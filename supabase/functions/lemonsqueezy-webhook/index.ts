// LEO-196: Lemon Squeezy subscription webhook (Supabase Edge Function / Deno).
//
// Responsibilities:
//   1. Verify the `X-Signature` header (HMAC-SHA256 of the raw body keyed by
//      LEMONSQUEEZY_WEBHOOK_SECRET) using a constant-time comparison.
//   2. Map subscription lifecycle events onto our `subscriptions` table.
//   3. Associate the row with a Supabase user via
//      `meta.custom_data.user_id` (set on the checkout hand-off from the client).
//   4. Upsert with the service_role key so the write bypasses RLS.
//
// Deploy:
//   supabase functions deploy lemonsqueezy-webhook --no-verify-jwt
//   supabase secrets set LEMONSQUEEZY_WEBHOOK_SECRET=... \
//     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
// (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically in the
//  Supabase-hosted runtime; set them explicitly only when running locally.)
//
// `--no-verify-jwt` is required: Lemon Squeezy calls this endpoint without a
// Supabase JWT; our own HMAC check is the authentication.

// @ts-nocheck -- Deno runtime globals (Deno.serve, Deno.env) and the esm.sh
// import specifier are resolved on deploy, not by the app's tsc/vite build.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type LemonSqueezyWebhook = {
  meta?: {
    event_name?: string;
    custom_data?: Record<string, unknown>;
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      variant_name?: string;
      product_name?: string;
      renews_at?: string | null;
      ends_at?: string | null;
      trial_ends_at?: string | null;
      user_email?: string | null;
    };
  };
};

// Lemon Squeezy subscription events we react to. `created`, `updated` and
// `resumed` set the row to its live status; `cancelled` and `expired` flip it to
// an inactive-style status. We store the raw LS status verbatim (active,
// on_trial, cancelled, expired, past_due, unpaid, paused) and let the client
// entitlement resolver decide what counts as Pro.
const HANDLED_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_expired",
  "subscription_resumed"
]);

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time string compare to avoid leaking timing information on the
// signature check.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody)
  );
  return timingSafeEqual(toHex(digest), signature.trim().toLowerCase());
}

// Resolve the effective period-end from the LS attributes. Trials expose
// `trial_ends_at`; active subs expose `renews_at`; cancelled/expired expose
// `ends_at`. We keep the furthest-out grant window so the client can honour a
// paid-through-period-end cancellation.
function resolvePeriodEnd(
  attributes: NonNullable<LemonSqueezyWebhook["data"]>["attributes"]
): string | null {
  return (
    attributes?.ends_at ??
    attributes?.renews_at ??
    attributes?.trial_ends_at ??
    null
  );
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!secret || !supabaseUrl || !serviceRoleKey) {
    console.error("Webhook missing required environment configuration.");
    return new Response("Server not configured", { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature");

  if (!(await verifySignature(rawBody, signature, secret))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: LemonSqueezyWebhook;
  try {
    payload = JSON.parse(rawBody) as LemonSqueezyWebhook;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const eventName = payload.meta?.event_name ?? "";
  if (!HANDLED_EVENTS.has(eventName)) {
    // Acknowledge unrelated events (orders, licenses, etc.) so LS does not retry.
    return new Response(JSON.stringify({ ignored: eventName }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  const userId = payload.meta?.custom_data?.user_id;
  if (typeof userId !== "string" || userId.length === 0) {
    console.warn("Webhook event missing meta.custom_data.user_id", eventName);
    // 200 so LS stops retrying a structurally-unlinkable event; nothing to write.
    return new Response(JSON.stringify({ skipped: "missing user_id" }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  const attributes = payload.data?.attributes;
  const status = attributes?.status ?? "inactive";
  const plan = attributes?.variant_name ?? attributes?.product_name ?? null;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      ls_subscription_id: payload.data?.id ?? null,
      status,
      plan,
      current_period_end: resolvePeriodEnd(attributes),
      raw: payload as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to upsert subscription", error);
    return new Response("Upsert failed", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, event: eventName }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
});

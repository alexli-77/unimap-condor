// LEO-196: subscription -> Pro entitlement mapping and Lemon Squeezy checkout
// helpers. Pure logic (no React, no network) so the workspace provider and the
// upgrade card can share one definition and the rules stay testable.

/** Raw subscription row shape as stored in the `subscriptions` table. */
export type SubscriptionRecord = {
  status: string;
  plan: string | null;
  current_period_end: string | null;
};

// Lemon Squeezy statuses that grant Pro access. `active` is a paid subscriber;
// `on_trial` is inside the trial window. Everything else (cancelled, expired,
// past_due, unpaid, paused, inactive) does not grant Pro — though a cancelled
// subscriber may still be Pro until current_period_end, handled below.
const PRO_STATUSES = new Set(["active", "on_trial"]);

// A cancelled subscription that is still paid through the end of its period
// keeps Pro until current_period_end passes.
const GRACE_STATUSES = new Set(["cancelled"]);

/**
 * Resolve whether a subscription record grants Pro at `now`.
 *   - active / on_trial  -> Pro while current_period_end is null or in the future
 *   - cancelled          -> Pro until current_period_end passes (paid-through)
 *   - anything else       -> not Pro
 * A null record (never subscribed) is never Pro.
 */
export function isSubscriptionActive(
  record: SubscriptionRecord | null | undefined,
  now: Date = new Date()
): boolean {
  if (!record) return false;

  const periodEnd = record.current_period_end
    ? new Date(record.current_period_end)
    : null;
  const periodValid =
    periodEnd === null || (!Number.isNaN(periodEnd.getTime()) && periodEnd > now);

  if (PRO_STATUSES.has(record.status)) {
    return periodValid;
  }
  if (GRACE_STATUSES.has(record.status)) {
    // Grace only applies when there is a real, future period end.
    return periodEnd !== null && !Number.isNaN(periodEnd.getTime()) && periodEnd > now;
  }
  return false;
}

export type CheckoutContext = {
  email?: string | null;
  userId?: string | null;
};

/**
 * Append Lemon Squeezy checkout prefill params to a checkout URL:
 *   - checkout[email]           prefills the buyer email (when logged in)
 *   - checkout[custom][user_id] round-trips our Supabase user id so the webhook
 *     can associate the subscription (see the edge function).
 * Returns the base URL unchanged when it is empty. Invalid base URLs fall back
 * to manual query concatenation so a misconfigured value never throws.
 */
export function buildCheckoutUrl(baseUrl: string, context: CheckoutContext = {}): string {
  if (!baseUrl) return baseUrl;

  const params: Array<[string, string]> = [];
  if (context.email) params.push(["checkout[email]", context.email]);
  if (context.userId) params.push(["checkout[custom][user_id]", context.userId]);
  if (params.length === 0) return baseUrl;

  try {
    const url = new URL(baseUrl);
    params.forEach(([key, value]) => url.searchParams.set(key, value));
    return url.toString();
  } catch {
    const query = params
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return baseUrl.includes("?") ? `${baseUrl}&${query}` : `${baseUrl}?${query}`;
  }
}

// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  buildCheckoutUrl,
  isSubscriptionActive,
  startCheckout,
  type SubscriptionRecord
} from "../src/subscription";

const NOW = new Date("2026-07-16T00:00:00.000Z");
const FUTURE = "2026-08-16T00:00:00.000Z";
const PAST = "2026-06-16T00:00:00.000Z";

function record(overrides: Partial<SubscriptionRecord>): SubscriptionRecord {
  return {
    status: "active",
    plan: "UniMap Pro",
    current_period_end: FUTURE,
    ...overrides
  };
}

describe("isSubscriptionActive -> Pro mapping", () => {
  it("treats a null record (never subscribed) as not Pro", () => {
    expect(isSubscriptionActive(null, NOW)).toBe(false);
    expect(isSubscriptionActive(undefined, NOW)).toBe(false);
  });

  it("grants Pro for an active subscription with a future period end", () => {
    expect(isSubscriptionActive(record({ status: "active" }), NOW)).toBe(true);
  });

  it("grants Pro during a trial (on_trial)", () => {
    expect(isSubscriptionActive(record({ status: "on_trial" }), NOW)).toBe(true);
  });

  it("grants Pro when there is no period end (active, open-ended)", () => {
    expect(
      isSubscriptionActive(record({ status: "active", current_period_end: null }), NOW)
    ).toBe(true);
  });

  it("revokes Pro once an active subscription's period has passed", () => {
    expect(
      isSubscriptionActive(record({ status: "active", current_period_end: PAST }), NOW)
    ).toBe(false);
  });

  it("keeps Pro for a cancelled sub paid through a future period end", () => {
    expect(
      isSubscriptionActive(record({ status: "cancelled", current_period_end: FUTURE }), NOW)
    ).toBe(true);
  });

  it("revokes Pro for a cancelled sub past its period end", () => {
    expect(
      isSubscriptionActive(record({ status: "cancelled", current_period_end: PAST }), NOW)
    ).toBe(false);
  });

  it("treats expired / past_due as not Pro", () => {
    expect(isSubscriptionActive(record({ status: "expired" }), NOW)).toBe(false);
    expect(isSubscriptionActive(record({ status: "past_due" }), NOW)).toBe(false);
  });
});

describe("buildCheckoutUrl", () => {
  const base = "https://store.lemonsqueezy.com/buy/abc";

  it("returns the base unchanged when no context is given", () => {
    expect(buildCheckoutUrl(base)).toBe(base);
  });

  it("returns empty base unchanged", () => {
    expect(buildCheckoutUrl("")).toBe("");
  });

  it("appends email and user_id prefill params", () => {
    const url = new URL(
      buildCheckoutUrl(base, { email: "a@b.com", userId: "user-123" })
    );
    expect(url.searchParams.get("checkout[email]")).toBe("a@b.com");
    expect(url.searchParams.get("checkout[custom][user_id]")).toBe("user-123");
  });

  it("omits params that are absent", () => {
    const url = new URL(buildCheckoutUrl(base, { userId: "user-9" }));
    expect(url.searchParams.get("checkout[email]")).toBeNull();
    expect(url.searchParams.get("checkout[custom][user_id]")).toBe("user-9");
  });
});

describe("startCheckout (LEO-238)", () => {
  const base = "https://store.lemonsqueezy.com/checkout/buy/abc";

  it("refuses to open checkout without a userId (anonymous)", () => {
    let opened: string | null = null;
    const ok = startCheckout(base, { email: "a@b.com" }, (url) => {
      opened = url;
    });
    expect(ok).toBe(false);
    expect(opened).toBeNull();
  });

  it("refuses when no checkout base url is configured", () => {
    let called = false;
    const ok = startCheckout(undefined, { userId: "user-1" }, () => {
      called = true;
    });
    expect(ok).toBe(false);
    expect(called).toBe(false);
  });

  it("opens checkout carrying the user_id for a signed-in user", () => {
    let opened = "";
    const ok = startCheckout(
      base,
      { email: "a@b.com", userId: "user-42" },
      (url) => {
        opened = url;
      }
    );
    expect(ok).toBe(true);
    const parsed = new URL(opened);
    expect(parsed.searchParams.get("checkout[custom][user_id]")).toBe("user-42");
  });
});

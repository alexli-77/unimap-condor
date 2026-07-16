import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Controllable Supabase client presence. withSupabaseFallback reads the live
// `supabase` binding from ../src/supabase at call time, so a getter lets each
// test toggle between "client available" and "offline" without a real client.
const h = vi.hoisted(() => ({ supabase: null as unknown }));
vi.mock("../src/supabase", () => ({
  get supabase() {
    return h.supabase;
  }
}));

// api.ts runs a one-time stale-cache purge on module load, so tests that assert
// on that behaviour re-import a fresh module after seeding localStorage.
async function loadApi() {
  vi.resetModules();
  return import("../src/api");
}

describe("escapeLikePattern", () => {
  it("escapes %, _ and backslash so user input cannot inject LIKE wildcards", async () => {
    const { escapeLikePattern } = await loadApi();
    expect(escapeLikePattern("50% _off_")).toBe("50\\% \\_off\\_");
    expect(escapeLikePattern("a\\b")).toBe("a\\\\b");
  });

  it("leaves ordinary institution names untouched", async () => {
    const { escapeLikePattern } = await loadApi();
    expect(escapeLikePattern("McGill University")).toBe("McGill University");
    expect(escapeLikePattern("Universite de Montreal")).toBe("Universite de Montreal");
  });
});

describe("withSupabaseFallback", () => {
  beforeEach(() => {
    h.supabase = null;
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("serves local without invoking remote when Supabase is unavailable", async () => {
    h.supabase = null;
    const { withSupabaseFallback } = await loadApi();
    const remote = vi.fn(async () => "remote");

    const result = await withSupabaseFallback(remote, async () => "local", "x");

    expect(result).toBe("local");
    expect(remote).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns the remote value when Supabase yields data", async () => {
    h.supabase = {};
    const { withSupabaseFallback } = await loadApi();
    const local = vi.fn(async () => "local");

    const result = await withSupabaseFallback(async () => "remote", local, "x");

    expect(result).toBe("remote");
    expect(local).not.toHaveBeenCalled();
  });

  it("warns and falls back to local when the remote call throws", async () => {
    h.supabase = {};
    const { withSupabaseFallback } = await loadApi();

    const result = await withSupabaseFallback(
      async () => {
        throw new Error("db down");
      },
      async () => "local",
      "advisor cards"
    );

    expect(result).toBe("local");
    expect(console.warn).toHaveBeenCalledWith(
      "Falling back to local advisor cards",
      expect.any(Error)
    );
  });

  it("falls back silently when the remote call yields null (empty result)", async () => {
    h.supabase = {};
    const { withSupabaseFallback } = await loadApi();

    const result = await withSupabaseFallback(
      async () => null,
      async () => "local",
      "faculty page"
    );

    expect(result).toBe("local");
    expect(console.warn).not.toHaveBeenCalled();
  });
});

describe("localStorage cache version invalidation", () => {
  beforeEach(() => {
    h.supabase = null;
    localStorage.clear();
  });

  it("purges older-version api cache keys while keeping current + unrelated keys", async () => {
    localStorage.setItem("unimap.api/sources/availabilities", "stale-unversioned");
    localStorage.setItem("unimap.api.v1.rankings", "stale-versioned");
    localStorage.setItem("unimap.api.v2.keep", "current");
    localStorage.setItem("unimap.favorites", "unrelated-app-state");

    await loadApi();

    expect(localStorage.getItem("unimap.api/sources/availabilities")).toBeNull();
    expect(localStorage.getItem("unimap.api.v1.rankings")).toBeNull();
    expect(localStorage.getItem("unimap.api.v2.keep")).toBe("current");
    expect(localStorage.getItem("unimap.favorites")).toBe("unrelated-app-state");
  });
});

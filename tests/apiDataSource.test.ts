import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// api.ts keeps module-level caches and a data-source listener set, so each test
// re-imports a fresh module (via resetModules) and clears the localStorage
// response cache to observe the remote/local signal in isolation.
async function loadFreshApi() {
  vi.resetModules();
  localStorage.clear();
  return import("../src/api");
}

describe("api data-source signalling on remote -> local fallback", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("reports 'remote' and merges live availabilities when the API responds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify([]), { status: 200 }))
    );

    const { api, onDataSourceChange } = await loadFreshApi();
    const events: string[] = [];
    onDataSourceChange((source) => events.push(source));

    const availabilities = await api.getAvailabilities();

    expect(events).toContain("remote");
    expect(events).not.toContain("local");
    // mergeLocalAvailabilities always folds in bundled sources, so the merged
    // result is non-empty even when the remote list is empty.
    expect(Array.isArray(availabilities)).toBe(true);
    expect(availabilities.length).toBeGreaterThan(0);
  });

  it("reports 'local' and still serves bundled availabilities when the API fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      })
    );

    const { api, onDataSourceChange } = await loadFreshApi();
    const events: string[] = [];
    const unsubscribe = onDataSourceChange((source) => events.push(source));

    const availabilities = await api.getAvailabilities();

    expect(events).toContain("local");
    expect(availabilities.length).toBeGreaterThan(0);

    unsubscribe();
    // After unsubscribing no further events reach the listener.
    await api.getAvailabilities().catch(() => undefined);
    expect(events.filter((source) => source === "local")).toHaveLength(1);
  });

  it("re-raises AbortError instead of masking it as a local fallback", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        const error = new Error("aborted");
        error.name = "AbortError";
        throw error;
      })
    );

    const { api, onDataSourceChange } = await loadFreshApi();
    const events: string[] = [];
    onDataSourceChange((source) => events.push(source));

    await expect(api.getAvailabilities()).rejects.toThrow(/aborted/);
    expect(events).not.toContain("local");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Controllable Supabase query result, shared with the hoisted module mock below.
const h = vi.hoisted(() => ({
  queryResult: { data: null as unknown, error: null as unknown }
}));

// Mock the Supabase client so api.ts exercises its remote->local fallback logic
// without a network/db. The builder is a thenable that always resolves to the
// current h.queryResult, so every .select().ilike().order() chain awaits it.
vi.mock("../src/supabase", () => {
  const builder: Record<string, unknown> = {};
  const passthrough = () => builder;
  for (const method of ["select", "ilike", "order", "eq", "range", "abortSignal"]) {
    builder[method] = passthrough;
  }
  builder.then = (resolve: (value: unknown) => void) => resolve(h.queryResult);
  return { supabase: { from: () => builder } };
});

async function loadApi() {
  vi.resetModules();
  return (await import("../src/api")).api;
}

describe("api.getSchoolDecisionFacts Supabase -> local fallback", () => {
  beforeEach(() => {
    localStorage.clear();
    h.queryResult = { data: null, error: null };
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("serves verified remote facts when Supabase returns data", async () => {
    h.queryResult = {
      data: [
        {
          id: "sf-remote-1",
          institution_name: "Stanford University",
          record_type: "program",
          title: "MS in Computer Science",
          raw_label: "MSCS",
          evidence_url: "https://stanford.example/program",
          source_url: "https://stanford.example/program",
          verified_at: "2026-07-15",
          amounts: []
        }
      ],
      error: null
    };

    const api = await loadApi();
    const facts = await api.getSchoolDecisionFacts("Stanford University");

    expect(facts.sourceLabel).toBe("Verified decision facts");
    expect(facts.programs).toHaveLength(1);
    expect(facts.programs[0].title).toBe("MS in Computer Science");
  });

  it("falls back to local facts when Supabase errors", async () => {
    h.queryResult = { data: null, error: new Error("supabase unavailable") };

    const api = await loadApi();
    const facts = await api.getSchoolDecisionFacts("Stanford University");

    expect(facts.sourceLabel).toBe("Local verified facts");
    const total =
      facts.programs.length +
      facts.funding.length +
      (facts.employment?.length ?? 0) +
      (facts.immigration?.length ?? 0);
    expect(total, "local Stanford facts should exist").toBeGreaterThan(0);
    expect(console.warn).toHaveBeenCalled();
  });

  it("falls back to local facts when Supabase returns an empty result", async () => {
    h.queryResult = { data: [], error: null };

    const api = await loadApi();
    const facts = await api.getSchoolDecisionFacts("Stanford University");

    expect(facts.sourceLabel).toBe("Local verified facts");
    const total =
      facts.programs.length +
      facts.funding.length +
      (facts.employment?.length ?? 0) +
      (facts.immigration?.length ?? 0);
    expect(total, "empty remote result must not blank out the panel").toBeGreaterThan(0);
  });
});

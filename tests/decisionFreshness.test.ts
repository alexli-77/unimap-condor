// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  hasAsOfClause,
  isLowConfidence,
  isStale,
  monthsSince,
  summarizeFreshness
} from "../src/decisionFreshness";
import type { SchoolDecisionFact } from "../src/types";

const NOW = new Date("2026-07-15T00:00:00Z");

function fact(overrides: Partial<SchoolDecisionFact>): SchoolDecisionFact {
  return {
    id: "x",
    institutionName: "Test University",
    recordType: "program",
    title: "Test fact",
    amounts: [],
    rawLabel: "",
    evidenceUrl: "https://example.edu/a",
    sourceUrl: "https://example.edu/a",
    ...overrides
  };
}

describe("isStale", () => {
  it("flags facts verified 12+ months ago", () => {
    expect(isStale("2025-07-15", NOW)).toBe(true);
    expect(isStale("2024-01-01", NOW)).toBe(true);
  });

  it("keeps recent facts fresh", () => {
    expect(isStale("2026-07-15", NOW)).toBe(false);
    expect(isStale("2026-01-01", NOW)).toBe(false);
  });

  it("treats undated facts as not stale", () => {
    expect(isStale(undefined, NOW)).toBe(false);
  });
});

describe("monthsSince", () => {
  it("counts whole calendar months and null for undated", () => {
    expect(monthsSince("2026-01-15", NOW)).toBe(6);
    expect(monthsSince(undefined, NOW)).toBeNull();
  });
});

describe("isLowConfidence", () => {
  it("flags confidence below 0.6 and ignores undefined", () => {
    expect(isLowConfidence(0.5)).toBe(true);
    expect(isLowConfidence(0.6)).toBe(false);
    expect(isLowConfidence(0.9)).toBe(false);
    expect(isLowConfidence(undefined)).toBe(false);
  });
});

describe("hasAsOfClause", () => {
  it("detects the policy currency clause", () => {
    expect(hasAsOfClause("As of 2026-07, master's graduates are eligible...")).toBe(true);
    expect(hasAsOfClause("A 16-month research program.")).toBe(false);
  });
});

describe("summarizeFreshness", () => {
  it("reports oldest/newest, unique sources and stale count", () => {
    const summary = summarizeFreshness(
      [
        fact({ verifiedAt: "2026-07-15", sourceUrl: "https://a.edu" }),
        fact({ verifiedAt: "2025-01-10", sourceUrl: "https://b.edu" }),
        fact({ verifiedAt: "2026-03-01", sourceUrl: "https://a.edu" }),
        fact({ verifiedAt: undefined, sourceUrl: "https://c.edu" })
      ],
      NOW
    );
    expect(summary.oldest).toBe("2025-01-10");
    expect(summary.newest).toBe("2026-07-15");
    expect(summary.datedCount).toBe(3);
    expect(summary.sourceCount).toBe(3);
    expect(summary.staleCount).toBe(1);
  });

  it("returns null bounds when nothing is dated", () => {
    const summary = summarizeFreshness([fact({ verifiedAt: undefined })], NOW);
    expect(summary.oldest).toBeNull();
    expect(summary.datedCount).toBe(0);
  });
});

// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  RANKINGS_DISCLAIMER,
  RANKING_LIST_LIMIT,
  getRankingSourceLink
} from "../src/rankingSources";

// LEO-187 compliance guardrails: every ranking source the UI can attribute must
// resolve to an official, https publisher URL with a human-readable label, and
// the reference disclaimer / list limit must stay populated so we never
// republish a full third-party league table.
describe("ranking sources compliance", () => {
  it("keeps a reference-use disclaimer populated", () => {
    expect(typeof RANKINGS_DISCLAIMER).toBe("string");
    expect(RANKINGS_DISCLAIMER.trim().length).toBeGreaterThan(0);
    expect(
      RANKINGS_DISCLAIMER,
      "RANKINGS_DISCLAIMER should state that rankings are shown for reference only"
    ).toMatch(/reference/i);
  });

  it("caps the locally surfaced list to a small positive slice", () => {
    expect(Number.isInteger(RANKING_LIST_LIMIT)).toBe(true);
    expect(RANKING_LIST_LIMIT).toBeGreaterThan(0);
    expect(RANKING_LIST_LIMIT).toBeLessThanOrEqual(100);
  });

  const knownSources = [
    { query: "QS World University Rankings", host: "topuniversities.com" },
    { query: "qs", host: "topuniversities.com" },
    { query: "Times Higher Education", host: "timeshighereducation.com" },
    { query: "Shanghai ARWU", host: "shanghairanking.com" },
    { query: "arwu", host: "shanghairanking.com" },
    { query: "CSRankings", host: "csrankings.org" }
  ];

  it.each(knownSources)(
    "resolves $query to an official https link at $host",
    ({ query, host }) => {
      const link = getRankingSourceLink(query);
      expect(link, `getRankingSourceLink("${query}") must resolve to an official link`).toBeTruthy();
      expect(typeof link!.label).toBe("string");
      expect(link!.label.trim().length).toBeGreaterThan(0);
      expect(
        link!.url,
        `Ranking source "${query}" must expose an https official URL, got ${link!.url}`
      ).toMatch(/^https:\/\//);
      expect(
        link!.url,
        `Ranking source "${query}" should point at official host ${host}, got ${link!.url}`
      ).toContain(host);
    }
  );

  it("uses a provided fallback URL for an unknown source", () => {
    const fallback = getRankingSourceLink("Some New Ranking", "https://example.org/table");
    expect(fallback, "Unknown source with fallback URL should still return a link").toBeTruthy();
    expect(fallback!.url).toBe("https://example.org/table");
    expect(fallback!.label.trim().length).toBeGreaterThan(0);
  });

  it("never fabricates a link when there is no source and no fallback", () => {
    expect(getRankingSourceLink(undefined)).toBeNull();
    expect(getRankingSourceLink("Totally Unknown Ranking")).toBeNull();
  });
});

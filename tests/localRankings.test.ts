// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type LocalRankingRow = {
  groundTruthName: string;
  sourceRankValue: string;
  rankValue: number;
  overallScore?: number;
  coordinates: [number, number];
  locationQuality: string;
};

const rows = JSON.parse(
  readFileSync(new URL("../src/localRankings/qs2027Overall.json", import.meta.url), "utf8")
) as LocalRankingRow[];

// QS 2027 Overall is the local ranking dataset the map is driven by. These
// assertions pin the row count, the top-of-table identity/tie handling, and the
// geocoding quality distribution so a bad data regen fails loudly.
describe("QS 2027 local ranking data", () => {
  it("includes the full 1504-university table", () => {
    expect(rows.length, "QS 2027 Overall should include 1504 universities").toBe(1504);
  });

  it("keeps the top-of-table identities and tie markers intact", () => {
    const [mit, imperial, stanford] = rows;

    expect(mit.groundTruthName).toBe("Massachusetts Institute of Technology (MIT)");
    expect(mit.sourceRankValue).toBe("1");
    expect(mit.rankValue).toBe(1);
    expect(mit.overallScore).toBe(100);

    expect(imperial.groundTruthName).toBe("Imperial College London");
    expect(imperial.sourceRankValue).toBe("=2");
    expect(imperial.rankValue).toBe(2);

    expect(stanford.groundTruthName).toBe("Stanford University");
    expect(stanford.sourceRankValue).toBe("=2");
    expect(stanford.rankValue).toBe(2);
  });

  it("gives every university real [lng, lat] coordinates (no null island)", () => {
    for (const row of rows) {
      expect(Array.isArray(row.coordinates), `${row.groundTruthName} is missing coordinates`).toBe(
        true
      );
      expect(
        row.coordinates.length,
        `${row.groundTruthName} coordinates must be [lng, lat]`
      ).toBe(2);
      expect(
        row.coordinates,
        `${row.groundTruthName} fell back to null island`
      ).not.toEqual([0, 0]);
    }
  });

  it("preserves the geocoding location-quality distribution", () => {
    const locationQualityCounts = rows.reduce<Record<string, number>>((counts, row) => {
      counts[row.locationQuality] = (counts[row.locationQuality] ?? 0) + 1;
      return counts;
    }, {});

    expect(locationQualityCounts.matched).toBe(1259);
    expect(locationQualityCounts.city).toBe(136);
    expect(locationQualityCounts["geocoded-city"]).toBe(109);
  });
});

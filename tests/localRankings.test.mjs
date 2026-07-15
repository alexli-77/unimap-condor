import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const rows = JSON.parse(readFileSync("src/localRankings/qs2027Overall.json", "utf8"));

assert.equal(rows.length, 1504, "QS 2027 Overall should include 1504 universities");

const [mit, imperial, stanford] = rows;

assert.equal(mit.groundTruthName, "Massachusetts Institute of Technology (MIT)");
assert.equal(mit.sourceRankValue, "1");
assert.equal(mit.rankValue, 1);
assert.equal(mit.overallScore, 100);

assert.equal(imperial.groundTruthName, "Imperial College London");
assert.equal(imperial.sourceRankValue, "=2");
assert.equal(imperial.rankValue, 2);

assert.equal(stanford.groundTruthName, "Stanford University");
assert.equal(stanford.sourceRankValue, "=2");
assert.equal(stanford.rankValue, 2);

for (const row of rows) {
  assert.ok(Array.isArray(row.coordinates), `${row.groundTruthName} is missing coordinates`);
  assert.equal(row.coordinates.length, 2, `${row.groundTruthName} coordinates must be [lng, lat]`);
  assert.notDeepEqual(row.coordinates, [0, 0], `${row.groundTruthName} fell back to null island`);
}

const locationQualityCounts = rows.reduce((counts, row) => {
  counts[row.locationQuality] = (counts[row.locationQuality] ?? 0) + 1;
  return counts;
}, {});

assert.equal(locationQualityCounts.matched, 1259);
assert.equal(locationQualityCounts.city, 136);
assert.equal(locationQualityCounts["geocoded-city"], 109);

console.log("QS 2027 local ranking data looks good:", {
  total: rows.length,
  locationQualityCounts
});

import {
  RANKINGS_DISCLAIMER,
  RANKING_LIST_LIMIT,
  getRankingSourceLink
} from "../src/rankingSources.js";

function assertOk(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${String(expected)}\nActual: ${String(actual)}`);
  }
}

// LEO-187 compliance guardrails: every ranking source the UI can attribute must
// resolve to an official, https publisher URL with a human-readable label, and
// the reference disclaimer / list limit must stay populated so we never
// republish a full third-party league table.

// 1. Disclaimer copy must be present and mention the publishers + reference use.
assertOk(
  typeof RANKINGS_DISCLAIMER === "string" && RANKINGS_DISCLAIMER.trim().length > 0,
  "RANKINGS_DISCLAIMER must be a non-empty string"
);
assertOk(
  /reference/i.test(RANKINGS_DISCLAIMER),
  "RANKINGS_DISCLAIMER should state that rankings are shown for reference only"
);

// 2. The local list limit must be a small positive integer (complete table lives
// behind the outbound link).
assertOk(
  Number.isInteger(RANKING_LIST_LIMIT) && RANKING_LIST_LIMIT > 0 && RANKING_LIST_LIMIT <= 100,
  `RANKING_LIST_LIMIT must be a small positive integer, got ${RANKING_LIST_LIMIT}`
);

// 3. Each known ranking publisher must resolve to a complete, official link.
const knownSources = [
  { query: "QS World University Rankings", host: "topuniversities.com" },
  { query: "qs", host: "topuniversities.com" },
  { query: "Times Higher Education", host: "timeshighereducation.com" },
  { query: "Shanghai ARWU", host: "shanghairanking.com" },
  { query: "arwu", host: "shanghairanking.com" },
  { query: "CSRankings", host: "csrankings.org" }
];

for (const { query, host } of knownSources) {
  const link = getRankingSourceLink(query);
  assertOk(link, `getRankingSourceLink("${query}") must resolve to an official link`);
  assertOk(
    typeof link!.label === "string" && link!.label.trim().length > 0,
    `Ranking source "${query}" must have a non-empty label`
  );
  assertOk(
    /^https:\/\//.test(link!.url),
    `Ranking source "${query}" must expose an https official URL, got ${link!.url}`
  );
  assertOk(
    link!.url.includes(host),
    `Ranking source "${query}" should point at official host ${host}, got ${link!.url}`
  );
}

// 4. Unknown source with a fallback URL keeps attribution pointing somewhere.
const fallback = getRankingSourceLink("Some New Ranking", "https://example.org/table");
assertOk(fallback, "Unknown source with fallback URL should still return a link");
assertEqual(
  fallback!.url,
  "https://example.org/table",
  "Fallback link must use the provided source URL"
);
assertOk(
  fallback!.label.trim().length > 0,
  "Fallback link must still carry a non-empty label"
);

// 5. Unknown source without a fallback URL resolves to null (no fabricated link).
assertEqual(
  getRankingSourceLink(undefined),
  null,
  "No source name and no fallback URL must resolve to null"
);
assertEqual(
  getRankingSourceLink("Totally Unknown Ranking"),
  null,
  "Unknown source without fallback must resolve to null"
);

console.log("Ranking sources compliance test set passed:", {
  knownSources: knownSources.length,
  listLimit: RANKING_LIST_LIMIT
});

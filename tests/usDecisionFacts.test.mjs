import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { localDecisionFacts } from "../.tmp-us-decision-tests/src/localDecisionFacts.js";

// Mirror of src/api.ts normalizeName + decisionFactMatchesUniversity so this
// test exercises the exact name-association logic the app uses.
function normalizeName(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function namesAssociate(a, b) {
  const x = normalizeName(a);
  const y = normalizeName(b);
  return x.includes(y) || y.includes(x);
}

// QS 2027 Overall is the local ranking dataset the map is driven by; each
// decision-fact institutionName must associate with a school it contains.
const qsRows = JSON.parse(
  readFileSync("src/localRankings/qs2027Overall.json", "utf8")
);
const qsNames = qsRows.map((row) => row.groundTruthName).filter(Boolean);

// The 12 LEO-189 sample schools, named exactly as they appear in QS 2027.
const US_SCHOOLS = [
  "Carnegie Mellon University",
  "Massachusetts Institute of Technology (MIT)",
  "Stanford University",
  "University of California, Berkeley (UCB)",
  "University of Illinois Urbana-Champaign",
  "Georgia Institute of Technology",
  "University of Washington",
  "Cornell University",
  "University of Texas at Austin",
  "University of Michigan-Ann Arbor",
  "University of California, San Diego (UCSD)",
  "University of Massachusetts Amherst"
];

const VALID_RECORD_TYPES = new Set([
  "program",
  "tuition_funding",
  "employment",
  "immigration"
]);

let totalUsFacts = 0;

for (const school of US_SCHOOLS) {
  const facts = localDecisionFacts.filter(
    (fact) => fact.institutionName === school
  );

  // Each sample school carries at least four decision facts.
  assert.ok(
    facts.length >= 4,
    `${school} should have >= 4 decision facts, found ${facts.length}`
  );
  totalUsFacts += facts.length;

  // The school name must associate with a QS 2027 university via normalizeName.
  const matched = qsNames.some((qsName) => namesAssociate(qsName, school));
  assert.ok(
    matched,
    `${school} could not be matched to any QS 2027 university via normalizeName`
  );

  for (const fact of facts) {
    // Every fact must cite a source.
    assert.ok(
      typeof fact.sourceUrl === "string" && fact.sourceUrl.startsWith("http"),
      `${school} fact ${fact.id} is missing a sourceUrl`
    );
    assert.ok(
      typeof fact.evidenceUrl === "string" &&
        fact.evidenceUrl.startsWith("http"),
      `${school} fact ${fact.id} is missing an evidenceUrl`
    );
    assert.ok(
      VALID_RECORD_TYPES.has(fact.recordType),
      `${school} fact ${fact.id} has an unexpected recordType ${fact.recordType}`
    );
    assert.equal(
      fact.verifiedAt,
      "2026-07-15",
      `${school} fact ${fact.id} should be verifiedAt 2026-07-15`
    );
    assert.ok(
      typeof fact.rawLabel === "string" && fact.rawLabel.length > 0,
      `${school} fact ${fact.id} is missing rawLabel`
    );
  }
}

// Fact ids must be unique across the whole dataset.
const ids = localDecisionFacts.map((fact) => fact.id);
assert.equal(new Set(ids).size, ids.length, "decision-fact ids must be unique");

assert.ok(
  totalUsFacts >= 48,
  `expected >= 48 US decision facts across 12 schools, found ${totalUsFacts}`
);

console.log(
  `usDecisionFacts: ${US_SCHOOLS.length} schools, ${totalUsFacts} US facts, all matched to QS 2027 and sourced.`
);

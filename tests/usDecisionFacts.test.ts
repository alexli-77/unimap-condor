// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { localDecisionFacts } from "../src/localDecisionFacts";

// Mirror of src/api.ts normalizeName + decisionFactMatchesUniversity so this
// test exercises the exact name-association logic the app uses.
function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function namesAssociate(a: string, b: string) {
  const x = normalizeName(a);
  const y = normalizeName(b);
  return x.includes(y) || y.includes(x);
}

// QS 2027 Overall is the local ranking dataset the map is driven by; each
// decision-fact institutionName must associate with a school it contains.
const qsRows = JSON.parse(
  readFileSync(new URL("../src/localRankings/qs2027Overall.json", import.meta.url), "utf8")
) as Array<{ groundTruthName: string }>;
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

describe("US decision facts (LEO-189)", () => {
  it.each(US_SCHOOLS)("%s carries >=4 sourced, well-formed decision facts", (school) => {
    const facts = localDecisionFacts.filter((fact) => fact.institutionName === school);

    expect(
      facts.length,
      `${school} should have >= 4 decision facts, found ${facts.length}`
    ).toBeGreaterThanOrEqual(4);

    const matched = qsNames.some((qsName) => namesAssociate(qsName, school));
    expect(
      matched,
      `${school} could not be matched to any QS 2027 university via normalizeName`
    ).toBe(true);

    for (const fact of facts) {
      expect(
        typeof fact.sourceUrl === "string" && fact.sourceUrl.startsWith("http"),
        `${school} fact ${fact.id} is missing a sourceUrl`
      ).toBe(true);
      expect(
        typeof fact.evidenceUrl === "string" && fact.evidenceUrl.startsWith("http"),
        `${school} fact ${fact.id} is missing an evidenceUrl`
      ).toBe(true);
      expect(
        VALID_RECORD_TYPES.has(fact.recordType),
        `${school} fact ${fact.id} has an unexpected recordType ${fact.recordType}`
      ).toBe(true);
      expect(fact.verifiedAt, `${school} fact ${fact.id} should be verifiedAt 2026-07-15`).toBe(
        "2026-07-15"
      );
      expect(
        typeof fact.rawLabel === "string" && fact.rawLabel.length > 0,
        `${school} fact ${fact.id} is missing rawLabel`
      ).toBe(true);
    }
  });

  it("keeps decision-fact ids unique across the whole dataset", () => {
    const ids = localDecisionFacts.map((fact) => fact.id);
    expect(new Set(ids).size, "decision-fact ids must be unique").toBe(ids.length);
  });

  it("provides at least 48 US decision facts across the 12 sample schools", () => {
    const totalUsFacts = US_SCHOOLS.reduce(
      (sum, school) =>
        sum + localDecisionFacts.filter((fact) => fact.institutionName === school).length,
      0
    );
    expect(
      totalUsFacts,
      `expected >= 48 US decision facts across 12 schools, found ${totalUsFacts}`
    ).toBeGreaterThanOrEqual(48);
  });
});

// @vitest-environment node
import { describe, expect, it } from "vitest";
import { defaultRecommendationPolicy } from "../src/recommendationPolicy";
import type {
  AdvisorCard,
  FacultyDepartmentSummary,
  PreferenceProfile,
  RankingFeature
} from "../src/types";

function preference(overrides: Partial<PreferenceProfile> = {}): PreferenceProfile {
  return {
    schemaVersion: 1,
    updatedAt: "2026-07-15T00:00:00.000Z",
    degreeLevel: "",
    targetCountries: "",
    targetCities: "",
    budgetCurrency: "CAD",
    maxTuition: "",
    fundingRequirement: "flexible",
    subjectAreas: "",
    researchKeywords: "",
    gpa: "",
    languageScores: "",
    background: "",
    employmentPriority: "medium",
    researchPriority: "medium",
    immigrationPriority: "medium",
    acceptsSmallCities: false,
    acceptsCourseBased: false,
    acceptsNichePrograms: false,
    notes: "",
    ...overrides
  };
}

function feature(overrides: Partial<RankingFeature["properties"]> = {}): RankingFeature {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [0, 0] },
    properties: {
      universityId: 1,
      universityName: "Test University",
      country: "Nowhere",
      city: "Testville",
      sourceName: "QS",
      sourceUrl: "https://example.com",
      attribution: "Fixture",
      subject: "Overall",
      ...overrides
    }
  };
}

// The recommendation policy must never fabricate confidence when inputs are
// missing: with an empty preference or absent decision facts it should degrade
// to honest "not set / not connected" placeholders and still return a next
// action, rather than a strong fit built on no evidence.
describe("recommendationPolicy honest boundaries", () => {
  it("scoreSchool with an empty preference yields honest placeholders, not a strong fit", () => {
    const result = defaultRecommendationPolicy.scoreSchool(feature(), preference());

    expect(result.level).toBe("weak");
    expect(result.missing).toContain("Target country is not set.");
    expect(result.missing).toContain("Target city is not set.");
    expect(result.missing).toContain("Subject areas or research keywords are not set.");
    expect(result.nextAction).toBeTruthy();
  });

  it("scoreSchool without decision facts flags missing program/funding evidence", () => {
    const result = defaultRecommendationPolicy.scoreSchool(
      feature(),
      preference({ degreeLevel: "PhD" })
      // no decisionFacts context at all
    );

    expect(result.missing).toContain("Program data is needed to verify PhD fit.");
    expect(result.missing).toContain("Funding and tuition facts are not connected yet.");
  });

  it("scoreSchool leaves honest employment/immigration placeholders when that data is absent", () => {
    // Country/city/subject are matched so the (capped-at-5) missing list has room
    // to surface the high-priority employment and immigration gaps.
    const result = defaultRecommendationPolicy.scoreSchool(
      feature({ rankValue: 10 }),
      preference({
        targetCountries: "Nowhere",
        targetCities: "Testville",
        subjectAreas: "Overall",
        employmentPriority: "high",
        immigrationPriority: "high"
      }),
      { decisionFacts: null, openDataProfile: null }
    );

    expect(result.missing).toContain(
      "Employment outcomes, co-op, or job-market notes are not connected yet."
    );
    expect(result.missing).toContain("Immigration pathway notes are not connected yet.");
  });

  it("scoreSchool flags a high research priority with no connected research topics", () => {
    const result = defaultRecommendationPolicy.scoreSchool(
      feature({ rankValue: 10 }),
      preference({
        targetCountries: "Nowhere",
        targetCities: "Testville",
        researchPriority: "high"
      }),
      { decisionFacts: null, openDataProfile: null }
    );

    expect(result.missing).toContain(
      "Research priority is high, but research topics are not connected."
    );
  });

  it("scoreDepartment with no keywords and no advisors asks for more evidence", () => {
    const department: FacultyDepartmentSummary = {
      name: "General Studies",
      facultyName: "Faculty of Arts",
      count: 2,
      expertise: [],
      roles: []
    };

    const result = defaultRecommendationPolicy.scoreDepartment(department, preference(), {
      advisors: []
    });

    expect(result.missing).toContain(
      "Add subject or research keywords to personalize department ranking."
    );
    expect(result.missing).toContain(
      "No curated advisor recommendation is linked to this department yet."
    );
    expect(result.nextAction).toBeTruthy();
  });

  it("scoreAdvisor with an empty preference asks for personalizing keywords", () => {
    const advisor: AdvisorCard = {
      id: "advisor-1",
      fullName: "Dr. Nobody",
      institutionName: "Test University",
      institutionAliases: [],
      fitSummary: "",
      researchAreas: [],
      targetPrograms: []
    };

    const result = defaultRecommendationPolicy.scoreAdvisor(advisor, preference());

    expect(result.missing).toContain(
      "Add subject or research keywords to personalize advisor ranking."
    );
    expect(result.nextAction).toBeTruthy();
  });
});

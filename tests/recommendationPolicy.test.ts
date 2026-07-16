// @vitest-environment node
import { describe, expect, it } from "vitest";
import { defaultRecommendationPolicy } from "../src/recommendationPolicy";
import { recommendationScenarios } from "./fixtures/recommendationScenarios";

// Data-driven coverage: each fixture scenario asserts the ranked ordering the UI
// relies on (top school/department/advisor), that the winning explanation carries
// the expected evidence, and that every scored entity produces interpretable
// evidence plus a next action. Mirrors the original assert-based suite exactly.
describe("defaultRecommendationPolicy scenarios", () => {
  for (const scenario of recommendationScenarios) {
    it(`${scenario.id}: ranks and explains schools, departments and advisors`, () => {
      const schoolResults = scenario.schools
        .map((school) => ({
          id: school.id,
          result: defaultRecommendationPolicy.scoreSchool(school.feature, scenario.preference, {
            decisionFacts: school.facts
          })
        }))
        .sort((a, b) => b.result.score - a.result.score);

      expect(schoolResults[0]?.id, `${scenario.id}: expected top school`).toBe(
        scenario.expectations.topSchool
      );

      const expectedSchoolExplanation =
        "schoolMatchedIncludes" in scenario.expectations
          ? scenario.expectations.schoolMatchedIncludes
          : "";
      if (expectedSchoolExplanation) {
        expect(
          schoolResults[0].result.matched.some((item) =>
            item.toLowerCase().includes(expectedSchoolExplanation.toLowerCase())
          ),
          `${scenario.id}: expected top school explanation to include ${expectedSchoolExplanation}`
        ).toBe(true);
      }

      const departmentResults = scenario.departments
        .map((department) => ({
          name: department.name,
          result: defaultRecommendationPolicy.scoreDepartment(department, scenario.preference, {
            advisors: [...scenario.advisors]
          })
        }))
        .sort((a, b) => b.result.score - a.result.score);

      expect(departmentResults[0]?.name, `${scenario.id}: expected top department`).toBe(
        scenario.expectations.topDepartment
      );

      const advisorResults = scenario.advisors
        .map((advisor) => ({
          id: advisor.id,
          result: defaultRecommendationPolicy.scoreAdvisor(advisor, scenario.preference)
        }))
        .sort((a, b) => b.result.score - a.result.score);

      expect(advisorResults[0]?.id, `${scenario.id}: expected top advisor`).toBe(
        scenario.expectations.topAdvisor
      );

      const expectedAdvisorExplanation =
        "advisorMatchedIncludes" in scenario.expectations
          ? scenario.expectations.advisorMatchedIncludes
          : "";
      if (expectedAdvisorExplanation) {
        expect(
          advisorResults[0].result.matched.some((item) =>
            item.toLowerCase().includes(expectedAdvisorExplanation.toLowerCase())
          ),
          `${scenario.id}: expected top advisor explanation to include ${expectedAdvisorExplanation}`
        ).toBe(true);
      }

      for (const item of [...schoolResults, ...departmentResults, ...advisorResults]) {
        const label = "id" in item ? item.id : item.name;
        expect(
          item.result.matched.length + item.result.concerns.length + item.result.missing.length,
          `${scenario.id}: ${label} must produce interpretable evidence`
        ).toBeGreaterThan(0);
        expect(
          item.result.nextAction,
          `${scenario.id}: recommendation result must include next action`
        ).toBeTruthy();
      }
    });
  }
});

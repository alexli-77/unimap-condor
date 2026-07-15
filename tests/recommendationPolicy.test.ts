import { defaultRecommendationPolicy } from "../src/recommendationPolicy.js";
import { recommendationScenarios } from "./fixtures/recommendationScenarios.js";

function assertEqual(actual: unknown, expected: unknown, message: string) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${String(expected)}\nActual: ${String(actual)}`);
  }
}

function assertOk(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

for (const scenario of recommendationScenarios) {
  const schoolResults = scenario.schools
    .map((school) => ({
      id: school.id,
      result: defaultRecommendationPolicy.scoreSchool(school.feature, scenario.preference, {
        decisionFacts: school.facts
      })
    }))
    .sort((a, b) => b.result.score - a.result.score);

  assertEqual(
    schoolResults[0]?.id,
    scenario.expectations.topSchool,
    `${scenario.id}: expected top school ${scenario.expectations.topSchool}, got ${schoolResults[0]?.id}`
  );

  const expectedSchoolExplanation =
    "schoolMatchedIncludes" in scenario.expectations
      ? scenario.expectations.schoolMatchedIncludes
      : "";
  if (expectedSchoolExplanation) {
    assertOk(
      schoolResults[0].result.matched.some((item) =>
        item.toLowerCase().includes(expectedSchoolExplanation.toLowerCase())
      ),
      `${scenario.id}: expected top school explanation to include ${expectedSchoolExplanation}`
    );
  }

  const departmentResults = scenario.departments
    .map((department) => ({
      name: department.name,
      result: defaultRecommendationPolicy.scoreDepartment(department, scenario.preference, {
        advisors: [...scenario.advisors]
      })
    }))
    .sort((a, b) => b.result.score - a.result.score);

  assertEqual(
    departmentResults[0]?.name,
    scenario.expectations.topDepartment,
    `${scenario.id}: expected top department ${scenario.expectations.topDepartment}, got ${departmentResults[0]?.name}`
  );

  const advisorResults = scenario.advisors
    .map((advisor) => ({
      id: advisor.id,
      result: defaultRecommendationPolicy.scoreAdvisor(advisor, scenario.preference)
    }))
    .sort((a, b) => b.result.score - a.result.score);

  assertEqual(
    advisorResults[0]?.id,
    scenario.expectations.topAdvisor,
    `${scenario.id}: expected top advisor ${scenario.expectations.topAdvisor}, got ${advisorResults[0]?.id}`
  );

  const expectedAdvisorExplanation =
    "advisorMatchedIncludes" in scenario.expectations
      ? scenario.expectations.advisorMatchedIncludes
      : "";
  if (expectedAdvisorExplanation) {
    assertOk(
      advisorResults[0].result.matched.some((item) =>
        item.toLowerCase().includes(expectedAdvisorExplanation.toLowerCase())
      ),
      `${scenario.id}: expected top advisor explanation to include ${expectedAdvisorExplanation}`
    );
  }

  for (const item of [...schoolResults, ...departmentResults, ...advisorResults]) {
    assertOk(
      item.result.matched.length + item.result.concerns.length + item.result.missing.length > 0,
      `${scenario.id}: ${"id" in item ? item.id : item.name} must produce interpretable evidence`
    );
    assertOk(item.result.nextAction, `${scenario.id}: recommendation result must include next action`);
  }
}

console.log(`Recommendation policy test set passed: ${recommendationScenarios.length} scenarios`);

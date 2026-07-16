// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  canAddCompareSchool,
  canSaveSchool,
  FREE_MAX_COMPARE_SCHOOLS,
  FREE_MAX_SAVED_SCHOOLS,
  freeEntitlements,
  getEntitlements,
  PRO_MAX_COMPARE_SCHOOLS,
  proEntitlements,
  upgradeCopy
} from "../src/entitlements";

describe("getEntitlements", () => {
  it("returns the Free tier caps for a non-Pro user", () => {
    expect(getEntitlements(false)).toEqual(freeEntitlements);
    expect(freeEntitlements.maxSavedSchools).toBe(FREE_MAX_SAVED_SCHOOLS);
    expect(freeEntitlements.maxCompareSchools).toBe(FREE_MAX_COMPARE_SCHOOLS);
    expect(freeEntitlements.shortlistWatermark).toBe(true);
  });

  it("returns unlimited saves and a lifted compare cap for a Pro user", () => {
    expect(getEntitlements(true)).toEqual(proEntitlements);
    expect(proEntitlements.maxSavedSchools).toBeNull();
    expect(proEntitlements.maxCompareSchools).toBe(PRO_MAX_COMPARE_SCHOOLS);
    expect(proEntitlements.shortlistWatermark).toBe(false);
  });
});

describe("canSaveSchool", () => {
  it("allows Free saves up to the cap and blocks the one past it", () => {
    expect(canSaveSchool(freeEntitlements, FREE_MAX_SAVED_SCHOOLS - 1)).toBe(true);
    // At the cap (15 already saved) the 16th is blocked.
    expect(canSaveSchool(freeEntitlements, FREE_MAX_SAVED_SCHOOLS)).toBe(false);
  });

  it("never blocks a Pro user regardless of count", () => {
    expect(canSaveSchool(proEntitlements, 0)).toBe(true);
    expect(canSaveSchool(proEntitlements, 500)).toBe(true);
  });
});

describe("canAddCompareSchool", () => {
  it("blocks the 4th Free comparison but allows up to 6 on Pro", () => {
    expect(canAddCompareSchool(freeEntitlements, FREE_MAX_COMPARE_SCHOOLS - 1)).toBe(
      true
    );
    expect(canAddCompareSchool(freeEntitlements, FREE_MAX_COMPARE_SCHOOLS)).toBe(false);
    expect(canAddCompareSchool(proEntitlements, FREE_MAX_COMPARE_SCHOOLS)).toBe(true);
    expect(canAddCompareSchool(proEntitlements, PRO_MAX_COMPARE_SCHOOLS)).toBe(false);
  });
});

describe("upgradeCopy", () => {
  it("uses the exact saved-schools cap wording the paywall promises", () => {
    expect(upgradeCopy.savedSchoolsCap).toBe(
      "Free plan tracks up to 15 schools — Pro unlocks unlimited"
    );
    expect(upgradeCopy.proCta).toBe("Upgrade to Pro — $6.99/mo");
  });
});

// Central definition of Free vs Pro entitlements for the v1.1 soft paywall
// (subscription groundwork, product analysis §4.1 free/paid split).
//
// This module is pure logic: no React, no storage, no network. The workspace
// provider decides whether the user is Pro (see workspaceContext / the
// `unimap.pro` placeholder) and the individual touchpoints read the caps and
// flags defined here. Keeping the shape in one place means LEO-196 can swap the
// Pro *source* (real subscription) without rewriting any touchpoint.

export type PlanId = "free" | "pro";

/** Monthly Pro price, kept as one source for both display and copy. */
export const PRO_PRICE_LABEL = "$6.99/mo";
export const PRO_MONTHLY_PRICE_USD = 6.99;

/** Free-tier caps. Named so callers and tests reference one definition. */
export const FREE_MAX_SAVED_SCHOOLS = 15;
export const FREE_MAX_COMPARE_SCHOOLS = 3;
export const PRO_MAX_COMPARE_SCHOOLS = 6;

/** Footer / per-page label stamped onto Free shortlist exports. */
export const WATERMARK_LABEL = "Generated with UniMap Condor Free";

export type Entitlements = {
  plan: PlanId;
  /** Max number of `school`-kind favorites the user may keep. `null` = unlimited. */
  maxSavedSchools: number | null;
  /** Max schools lined up in the Compare table at once. */
  maxCompareSchools: number;
  /** Whether exported shortlist HTML carries the Free watermark. */
  shortlistWatermark: boolean;
};

export const freeEntitlements: Entitlements = {
  plan: "free",
  maxSavedSchools: FREE_MAX_SAVED_SCHOOLS,
  maxCompareSchools: FREE_MAX_COMPARE_SCHOOLS,
  shortlistWatermark: true
};

export const proEntitlements: Entitlements = {
  plan: "pro",
  maxSavedSchools: null,
  maxCompareSchools: PRO_MAX_COMPARE_SCHOOLS,
  shortlistWatermark: false
};

/** Resolve the active entitlement set from a Pro flag. */
export function getEntitlements(isPro: boolean): Entitlements {
  return isPro ? proEntitlements : freeEntitlements;
}

/**
 * True when the user may still save another school. Pro (unlimited / `null`
 * cap) is always allowed; Free is allowed while under its cap.
 */
export function canSaveSchool(
  entitlements: Entitlements,
  currentSchoolCount: number
): boolean {
  if (entitlements.maxSavedSchools === null) return true;
  return currentSchoolCount < entitlements.maxSavedSchools;
}

/** True when another school can be added to the Compare table. */
export function canAddCompareSchool(
  entitlements: Entitlements,
  currentCompareCount: number
): boolean {
  return currentCompareCount < entitlements.maxCompareSchools;
}

/**
 * Friendly, non-nagging upgrade lines shown at each touchpoint. Centralized so
 * copy stays consistent (and testable) across the app.
 */
export const upgradeCopy = {
  savedSchoolsCap: `Free plan tracks up to ${FREE_MAX_SAVED_SCHOOLS} schools — Pro unlocks unlimited`,
  compareCap: `Free plan compares ${FREE_MAX_COMPARE_SCHOOLS} schools — Pro extends this to ${PRO_MAX_COMPARE_SCHOOLS}`,
  shortlistWatermark: "Free exports carry a small watermark — Pro removes it.",
  proCta: `Upgrade to Pro — ${PRO_PRICE_LABEL}`
} as const;

/** Benefit bullets rendered in the Pro intro card. */
export const proBenefits: readonly string[] = [
  `Unlimited saved schools (Free stops at ${FREE_MAX_SAVED_SCHOOLS})`,
  `Compare up to ${PRO_MAX_COMPARE_SCHOOLS} schools side by side (Free ${FREE_MAX_COMPARE_SCHOOLS})`,
  "Clean shortlist exports with no watermark"
];

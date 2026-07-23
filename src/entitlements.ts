// Central definition of Free vs Pro entitlements for the v1.1 soft paywall
// (subscription groundwork, product analysis §4.1 free/paid split).
//
// This module is pure logic: no React, no storage, no network. The workspace
// provider decides whether the user is Pro (see workspaceContext / the
// `unimap.pro` placeholder) and the individual touchpoints read the caps and
// flags defined here. Keeping the shape in one place means LEO-196 can swap the
// Pro *source* (real subscription) without rewriting any touchpoint.

import type { DetailTab } from "./workspace/types";

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
  `Compare up to ${PRO_MAX_COMPARE_SCHOOLS} schools side by side`,
  "Decision, research, faculty & recommendation deep dives",
  "Workspace backup import/export",
  "Clean shortlist exports with no watermark"
];

// --- Hard 3-tier access model -----------------------------------------------
//
// On top of the Free/Pro caps above, access is hard-gated by tier:
//   visitor — signed out: map, pins and search only. School details and the
//             Saved panel show a sign-in prompt instead of content.
//   member  — signed in without a subscription: Overview/Rankings/Community
//             tabs and the Saved list (Free caps apply). Deep-dive tabs,
//             Compare and workspace import/export are visible but locked.
//   pro     — subscriber: everything unlocked, the caps above still apply.
//
// Pure logic like the rest of this module: callers pass the auth/subscription
// flags in; UI components consume the resulting tier via workspaceContext.

export type AccessTier = "visitor" | "member" | "pro";

/**
 * Resolve the access tier. `isPro` wins even without a session so the
 * `unimap.pro` logged-out dev/preview backdoor (see workspaceContext) keeps
 * unlocking the full experience; real signed-out users are never Pro.
 */
export function getAccessTier(isSignedIn: boolean, isPro: boolean): AccessTier {
  if (isPro) return "pro";
  return isSignedIn ? "member" : "visitor";
}

/**
 * Detail tabs locked behind Pro for signed-in Free members. Overview stays
 * free as the core value loop; Rankings and Community ride along free too
 * (they present already-public list data, not deep-dive analysis).
 */
export const lockedDetailTabs: readonly DetailTab[] = [
  "decision",
  "research",
  "faculty",
  "recommendations"
];

/** True when the given detail tab renders the Pro upsell instead of content. */
export function isDetailTabLocked(tier: AccessTier, tab: DetailTab): boolean {
  return tier !== "pro" && lockedDetailTabs.includes(tab);
}

/** True when the school detail panel requires sign-in before showing tabs. */
export function requiresAuthForDetails(tier: AccessTier): boolean {
  return tier === "visitor";
}

/** True when the Saved panel shows a sign-in prompt instead of content. */
export function requiresAuthForSaved(tier: AccessTier): boolean {
  return tier === "visitor";
}

/** Compare (detail header, Saved rows, Compare drawer) is Pro-only. */
export function canUseCompare(tier: AccessTier): boolean {
  return tier === "pro";
}

/** Workspace backup import/export (JSON) is Pro-only. */
export function canImportExport(tier: AccessTier): boolean {
  return tier === "pro";
}

/** Copy for the hard-gate touchpoints, centralized like `upgradeCopy`. */
export const gateCopy = {
  signInForDetails: "Sign in to view school details",
  signInForSaved: "Sign in to see your saved schools",
  lockedTabTitle: "This section is part of Pro",
  lockedTabBody:
    "Decision workflow, research output, faculty directory and tailored recommendations are included in UniMap Condor Pro.",
  compareLocked: "Compare schools side by side with Pro",
  importExportLocked: "Workspace import/export is part of Pro"
} as const;

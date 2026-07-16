import type { PreferenceProfile } from "../types";
import type { ApplicationStatus, DetailTab, MapStyleId } from "./types";

export const mapStyles: Array<{ id: MapStyleId; label: string; url: string }> = [
  {
    id: "liberty",
    label: "Liberty",
    url: "https://tiles.openfreemap.org/styles/liberty"
  },
  {
    id: "bright",
    label: "Bright",
    url: "https://tiles.openfreemap.org/styles/bright"
  },
  {
    id: "positron",
    label: "Positron",
    url: "https://tiles.openfreemap.org/styles/positron"
  }
];

export const palette = [
  "#2563eb",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#c2410c",
  "#0891b2",
  "#be123c",
  "#4d7c0f"
];

export const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "overview" },
  { id: "decision", label: "decision" },
  { id: "rankings", label: "rankings" },
  { id: "research", label: "research" },
  { id: "faculty", label: "faculty" },
  { id: "recommendations", label: "recommend" },
  { id: "community", label: "community" }
];

export const applicationStatuses: Array<{
  id: ApplicationStatus;
  label: string;
  description: string;
}> = [
  { id: "interested", label: "Interested", description: "Worth watching" },
  { id: "longlist", label: "Longlist", description: "Candidate pool" },
  { id: "shortlist", label: "Shortlist", description: "High intent" },
  { id: "applying", label: "Applying", description: "In progress" },
  { id: "rejected", label: "Rejected by me", description: "Removed for now" }
];

export const defaultPreferenceProfile: PreferenceProfile = {
  schemaVersion: 1,
  updatedAt: "",
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
  acceptsSmallCities: true,
  acceptsCourseBased: true,
  acceptsNichePrograms: true,
  notes: ""
};
// North America CS master's starter template used by the first-run welcome
// layer. Pre-fills the fields the fit engine reads so new users get signals
// immediately instead of staring at an empty preference form.
export const northAmericaCsTemplate: PreferenceProfile = {
  ...defaultPreferenceProfile,
  degreeLevel: "Master",
  targetCountries: "Canada, United States",
  targetCities: "",
  budgetCurrency: "USD",
  maxTuition: "",
  fundingRequirement: "preferred",
  subjectAreas: "Computer Science, Software Engineering, AI, Machine Learning",
  researchKeywords: "machine learning, NLP, systems, HCI",
  employmentPriority: "high",
  researchPriority: "medium",
  immigrationPriority: "high",
  notes:
    "North America CS master's shortlist. Adjust the template to match your own profile."
};

export const favoritesStorageKey = "unimap.favorites";
export const preferenceStorageKey = "unimap.preferenceProfile";
export const schoolDecisionsStorageKey = "unimap.schoolDecisions";
export const welcomeDismissedStorageKey = "unimap.welcomeDismissed";
export const facultyPageSize = 30;
// v1.1 soft paywall placeholder. `unimap.pro` is a manual dev/preview toggle for
// the Pro flag; LEO-196 replaces it with real subscription state. Tier caps
// themselves live in src/entitlements.ts, not here.
export const proStorageKey = "unimap.pro";

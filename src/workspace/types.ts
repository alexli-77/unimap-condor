import type { PreferenceProfile } from "../types";

export type Mode = "rankings" | "strength";
export type MapStyleId = "liberty" | "bright" | "positron";
export type FavoriteKind = "school" | "subject" | "advisor";
export type LeftPanel = "filters" | "saved" | "compare" | "view";
export type PointSize = "small" | "normal" | "large";
export type ApplicationStatus =
  "interested" | "longlist" | "shortlist" | "applying" | "rejected";
export type StringPreferenceKey = {
  [K in keyof PreferenceProfile]: PreferenceProfile[K] extends string ? K : never;
}[keyof PreferenceProfile];
export type BooleanPreferenceKey = {
  [K in keyof PreferenceProfile]: PreferenceProfile[K] extends boolean ? K : never;
}[keyof PreferenceProfile];
export type FavoriteItem = {
  id: string;
  kind: FavoriteKind;
  universityId: number;
  universityName: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
  label: string;
  createdAt: string;
};
export type SchoolDecision = {
  universityId: number;
  status: ApplicationStatus;
  keepReason: string;
  rejectReason: string;
  nextAction: string;
  updatedAt: string;
};
export type SchoolDecisionPatch = Partial<
  Pick<SchoolDecision, "status" | "keepReason" | "rejectReason" | "nextAction">
>;
export type FitLevel = "good" | "possible" | "weak";
export type FitSignals = {
  level: FitLevel;
  label: string;
  summary: string;
  matched: string[];
  risks: string[];
  missing: string[];
  nextAction: string;
};
export type WorkspaceBackup = {
  app: "unimap-condor";
  schemaVersion: 1;
  exportedAt: string;
  favorites: FavoriteItem[];
  schoolDecisions: Record<number, SchoolDecision>;
  preferenceProfile: PreferenceProfile;
};

export type DetailTab =
  | "overview"
  | "decision"
  | "research"
  | "faculty"
  | "recommendations"
  | "community";

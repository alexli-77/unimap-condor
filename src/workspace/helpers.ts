import {
  defaultRecommendationPolicy,
  type RecommendationResult
} from "../recommendationPolicy";
import type {
  OpenDataProfile,
  PreferenceProfile,
  PriorityLevel,
  RankingFeature
} from "../types";
import {
  applicationStatuses,
  defaultPreferenceProfile,
  preferenceStorageKey,
  schoolDecisionsStorageKey
} from "./constants";
import type {
  ApplicationStatus,
  FavoriteItem,
  FavoriteKind,
  FitLevel,
  FitSignals,
  PointSize,
  SchoolDecision,
  WorkspaceBackup
} from "./types";

export function isFavoriteKind(value: unknown): value is FavoriteKind {
  return value === "school" || value === "subject" || value === "advisor";
}

export function normalizeFavoriteItem(value: Partial<FavoriteItem>): FavoriteItem | null {
  if (
    typeof value.id !== "string" ||
    !isFavoriteKind(value.kind) ||
    typeof value.universityName !== "string" ||
    typeof value.label !== "string"
  ) {
    return null;
  }
  const universityId = Number(value.universityId);
  const longitude = Number(value.longitude);
  const latitude = Number(value.latitude);
  if (![universityId, longitude, latitude].every(Number.isFinite)) return null;

  return {
    id: value.id,
    kind: value.kind,
    universityId,
    universityName: value.universityName,
    city: value.city ?? "",
    country: value.country ?? "",
    longitude,
    latitude,
    label: value.label,
    createdAt: value.createdAt ?? new Date().toISOString()
  };
}

export function normalizeSchoolDecisions(value: unknown): Record<number, SchoolDecision> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, Partial<SchoolDecision>>)
      .map(([key, item]) => {
        const universityId = Number(item.universityId ?? key);
        if (!Number.isFinite(universityId)) return null;
        const status = applicationStatuses.some(
          (statusItem) => statusItem.id === item.status
        )
          ? (item.status as ApplicationStatus)
          : "interested";
        return [
          universityId,
          {
            ...getDefaultSchoolDecision(universityId),
            ...item,
            universityId,
            status,
            keepReason: item.keepReason ?? "",
            rejectReason: item.rejectReason ?? "",
            nextAction: item.nextAction ?? "",
            updatedAt: item.updatedAt ?? ""
          }
        ] as const;
      })
      .filter(Boolean) as Array<readonly [number, SchoolDecision]>
  );
}

export function normalizePreferenceProfile(value: unknown): PreferenceProfile {
  if (!value || typeof value !== "object") return defaultPreferenceProfile;
  const profile = value as Partial<PreferenceProfile>;
  return {
    ...defaultPreferenceProfile,
    ...profile,
    schemaVersion: 1,
    updatedAt: profile.updatedAt ?? new Date().toISOString(),
    employmentPriority: ["low", "medium", "high"].includes(
      profile.employmentPriority ?? ""
    )
      ? (profile.employmentPriority as PriorityLevel)
      : "medium",
    researchPriority: ["low", "medium", "high"].includes(profile.researchPriority ?? "")
      ? (profile.researchPriority as PriorityLevel)
      : "medium",
    immigrationPriority: ["low", "medium", "high"].includes(
      profile.immigrationPriority ?? ""
    )
      ? (profile.immigrationPriority as PriorityLevel)
      : "medium",
    acceptsSmallCities: Boolean(profile.acceptsSmallCities ?? true),
    acceptsCourseBased: Boolean(profile.acceptsCourseBased ?? true),
    acceptsNichePrograms: Boolean(profile.acceptsNichePrograms ?? true)
  };
}

export function parseWorkspaceBackup(raw: string): WorkspaceBackup {
  const parsed = JSON.parse(raw) as Partial<WorkspaceBackup> & {
    favorites?: unknown;
    schoolDecisions?: unknown;
    preferenceProfile?: unknown;
  };
  const favorites = Array.isArray(parsed.favorites)
    ? (parsed.favorites
        .map((item) => normalizeFavoriteItem(item as Partial<FavoriteItem>))
        .filter(Boolean) as FavoriteItem[])
    : [];

  return {
    app: "unimap-condor",
    schemaVersion: 1,
    exportedAt: parsed.exportedAt ?? new Date().toISOString(),
    favorites,
    schoolDecisions: normalizeSchoolDecisions(parsed.schoolDecisions),
    preferenceProfile: normalizePreferenceProfile(parsed.preferenceProfile)
  };
}

export function formatCompact(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "n/a";
  return Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function getGoogleMapsUrl(feature: RankingFeature) {
  const p = feature.properties;
  const query = encodeURIComponent(`${p.universityName} ${p.city} ${p.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getFavoriteId(
  kind: FavoriteKind,
  universityId: number,
  entityKey: string
) {
  return `${kind}:${universityId}:${entityKey.trim().toLowerCase()}`;
}

export function createFavoriteItem(
  feature: RankingFeature,
  kind: FavoriteKind,
  label: string,
  entityKey = label
): FavoriteItem {
  const p = feature.properties;
  const [longitude, latitude] = feature.geometry.coordinates;
  return {
    id: getFavoriteId(kind, p.universityId, entityKey),
    kind,
    universityId: p.universityId,
    universityName: p.universityName,
    city: p.city,
    country: p.country,
    longitude,
    latitude,
    label,
    createdAt: new Date().toISOString()
  };
}

export function getDefaultSchoolDecision(universityId: number): SchoolDecision {
  return {
    universityId,
    status: "interested",
    keepReason: "",
    rejectReason: "",
    nextAction: "",
    updatedAt: ""
  };
}

export function getStatusMeta(status: ApplicationStatus) {
  return applicationStatuses.find((item) => item.id === status) ?? applicationStatuses[0];
}

export function loadSchoolDecisions(): Record<number, SchoolDecision> {
  const saved = localStorage.getItem(schoolDecisionsStorageKey);
  if (!saved) return {};
  try {
    const parsed = JSON.parse(saved) as Record<string, Partial<SchoolDecision>>;
    return Object.fromEntries(
      Object.entries(parsed)
        .map(([key, value]) => {
          const universityId = Number(value.universityId ?? key);
          if (!Number.isFinite(universityId)) return null;
          return [
            universityId,
            {
              ...getDefaultSchoolDecision(universityId),
              ...value,
              universityId,
              status: applicationStatuses.some((item) => item.id === value.status)
                ? (value.status as ApplicationStatus)
                : "interested"
            }
          ] as const;
        })
        .filter(Boolean) as Array<readonly [number, SchoolDecision]>
    );
  } catch {
    return {};
  }
}

export function loadPreferenceProfile(): PreferenceProfile {
  const saved = localStorage.getItem(preferenceStorageKey);
  if (!saved) return defaultPreferenceProfile;
  try {
    const parsed = JSON.parse(saved) as Partial<PreferenceProfile> & {
      subjects?: string;
      countries?: string;
      budget?: string;
      priority?: string;
      timeline?: string;
    };
    return {
      ...defaultPreferenceProfile,
      ...parsed,
      subjectAreas: parsed.subjectAreas ?? parsed.subjects ?? "",
      targetCountries: parsed.targetCountries ?? parsed.countries ?? "",
      maxTuition: parsed.maxTuition ?? parsed.budget ?? "",
      notes: parsed.notes ?? [parsed.priority, parsed.timeline].filter(Boolean).join("\n")
    };
  } catch {
    return defaultPreferenceProfile;
  }
}

export function hasPreferenceProfile(profile: PreferenceProfile) {
  return Boolean(
    [
      profile.degreeLevel,
      profile.targetCountries,
      profile.targetCities,
      profile.maxTuition,
      profile.subjectAreas,
      profile.researchKeywords,
      profile.gpa,
      profile.languageScores,
      profile.background,
      profile.notes
    ].some((value) => value.trim())
  );
}

export function formatPriority(value: PriorityLevel) {
  if (value === "high") return "High";
  if (value === "low") return "Low";
  return "Medium";
}

export function getPreferenceSignals(profile: PreferenceProfile) {
  const location = [profile.targetCountries, profile.targetCities]
    .filter(Boolean)
    .join(" / ");
  const budget = profile.maxTuition
    ? `${profile.budgetCurrency} ${profile.maxTuition}`
    : profile.fundingRequirement === "required"
      ? "Funding required"
      : "";
  return [
    profile.degreeLevel && `Degree: ${profile.degreeLevel}`,
    profile.subjectAreas && `Subjects: ${profile.subjectAreas}`,
    location && `Location: ${location}`,
    budget && `Budget: ${budget}`,
    profile.researchKeywords && `Research: ${profile.researchKeywords}`,
    profile.gpa && `GPA: ${profile.gpa}`,
    profile.languageScores && `Language: ${profile.languageScores}`
  ].filter(Boolean) as string[];
}

export function formatSourceBadge(sourceName: string) {
  if (/\bqs\b/i.test(sourceName)) return "QS";
  return sourceName;
}

export function mapRecommendationLevelToFitLevel(
  level: RecommendationResult["level"]
): FitLevel {
  if (level === "strong") return "good";
  if (level === "possible") return "possible";
  return "weak";
}

export function buildFitSignals(
  feature: RankingFeature,
  preference: PreferenceProfile,
  openDataProfile?: OpenDataProfile | null
): FitSignals {
  const result = defaultRecommendationPolicy.scoreSchool(feature, preference, {
    openDataProfile
  });

  return {
    level: mapRecommendationLevelToFitLevel(result.level),
    label: result.label,
    summary: result.summary,
    matched: result.matched,
    risks: result.concerns,
    missing: result.missing,
    nextAction: result.nextAction
  };
}

export function getPointSizeScale(size: PointSize) {
  if (size === "small") return 0.78;
  if (size === "large") return 1.24;
  return 1;
}

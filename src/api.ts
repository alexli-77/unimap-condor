import type {
  AdvisorCard,
  FacultyDirectoryEntry,
  OpenDataProfile,
  RankingFeatureCollection,
  Source,
  SourceAvailability,
  UniversityDetail
} from "./types";
import { localFacultyDirectory } from "./localFacultyDirectory";
import { localAdvisorCards } from "./localAdvisors";
import { supabase } from "./supabase";

const responseCache = new Map<string, unknown>();
const universityCache = new Map<number, UniversityDetail>();
const openDataCache = new Map<string, OpenDataProfile>();
const advisorCache = new Map<string, AdvisorCard[]>();
const facultyDirectoryCache = new Map<string, FacultyDirectoryEntry[]>();

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!signal && responseCache.has(path)) {
    return responseCache.get(path) as T;
  }

  const response = await fetch(`/api${path}`, { signal });
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new Error(data?.message || response.statusText);
  }

  if (!signal) {
    responseCache.set(path, data);
  }

  return data as T;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(response.statusText);
  return response.json() as Promise<T>;
}

function uniq(values: Array<string | undefined>) {
  return [...new Set(values.filter(Boolean) as string[])];
}

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function advisorMatchesUniversity(advisor: AdvisorCard, universityName: string) {
  const selected = normalizeName(universityName);
  return [advisor.institutionName, ...advisor.institutionAliases].some((alias) => {
    const normalized = normalizeName(alias);
    return selected.includes(normalized) || normalized.includes(selected);
  });
}

function directoryEntryMatchesUniversity(
  entry: FacultyDirectoryEntry,
  universityName: string
) {
  const selected = normalizeName(universityName);
  return [entry.institutionName, ...entry.institutionAliases].some((alias) => {
    const normalized = normalizeName(alias);
    return selected.includes(normalized) || normalized.includes(selected);
  });
}

function mapAdvisorRow(row: any): AdvisorCard {
  return {
    id: String(row.id),
    fullName: row.full_name,
    institutionName: row.institution_name,
    institutionAliases: row.institution_aliases ?? [],
    department: row.department ?? undefined,
    lab: row.lab ?? undefined,
    title: row.title ?? undefined,
    priority: row.priority ?? undefined,
    priorityScore: row.priority_score ?? undefined,
    fitSummary: row.fit_summary ?? "",
    contactAngle: row.contact_angle ?? undefined,
    researchAreas: row.research_areas ?? [],
    targetPrograms: row.target_programs ?? [],
    politicalSensitivity: row.political_sensitivity ?? undefined,
    recruitingSignal: row.recruiting_signal ?? undefined,
    outreachStatus: row.outreach_status ?? undefined,
    profileUrl: row.profile_url ?? undefined,
    sourceLabel: row.source_label ?? undefined
  };
}

function getLocalAdvisorCards(universityName: string) {
  return localAdvisorCards
    .filter((advisor) => advisorMatchesUniversity(advisor, universityName))
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0));
}

function getFacultyDirectoryEntries(universityName: string) {
  const cacheKey = normalizeName(universityName);
  if (facultyDirectoryCache.has(cacheKey)) {
    return facultyDirectoryCache.get(cacheKey)!;
  }

  const entries = localFacultyDirectory
    .filter((entry) => directoryEntryMatchesUniversity(entry, universityName))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  facultyDirectoryCache.set(cacheKey, entries);
  return entries;
}

async function getAdvisorCards(
  universityName: string,
  signal?: AbortSignal
): Promise<AdvisorCard[]> {
  const cacheKey = normalizeName(universityName);
  if (!signal && advisorCache.has(cacheKey)) {
    return advisorCache.get(cacheKey)!;
  }

  if (!supabase) {
    const localCards = getLocalAdvisorCards(universityName);
    if (!signal) advisorCache.set(cacheKey, localCards);
    return localCards;
  }

  try {
    const query = supabase
      .from("university_advisor_cards")
      .select("*")
      .eq("is_active", true)
      .order("priority_score", { ascending: false });

    const { data, error } = await (signal ? query.abortSignal(signal) : query);
    if (error) throw error;

    const cards = (data ?? [])
      .map(mapAdvisorRow)
      .filter((advisor) => advisorMatchesUniversity(advisor, universityName));

    if (!signal) advisorCache.set(cacheKey, cards);
    return cards;
  } catch (error) {
    console.warn("Falling back to local advisor cards", error);
    const localCards = getLocalAdvisorCards(universityName);
    if (!signal) advisorCache.set(cacheKey, localCards);
    return localCards;
  }
}

async function getOpenDataProfile(
  universityName: string,
  signal?: AbortSignal
): Promise<OpenDataProfile> {
  const cacheKey = universityName.toLowerCase();
  if (!signal && openDataCache.has(cacheKey)) {
    return openDataCache.get(cacheKey)!;
  }

  const query = encodeURIComponent(universityName);
  const [openAlexResult, rorResult] = await Promise.allSettled([
    getJson<{ results: Array<Record<string, any>> }>(
      `/openalex/institutions?search=${query}&per-page=1`,
      signal
    ),
    getJson<{ items: Array<Record<string, any>> }>(
      `/ror/organizations?query=${query}`,
      signal
    )
  ]);

  const openAlex =
    openAlexResult.status === "fulfilled" ? openAlexResult.value.results?.[0] : undefined;
  const ror = rorResult.status === "fulfilled" ? rorResult.value.items?.[0] : undefined;

  if (!openAlex && !ror) {
    return {
      status: "not_found",
      aliases: [],
      topics: [],
      relatedInstitutions: [],
      message: "OpenAlex and ROR did not return a matching institution."
    };
  }

  const rorLinks = (ror?.links ?? []) as Array<{ type?: string; value?: string }>;
  const wikidataId =
    openAlex?.ids?.wikidata ??
    ror?.external_ids?.find((id: any) => id.type === "wikidata")?.preferred;
  const wikipediaUrl =
    openAlex?.ids?.wikipedia ?? rorLinks.find((link) => link.type === "wikipedia")?.value;
  const homepageUrl =
    openAlex?.homepage_url ?? rorLinks.find((link) => link.type === "website")?.value;

  const profile: OpenDataProfile = {
    status: "available",
    homepageUrl,
    wikipediaUrl,
    wikidataId,
    rorId: ror?.id ?? openAlex?.ror,
    established: ror?.established,
    aliases: uniq([
      ...(openAlex?.display_name_acronyms ?? []),
      ...(openAlex?.display_name_alternatives ?? []),
      ...(ror?.names ?? []).map((name: any) => name.value)
    ]).slice(0, 8),
    worksCount: openAlex?.works_count,
    citedByCount: openAlex?.cited_by_count,
    hIndex: openAlex?.summary_stats?.h_index,
    twoYearMeanCitedness: openAlex?.summary_stats?.["2yr_mean_citedness"],
    topics: (openAlex?.topics ?? []).slice(0, 6).map((topic: any) => ({
      name: topic.display_name ?? topic.topic?.display_name ?? "Topic",
      count: topic.count,
      share: topic.value
    })),
    relatedInstitutions: (openAlex?.associated_institutions ?? [])
      .slice(0, 5)
      .map((institution: any) => ({
        name: institution.display_name,
        relationship: institution.relationship
      }))
  };

  if (!signal) {
    openDataCache.set(cacheKey, profile);
  }

  return profile;
}

export const api = {
  getAvailabilities: (signal?: AbortSignal) =>
    request<SourceAvailability[]>("/sources/availabilities", signal),
  getSources: (signal?: AbortSignal) => request<Source[]>("/sources", signal),
  getRankings: (
    source: string,
    year: string,
    subject: string,
    signal?: AbortSignal
  ) =>
    request<RankingFeatureCollection>(
      `/rankings?source=${encodeURIComponent(source)}&year=${encodeURIComponent(
        year
      )}&subject=${encodeURIComponent(subject)}`,
      signal
    ),
  getSubjectScores: (source: string, year: string, signal?: AbortSignal) =>
    request<RankingFeatureCollection>(
      `/rankings/subject-scores?source=${encodeURIComponent(
        source
      )}&year=${encodeURIComponent(year)}`,
      signal
    ),
  getUniversity: async (id: number, signal?: AbortSignal) => {
    if (!signal && universityCache.has(id)) {
      return universityCache.get(id)!;
    }
    const detail = await request<UniversityDetail>(`/universities/${id}/rankings`, signal);
    if (!signal) {
      universityCache.set(id, detail);
    }
    return detail;
  },
  getOpenDataProfile,
  getAdvisorCards,
  getFacultyDirectoryEntries
};

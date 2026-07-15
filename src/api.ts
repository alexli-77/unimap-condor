import type {
  AdvisorCard,
  FacultyDepartmentSummary,
  FacultyDirectoryEntry,
  FacultyDirectoryPage,
  FacultyDirectorySummary,
  OpenDataProfile,
  RankingFeatureCollection,
  SchoolDecisionFact,
  SchoolDecisionFacts,
  Source,
  SourceAvailability,
  UniversityDetail
} from "./types";
import {
  getLocalRankingCollection,
  getLocalUniversityDetail,
  mergeLocalAvailabilities,
  mergeLocalUniversityDetail
} from "./localRankings";
import { supabase } from "./supabase";

const responseCache = new Map<string, unknown>();
const jsonCache = new Map<string, unknown>();
const universityCache = new Map<number, UniversityDetail>();
const openDataCache = new Map<string, OpenDataProfile>();
const advisorCache = new Map<string, AdvisorCard[]>();
const facultyDirectoryCache = new Map<string, FacultyDirectoryEntry[]>();
const facultySummaryCache = new Map<string, FacultyDirectorySummary>();
const facultyPageCache = new Map<string, FacultyDirectoryPage>();
const decisionFactsCache = new Map<string, SchoolDecisionFacts>();

export type DataSource = "remote" | "local";

const dataSourceListeners = new Set<(source: DataSource) => void>();

/**
 * Subscribe to data-source changes. Fires "local" whenever the app serves
 * bundled/offline data (either the default local dataset or a remote fallback)
 * and "remote" when live data is returned. Returns an unsubscribe function.
 */
export function onDataSourceChange(listener: (source: DataSource) => void) {
  dataSourceListeners.add(listener);
  return () => {
    dataSourceListeners.delete(listener);
  };
}

function reportDataSource(source: DataSource) {
  dataSourceListeners.forEach((listener) => listener(source));
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (responseCache.has(path)) {
    return responseCache.get(path) as T;
  }

  const storageKey = `unimap.api${path}`;
  const stored = readStoredResponse<T>(storageKey);
  if (stored) {
    responseCache.set(path, stored);
    return stored;
  }

  const response = await fetch(`/api${path}`, { signal });
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new Error(data?.message || response.statusText);
  }

  responseCache.set(path, data);
  storeResponse(storageKey, data);

  return data as T;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  if (jsonCache.has(url)) {
    return jsonCache.get(url) as T;
  }

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(response.statusText);
  const data = (await response.json()) as T;
  jsonCache.set(url, data);
  return data;
}

function readStoredResponse<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { savedAt: number; data: T };
    if (Date.now() - cached.savedAt > 1000 * 60 * 60 * 24 * 7) {
      localStorage.removeItem(key);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function storeResponse(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Ignore quota/private-mode failures; in-memory cache still applies.
  }
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

function decisionFactMatchesUniversity(fact: SchoolDecisionFact, universityName: string) {
  const selected = normalizeName(universityName);
  const institution = normalizeName(fact.institutionName);
  return selected.includes(institution) || institution.includes(selected);
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

async function getLocalAdvisorCards(universityName: string) {
  const { localAdvisorCards } = await import("./localAdvisors");
  return localAdvisorCards
    .filter((advisor) => advisorMatchesUniversity(advisor, universityName))
    .sort((a, b) => (b.priorityScore ?? 0) - (a.priorityScore ?? 0));
}

async function getFacultyDirectoryEntries(universityName: string) {
  const cacheKey = normalizeName(universityName);
  if (facultyDirectoryCache.has(cacheKey)) {
    return facultyDirectoryCache.get(cacheKey)!;
  }

  const { localFacultyDirectory } = await import("./localFacultyDirectory");
  const entries = localFacultyDirectory
    .filter((entry) => directoryEntryMatchesUniversity(entry, universityName))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  facultyDirectoryCache.set(cacheKey, entries);
  return entries;
}

function buildFacultySummary(
  universityName: string,
  entries: FacultyDirectoryEntry[],
  sourceLabel = "Local directory"
): FacultyDirectorySummary {
  const departments = new Map<string, FacultyDepartmentSummary>();

  entries.forEach((entry) => {
    const name = entry.departmentName || "Academic department";
    const key = `${entry.facultyName || "Faculty / School"}::${name}`;
    const current = departments.get(key) ?? {
      name,
      facultyName: entry.facultyName,
      count: 0,
      expertise: [],
      roles: []
    };
    current.count += 1;
    current.expertise = uniq([...current.expertise, ...entry.expertise]).slice(0, 8);
    current.roles = uniq([...current.roles, entry.role]).slice(0, 6);
    departments.set(key, current);
  });

  return {
    universityName,
    totalEntries: entries.length,
    sourceUrl: entries[0]?.sourceUrl,
    sourceLabel,
    departments: [...departments.values()].sort((a, b) => b.count - a.count)
  };
}

function sliceFacultyPage(
  entries: FacultyDirectoryEntry[],
  offset: number,
  limit: number
): FacultyDirectoryPage {
  const safeOffset = Math.max(0, offset);
  const safeLimit = Math.max(1, limit);
  return {
    entries: entries.slice(safeOffset, safeOffset + safeLimit),
    total: entries.length,
    offset: safeOffset,
    limit: safeLimit,
    hasMore: safeOffset + safeLimit < entries.length,
    sourceUrl: entries[0]?.sourceUrl
  };
}

function mapFacultyDirectoryRow(row: any): FacultyDirectoryEntry {
  const researchAreas = Array.isArray(row.research_areas)
    ? row.research_areas
    : Array.isArray(row.expertise)
      ? row.expertise
      : [];
  return {
    id: String(row.id ?? row.record_key ?? row.full_name),
    fullName: row.full_name ?? row.name ?? "",
    institutionName: row.institution_name ?? "",
    institutionAliases: row.institution_aliases ?? [],
    facultyName: row.faculty_name ?? "",
    departmentName: row.department_name ?? row.department ?? "",
    role: row.role ?? row.title ?? undefined,
    email: row.email ?? undefined,
    profileUrl: row.profile_url ?? undefined,
    expertise: researchAreas,
    sourceUrl: row.source_url ?? ""
  };
}

function mapDepartmentSummaryRow(row: any): FacultyDepartmentSummary {
  return {
    name: row.department_name || "Academic department",
    facultyName: row.faculty_name ?? "",
    count: Number(row.member_count ?? row.count ?? 0),
    expertise: Array.isArray(row.research_areas) ? row.research_areas.slice(0, 8) : [],
    roles: Array.isArray(row.roles) ? row.roles.slice(0, 6) : []
  };
}

function mapDecisionFactRow(row: any): SchoolDecisionFact {
  const fact = row.fact_json ?? row.extracted_json ?? {};
  const amounts = Array.isArray(row.amounts)
    ? row.amounts
    : Array.isArray(fact.amounts)
      ? fact.amounts
      : [];

  return {
    id: String(row.id ?? row.record_key ?? row.title),
    institutionName: row.institution_name ?? "",
    recordType: row.record_type,
    title: row.title ?? fact.name ?? fact.topic ?? "Verified fact",
    degreeLevel: row.degree_level ?? fact.degree_level ?? undefined,
    topic: row.topic ?? fact.topic ?? undefined,
    department: row.department ?? fact.department ?? undefined,
    duration: row.duration ?? fact.duration ?? undefined,
    programFormat: row.program_format ?? fact.program_format ?? undefined,
    amounts,
    rawLabel: row.raw_label ?? fact.raw_label ?? "",
    evidenceUrl: row.evidence_url ?? fact.evidence_url ?? row.source_url ?? "",
    sourceUrl: row.source_url ?? fact.evidence_url ?? "",
    confidence: row.confidence ? Number(row.confidence) : undefined,
    verifiedAt: row.verified_at ?? undefined
  };
}

function buildDecisionFacts(
  universityName: string,
  facts: SchoolDecisionFact[],
  sourceLabel: string
): SchoolDecisionFacts {
  const matchingFacts = facts.filter((fact) =>
    decisionFactMatchesUniversity(fact, universityName)
  );
  return {
    universityName,
    sourceLabel,
    programs: matchingFacts.filter((fact) => fact.recordType === "program"),
    funding: matchingFacts.filter((fact) => fact.recordType === "tuition_funding")
  };
}

async function getSchoolDecisionFacts(
  universityName: string,
  signal?: AbortSignal
): Promise<SchoolDecisionFacts> {
  const cacheKey = normalizeName(universityName);
  if (!signal && decisionFactsCache.has(cacheKey)) {
    return decisionFactsCache.get(cacheKey)!;
  }

  if (supabase) {
    try {
      const query = supabase
        .from("university_decision_facts_public")
        .select("*")
        .ilike("institution_name", `%${universityName}%`)
        .order("record_type", { ascending: true })
        .order("title", { ascending: true });

      const { data, error } = await (signal ? query.abortSignal(signal) : query);
      if (error) throw error;

      if (data?.length) {
        const facts = buildDecisionFacts(
          universityName,
          data.map(mapDecisionFactRow),
          "Verified decision facts"
        );
        if (!signal) decisionFactsCache.set(cacheKey, facts);
        return facts;
      }
    } catch (error) {
      console.warn("Falling back to local decision facts", error);
    }
  }

  const { localDecisionFacts } = await import("./localDecisionFacts");
  const facts = buildDecisionFacts(universityName, localDecisionFacts, "Local verified facts");
  if (!signal) decisionFactsCache.set(cacheKey, facts);
  return facts;
}

async function getFacultyDirectorySummary(
  universityName: string,
  signal?: AbortSignal
): Promise<FacultyDirectorySummary> {
  const cacheKey = normalizeName(universityName);
  if (!signal && facultySummaryCache.has(cacheKey)) {
    return facultySummaryCache.get(cacheKey)!;
  }

  if (supabase) {
    try {
      const query = supabase
        .from("university_faculty_department_summary_public")
        .select("*")
        .ilike("institution_name", `%${universityName}%`)
        .order("member_count", { ascending: false });

      const { data, error } = await (signal ? query.abortSignal(signal) : query);
      if (error) throw error;

      const departments = (data ?? []).map(mapDepartmentSummaryRow);
      if (departments.length) {
        const summary: FacultyDirectorySummary = {
          universityName,
          totalEntries: departments.reduce((sum, department) => sum + department.count, 0),
          sourceUrl: data?.[0]?.source_url ?? undefined,
          sourceLabel: "Verified faculty index",
          departments
        };
        if (!signal) facultySummaryCache.set(cacheKey, summary);
        return summary;
      }
    } catch (error) {
      console.warn("Falling back to local faculty summary", error);
    }
  }

  const summary = buildFacultySummary(
    universityName,
    await getFacultyDirectoryEntries(universityName),
    "Local faculty directory"
  );
  if (!signal) facultySummaryCache.set(cacheKey, summary);
  return summary;
}

async function getFacultyDirectoryPage(
  universityName: string,
  departmentName: string,
  offset = 0,
  limit = 30,
  signal?: AbortSignal
): Promise<FacultyDirectoryPage> {
  const cacheKey = [
    normalizeName(universityName),
    normalizeName(departmentName),
    offset,
    limit
  ].join(":");
  if (!signal && facultyPageCache.has(cacheKey)) {
    return facultyPageCache.get(cacheKey)!;
  }

  if (supabase) {
    try {
      let query = supabase
        .from("university_faculty_directory_public")
        .select("*", { count: "exact" })
        .ilike("institution_name", `%${universityName}%`)
        .order("full_name", { ascending: true })
        .range(offset, offset + limit - 1);

      if (departmentName) {
        query = query.eq("department_name", departmentName);
      }

      const { data, error, count } = await (signal ? query.abortSignal(signal) : query);
      if (error) throw error;

      if (data?.length || count) {
        const page: FacultyDirectoryPage = {
          entries: (data ?? []).map(mapFacultyDirectoryRow),
          total: count ?? data?.length ?? 0,
          offset,
          limit,
          hasMore: offset + limit < (count ?? 0),
          sourceUrl: data?.[0]?.source_url ?? undefined
        };
        if (!signal) facultyPageCache.set(cacheKey, page);
        return page;
      }
    } catch (error) {
      console.warn("Falling back to local faculty page", error);
    }
  }

  const entries = (await getFacultyDirectoryEntries(universityName))
    .filter((entry) => !departmentName || entry.departmentName === departmentName);
  const page = sliceFacultyPage(entries, offset, limit);
  if (!signal) facultyPageCache.set(cacheKey, page);
  return page;
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
    const localCards = await getLocalAdvisorCards(universityName);
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
    const localCards = await getLocalAdvisorCards(universityName);
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
    const profile: OpenDataProfile = {
      status: "not_found",
      aliases: [],
      topics: [],
      relatedInstitutions: [],
      message: "OpenAlex and ROR did not return a matching institution."
    };
    openDataCache.set(cacheKey, profile);
    return profile;
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

  openDataCache.set(cacheKey, profile);

  return profile;
}

export const api = {
  getAvailabilities: async (signal?: AbortSignal) => {
    try {
      const availabilities = mergeLocalAvailabilities(
        await request<SourceAvailability[]>("/sources/availabilities", signal)
      );
      reportDataSource("remote");
      return availabilities;
    } catch (error) {
      if ((error as Error).name === "AbortError") throw error;
      reportDataSource("local");
      return mergeLocalAvailabilities([]);
    }
  },
  getSources: (signal?: AbortSignal) => request<Source[]>("/sources", signal),
  getRankings: async (
    source: string,
    year: string,
    subject: string,
    signal?: AbortSignal
  ) => {
    const localCollection = await getLocalRankingCollection(source, year, subject);
    if (localCollection) {
      reportDataSource("local");
      return localCollection;
    }

    const remoteCollection = await request<RankingFeatureCollection>(
      `/rankings?source=${encodeURIComponent(source)}&year=${encodeURIComponent(
        year
      )}&subject=${encodeURIComponent(subject)}`,
      signal
    );
    reportDataSource("remote");
    return remoteCollection;
  },
  getSubjectScores: (source: string, year: string, signal?: AbortSignal) =>
    request<RankingFeatureCollection>(
      `/rankings/subject-scores?source=${encodeURIComponent(
        source
      )}&year=${encodeURIComponent(year)}`,
      signal
    ),
  getUniversity: async (id: number, signal?: AbortSignal) => {
    if (universityCache.has(id)) {
      return universityCache.get(id)!;
    }
    try {
      const detail = await mergeLocalUniversityDetail(
        await request<UniversityDetail>(`/universities/${id}/rankings`, signal)
      );
      universityCache.set(id, detail);
      return detail;
    } catch (error) {
      const localDetail = await getLocalUniversityDetail(id);
      if (!localDetail) throw error;
      universityCache.set(id, localDetail);
      return localDetail;
    }
  },
  getOpenDataProfile,
  getAdvisorCards,
  getFacultyDirectoryEntries,
  getFacultyDirectorySummary,
  getFacultyDirectoryPage,
  getSchoolDecisionFacts
};

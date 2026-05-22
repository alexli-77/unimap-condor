import type {
  OpenDataProfile,
  RankingFeatureCollection,
  Source,
  SourceAvailability,
  UniversityDetail
} from "./types";

const responseCache = new Map<string, unknown>();
const universityCache = new Map<number, UniversityDetail>();
const openDataCache = new Map<string, OpenDataProfile>();

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
  getOpenDataProfile
};

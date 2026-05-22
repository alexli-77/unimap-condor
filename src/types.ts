export type Source = {
  id: string;
  name: string;
  url: string;
  attribution: string;
};

export type SourceAvailability = {
  source: Source;
  years: string[];
  subjectsByYear: Record<string, string[]>;
};

export type RankingProperties = {
  rankValue?: number;
  sourceRankValue?: string;
  year?: number;
  subject?: string;
  universityName: string;
  rankingGroundTruthUniversityName?: string;
  universityId: number;
  country: string;
  city: string;
  sourceName: string;
  sourceUrl: string;
  attribution: string;
  topSubject?: string;
  topSubjectRankValue?: number;
  topSubjectSourceRankValue?: string;
  normalizedInvertedSubjectRanks?: Record<string, number>;
};

export type RankingFeature = GeoJSON.Feature<GeoJSON.Point, RankingProperties>;
export type RankingFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  RankingProperties
>;

export type UniversityRankingGroup = {
  source: Source;
  subjects: Record<string, Array<{ year: number; rankValue: string }>>;
};

export type UniversityDetail = {
  id: number;
  name: string;
  city: string;
  country: string;
  alternativeNames: string[];
  rankings: UniversityRankingGroup[];
};

export type OpenDataProfile = {
  status: "available" | "not_found" | "error";
  homepageUrl?: string;
  wikipediaUrl?: string;
  wikidataId?: string;
  rorId?: string;
  established?: number;
  aliases: string[];
  worksCount?: number;
  citedByCount?: number;
  hIndex?: number;
  twoYearMeanCitedness?: number;
  topics: Array<{ name: string; count?: number; share?: number }>;
  relatedInstitutions: Array<{ name: string; relationship?: string }>;
  message?: string;
};

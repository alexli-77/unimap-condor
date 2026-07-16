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
  overallScore?: number;
  locationQuality?: "matched" | "city" | "geocoded-city" | "missing";
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

export type PriorityLevel = "low" | "medium" | "high";

export type PreferenceProfile = {
  schemaVersion: 1;
  updatedAt: string;
  degreeLevel: string;
  targetCountries: string;
  targetCities: string;
  budgetCurrency: string;
  maxTuition: string;
  fundingRequirement: string;
  subjectAreas: string;
  researchKeywords: string;
  gpa: string;
  languageScores: string;
  background: string;
  employmentPriority: PriorityLevel;
  researchPriority: PriorityLevel;
  immigrationPriority: PriorityLevel;
  acceptsSmallCities: boolean;
  acceptsCourseBased: boolean;
  acceptsNichePrograms: boolean;
  notes: string;
};

export type AdvisorCard = {
  id: string;
  fullName: string;
  institutionName: string;
  institutionAliases: string[];
  department?: string;
  lab?: string;
  title?: string;
  priority?: string;
  priorityScore?: number;
  fitSummary: string;
  contactAngle?: string;
  researchAreas: string[];
  targetPrograms: string[];
  politicalSensitivity?: string;
  recruitingSignal?: string;
  outreachStatus?: string;
  profileUrl?: string;
  sourceLabel?: string;
};

export type FacultyDirectoryEntry = {
  id: string;
  fullName: string;
  institutionName: string;
  institutionAliases: string[];
  facultyName: string;
  departmentName: string;
  role?: string;
  email?: string;
  profileUrl?: string;
  expertise: string[];
  sourceUrl: string;
};

export type FacultyDepartmentSummary = {
  name: string;
  facultyName: string;
  count: number;
  expertise: string[];
  roles: string[];
};

export type FacultyDirectorySummary = {
  universityName: string;
  totalEntries: number;
  sourceUrl?: string;
  sourceLabel: string;
  departments: FacultyDepartmentSummary[];
};

export type FacultyDirectoryPage = {
  entries: FacultyDirectoryEntry[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  sourceUrl?: string;
};

export type SchoolDecisionFactType =
  "program" | "tuition_funding" | "employment" | "immigration";

export type SchoolDecisionFact = {
  id: string;
  institutionName: string;
  recordType: SchoolDecisionFactType;
  title: string;
  degreeLevel?: string;
  topic?: string;
  department?: string;
  duration?: string;
  programFormat?: string;
  amounts: string[];
  rawLabel: string;
  evidenceUrl: string;
  sourceUrl: string;
  confidence?: number;
  verifiedAt?: string;
};

export type SchoolDecisionFacts = {
  universityName: string;
  sourceLabel: string;
  programs: SchoolDecisionFact[];
  funding: SchoolDecisionFact[];
  employment?: SchoolDecisionFact[];
  immigration?: SchoolDecisionFact[];
};

// --- Supabase view row shapes -------------------------------------------------
// Hand-written interfaces that mirror the columns exposed by the public
// Supabase views (see supabase/migrations). They intentionally allow the loose
// null/undefined shapes Postgres returns so the mapXxxRow() helpers can stay
// defensive, while replacing the previous `row: any` boundary types.

export type AdvisorCardRow = {
  id: string | number;
  slug?: string | null;
  full_name: string;
  title?: string | null;
  institution_name: string;
  institution_aliases?: string[] | null;
  department?: string | null;
  lab?: string | null;
  profile_url?: string | null;
  research_areas?: string[] | null;
  is_active?: boolean | null;
  priority?: string | null;
  priority_score?: number | null;
  fit_summary?: string | null;
  contact_angle?: string | null;
  target_programs?: string[] | null;
  political_sensitivity?: string | null;
  recruiting_signal?: string | null;
  outreach_status?: string | null;
  source_label?: string | null;
};

export type FacultyDirectoryRow = {
  id?: string | number | null;
  record_key?: string | null;
  full_name?: string | null;
  name?: string | null;
  institution_name?: string | null;
  institution_aliases?: string[] | null;
  faculty_name?: string | null;
  department_name?: string | null;
  department?: string | null;
  role?: string | null;
  title?: string | null;
  email?: string | null;
  profile_url?: string | null;
  research_areas?: string[] | null;
  expertise?: string[] | null;
  source_url?: string | null;
};

export type FacultyDepartmentSummaryRow = {
  institution_name?: string | null;
  faculty_name?: string | null;
  department_name?: string | null;
  member_count?: number | null;
  count?: number | null;
  research_areas?: string[] | null;
  roles?: string[] | null;
  source_url?: string | null;
};

export type DecisionFactJson = {
  name?: string;
  topic?: string;
  degree_level?: string;
  department?: string;
  duration?: string;
  program_format?: string;
  amounts?: string[];
  raw_label?: string;
  evidence_url?: string;
};

export type DecisionFactRow = {
  id?: string | number | null;
  record_key?: string | null;
  institution_name?: string | null;
  record_type: SchoolDecisionFactType;
  title?: string | null;
  degree_level?: string | null;
  topic?: string | null;
  department?: string | null;
  duration?: string | null;
  program_format?: string | null;
  amounts?: string[] | null;
  raw_label?: string | null;
  evidence_url?: string | null;
  source_url?: string | null;
  fact_json?: DecisionFactJson | null;
  extracted_json?: DecisionFactJson | null;
  confidence?: number | string | null;
  verified_at?: string | null;
};

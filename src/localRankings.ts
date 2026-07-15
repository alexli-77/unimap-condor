import type {
  RankingFeatureCollection,
  Source,
  SourceAvailability,
  UniversityDetail,
  UniversityRankingGroup
} from "./types";

type LocalRankingRow = {
  id: number;
  name: string;
  groundTruthName: string;
  country: string;
  city: string;
  rankValue?: number;
  sourceRankValue: string;
  overallScore?: number;
  coordinates: [number, number];
  locationQuality: "matched" | "city" | "geocoded-city" | "missing";
};

const localQsSource: Source = {
  id: "QS",
  name: "QS World University Rankings",
  url: "https://www.topuniversities.com/world-university-rankings",
  attribution: "Source: QS World University Rankings 2027 (QS Ltd.)"
};

type Qs2027Data = {
  rows: LocalRankingRow[];
  byId: Map<number, LocalRankingRow>;
};

let qs2027Promise: Promise<Qs2027Data> | null = null;

function loadQs2027(): Promise<Qs2027Data> {
  if (!qs2027Promise) {
    qs2027Promise = import("./localRankings/qs2027Overall.json").then((module) => {
      const rows = (module.default ?? module) as LocalRankingRow[];
      return { rows, byId: new Map(rows.map((row) => [row.id, row])) };
    });
  }
  return qs2027Promise;
}

function isLocalQs2027Overall(source: string, year: string, subject: string) {
  return source === "QS" && year === "2027" && subject === "Overall";
}

function uniqueSortedYears(years: string[]) {
  return [...new Set(years)].sort((a, b) => Number(a) - Number(b));
}

export async function getLocalRankingCollection(
  source: string,
  year: string,
  subject: string
): Promise<RankingFeatureCollection | null> {
  if (!isLocalQs2027Overall(source, year, subject)) return null;

  const { rows } = await loadQs2027();
  return {
    type: "FeatureCollection",
    features: rows.map((row) => ({
      type: "Feature",
      properties: {
        rankValue: row.rankValue,
        sourceRankValue: row.sourceRankValue,
        year: 2027,
        subject: "Overall",
        universityName: row.name,
        rankingGroundTruthUniversityName: row.groundTruthName,
        universityId: row.id,
        country: row.country,
        city: row.city,
        sourceName: localQsSource.id,
        sourceUrl: localQsSource.url,
        attribution: localQsSource.attribution,
        overallScore: row.overallScore,
        locationQuality: row.locationQuality
      },
      geometry: {
        type: "Point",
        coordinates: row.coordinates
      }
    }))
  };
}

export function mergeLocalAvailabilities(items: SourceAvailability[]) {
  const next = items.map((item) => {
    if (item.source.id !== localQsSource.id) return item;
    return {
      ...item,
      source: {
        ...item.source,
        url: localQsSource.url
      },
      years: uniqueSortedYears([...item.years, "2027"]),
      subjectsByYear: {
        ...item.subjectsByYear,
        "2027": ["Overall"]
      }
    };
  });

  if (next.some((item) => item.source.id === localQsSource.id)) return next;

  return [
    ...next,
    {
      source: localQsSource,
      years: ["2027"],
      subjectsByYear: {
        "2027": ["Overall"]
      }
    }
  ];
}

export async function getLocalUniversityDetail(
  id: number
): Promise<UniversityDetail | null> {
  const { byId } = await loadQs2027();
  const row = byId.get(id);
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    city: row.city,
    country: row.country,
    alternativeNames: row.groundTruthName === row.name ? [] : [row.groundTruthName],
    rankings: [
      {
        source: localQsSource,
        subjects: {
          Overall: [{ year: 2027, rankValue: row.sourceRankValue }]
        }
      }
    ]
  };
}

export async function mergeLocalUniversityDetail(
  detail: UniversityDetail
): Promise<UniversityDetail> {
  const { byId } = await loadQs2027();
  const row = byId.get(detail.id);
  if (!row) return detail;

  const qsGroup = detail.rankings.find((group) => group.source.id === localQsSource.id);
  if (!qsGroup) {
    return {
      ...detail,
      rankings: [
        ...detail.rankings,
        {
          source: localQsSource,
          subjects: {
            Overall: [{ year: 2027, rankValue: row.sourceRankValue }]
          }
        }
      ]
    };
  }

  const overallEntries = qsGroup.subjects.Overall ?? [];
  if (overallEntries.some((entry) => entry.year === 2027)) return detail;

  const updatedGroup: UniversityRankingGroup = {
    ...qsGroup,
    source: {
      ...qsGroup.source,
      url: localQsSource.url
    },
    subjects: {
      ...qsGroup.subjects,
      Overall: [...overallEntries, { year: 2027, rankValue: row.sourceRankValue }]
        .slice()
        .sort((a, b) => a.year - b.year)
    }
  };

  return {
    ...detail,
    rankings: detail.rankings.map((group) =>
      group.source.id === localQsSource.id ? updatedGroup : group
    )
  };
}

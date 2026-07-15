// Compliance helpers for ranking data.
// Ranking tables belong to their original publishers. The product never
// republishes a full third-party league table; it links out to the official
// source and only shows a limited reference slice locally.

export const RANKINGS_DISCLAIMER =
  "Rankings © respective publishers, shown for reference only.";

// How many rows of any single ranking source we surface in the local list.
// The complete table always lives behind the official outbound link.
export const RANKING_LIST_LIMIT = 25;

export type RankingSourceLink = {
  label: string;
  url: string;
};

const rankingSourceLinks: Array<{ match: RegExp; link: RankingSourceLink }> = [
  {
    match: /\bqs\b|topuniversities/i,
    link: {
      label: "QS World University Rankings",
      url: "https://www.topuniversities.com/world-university-rankings"
    }
  },
  {
    match: /times higher|\bthe\b/i,
    link: {
      label: "Times Higher Education",
      url: "https://www.timeshighereducation.com/world-university-rankings"
    }
  },
  {
    match: /shanghai|arwu/i,
    link: {
      label: "ShanghaiRanking",
      url: "https://www.shanghairanking.com/rankings"
    }
  },
  {
    match: /cs ?rankings/i,
    link: {
      label: "CSRankings",
      url: "https://csrankings.org/"
    }
  }
];

/**
 * Resolve the official publisher homepage for a ranking source name.
 * Falls back to a provided source URL (and finally a generic label) so the
 * UI can always point users at the authoritative, complete table.
 */
export function getRankingSourceLink(
  sourceName: string | undefined,
  fallbackUrl?: string
): RankingSourceLink | null {
  const name = sourceName ?? "";
  const matched = rankingSourceLinks.find((entry) => entry.match.test(name));
  if (matched) return matched.link;
  if (fallbackUrl) {
    return { label: sourceName || "Official ranking source", url: fallbackUrl };
  }
  return null;
}

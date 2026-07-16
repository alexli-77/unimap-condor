import { ChevronDown, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import {
  RANKINGS_DISCLAIMER,
  RANKING_LIST_LIMIT,
  getRankingSourceLink
} from "../../rankingSources";
import type { RankingFeature } from "../../types";
import type { Mode } from "../../workspace/types";

export function RankingListPanel({
  features,
  mode,
  pinnedIds,
  onSelect
}: {
  features: RankingFeature[];
  mode: Mode;
  pinnedIds: Set<number>;
  onSelect: (feature: RankingFeature) => void;
}) {
  const rows = useMemo(
    () =>
      [...features].sort((a, b) => {
        const aRank =
          a.properties.rankValue ?? a.properties.topSubjectRankValue ?? Infinity;
        const bRank =
          b.properties.rankValue ?? b.properties.topSubjectRankValue ?? Infinity;
        return aRank - bRank;
      }),
    [features]
  );

  // Compliance: never republish a full third-party league table locally. Show a
  // capped reference slice (top rows + pinned/selected schools) and point the
  // complete ranking at the official publisher.
  const { visibleRows, hiddenCount } = useMemo(() => {
    const top = rows.slice(0, RANKING_LIST_LIMIT);
    const shownIds = new Set(top.map((feature) => feature.properties.universityId));
    const pinnedExtras = rows.filter(
      (feature) =>
        pinnedIds.has(feature.properties.universityId) &&
        !shownIds.has(feature.properties.universityId)
    );
    const visible = [...top, ...pinnedExtras];
    return {
      visibleRows: visible,
      hiddenCount: Math.max(0, rows.length - visible.length)
    };
  }, [rows, pinnedIds]);

  const sourceName = features[0]?.properties.sourceName;
  const officialLink = getRankingSourceLink(
    sourceName,
    features[0]?.properties.sourceUrl
  );

  return (
    <details className="ranking-list-panel">
      <summary>
        <div>
          <strong>Top school rankings</strong>
          <span>{sourceName ?? "Current source"}</span>
        </div>
        <ChevronDown size={16} />
      </summary>
      <div className="ranking-list">
        {visibleRows.map((feature) => {
          const p = feature.properties;
          const rank =
            mode === "rankings"
              ? (p.sourceRankValue ?? p.rankValue ?? "n/a")
              : (p.topSubjectSourceRankValue ?? p.topSubjectRankValue ?? "n/a");
          return (
            <button
              key={`${p.universityId}-${p.subject ?? p.topSubject ?? "rank"}`}
              className="ranking-list-item"
              type="button"
              onClick={() => onSelect(feature)}
            >
              <strong>{rank}</strong>
              <span>{p.universityName}</span>
            </button>
          );
        })}
      </div>
      <div className="ranking-list-compliance">
        {hiddenCount > 0 && (
          <p>
            Showing the top {RANKING_LIST_LIMIT}
            {pinnedIds.size ? " plus your saved schools" : ""} of {rows.length}. View the
            complete ranking on the official site.
          </p>
        )}
        {officialLink && (
          <a
            className="external-chip"
            href={officialLink.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {officialLink.label}
            <ExternalLink size={13} />
          </a>
        )}
        <small className="ranking-disclaimer">{RANKINGS_DISCLAIMER}</small>
      </div>
    </details>
  );
}

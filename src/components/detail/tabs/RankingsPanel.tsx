import { ExternalLink } from "lucide-react";
import { RANKINGS_DISCLAIMER, getRankingSourceLink } from "../../../rankingSources";
import type { RankingFeature } from "../../../types";
import { palette } from "../../../workspace/constants";
import type { Mode } from "../../../workspace/types";
import { ExternalChip } from "../../ui";

export function RankingsPanel({
  feature,
  mode
}: {
  feature: RankingFeature;
  mode: Mode;
}) {
  const p = feature.properties;
  const officialLink = getRankingSourceLink(p.sourceName, p.sourceUrl);
  return (
    <div className="tab-panel">
      <div className="rank-row">
        <div>
          <span>{mode === "rankings" ? "Rank" : "Top subject rank"}</span>
          <strong>
            {mode === "rankings"
              ? (p.sourceRankValue ?? p.rankValue ?? "n/a")
              : (p.topSubjectSourceRankValue ?? p.topSubjectRankValue ?? "n/a")}
          </strong>
        </div>
        <div>
          <span>{mode === "rankings" ? "Subject" : "Top subject"}</span>
          <strong>{mode === "rankings" ? p.subject : p.topSubject}</strong>
        </div>
      </div>
      {p.normalizedInvertedSubjectRanks ? (
        <div className="subject-bars">
          {Object.entries(p.normalizedInvertedSubjectRanks)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, score], index) => (
              <div key={name} className="bar-line">
                <span>{name}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.round(score * 100)}%`,
                      background: palette[index]
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="muted">
          Switch to Subject Strength to compare normalized subject signals.
        </p>
      )}
      <div className="ranking-list-compliance">
        {officialLink ? (
          <a
            className="external-chip"
            href={officialLink.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {officialLink.label}
            <ExternalLink size={13} />
          </a>
        ) : (
          <ExternalChip href={p.sourceUrl} label={`${p.sourceName} source`} />
        )}
        <small className="ranking-disclaimer">{RANKINGS_DISCLAIMER}</small>
      </div>
    </div>
  );
}

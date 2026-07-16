import { Loader2, Search } from "lucide-react";
import type { RankingFeature } from "../../types";

export function SearchResults({
  features,
  isSettling,
  onSelect
}: {
  features: RankingFeature[];
  isSettling: boolean;
  onSelect: (feature: RankingFeature) => void;
}) {
  return (
    <section className="panel results">
      <div className="panel-title">
        <Search size={18} />
        <h2>Results</h2>
        {isSettling && <Loader2 className="spin subtle-loader" size={14} />}
      </div>
      {features.length === 0 ? (
        <p className="muted">No universities match this search.</p>
      ) : (
        <div className="result-list">
          {features.map((feature) => (
            <button
              key={feature.properties.universityId}
              className="result-item"
              onClick={() => onSelect(feature)}
            >
              <strong>{feature.properties.universityName}</strong>
              <span>
                {feature.properties.city}, {feature.properties.country}
              </span>
              <em>
                {feature.properties.sourceRankValue
                  ? `Rank ${feature.properties.sourceRankValue}`
                  : feature.properties.topSubject
                    ? feature.properties.topSubject
                    : "Open details"}
              </em>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

import {
  Building2,
  ExternalLink,
  Globe2,
  Search,
  SlidersHorizontal,
  Trophy
} from "lucide-react";
import { RANKINGS_DISCLAIMER, getRankingSourceLink } from "../../rankingSources";
import type { RankingFeature, SourceAvailability } from "../../types";
import type { Mode } from "../../workspace/types";
import { Metric } from "../ui";
import { RankingListPanel } from "./RankingListPanel";
import { SearchResults } from "./SearchResults";

export function FiltersPanel({
  query,
  onQueryChange,
  source,
  onSourceChange,
  availabilities,
  year,
  onYearChange,
  years,
  subject,
  onSubjectChange,
  subjects,
  activeAvailability,
  filteredFeatures,
  debouncedQuery,
  onSelect,
  stats,
  mode,
  pinnedIds
}: {
  query: string;
  onQueryChange: (value: string) => void;
  source: string;
  onSourceChange: (value: string) => void;
  availabilities: SourceAvailability[];
  year: string;
  onYearChange: (value: string) => void;
  years: string[];
  subject: string;
  onSubjectChange: (value: string) => void;
  subjects: string[];
  activeAvailability?: SourceAvailability;
  filteredFeatures: RankingFeature[];
  debouncedQuery: string;
  onSelect: (feature: RankingFeature) => void;
  stats: { count: number; countries: number; bestRank: number | null };
  mode: Mode;
  pinnedIds: Set<number>;
}) {
  return (
    <>
      <section className="panel controls">
        <div className="panel-title">
          <SlidersHorizontal size={18} />
          <h2>Filters</h2>
        </div>

        <label>
          Search
          <div className="searchbox">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="University, city, country"
            />
          </div>
        </label>

        <label>
          Source
          <select value={source} onChange={(event) => onSourceChange(event.target.value)}>
            {availabilities.map((item) => (
              <option key={item.source.id} value={item.source.id}>
                {item.source.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <select value={year} onChange={(event) => onYearChange(event.target.value)}>
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subject
          <select
            value={subject}
            onChange={(event) => onSubjectChange(event.target.value)}
          >
            {subjects.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </section>

      {query.trim() && (
        <SearchResults
          features={filteredFeatures.slice(0, 8)}
          isSettling={query !== debouncedQuery}
          onSelect={onSelect}
        />
      )}

      <section className="metric-grid">
        <Metric icon={<Building2 size={18} />} label="Universities" value={stats.count} />
        <Metric icon={<Globe2 size={18} />} label="Countries" value={stats.countries} />
        <Metric
          icon={<Trophy size={18} />}
          label="Best rank"
          value={stats.bestRank ?? "n/a"}
        />
      </section>

      <RankingListPanel
        features={filteredFeatures}
        mode={mode}
        pinnedIds={pinnedIds}
        onSelect={onSelect}
      />

      {activeAvailability && (
        <div className="source-footer">
          <div className="source-footer-row">
            <span>Source:</span>
            <a
              className="provider"
              href={
                getRankingSourceLink(
                  activeAvailability.source.name,
                  activeAvailability.source.url
                )?.url ?? activeAvailability.source.url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {activeAvailability.source.attribution}
              <ExternalLink size={14} />
            </a>
          </div>
          <small className="ranking-disclaimer">{RANKINGS_DISCLAIMER}</small>
        </div>
      )}
    </>
  );
}

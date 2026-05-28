import {
  ArrowLeftRight,
  Building2,
  ChevronDown,
  ExternalLink,
  Globe2,
  Layers3,
  Loader2,
  MapPin,
  Search,
  Settings2,
  SlidersHorizontal,
  Star,
  Trophy,
  UserRoundSearch,
  X
} from "lucide-react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api";
import mascotLogo from "../docs/assets/unimap-condor-mascot.png";
import type {
  AdvisorCard,
  FacultyDirectoryEntry,
  OpenDataProfile,
  RankingFeature,
  RankingFeatureCollection,
  SourceAvailability,
  UniversityDetail
} from "./types";

type Mode = "rankings" | "strength";
type MapStyleId = "liberty" | "bright" | "positron";
type FavoriteKind = "school" | "subject" | "advisor";
type LeftPanel = "filters" | "saved" | "compare" | "view";
type PointSize = "small" | "normal" | "large";
type PreferenceProfile = {
  degreeLevel: string;
  subjects: string;
  countries: string;
  budget: string;
  researchKeywords: string;
  priority: string;
  timeline: string;
};
type FavoriteItem = {
  id: string;
  kind: FavoriteKind;
  universityId: number;
  universityName: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
  label: string;
  createdAt: string;
};

const mapStyles: Array<{ id: MapStyleId; label: string; url: string }> = [
  {
    id: "liberty",
    label: "Liberty",
    url: "https://tiles.openfreemap.org/styles/liberty"
  },
  {
    id: "bright",
    label: "Bright",
    url: "https://tiles.openfreemap.org/styles/bright"
  },
  {
    id: "positron",
    label: "Positron",
    url: "https://tiles.openfreemap.org/styles/positron"
  }
];

const palette = [
  "#2563eb",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#c2410c",
  "#0891b2",
  "#be123c",
  "#4d7c0f"
];

type DetailTab =
  | "overview"
  | "rankings"
  | "research"
  | "faculty"
  | "recommendations"
  | "community";

const detailTabs: Array<{ id: DetailTab; label: string }> = [
  { id: "overview", label: "overview" },
  { id: "rankings", label: "rankings" },
  { id: "research", label: "research" },
  { id: "faculty", label: "faculty" },
  { id: "recommendations", label: "recommend" },
  { id: "community", label: "community" }
];

const defaultPreferenceProfile: PreferenceProfile = {
  degreeLevel: "",
  subjects: "",
  countries: "",
  budget: "",
  researchKeywords: "",
  priority: "",
  timeline: ""
};
const favoritesStorageKey = "unimap.favorites";

function formatCompact(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "n/a";
  return Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

function getGoogleMapsUrl(feature: RankingFeature) {
  const p = feature.properties;
  const query = encodeURIComponent(`${p.universityName} ${p.city} ${p.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function useDebouncedValue<T>(value: T, delay = 180) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debounced;
}

function getFavoriteId(kind: FavoriteKind, universityId: number, entityKey: string) {
  return `${kind}:${universityId}:${entityKey.trim().toLowerCase()}`;
}

function createFavoriteItem(
  feature: RankingFeature,
  kind: FavoriteKind,
  label: string,
  entityKey = label
): FavoriteItem {
  const p = feature.properties;
  const [longitude, latitude] = feature.geometry.coordinates;
  return {
    id: getFavoriteId(kind, p.universityId, entityKey),
    kind,
    universityId: p.universityId,
    universityName: p.universityName,
    city: p.city,
    country: p.country,
    longitude,
    latitude,
    label,
    createdAt: new Date().toISOString()
  };
}

function getPointSizeScale(size: PointSize) {
  if (size === "small") return 0.78;
  if (size === "large") return 1.24;
  return 1;
}

function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="app">{children}</div>;
}

function PreferenceDialog({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<PreferenceProfile>(() => {
    const saved = localStorage.getItem("unimap.preferenceProfile");
    if (!saved) return defaultPreferenceProfile;
    try {
      return { ...defaultPreferenceProfile, ...JSON.parse(saved) };
    } catch {
      return defaultPreferenceProfile;
    }
  });

  const updateProfile = (key: keyof PreferenceProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = () => {
    localStorage.setItem("unimap.preferenceProfile", JSON.stringify(profile));
    onClose();
  };

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="preference-dialog" role="dialog" aria-modal="true" aria-label="Preference profile">
        <div className="dialog-head">
          <div>
            <h2>Preference profile</h2>
            <p>Capture your school-selection intent before comparing schools.</p>
          </div>
          <button className="icon-button" aria-label="Close preference profile" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        <div className="preference-grid">
          <label>
            Degree level
            <input
              value={profile.degreeLevel}
              onChange={(event) => updateProfile("degreeLevel", event.target.value)}
              placeholder="Master, PhD, exchange"
            />
          </label>
          <label>
            Target subjects
            <input
              value={profile.subjects}
              onChange={(event) => updateProfile("subjects", event.target.value)}
              placeholder="CS, SE, HCI, AI"
            />
          </label>
          <label>
            Countries or cities
            <input
              value={profile.countries}
              onChange={(event) => updateProfile("countries", event.target.value)}
              placeholder="Canada, Montreal, Europe"
            />
          </label>
          <label>
            Budget / funding
            <input
              value={profile.budget}
              onChange={(event) => updateProfile("budget", event.target.value)}
              placeholder="Need funding, under 30k CAD"
            />
          </label>
          <label>
            Research keywords
            <input
              value={profile.researchKeywords}
              onChange={(event) => updateProfile("researchKeywords", event.target.value)}
              placeholder="LLM evaluation, AI for SE"
            />
          </label>
          <label>
            Decision priority
            <input
              value={profile.priority}
              onChange={(event) => updateProfile("priority", event.target.value)}
              placeholder="Advisor fit, ranking, visa, jobs"
            />
          </label>
          <label className="preference-wide">
            Timeline
            <input
              value={profile.timeline}
              onChange={(event) => updateProfile("timeline", event.target.value)}
              placeholder="Fall 2027, contact advisors this month"
            />
          </label>
        </div>

        <div className="dialog-actions">
          <button className="ghost-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="button" onClick={saveProfile}>
            Save profile
          </button>
        </div>
      </section>
    </div>
  );
}

export function App() {
  const [availabilities, setAvailabilities] = useState<SourceAvailability[]>([]);
  const [source, setSource] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [mode] = useState<Mode>("rankings");
  const [mapStyle, setMapStyle] = useState<MapStyleId>("liberty");
  const [data, setData] = useState<RankingFeatureCollection | null>(null);
  const [selected, setSelected] = useState<RankingFeature | null>(null);
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [activeLeftPanel, setActiveLeftPanel] = useState<LeftPanel | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem(favoritesStorageKey);
    if (!saved) return [];
    try {
      return JSON.parse(saved) as FavoriteItem[];
    } catch {
      return [];
    }
  });
  const [showFavoritesLayer, setShowFavoritesLayer] = useState(false);
  const [showUniversityLabels, setShowUniversityLabels] = useState(false);
  const [pointSize, setPointSize] = useState<PointSize>("normal");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (selected) setIsDetailsCollapsed(false);
  }, [selected]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api
      .getAvailabilities(controller.signal)
      .then((items) => {
        setAvailabilities(items);
        const first = items[0];
        if (!first) return;
        setSource(first.source.id);
        setYear(first.years.at(-1) ?? first.years[0]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const activeAvailability = availabilities.find((item) => item.source.id === source);
  const years = activeAvailability?.years ?? [];
  const subjects = activeAvailability?.subjectsByYear[year] ?? [];

  useEffect(() => {
    if (!activeAvailability) return;
    if (!years.includes(year)) setYear(years.at(-1) ?? years[0] ?? "");
  }, [activeAvailability, year, years]);

  useEffect(() => {
    if (!subjects.length) return;
    if (!subjects.includes(subject)) setSubject(subjects[0]);
  }, [subject, subjects]);

  useEffect(() => {
    if (!source || !year || (mode === "rankings" && !subject)) return;

    const controller = new AbortController();
    setLoading(true);
    setError("");

    const loader =
      mode === "rankings"
        ? api.getRankings(source, year, subject, controller.signal)
        : api.getSubjectScores(source, year, controller.signal);

    loader
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    const params = new URLSearchParams({
      mode,
      source,
      year,
      subject: mode === "rankings" ? subject : ""
    });
    history.replaceState(null, "", `?${params.toString()}`);

    return () => controller.abort();
  }, [mode, source, subject, year]);

  const filteredFeatures = useMemo(() => {
    const features = data?.features ?? [];
    if (!debouncedQuery.trim()) return features;
    const needle = debouncedQuery.trim().toLowerCase();
    return features.filter((feature) => {
      const p = feature.properties;
      return [p.universityName, p.city, p.country, p.topSubject]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [data, debouncedQuery]);

  const handleSelectFeature = useCallback((feature: RankingFeature) => {
    setSelected(feature);
  }, []);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((current) =>
      current.some((favorite) => favorite.id === item.id)
        ? current.filter((favorite) => favorite.id !== item.id)
        : [...current, item]
    );
  }, []);

  const isFavorite = useCallback(
    (kind: FavoriteKind, universityId: number, entityKey: string) =>
      favorites.some(
        (favorite) => favorite.id === getFavoriteId(kind, universityId, entityKey)
      ),
    [favorites]
  );

  const favoriteFeatures = useMemo(() => {
    const byUniversity = new Map<number, FavoriteItem>();
    favorites.forEach((favorite) => {
      if (!byUniversity.has(favorite.universityId)) {
        byUniversity.set(favorite.universityId, favorite);
      }
    });

    return [...byUniversity.values()].map(
      (favorite) =>
        ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [favorite.longitude, favorite.latitude]
          },
          properties: {
            universityId: favorite.universityId,
            universityName: favorite.universityName,
            city: favorite.city,
            country: favorite.country,
            sourceName: "Favorites",
            sourceUrl: "",
            attribution: "User favorites"
          }
        }) as RankingFeature
    );
  }, [favorites]);

  const stats = useMemo(() => {
    const countries = new Set(filteredFeatures.map((f) => f.properties.country));
    const bestRank = filteredFeatures.reduce<number | null>((best, feature) => {
      const rank = feature.properties.rankValue;
      if (rank === undefined) return best;
      return best === null ? rank : Math.min(best, rank);
    }, null);
    return { count: filteredFeatures.length, countries: countries.size, bestRank };
  }, [filteredFeatures]);

  const addToCompare = (id: number) => {
    setCompareIds((ids) =>
      ids.includes(id) ? ids : [...ids.slice(Math.max(0, ids.length - 2)), id]
    );
  };

  const toggleLeftPanel = (panel: LeftPanel) => {
    setActiveLeftPanel((current) => (current === panel ? null : panel));
  };

  const selectFavorite = useCallback(
    (favorite: FavoriteItem) => {
      const feature = data?.features.find(
        (item) => item.properties.universityId === favorite.universityId
      );
      if (feature) setSelected(feature);
    },
    [data]
  );

  return (
    <AppShell>
      <main className="workspace">
        <aside className="map-nav" aria-label="Map tools">
          <div className="map-nav-brand">
            <img className="map-nav-logo" src={mascotLogo} alt="UniMap Condor" />
          </div>
          <button
            className={`map-nav-item ${activeLeftPanel === "filters" ? "active" : ""}`}
            type="button"
            aria-pressed={activeLeftPanel === "filters"}
            onClick={() => toggleLeftPanel("filters")}
          >
            <span className="map-nav-icon">
              <SlidersHorizontal size={25} />
            </span>
            <span>Filter</span>
          </button>
          <button
            className={`map-nav-item ${activeLeftPanel === "saved" ? "active" : ""}`}
            type="button"
            aria-pressed={activeLeftPanel === "saved"}
            onClick={() => toggleLeftPanel("saved")}
          >
            <span className="map-nav-icon">
              <Star
                size={25}
                fill={activeLeftPanel === "saved" ? "currentColor" : "none"}
              />
            </span>
            <span>Saved</span>
          </button>
          <button
            className={`map-nav-item ${activeLeftPanel === "compare" ? "active" : ""}`}
            type="button"
            aria-pressed={activeLeftPanel === "compare"}
            onClick={() => toggleLeftPanel("compare")}
          >
            <span className="map-nav-icon">
              <ArrowLeftRight size={25} />
            </span>
            <span>Compare</span>
          </button>
          <button
            className={`map-nav-item ${activeLeftPanel === "view" ? "active" : ""}`}
            type="button"
            aria-pressed={activeLeftPanel === "view"}
            onClick={() => toggleLeftPanel("view")}
          >
            <span className="map-nav-icon">
              <Layers3 size={25} />
            </span>
            <span>View</span>
          </button>
          <button
            className="map-nav-item map-nav-preference"
            type="button"
            onClick={() => setIsConfigOpen(true)}
          >
            <span className="map-nav-icon">
              <Settings2 size={25} />
            </span>
            <span>Prefs</span>
          </button>
        </aside>

        {isConfigOpen && <PreferenceDialog onClose={() => setIsConfigOpen(false)} />}

        {activeLeftPanel && (
          <div className="drawer-shell">
            <aside className="sidebar tool-drawer">
              {activeLeftPanel === "filters" && (
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
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="University, city, country"
                        />
                      </div>
                    </label>

                    <label>
                      Source
                      <select value={source} onChange={(event) => setSource(event.target.value)}>
                        {availabilities.map((item) => (
                          <option key={item.source.id} value={item.source.id}>
                            {item.source.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Year
                      <select value={year} onChange={(event) => setYear(event.target.value)}>
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
                        onChange={(event) => setSubject(event.target.value)}
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
                      onSelect={handleSelectFeature}
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
                    onSelect={handleSelectFeature}
                  />

                  {activeAvailability && (
                    <div className="source-footer">
                      <span>Source:</span>
                      <a
                        className="provider"
                        href={activeAvailability.source.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {activeAvailability.source.attribution}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </>
              )}

              {activeLeftPanel === "saved" && (
                <SavedPanel favorites={favorites} onSelect={selectFavorite} />
              )}

              {activeLeftPanel === "compare" && (
                <ComparePanel
                  ids={compareIds}
                  onRemove={(id) => setCompareIds((ids) => ids.filter((value) => value !== id))}
                />
              )}

              {activeLeftPanel === "view" && (
                <ViewPanel
                  mapStyle={mapStyle}
                  onMapStyleChange={setMapStyle}
                  pointSize={pointSize}
                  onPointSizeChange={setPointSize}
                  showFavoritesLayer={showFavoritesLayer}
                  onShowFavoritesLayerChange={setShowFavoritesLayer}
                  showUniversityLabels={showUniversityLabels}
                  onShowUniversityLabelsChange={setShowUniversityLabels}
                />
              )}
            </aside>
            <button
              className="drawer-collapse"
              type="button"
              aria-label="Collapse side panel"
              title="Collapse side panel"
              onClick={() => setActiveLeftPanel(null)}
            >
              <ChevronDown size={18} />
            </button>
          </div>
        )}

        <section className="map-stage">
          {error && <div className="banner error">{error}</div>}
          {loading && (
            <div className="banner loading">
              <Loader2 className="spin" size={18} />
              Loading ranking data
            </div>
          )}
          <RankingMap
            features={filteredFeatures}
            favoriteFeatures={favoriteFeatures}
            showFavoritesLayer={showFavoritesLayer}
            showUniversityLabels={showUniversityLabels}
            pointSize={pointSize}
            mode={mode}
            mapStyle={mapStyle}
            selectedId={selected?.properties.universityId}
            onSelect={handleSelectFeature}
          />
        </section>

        {selected && !isDetailsCollapsed && (
          <div className="details-shell">
            <button
              className="details-collapse"
              type="button"
              aria-label="Collapse details panel"
              title="Collapse details panel"
              onClick={() => setIsDetailsCollapsed(true)}
            >
              <ChevronDown size={18} />
            </button>
            <aside className="details">
              <UniversityCard
                feature={selected}
                mode={mode}
                onClose={() => setSelected(null)}
                onCompare={() => addToCompare(selected.properties.universityId)}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </aside>
          </div>
        )}

        {selected && isDetailsCollapsed && (
          <button
            className="details-peek"
            type="button"
            aria-label="Open details panel"
            title="Open details panel"
            onClick={() => setIsDetailsCollapsed(false)}
          >
            <ChevronDown size={18} />
          </button>
        )}
      </main>
    </AppShell>
  );
}

function Metric({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SearchResults({
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

function RankingListPanel({
  features,
  mode,
  onSelect
}: {
  features: RankingFeature[];
  mode: Mode;
  onSelect: (feature: RankingFeature) => void;
}) {
  const rows = useMemo(
    () =>
      [...features].sort((a, b) => {
        const aRank = a.properties.rankValue ?? a.properties.topSubjectRankValue ?? Infinity;
        const bRank = b.properties.rankValue ?? b.properties.topSubjectRankValue ?? Infinity;
        return aRank - bRank;
      }),
    [features]
  );

  return (
    <details className="ranking-list-panel">
      <summary>
        <div>
          <strong>All school rankings</strong>
          <span>{features[0]?.properties.sourceName ?? "Current source"}</span>
        </div>
        <ChevronDown size={16} />
      </summary>
      <div className="ranking-list">
        {rows.map((feature) => {
          const p = feature.properties;
          const rank =
            mode === "rankings"
              ? p.sourceRankValue ?? p.rankValue ?? "n/a"
              : p.topSubjectSourceRankValue ?? p.topSubjectRankValue ?? "n/a";
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
    </details>
  );
}

function ViewPanel({
  mapStyle,
  onMapStyleChange,
  pointSize,
  onPointSizeChange,
  showFavoritesLayer,
  onShowFavoritesLayerChange,
  showUniversityLabels,
  onShowUniversityLabelsChange
}: {
  mapStyle: MapStyleId;
  onMapStyleChange: (value: MapStyleId) => void;
  pointSize: PointSize;
  onPointSizeChange: (value: PointSize) => void;
  showFavoritesLayer: boolean;
  onShowFavoritesLayerChange: (value: boolean) => void;
  showUniversityLabels: boolean;
  onShowUniversityLabelsChange: (value: boolean) => void;
}) {
  return (
    <section className="panel controls view-panel">
      <div className="panel-title">
        <Layers3 size={18} />
        <h2>View</h2>
      </div>

      <label>
        Map style
        <div className="select-wrap">
          <select
            value={mapStyle}
            onChange={(event) => onMapStyleChange(event.target.value as MapStyleId)}
          >
            {mapStyles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} />
        </div>
      </label>

      <label>
        Point size
        <div className="segmented-control">
          {(["small", "normal", "large"] as PointSize[]).map((value) => (
            <button
              key={value}
              className={pointSize === value ? "active" : ""}
              type="button"
              onClick={() => onPointSizeChange(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </label>

      <label className="switch-row">
        <span>
          <strong>Saved stars</strong>
          <em>Show followed schools on the map.</em>
        </span>
        <input
          type="checkbox"
          checked={showFavoritesLayer}
          onChange={(event) => onShowFavoritesLayerChange(event.target.checked)}
        />
      </label>

      <label className="switch-row">
        <span>
          <strong>School labels</strong>
          <em>Display university names near points.</em>
        </span>
        <input
          type="checkbox"
          checked={showUniversityLabels}
          onChange={(event) => onShowUniversityLabelsChange(event.target.checked)}
        />
      </label>
    </section>
  );
}

function SavedPanel({
  favorites,
  onSelect
}: {
  favorites: FavoriteItem[];
  onSelect: (favorite: FavoriteItem) => void;
}) {
  return (
    <section className="panel saved-panel">
      <div className="panel-title">
        <Star size={18} />
        <h2>Saved</h2>
      </div>
      {!favorites.length ? (
        <p className="muted">Star a university, subject, or advisor to show it here.</p>
      ) : (
        <div className="saved-list">
          {favorites.map((favorite) => (
            <button
              key={favorite.id}
              className="saved-item"
              type="button"
              onClick={() => onSelect(favorite)}
            >
              <Star size={17} fill="currentColor" />
              <span>
                <strong>{favorite.label}</strong>
                <em>
                  {favorite.kind} · {favorite.universityName}
                </em>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function RankingMap({
  features,
  favoriteFeatures,
  showFavoritesLayer,
  showUniversityLabels,
  pointSize,
  mode,
  mapStyle,
  selectedId,
  onSelect
}: {
  features: RankingFeature[];
  favoriteFeatures: RankingFeature[];
  showFavoritesLayer: boolean;
  showUniversityLabels: boolean;
  pointSize: PointSize;
  mode: Mode;
  mapStyle: MapStyleId;
  selectedId?: number;
  onSelect: (feature: RankingFeature) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const featureRef = useRef<RankingFeature[]>([]);
  const favoriteFeatureRef = useRef<RankingFeature[]>([]);
  const modeRef = useRef<Mode>(mode);
  const mapStyleRef = useRef<MapStyleId>(mapStyle);
  const showFavoritesLayerRef = useRef(showFavoritesLayer);
  const showUniversityLabelsRef = useRef(showUniversityLabels);
  const pointSizeRef = useRef<PointSize>(pointSize);

  useEffect(() => {
    featureRef.current = features;
  }, [features]);

  useEffect(() => {
    favoriteFeatureRef.current = favoriteFeatures;
  }, [favoriteFeatures]);

  useEffect(() => {
    showFavoritesLayerRef.current = showFavoritesLayer;
  }, [showFavoritesLayer]);

  useEffect(() => {
    showUniversityLabelsRef.current = showUniversityLabels;
  }, [showUniversityLabels]);

  useEffect(() => {
    pointSizeRef.current = pointSize;
  }, [pointSize]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyles.find((style) => style.id === mapStyle)?.url ?? mapStyles[0].url,
      center: [10, 25],
      zoom: 1.15,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    function paintColorExpression() {
      return [
        "case",
        ["==", ["get", "universityId"], -1],
        "#111827",
        modeRef.current === "strength" ? "#059669" : "#2563eb"
      ] as maplibregl.ExpressionSpecification;
    }

    function pointRadiusExpression() {
      const scale = getPointSizeScale(pointSizeRef.current);
      return [
        "interpolate",
        ["linear"],
        ["coalesce", ["get", "rankValue"], ["get", "topSubjectRankValue"], 500],
        1,
        9 * scale,
        100,
        7 * scale,
        500,
        5 * scale,
        1000,
        4 * scale
      ] as maplibregl.ExpressionSpecification;
    }

    function clusterRadiusExpression() {
      const scale = getPointSizeScale(pointSizeRef.current);
      return ["step", ["get", "point_count"], 18 * scale, 50, 24 * scale, 150, 32 * scale] as maplibregl.ExpressionSpecification;
    }

    function ensureRankingLayers() {
      if (!map.getSource("rankings")) {
        map.addSource("rankings", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          cluster: true,
          clusterRadius: 44,
          clusterMaxZoom: 5
        });
      }

      if (!map.getSource("favorites")) {
        map.addSource("favorites", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        });
      }

      if (!map.getLayer("clusters")) {
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "rankings",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#0f172a",
            "circle-radius": clusterRadiusExpression(),
            "circle-opacity": 0.86
          }
        });
      }

      if (!map.getLayer("cluster-count")) {
        map.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "rankings",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-size": 12
          },
          paint: { "text-color": "#fff" }
        });
      }

      if (!map.getLayer("points")) {
        map.addLayer({
          id: "points",
          type: "circle",
          source: "rankings",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": paintColorExpression(),
            "circle-radius": pointRadiusExpression(),
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1.5,
            "circle-opacity": 0.92
          }
        });
      }

      if (!map.getLayer("university-labels")) {
        map.addLayer({
          id: "university-labels",
          type: "symbol",
          source: "rankings",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "text-field": ["get", "universityName"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 2, 10, 6, 12],
            "text-offset": [0, 1.05],
            "text-anchor": "top",
            "text-max-width": 12,
            visibility: showUniversityLabelsRef.current ? "visible" : "none"
          },
          paint: {
            "text-color": "#172033",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.4
          }
        });
      }

      if (!map.getLayer("favorite-stars")) {
        map.addLayer({
          id: "favorite-stars",
          type: "symbol",
          source: "favorites",
          layout: {
            "text-allow-overlap": true,
            "text-field": "★",
            "text-ignore-placement": true,
            "text-offset": [0, -0.9],
            "text-size": ["interpolate", ["linear"], ["zoom"], 1, 18, 6, 26],
            visibility: showFavoritesLayerRef.current ? "visible" : "none"
          },
          paint: {
            "text-color": "#f59e0b",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2
          }
        });
      }

      const rankingsSource = map.getSource("rankings") as maplibregl.GeoJSONSource;
      rankingsSource.setData({
        type: "FeatureCollection",
        features: featureRef.current
      });
      const favoritesSource = map.getSource("favorites") as maplibregl.GeoJSONSource;
      favoritesSource.setData({
        type: "FeatureCollection",
        features: favoriteFeatureRef.current
      });
    }

    map.on("load", () => {
      ensureRankingLayers();
    });

    map.on("style.load", () => {
      ensureRankingLayers();
    });

    map.on("click", "points", (event) => {
      const id = Number(event.features?.[0]?.properties?.universityId);
      const feature = featureRef.current.find((item) => item.properties.universityId === id);
      if (feature) onSelect(feature);
    });

    map.on("click", "favorite-stars", (event) => {
      const id = Number(event.features?.[0]?.properties?.universityId);
      const feature = featureRef.current.find((item) => item.properties.universityId === id);
      if (feature) onSelect(feature);
    });

    map.on("click", "university-labels", (event) => {
      const id = Number(event.features?.[0]?.properties?.universityId);
      const feature = featureRef.current.find((item) => item.properties.universityId === id);
      if (feature) onSelect(feature);
    });

    map.on("click", "clusters", async (event) => {
      const featuresAtPoint = map.queryRenderedFeatures(event.point, {
        layers: ["clusters"]
      });
      const clusterId = featuresAtPoint[0]?.properties?.cluster_id;
      const source = map.getSource("rankings") as maplibregl.GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(clusterId);
      map.easeTo({ center: event.lngLat, zoom });
    });

    map.on("mouseenter", "points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "favorite-stars", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "favorite-stars", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "university-labels", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "university-labels", () => {
      map.getCanvas().style.cursor = "";
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    const styleUrl = mapStyles.find((style) => style.id === mapStyle)?.url ?? mapStyles[0].url;
    if (!map || mapStyleRef.current === mapStyle) return;
    mapStyleRef.current = mapStyle;
    map.setStyle(styleUrl, { diff: false });
  }, [mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const source = map.getSource("rankings") as maplibregl.GeoJSONSource | undefined;
      source?.setData({ type: "FeatureCollection", features });
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [features]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      const source = map.getSource("favorites") as maplibregl.GeoJSONSource | undefined;
      source?.setData({ type: "FeatureCollection", features: favoriteFeatures });
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [favoriteFeatures]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      if (map.getLayer("favorite-stars")) {
        map.setLayoutProperty(
          "favorite-stars",
          "visibility",
          showFavoritesLayer ? "visible" : "none"
        );
      }
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [showFavoritesLayer]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const update = () => {
      if (map.getLayer("university-labels")) {
        map.setLayoutProperty(
          "university-labels",
          "visibility",
          showUniversityLabels ? "visible" : "none"
        );
      }
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [showUniversityLabels]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const scale = getPointSizeScale(pointSize);
    const pointRadius = [
      "interpolate",
      ["linear"],
      ["coalesce", ["get", "rankValue"], ["get", "topSubjectRankValue"], 500],
      1,
      9 * scale,
      100,
      7 * scale,
      500,
      5 * scale,
      1000,
      4 * scale
    ] as maplibregl.ExpressionSpecification;
    const clusterRadius = [
      "step",
      ["get", "point_count"],
      18 * scale,
      50,
      24 * scale,
      150,
      32 * scale
    ] as maplibregl.ExpressionSpecification;
    const update = () => {
      if (map.getLayer("points")) {
        map.setPaintProperty("points", "circle-radius", pointRadius);
      }
      if (map.getLayer("clusters")) {
        map.setPaintProperty("clusters", "circle-radius", clusterRadius);
      }
    };
    map.isStyleLoaded() ? update() : map.once("style.load", update);
  }, [pointSize]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("points")) return;
    map.setPaintProperty("points", "circle-color", [
      "case",
      ["==", ["get", "universityId"], -1],
      "#111827",
      mode === "strength" ? "#059669" : "#2563eb"
    ]);
  }, [mode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const feature = features.find((item) => item.properties.universityId === selectedId);
    if (!feature) return;
    const [longitude, latitude] = feature.geometry.coordinates;
    map.easeTo({ center: [longitude, latitude], zoom: Math.max(map.getZoom(), 4) });
  }, [features, selectedId]);

  return <div ref={containerRef} className="map" />;
}

function UniversityCard({
  feature,
  mode,
  onClose,
  onCompare,
  isFavorite,
  onToggleFavorite
}: {
  feature: RankingFeature;
  mode: Mode;
  onClose: () => void;
  onCompare: () => void;
  isFavorite: (kind: FavoriteKind, universityId: number, entityKey: string) => boolean;
  onToggleFavorite: (item: FavoriteItem) => void;
}) {
  const p = feature.properties;
  const [tab, setTab] = useState<DetailTab>("overview");
  const schoolFavorite = createFavoriteItem(feature, "school", p.universityName);
  return (
    <section className="panel selected-card">
      <button className="icon-button close" aria-label="Close details" onClick={onClose}>
        <X size={18} />
      </button>
      <div className="eyebrow">
        <MapPin size={15} />
        {p.city}, {p.country}
      </div>
      <div className="selected-title-row">
        <h2>{p.universityName}</h2>
        <FavoriteButton
          active={isFavorite("school", p.universityId, p.universityName)}
          label="学校"
          onClick={() => onToggleFavorite(schoolFavorite)}
        />
      </div>
      <p className="muted">{p.rankingGroundTruthUniversityName ?? p.universityName}</p>

      <div className="detail-tabs" role="tablist" aria-label="University detail sections">
        {detailTabs.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? "active" : ""}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewPanel feature={feature} />}
      {tab === "rankings" && <RankingsPanel feature={feature} mode={mode} />}
      {tab === "research" && <ResearchPanel feature={feature} />}
      {tab === "faculty" && <FacultyPanel feature={feature} />}
      {tab === "recommendations" && (
        <RecommendationsPanel
          feature={feature}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      {tab === "community" && <CommunityPanel feature={feature} />}

      <div className="button-row">
        <button className="primary-button" onClick={onCompare}>
          <ArrowLeftRight size={16} />
          Add to compare
        </button>
        <a className="ghost-button" href={getGoogleMapsUrl(feature)} target="_blank" rel="noreferrer">
          Maps
          <ExternalLink size={16} />
        </a>
      </div>
    </section>
  );
}

function useOpenDataProfile(feature: RankingFeature) {
  const p = feature.properties;
  const [profile, setProfile] = useState<OpenDataProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    api
      .getOpenDataProfile(p.universityName)
      .then((nextProfile) => {
        if (isActive) setProfile(nextProfile);
      })
      .catch((err) => {
        if (isActive && err.name !== "AbortError") {
          setProfile({
            status: "error",
            aliases: [],
            topics: [],
            relatedInstitutions: [],
            message: err.message
          });
        }
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [p.universityName]);

  return { profile, loading };
}

function OverviewPanel({ feature }: { feature: RankingFeature }) {
  const p = feature.properties;
  const { profile, loading } = useOpenDataProfile(feature);

  return (
    <div className="tab-panel">
      <div className="fact-grid">
        <Fact label="City" value={p.city} />
        <Fact label="Country" value={p.country} />
        <Fact label="Established" value={profile?.established ?? "n/a"} />
        <Fact
          label="Research registry"
          value={profile?.rorId ? "Verified in ROR" : "n/a"}
        />
      </div>

      {loading && <InlineLoading label="Loading open data" />}
      {!loading && profile?.aliases.length ? (
        <div className="tag-cloud">
          {profile.aliases.map((alias) => (
            <span key={alias}>{alias}</span>
          ))}
        </div>
      ) : null}

      <div className="link-grid">
        {profile?.homepageUrl && <ExternalChip href={profile.homepageUrl} label="Official site" />}
        {profile?.wikipediaUrl && <ExternalChip href={profile.wikipediaUrl} label="Wikipedia" />}
        {profile?.wikidataId && (
          <ExternalChip href={`https://www.wikidata.org/wiki/${profile.wikidataId}`} label="Wikidata" />
        )}
        {profile?.rorId && <ExternalChip href={profile.rorId} label="ROR profile" />}
      </div>
    </div>
  );
}

function RankingsPanel({ feature, mode }: { feature: RankingFeature; mode: Mode }) {
  const p = feature.properties;
  return (
    <div className="tab-panel">
      <div className="rank-row">
        <div>
          <span>{mode === "rankings" ? "Rank" : "Top subject rank"}</span>
          <strong>
            {mode === "rankings"
              ? p.sourceRankValue ?? p.rankValue ?? "n/a"
              : p.topSubjectSourceRankValue ?? p.topSubjectRankValue ?? "n/a"}
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
                    style={{ width: `${Math.round(score * 100)}%`, background: palette[index] }}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="muted">Switch to Subject Strength to compare normalized subject signals.</p>
      )}
      <ExternalChip href={p.sourceUrl} label={`${p.sourceName} source`} />
    </div>
  );
}

function FavoriteButton({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`favorite-chip ${active ? "active" : ""}`}
      type="button"
      aria-label={active ? `取消关注${label}` : `关注${label}`}
      aria-pressed={active}
      title={active ? `取消关注${label}` : `关注${label}`}
      onClick={onClick}
    >
      <Star size={14} fill={active ? "currentColor" : "none"} />
    </button>
  );
}

function ResearchPanel({ feature }: { feature: RankingFeature }) {
  const { profile, loading } = useOpenDataProfile(feature);

  return (
    <div className="tab-panel">
      {loading && <InlineLoading label="Loading OpenAlex research signals" />}
      <div className="fact-grid">
        <Fact label="Works" value={formatCompact(profile?.worksCount)} />
        <Fact label="Citations" value={formatCompact(profile?.citedByCount)} />
        <Fact label="h-index" value={profile?.hIndex ?? "n/a"} />
        <Fact
          label="2yr mean citedness"
          value={profile?.twoYearMeanCitedness?.toFixed(2) ?? "n/a"}
        />
      </div>
      {profile?.topics.length ? (
        <div className="topic-list">
          {profile.topics.map((topic, index) => (
            <div key={topic.name}>
              <span>{topic.name}</span>
              <strong>{topic.count ? formatCompact(topic.count) : `${Math.round((topic.share ?? 0) * 100)}%`}</strong>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.max(10, Math.min(100, (topic.share ?? 0.12) * 100))}%`,
                    background: palette[index % palette.length]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">OpenAlex has no topic breakdown for this institution yet.</p>
      )}
    </div>
  );
}

function FacultyPanel({ feature }: { feature: RankingFeature }) {
  const p = feature.properties;
  const facultyEntries = useMemo(
    () => api.getFacultyDirectoryEntries(p.universityName),
    [p.universityName]
  );

  const departments = useMemo(() => {
    const counts = new Map<
      string,
      {
        name: string;
        facultyName: string;
        count: number;
        expertise: Set<string>;
        roles: Set<string>;
      }
    >();

    facultyEntries.forEach((entry) => {
      const name = entry.departmentName || "Academic department";
      const current = counts.get(name) ?? {
        name,
        facultyName: entry.facultyName,
        count: 0,
        expertise: new Set<string>(),
        roles: new Set<string>()
      };
      current.count += 1;
      entry.expertise.forEach((area) => current.expertise.add(area));
      if (entry.role) current.roles.add(entry.role);
      counts.set(name, current);
    });

    return [...counts.values()].sort((a, b) => b.count - a.count);
  }, [facultyEntries]);

  const topExpertise = useMemo(() => {
    const counts = new Map<string, number>();
    facultyEntries.forEach((entry) => {
      entry.expertise.forEach((area) => counts.set(area, (counts.get(area) ?? 0) + 1));
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([area]) => area);
  }, [facultyEntries]);

  return (
    <div className="tab-panel">
      <div className="structure-card">
        <div className="structure-row root">
          <Building2 size={16} />
          <div>
            <strong>{p.universityName}</strong>
            <span>Institution</span>
          </div>
        </div>
        <div className="structure-row">
          <span className="structure-node" />
          <div>
            <strong>{departments[0]?.facultyName ?? "Faculty / School"}</strong>
            <span>Academic unit for departments, programs, labs, and professor affiliations</span>
          </div>
        </div>
        <div className="structure-row">
          <span className="structure-node" />
          <div>
            <strong>Departments & professor directory</strong>
            <span>
              {facultyEntries.length
                ? `${facultyEntries.length} DIRO professors and invited researchers linked`
                : "Use recommendations for professor-level fit and outreach details"}
            </span>
          </div>
        </div>
      </div>

      {facultyEntries.length ? (
        <div className="tag-cloud compact-tags">
          {topExpertise.map((area) => (
            <span key={area}>{area}</span>
          ))}
        </div>
      ) : null}

      {departments.length === 0 ? (
        <div className="advisor-empty">
          <UserRoundSearch size={20} />
          <p>No faculty structure has been linked to this university yet.</p>
        </div>
      ) : null}

      {departments.length ? (
        <div className="department-list">
          {departments.map((department) => (
            <details key={department.name} className="department-card">
              <summary>
                <div>
                  <strong>{department.name}</strong>
                  <span>{department.count} people listed</span>
                </div>
              </summary>
              <div className="collapsible-body">
                <p>
                  {[...department.roles].slice(0, 4).join(" / ") ||
                    "Administrative and academic roles can be expanded in Supabase."}
                </p>
                <div className="tag-cloud compact-tags">
                  {[...department.expertise].slice(0, 4).map((area) => (
                    <span key={area}>{area}</span>
                  ))}
                </div>
                <FacultyDirectoryList
                  entries={facultyEntries.filter(
                    (entry) => entry.departmentName === department.name
                  )}
                  compact
                />
              </div>
            </details>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FacultyDirectoryList({
  entries,
  compact = false
}: {
  entries: FacultyDirectoryEntry[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "faculty-directory compact-directory" : "faculty-directory"}>
      {!compact && (
        <div className="faculty-directory-head">
          <div>
            <strong>DIRO professor directory</strong>
            <span>{entries.length} entries from the department page</span>
          </div>
          <ExternalChip href={entries[0].sourceUrl} label="DIRO source" />
        </div>
      )}
      <div className="faculty-person-list">
        {entries.map((entry) => (
          <details key={entry.id} className="faculty-person">
            <summary>
              <div>
                <strong>{entry.fullName}</strong>
                <span>{entry.role ?? "Faculty member"}</span>
              </div>
            </summary>
            <div className="collapsible-body">
              {entry.expertise.length ? (
                <p>{entry.expertise.slice(0, 3).join(" / ")}</p>
              ) : (
                <p>Expertise not listed on the directory card.</p>
              )}
              <div className="faculty-person-actions">
                {entry.email && <a href={`mailto:${entry.email}`}>{entry.email}</a>}
                {entry.profileUrl && <ExternalChip href={entry.profileUrl} label="Profile" />}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function RecommendationsPanel({
  feature,
  isFavorite,
  onToggleFavorite
}: {
  feature: RankingFeature;
  isFavorite: (kind: FavoriteKind, universityId: number, entityKey: string) => boolean;
  onToggleFavorite: (item: FavoriteItem) => void;
}) {
  const p = feature.properties;
  const [advisors, setAdvisors] = useState<AdvisorCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    api
      .getAdvisorCards(p.universityName)
      .then((items) => {
        if (isActive) setAdvisors(items);
      })
      .catch((err) => {
        if (isActive && err.name !== "AbortError") setAdvisors([]);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [p.universityName]);

  return (
    <div className="tab-panel">
      {loading && <InlineLoading label="Loading recommendations" />}
      {!loading && advisors.length === 0 ? (
        <div className="advisor-empty">
          <UserRoundSearch size={20} />
          <p>No advisor recommendations linked to this university yet.</p>
        </div>
      ) : null}
      <div className="advisor-list">
        {advisors.map((advisor) => (
          <AdvisorItem
            key={advisor.id}
            advisor={advisor}
            feature={feature}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

function AdvisorItem({
  advisor,
  feature,
  isFavorite,
  onToggleFavorite
}: {
  advisor: AdvisorCard;
  feature: RankingFeature;
  isFavorite: (kind: FavoriteKind, universityId: number, entityKey: string) => boolean;
  onToggleFavorite: (item: FavoriteItem) => void;
}) {
  const p = feature.properties;
  const advisorFavorite = createFavoriteItem(feature, "advisor", advisor.fullName, advisor.id);
  return (
    <details className="advisor-card">
      <summary className="advisor-card-header">
        <div>
          <strong>{advisor.fullName}</strong>
          <span>
            {[advisor.department, advisor.lab].filter(Boolean).join(" · ") ||
              advisor.institutionName}
          </span>
        </div>
        {advisor.priority && <em>{advisor.priority}</em>}
      </summary>

      <div className="collapsible-body">
        <p>{advisor.fitSummary}</p>

        {advisor.researchAreas.length ? (
          <div className="tag-cloud compact-tags">
            {advisor.researchAreas.slice(0, 5).map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        ) : null}

        <div className="advisor-section">
          {advisor.contactAngle && (
            <div>
              <h4>Angle</h4>
              <p>{advisor.contactAngle}</p>
            </div>
          )}
          {advisor.targetPrograms.length ? (
            <div>
              <h4>Programs</h4>
              <p>{advisor.targetPrograms.join(" / ")}</p>
            </div>
          ) : null}
        </div>

        <div className="advisor-meta">
          {advisor.outreachStatus && <span>{advisor.outreachStatus}</span>}
          {advisor.recruitingSignal && <span>{advisor.recruitingSignal}</span>}
          {advisor.politicalSensitivity && (
            <span className="advisor-warning">Sensitivity: {advisor.politicalSensitivity}</span>
          )}
        </div>

        <div className="advisor-footer">
          <FavoriteButton
            active={isFavorite("advisor", p.universityId, advisor.id)}
            label="导师"
            onClick={() => onToggleFavorite(advisorFavorite)}
          />
          {advisor.profileUrl && (
            <ExternalChip href={advisor.profileUrl} label="Profile" />
          )}
        </div>
      </div>
    </details>
  );
}

function CommunityPanel({ feature }: { feature: RankingFeature }) {
  const p = feature.properties;
  const communityQuery = encodeURIComponent(`"${p.universityName}" admissions`);
  const gterQuery = encodeURIComponent(p.universityName);
  const redditUrl = `https://www.reddit.com/search/?q=${communityQuery}`;
  const gterUrl = `https://f.gter.net/search.php?mod=forum&searchsubmit=yes&srchtxt=${gterQuery}`;
  const gterGoogleUrl = `https://www.google.com/search?q=site%3Af.gter.net+${gterQuery}`;

  return (
    <div className="tab-panel">
      <div className="community-card">
        <div>
          <strong>Reddit search</strong>
          <p>
            Opens a live Reddit search for English-language admissions, funding, campus
            life, and career outcome threads.
          </p>
        </div>
        <ExternalChip href={redditUrl} label="Open Reddit search" />
      </div>
      <div className="community-card">
        <div>
          <strong>寄托天下 / GTER search</strong>
          <p>
            Opens real search pages for Chinese-language application experiences,
            offers, interviews, school selection, and visa discussions.
          </p>
        </div>
        <div className="community-actions">
          <ExternalChip href={gterUrl} label="GTER site search" />
          <ExternalChip href={gterGoogleUrl} label="Google site search" />
        </div>
      </div>
      <div className="signal-list">
        {["Admissions", "Offer decisions", "Funding", "Career outcomes", "Housing"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="muted">
        These are real outbound search links, not pre-fetched post results. The product
        links out instead of copying community text without permission.
      </p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InlineLoading({ label }: { label: string }) {
  return (
    <p className="muted inline-loading">
      <Loader2 className="spin" size={15} />
      {label}
    </p>
  );
}

function ExternalChip({ href, label }: { href: string; label: string }) {
  return (
    <a className="external-chip" href={href} target="_blank" rel="noreferrer">
      {label}
      <ExternalLink size={13} />
    </a>
  );
}

function EmptySelection() {
  return (
    <section className="panel empty">
      <Layers3 size={42} />
      <h2>Select a university</h2>
      <p className="muted">
        Click an individual point on the map to inspect rank, subject, source, and
        location details.
      </p>
    </section>
  );
}

function ComparePanel({
  ids,
  onRemove
}: {
  ids: number[];
  onRemove: (id: number) => void;
}) {
  const [details, setDetails] = useState<UniversityDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) {
      setDetails([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    Promise.all(ids.map((id) => api.getUniversity(id, controller.signal)))
      .then(setDetails)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [ids]);

  return (
    <section className="panel compare">
      <div className="panel-title">
        <ArrowLeftRight size={18} />
        <h2>Compare</h2>
      </div>
      {!ids.length && <p className="muted">Add up to three universities from the map.</p>}
      {loading && (
        <p className="muted inline-loading">
          <Loader2 className="spin" size={16} />
          Loading details
        </p>
      )}
      <div className="compare-list">
        {details.map((detail) => (
          <div key={detail.id} className="compare-item">
            <button
              className="icon-button"
              aria-label={`Remove ${detail.name}`}
              onClick={() => onRemove(detail.id)}
            >
              <X size={15} />
            </button>
            <strong>{detail.name}</strong>
            <span>
              {detail.city}, {detail.country}
            </span>
            <RankingSummary detail={detail} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RankingSummary({ detail }: { detail: UniversityDetail }) {
  const rows = detail.rankings.flatMap((group) =>
    Object.entries(group.subjects).flatMap(([subject, entries]) =>
      entries.slice(0, 1).map((entry) => ({
        source: group.source.id,
        subject,
        year: entry.year,
        rank: entry.rankValue
      }))
    )
  );
  return (
    <div className="mini-table">
      {rows.slice(0, 5).map((row) => (
        <div key={`${row.source}-${row.subject}-${row.year}`}>
          <span>{row.source}</span>
          <span>{row.subject}</span>
          <strong>{row.rank}</strong>
        </div>
      ))}
    </div>
  );
}

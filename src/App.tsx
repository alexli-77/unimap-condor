import {
  ArrowLeftRight,
  BarChart3,
  Building2,
  ChevronDown,
  ExternalLink,
  Globe2,
  GraduationCap,
  Info,
  Layers3,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Trophy,
  X
} from "lucide-react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api";
import type {
  OpenDataProfile,
  RankingFeature,
  RankingFeatureCollection,
  SourceAvailability,
  UniversityDetail
} from "./types";

type Mode = "rankings" | "strength";
type MapStyleId = "liberty" | "bright" | "positron";

const mapStyles: Array<{ id: MapStyleId; label: string; url: string }> = [
  {
    id: "liberty",
    label: "OpenFreeMap Liberty",
    url: "https://tiles.openfreemap.org/styles/liberty"
  },
  {
    id: "bright",
    label: "OpenFreeMap Bright",
    url: "https://tiles.openfreemap.org/styles/bright"
  },
  {
    id: "positron",
    label: "OpenFreeMap Positron",
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

type DetailTab = "overview" | "rankings" | "research" | "community";

function formatCompact(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "n/a";
  return Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

function getGoogleMapsUrl(feature: RankingFeature) {
  const p = feature.properties;
  const query = encodeURIComponent(`${p.universityName} ${p.city} ${p.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function getInitialMode(): Mode {
  return new URLSearchParams(location.search).get("mode") === "strength"
    ? "strength"
    : "rankings";
}

function useDebouncedValue<T>(value: T, delay = 180) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debounced;
}

function AppShell({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
        <a
          className="source-link"
          href="https://disc-unimap.uibk.ac.at/"
          target="_blank"
          rel="noreferrer"
        >
          Original
          <ExternalLink size={16} />
        </a>
      </header>
      {children}
    </div>
  );
}

export function App() {
  const [availabilities, setAvailabilities] = useState<SourceAvailability[]>([]);
  const [source, setSource] = useState("");
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState<Mode>(getInitialMode);
  const [mapStyle, setMapStyle] = useState<MapStyleId>("liberty");
  const [data, setData] = useState<RankingFeatureCollection | null>(null);
  const [selected, setSelected] = useState<RankingFeature | null>(null);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const debouncedQuery = useDebouncedValue(query);

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
    setSelected(null);

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

  return (
    <AppShell
      title="University Rankings Map"
      subtitle="Explore global university rankings by source, year, and subject"
    >
      <main className="workspace">
        <aside className="sidebar">
          <section className="panel controls">
            <div className="panel-title">
              <SlidersHorizontal size={18} />
              <h2>Filters</h2>
            </div>

            <div className="segmented" aria-label="Map mode">
              <button
                className={mode === "rankings" ? "active" : ""}
                onClick={() => setMode("rankings")}
              >
                Rankings
              </button>
              <button
                className={mode === "strength" ? "active" : ""}
                onClick={() => setMode("strength")}
              >
                Subject Strength
              </button>
            </div>

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

            {mode === "rankings" && (
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
            )}

            <label>
              Map style
              <div className="select-wrap">
                <select
                  value={mapStyle}
                  onChange={(event) => setMapStyle(event.target.value as MapStyleId)}
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

          <section className="panel">
            <div className="panel-title">
              <Info size={18} />
              <h2>Data</h2>
            </div>
            <p className="muted">
              This clone reads the same public JSON endpoints exposed by the
              demonstration site. Ranking ownership remains with each provider.
            </p>
            {activeAvailability && (
              <a
                className="provider"
                href={activeAvailability.source.url}
                target="_blank"
                rel="noreferrer"
              >
                {activeAvailability.source.attribution}
                <ExternalLink size={14} />
              </a>
            )}
          </section>
        </aside>

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
            mode={mode}
            mapStyle={mapStyle}
            selectedId={selected?.properties.universityId}
            onSelect={handleSelectFeature}
          />
        </section>

        <aside className="details">
          {selected ? (
            <UniversityCard
              feature={selected}
              mode={mode}
              onClose={() => setSelected(null)}
              onCompare={() => addToCompare(selected.properties.universityId)}
            />
          ) : (
            <EmptySelection />
          )}

          <ComparePanel
            ids={compareIds}
            onRemove={(id) => setCompareIds((ids) => ids.filter((value) => value !== id))}
          />
        </aside>
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

function RankingMap({
  features,
  mode,
  mapStyle,
  selectedId,
  onSelect
}: {
  features: RankingFeature[];
  mode: Mode;
  mapStyle: MapStyleId;
  selectedId?: number;
  onSelect: (feature: RankingFeature) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const featureRef = useRef<RankingFeature[]>([]);
  const modeRef = useRef<Mode>(mode);
  const mapStyleRef = useRef<MapStyleId>(mapStyle);

  useEffect(() => {
    featureRef.current = features;
  }, [features]);

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
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: "OpenStreetMap contributors"
      }),
      "bottom-right"
    );

    function paintColorExpression() {
      return [
        "case",
        ["==", ["get", "universityId"], -1],
        "#111827",
        modeRef.current === "strength" ? "#059669" : "#2563eb"
      ] as maplibregl.ExpressionSpecification;
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

      if (!map.getLayer("clusters")) {
        map.addLayer({
          id: "clusters",
          type: "circle",
          source: "rankings",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#0f172a",
            "circle-radius": ["step", ["get", "point_count"], 18, 50, 24, 150, 32],
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
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", "rankValue"], ["get", "topSubjectRankValue"], 500],
              1,
              9,
              100,
              7,
              500,
              5,
              1000,
              4
            ],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1.5,
            "circle-opacity": 0.92
          }
        });
      }

      const rankingsSource = map.getSource("rankings") as maplibregl.GeoJSONSource;
      rankingsSource.setData({
        type: "FeatureCollection",
        features: featureRef.current
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
  onCompare
}: {
  feature: RankingFeature;
  mode: Mode;
  onClose: () => void;
  onCompare: () => void;
}) {
  const p = feature.properties;
  const [tab, setTab] = useState<DetailTab>("overview");
  return (
    <section className="panel selected-card">
      <button className="icon-button close" aria-label="Close details" onClick={onClose}>
        <X size={18} />
      </button>
      <div className="eyebrow">
        <MapPin size={15} />
        {p.city}, {p.country}
      </div>
      <h2>{p.universityName}</h2>
      <p className="muted">{p.rankingGroundTruthUniversityName ?? p.universityName}</p>

      <div className="detail-tabs" role="tablist" aria-label="University detail sections">
        {(["overview", "rankings", "research", "community"] as DetailTab[]).map((value) => (
          <button
            key={value}
            className={tab === value ? "active" : ""}
            onClick={() => setTab(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewPanel feature={feature} />}
      {tab === "rankings" && <RankingsPanel feature={feature} mode={mode} />}
      {tab === "research" && <ResearchPanel feature={feature} />}
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
    const controller = new AbortController();
    setLoading(true);
    api
      .getOpenDataProfile(p.universityName, controller.signal)
      .then(setProfile)
      .catch((err) => {
        if (err.name !== "AbortError") {
          setProfile({
            status: "error",
            aliases: [],
            topics: [],
            relatedInstitutions: [],
            message: err.message
          });
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
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

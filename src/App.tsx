import {
  ArrowLeftRight,
  ChevronDown,
  Compass,
  Layers3,
  Loader2,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserCircle2,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, onDataSourceChange, type DataSource } from "./api";
import mascotLogo from "../docs/assets/mascot.webp";
import { WelcomeOverlay } from "./components/WelcomeOverlay";
import { UniversityCard } from "./components/detail/UniversityCard";
import { RankingMap } from "./components/map/RankingMap";
import { ComparePanel } from "./components/panels/ComparePanel";
import { FiltersPanel } from "./components/panels/FiltersPanel";
import { SavedPanel } from "./components/panels/SavedPanel";
import { ViewPanel } from "./components/panels/ViewPanel";
import { PreferenceDialog } from "./components/preference/PreferenceDialog";
import { ProUpgradeCard } from "./components/ProUpgradeCard";
import { AuthDialog } from "./components/auth/AuthDialog";
import { useAuth } from "./state/authContext";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { buildShortlistHtml } from "./exportShortlist";
import { canAddCompareSchool, upgradeCopy } from "./entitlements";
import { useWorkspace } from "./state/workspaceContext";
import type {
  RankingFeature,
  RankingFeatureCollection,
  SourceAvailability
} from "./types";
import {
  northAmericaCsTemplate,
  welcomeDismissedStorageKey
} from "./workspace/constants";
import {
  hasPreferenceProfile,
  loadPreferenceProfile,
  parseWorkspaceBackup
} from "./workspace/helpers";
import type { LeftPanel, MapStyleId, Mode, PointSize } from "./workspace/types";

function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="app">{children}</div>;
}

export function App() {
  const {
    favorites,
    preferenceProfile,
    schoolDecisions,
    favoriteFeatures,
    persistPreferenceProfile,
    applyWorkspaceBackup,
    buildWorkspaceBackup,
    entitlements,
    upgradeHint,
    showUpgradeHint,
    dismissUpgradeHint,
    isProCardOpen,
    openProCard,
    closeProCard
  } = useWorkspace();
  const { isConfigured: isAuthConfigured, user } = useAuth();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
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
  const [configTemplate, setConfigTemplate] = useState<typeof preferenceProfile | null>(
    null
  );
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return false;
    const dismissed = localStorage.getItem(welcomeDismissedStorageKey) === "true";
    return !dismissed && !hasPreferenceProfile(loadPreferenceProfile());
  });
  const [toast, setToast] = useState("");
  const [showFavoritesLayer, setShowFavoritesLayer] = useState(false);
  const [showUniversityLabels, setShowUniversityLabels] = useState(false);
  const [pointSize, setPointSize] = useState<PointSize>("normal");
  const [query, setQuery] = useState("");
  const [workspaceMessage, setWorkspaceMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const debouncedQuery = useDebouncedValue(query);

  useEffect(() => onDataSourceChange(setDataSource), []);

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

  // Index the richest RankingFeature we currently hold per university so ComparePanel
  // can reuse recommendationPolicy fit signals. Loaded ranking data wins; favorites
  // provide a light fallback (country/city) when a school is off the current subject.
  const compareFeatureIndex = useMemo(() => {
    const index = new Map<number, RankingFeature>();
    (data?.features ?? []).forEach((feature) =>
      index.set(feature.properties.universityId, feature)
    );
    favoriteFeatures.forEach((feature) => {
      if (!index.has(feature.properties.universityId)) {
        index.set(feature.properties.universityId, feature);
      }
    });
    if (selected) index.set(selected.properties.universityId, selected);
    return index;
  }, [data, favoriteFeatures, selected]);

  const pinnedUniversityIds = useMemo(() => {
    const ids = new Set<number>(favorites.map((favorite) => favorite.universityId));
    if (selected) ids.add(selected.properties.universityId);
    return ids;
  }, [favorites, selected]);

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
    if (compareIds.includes(id)) return;
    // Soft paywall: Free compares up to 3 schools, Pro up to 6. At the cap we
    // nudge instead of silently dropping the oldest column.
    if (!canAddCompareSchool(entitlements, compareIds.length)) {
      showUpgradeHint(upgradeCopy.compareCap);
      return;
    }
    setCompareIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  };

  const toggleLeftPanel = (panel: LeftPanel) => {
    setActiveLeftPanel((current) => (current === panel ? null : panel));
  };

  const savePreferenceProfile = useCallback(
    (profile: typeof preferenceProfile) => {
      const nextProfile = persistPreferenceProfile(profile);
      setConfigTemplate(null);
      if (hasPreferenceProfile(nextProfile)) {
        const unlocked = data?.features.length ?? 0;
        setToast(
          unlocked
            ? `Fit analysis unlocked for ${unlocked} schools.`
            : "Preferences saved. Fit analysis is ready as soon as schools load."
        );
        localStorage.setItem(welcomeDismissedStorageKey, "true");
        setShowWelcome(false);
      }
    },
    [data, persistPreferenceProfile]
  );

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 6000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const dismissWelcome = useCallback(() => {
    localStorage.setItem(welcomeDismissedStorageKey, "true");
    setShowWelcome(false);
  }, []);

  const startWithTemplate = useCallback(() => {
    setConfigTemplate(northAmericaCsTemplate);
    setIsConfigOpen(true);
    setShowWelcome(false);
  }, []);

  const openGuide = useCallback(() => setShowWelcome(true), []);

  const exportWorkspace = useCallback(() => {
    const backup = buildWorkspaceBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = backup.exportedAt.slice(0, 10);
    anchor.href = url;
    anchor.download = `unimap-workspace-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setWorkspaceMessage(`Exported ${favorites.length} saved items.`);
  }, [buildWorkspaceBackup, favorites]);

  const exportShortlistHtml = useCallback(() => {
    const html = buildShortlistHtml(
      favorites,
      schoolDecisions,
      preferenceProfile,
      data?.features ?? [],
      { watermark: entitlements.shortlistWatermark }
    );
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `unimap-shortlist-${date}.html`;
    anchor.click();
    URL.revokeObjectURL(url);
    const schoolCount = favorites.filter((favorite) => favorite.kind === "school").length;
    setWorkspaceMessage(`Exported an HTML shortlist for ${schoolCount} schools.`);
  }, [data, favorites, preferenceProfile, schoolDecisions, entitlements]);

  const importWorkspace = useCallback(
    async (file: File) => {
      try {
        const backup = parseWorkspaceBackup(await file.text());
        applyWorkspaceBackup(backup);
        setWorkspaceMessage(`Imported ${backup.favorites.length} saved items.`);
      } catch (err) {
        setWorkspaceMessage(err instanceof Error ? err.message : "Import failed.");
      }
    },
    [applyWorkspaceBackup]
  );

  const selectFavorite = useCallback(
    (favorite: { universityId: number }) => {
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
          <button
            className="map-nav-item"
            type="button"
            onClick={openGuide}
            title="Open the getting-started guide"
          >
            <span className="map-nav-icon">
              <Compass size={25} />
            </span>
            <span>Guide</span>
          </button>
          <button
            className={`map-nav-item ${user ? "active" : ""}`}
            type="button"
            aria-pressed={isAuthOpen}
            onClick={() => setIsAuthOpen(true)}
            title={
              isAuthConfigured
                ? user
                  ? `Signed in as ${user.email}`
                  : "Sign in to sync your workspace"
                : "Cloud sync not configured"
            }
          >
            <span className="map-nav-icon">
              <UserCircle2 size={25} />
            </span>
            <span>{user ? "Account" : "Sign in"}</span>
          </button>
        </aside>

        {isConfigOpen && (
          <PreferenceDialog
            profile={configTemplate ?? preferenceProfile}
            onSave={savePreferenceProfile}
            onClose={() => {
              setIsConfigOpen(false);
              setConfigTemplate(null);
            }}
          />
        )}

        {showWelcome && (
          <WelcomeOverlay onStartTemplate={startWithTemplate} onSkip={dismissWelcome} />
        )}

        {isProCardOpen && (
          <ProUpgradeCard
            onClose={closeProCard}
            onRequireSignIn={() => {
              closeProCard();
              setIsAuthOpen(true);
            }}
          />
        )}

        {isAuthOpen && <AuthDialog onClose={() => setIsAuthOpen(false)} />}

        {activeLeftPanel && (
          <div className="drawer-shell">
            <aside className="sidebar tool-drawer">
              {activeLeftPanel === "filters" && (
                <FiltersPanel
                  query={query}
                  onQueryChange={setQuery}
                  source={source}
                  onSourceChange={setSource}
                  availabilities={availabilities}
                  year={year}
                  onYearChange={setYear}
                  years={years}
                  subject={subject}
                  onSubjectChange={setSubject}
                  subjects={subjects}
                  activeAvailability={activeAvailability}
                  filteredFeatures={filteredFeatures}
                  debouncedQuery={debouncedQuery}
                  onSelect={handleSelectFeature}
                  stats={stats}
                  mode={mode}
                  pinnedIds={pinnedUniversityIds}
                />
              )}

              {activeLeftPanel === "saved" && (
                <SavedPanel
                  onSelect={selectFavorite}
                  onCompare={(id) => {
                    addToCompare(id);
                    setActiveLeftPanel("compare");
                  }}
                  onExportWorkspace={exportWorkspace}
                  onExportShortlist={exportShortlistHtml}
                  onImportWorkspace={importWorkspace}
                  workspaceMessage={workspaceMessage}
                />
              )}

              {activeLeftPanel === "compare" && (
                <ComparePanel
                  ids={compareIds}
                  featureIndex={compareFeatureIndex}
                  onRemove={(id) =>
                    setCompareIds((ids) => ids.filter((value) => value !== id))
                  }
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
          {dataSource === "local" && (
            <div className="banner data-source" title="Showing bundled offline data">
              <Layers3 size={14} />
              Local data
            </div>
          )}
          {toast && (
            <div className="banner toast" role="status">
              <Star size={14} fill="currentColor" />
              {toast}
              <button
                className="banner-close"
                type="button"
                aria-label="Dismiss message"
                onClick={() => setToast("")}
              >
                <X size={13} />
              </button>
            </div>
          )}
          {upgradeHint && (
            <div className="banner upgrade" role="status">
              <Sparkles size={14} />
              <span>{upgradeHint}</span>
              <button
                className="banner-upgrade-cta"
                type="button"
                onClick={() => {
                  dismissUpgradeHint();
                  openProCard();
                }}
              >
                See Pro
              </button>
              <button
                className="banner-close"
                type="button"
                aria-label="Dismiss upgrade message"
                onClick={dismissUpgradeHint}
              >
                <X size={13} />
              </button>
            </div>
          )}
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

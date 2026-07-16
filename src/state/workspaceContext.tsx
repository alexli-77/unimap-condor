import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import type { PreferenceProfile, RankingFeature } from "../types";
import {
  canSaveSchool,
  getEntitlements,
  upgradeCopy,
  type Entitlements
} from "../entitlements";
import {
  favoritesStorageKey,
  preferenceStorageKey,
  proStorageKey,
  schoolDecisionsStorageKey
} from "../workspace/constants";
import { supabase } from "../supabase";
import { useAuth } from "./authContext";
import { SupabaseWorkspacePersistence } from "./persistence/supabaseAdapter";
import { mergeSnapshots } from "./persistence/merge";
import type { WorkspaceSnapshot } from "./persistence/types";
import {
  createFavoriteItem,
  getDefaultSchoolDecision,
  getFavoriteId,
  loadPreferenceProfile,
  loadSchoolDecisions
} from "../workspace/helpers";
import type {
  FavoriteItem,
  FavoriteKind,
  SchoolDecision,
  SchoolDecisionPatch,
  WorkspaceBackup
} from "../workspace/types";

export type WorkspaceContextValue = {
  favorites: FavoriteItem[];
  schoolDecisions: Record<number, SchoolDecision>;
  preferenceProfile: PreferenceProfile;
  favoriteFeatures: RankingFeature[];
  isFavorite: (kind: FavoriteKind, universityId: number, entityKey: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  saveSchoolDecision: (feature: RankingFeature, patch: SchoolDecisionPatch) => void;
  // Persists the preference profile (localStorage + state) and returns the stamped
  // profile so callers can drive UI side effects. Persistence is centralized here so a
  // future Supabase-backed store only has to change this provider.
  persistPreferenceProfile: (profile: PreferenceProfile) => PreferenceProfile;
  applyWorkspaceBackup: (backup: WorkspaceBackup) => void;
  buildWorkspaceBackup: () => WorkspaceBackup;
  // --- v1.1 soft paywall ---
  isPro: boolean;
  entitlements: Entitlements;
  savedSchoolCount: number;
  // Transient upgrade nudge (inline/toast, never a modal). Touchpoints call
  // showUpgradeHint when a Free cap is hit; the shell renders it and clears it.
  upgradeHint: string;
  showUpgradeHint: (message: string) => void;
  dismissUpgradeHint: () => void;
  // The lightweight Pro intro card (benefit list + "coming soon" subscribe).
  isProCardOpen: boolean;
  openProCard: () => void;
  closeProCard: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem(favoritesStorageKey);
    if (!saved) return [];
    try {
      return JSON.parse(saved) as FavoriteItem[];
    } catch {
      return [];
    }
  });
  const [schoolDecisions, setSchoolDecisions] = useState<Record<number, SchoolDecision>>(
    () => loadSchoolDecisions()
  );
  const [preferenceProfile, setPreferenceProfile] = useState<PreferenceProfile>(() =>
    loadPreferenceProfile()
  );

  const { user, subscriptionPro } = useAuth();

  // Subscription-driven Pro. Logged in -> the entitlement resolved from the
  // user's Lemon Squeezy subscription row (see authContext / subscription.ts).
  // Logged out -> the `unimap.pro` localStorage switch, retained as a manual
  // dev/preview backdoor (NOT a purchase path) so the offline experience is
  // unchanged. A signed-in user is never Pro via the backdoor.
  const [devPro] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(proStorageKey) === "true";
  });
  const isPro = user ? subscriptionPro : devPro;
  const [upgradeHint, setUpgradeHint] = useState("");
  const [isProCardOpen, setIsProCardOpen] = useState(false);

  const entitlements = useMemo(() => getEntitlements(isPro), [isPro]);
  const savedSchoolCount = useMemo(
    () => favorites.filter((favorite) => favorite.kind === "school").length,
    [favorites]
  );

  const showUpgradeHint = useCallback((message: string) => setUpgradeHint(message), []);
  const dismissUpgradeHint = useCallback(() => setUpgradeHint(""), []);
  const openProCard = useCallback(() => setIsProCardOpen(true), []);
  const closeProCard = useCallback(() => setIsProCardOpen(false), []);

  useEffect(() => {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(schoolDecisionsStorageKey, JSON.stringify(schoolDecisions));
  }, [schoolDecisions]);

  // --- LEO-196 cloud sync ---
  // localStorage above stays the always-on optimistic cache. When a Supabase
  // session is present we additionally mirror the workspace to the per-user
  // cloud tables through the Supabase persistence adapter. Logged out /
  // unconfigured, none of this runs and behaviour is unchanged.
  const cloudAdapterRef = useRef<SupabaseWorkspacePersistence | null>(null);
  const syncedUserRef = useRef<string | null>(null);
  const [cloudReady, setCloudReady] = useState(false);

  // Keep the latest local snapshot in a ref so the login effect can merge the
  // exact current data without re-running on every workspace edit.
  const snapshotRef = useRef<WorkspaceSnapshot>({
    favorites,
    schoolDecisions,
    preferenceProfile
  });
  useEffect(() => {
    snapshotRef.current = { favorites, schoolDecisions, preferenceProfile };
  }, [favorites, schoolDecisions, preferenceProfile]);

  useEffect(() => {
    if (!supabase || !user) {
      // Logged out / unconfigured: drop back to local-only mode.
      cloudAdapterRef.current = null;
      syncedUserRef.current = null;
      setCloudReady(false);
      return;
    }
    if (syncedUserRef.current === user.id) return;
    syncedUserRef.current = user.id;

    const adapter = new SupabaseWorkspacePersistence(supabase, user.id);
    cloudAdapterRef.current = adapter;
    let active = true;

    (async () => {
      try {
        const local = snapshotRef.current;
        const remote = await adapter.load();
        // First login: union local + cloud, local-newer-wins on conflicts.
        const merged = mergeSnapshots(local, remote);
        if (!active) return;

        setFavorites(merged.favorites);
        setSchoolDecisions(merged.schoolDecisions);
        setPreferenceProfile(merged.preferenceProfile);
        localStorage.setItem(favoritesStorageKey, JSON.stringify(merged.favorites));
        localStorage.setItem(
          schoolDecisionsStorageKey,
          JSON.stringify(merged.schoolDecisions)
        );
        localStorage.setItem(
          preferenceStorageKey,
          JSON.stringify(merged.preferenceProfile)
        );

        // Push the union back up so the cloud reflects the merged result.
        await Promise.all([
          adapter.saveFavorites(merged.favorites),
          adapter.saveSchoolDecisions(merged.schoolDecisions),
          adapter.savePreferenceProfile(merged.preferenceProfile)
        ]);
        if (active) setCloudReady(true);
      } catch (error) {
        // Cloud unavailable: keep serving the local cache silently.
        console.warn("Cloud sync unavailable; staying on local cache", error);
        syncedUserRef.current = null;
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  // Ongoing mirror: once the initial merge is done, push each collection to the
  // cloud when it changes. Fire-and-forget on top of optimistic local state.
  useEffect(() => {
    if (!cloudReady) return;
    cloudAdapterRef.current
      ?.saveFavorites(favorites)
      .catch((error) => console.warn("Failed to sync favorites", error));
  }, [favorites, cloudReady]);

  useEffect(() => {
    if (!cloudReady) return;
    cloudAdapterRef.current
      ?.saveSchoolDecisions(schoolDecisions)
      .catch((error) => console.warn("Failed to sync school decisions", error));
  }, [schoolDecisions, cloudReady]);

  useEffect(() => {
    if (!cloudReady) return;
    cloudAdapterRef.current
      ?.savePreferenceProfile(preferenceProfile)
      .catch((error) => console.warn("Failed to sync preference profile", error));
  }, [preferenceProfile, cloudReady]);

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      const alreadySaved = favorites.some((favorite) => favorite.id === item.id);
      // Soft paywall: only a *new* school favorite past the Free cap is blocked.
      // Removing a favorite, and saving subjects/advisors, are never gated.
      if (!alreadySaved && item.kind === "school") {
        if (!canSaveSchool(entitlements, savedSchoolCount)) {
          showUpgradeHint(upgradeCopy.savedSchoolsCap);
          return;
        }
      }
      setFavorites((current) =>
        current.some((favorite) => favorite.id === item.id)
          ? current.filter((favorite) => favorite.id !== item.id)
          : [...current, item]
      );
    },
    [favorites, entitlements, savedSchoolCount, showUpgradeHint]
  );

  const saveSchoolDecision = useCallback(
    (feature: RankingFeature, patch: SchoolDecisionPatch) => {
      const p = feature.properties;
      const schoolFavorite = createFavoriteItem(feature, "school", p.universityName);
      const alreadySaved = favorites.some(
        (favorite) => favorite.id === schoolFavorite.id
      );
      // Editing the decision workflow implicitly tracks the school, so honour the
      // same Free cap before it silently adds a 16th school favorite.
      if (!alreadySaved && !canSaveSchool(entitlements, savedSchoolCount)) {
        showUpgradeHint(upgradeCopy.savedSchoolsCap);
        return;
      }
      setFavorites((current) =>
        current.some((favorite) => favorite.id === schoolFavorite.id)
          ? current
          : [...current, schoolFavorite]
      );
      setSchoolDecisions((current) => {
        const previous =
          current[p.universityId] ?? getDefaultSchoolDecision(p.universityId);
        return {
          ...current,
          [p.universityId]: {
            ...previous,
            ...patch,
            universityId: p.universityId,
            updatedAt: new Date().toISOString()
          }
        };
      });
    },
    [favorites, entitlements, savedSchoolCount, showUpgradeHint]
  );

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

  const persistPreferenceProfile = useCallback((profile: PreferenceProfile) => {
    const nextProfile: PreferenceProfile = {
      ...profile,
      schemaVersion: 1,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(preferenceStorageKey, JSON.stringify(nextProfile));
    setPreferenceProfile(nextProfile);
    return nextProfile;
  }, []);

  const applyWorkspaceBackup = useCallback((backup: WorkspaceBackup) => {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(backup.favorites));
    localStorage.setItem(
      schoolDecisionsStorageKey,
      JSON.stringify(backup.schoolDecisions)
    );
    localStorage.setItem(preferenceStorageKey, JSON.stringify(backup.preferenceProfile));
    setFavorites(backup.favorites);
    setSchoolDecisions(backup.schoolDecisions);
    setPreferenceProfile(backup.preferenceProfile);
  }, []);

  const buildWorkspaceBackup = useCallback(
    (): WorkspaceBackup => ({
      app: "unimap-condor",
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      favorites,
      schoolDecisions,
      preferenceProfile
    }),
    [favorites, schoolDecisions, preferenceProfile]
  );

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      favorites,
      schoolDecisions,
      preferenceProfile,
      favoriteFeatures,
      isFavorite,
      toggleFavorite,
      saveSchoolDecision,
      persistPreferenceProfile,
      applyWorkspaceBackup,
      buildWorkspaceBackup,
      isPro,
      entitlements,
      savedSchoolCount,
      upgradeHint,
      showUpgradeHint,
      dismissUpgradeHint,
      isProCardOpen,
      openProCard,
      closeProCard
    }),
    [
      favorites,
      schoolDecisions,
      preferenceProfile,
      favoriteFeatures,
      isFavorite,
      toggleFavorite,
      saveSchoolDecision,
      persistPreferenceProfile,
      applyWorkspaceBackup,
      buildWorkspaceBackup,
      isPro,
      entitlements,
      savedSchoolCount,
      upgradeHint,
      showUpgradeHint,
      dismissUpgradeHint,
      isProCardOpen,
      openProCard,
      closeProCard
    ]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { PreferenceProfile, RankingFeature } from "../types";
import {
  favoritesStorageKey,
  preferenceStorageKey,
  schoolDecisionsStorageKey
} from "../workspace/constants";
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

  useEffect(() => {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(schoolDecisionsStorageKey, JSON.stringify(schoolDecisions));
  }, [schoolDecisions]);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((current) =>
      current.some((favorite) => favorite.id === item.id)
        ? current.filter((favorite) => favorite.id !== item.id)
        : [...current, item]
    );
  }, []);

  const saveSchoolDecision = useCallback(
    (feature: RankingFeature, patch: SchoolDecisionPatch) => {
      const p = feature.properties;
      const schoolFavorite = createFavoriteItem(feature, "school", p.universityName);
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
    []
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
      buildWorkspaceBackup
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
      buildWorkspaceBackup
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

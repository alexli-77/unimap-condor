import type { PreferenceProfile } from "../../types";
import {
  favoritesStorageKey,
  preferenceStorageKey,
  schoolDecisionsStorageKey
} from "../../workspace/constants";
import {
  loadPreferenceProfile,
  loadSchoolDecisions,
  normalizeFavoriteItem
} from "../../workspace/helpers";
import type { FavoriteItem, SchoolDecision } from "../../workspace/types";
import type { WorkspacePersistence, WorkspaceSnapshot } from "./types";

function loadFavorites(): FavoriteItem[] {
  const saved = localStorage.getItem(favoritesStorageKey);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeFavoriteItem(item as Partial<FavoriteItem>))
      .filter(Boolean) as FavoriteItem[];
  } catch {
    return [];
  }
}

/**
 * localStorage-backed persistence. This is the always-on offline cache and the
 * sole store when the user is logged out or Supabase is unconfigured, so its
 * behaviour is byte-for-byte the pre-LEO-196 workspace persistence.
 */
export class LocalWorkspacePersistence implements WorkspacePersistence {
  readonly kind = "local" as const;

  async load(): Promise<WorkspaceSnapshot> {
    return {
      favorites: loadFavorites(),
      schoolDecisions: loadSchoolDecisions(),
      preferenceProfile: loadPreferenceProfile()
    };
  }

  async saveFavorites(favorites: FavoriteItem[]): Promise<void> {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  }

  async saveSchoolDecisions(decisions: Record<number, SchoolDecision>): Promise<void> {
    localStorage.setItem(schoolDecisionsStorageKey, JSON.stringify(decisions));
  }

  async savePreferenceProfile(profile: PreferenceProfile): Promise<void> {
    localStorage.setItem(preferenceStorageKey, JSON.stringify(profile));
  }
}

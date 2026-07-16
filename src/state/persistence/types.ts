import type { PreferenceProfile } from "../../types";
import type { FavoriteItem, SchoolDecision } from "../../workspace/types";

/** The full workspace payload the provider owns and persists. */
export type WorkspaceSnapshot = {
  favorites: FavoriteItem[];
  schoolDecisions: Record<number, SchoolDecision>;
  preferenceProfile: PreferenceProfile;
};

/**
 * Persistence boundary for the workspace. Two implementations exist:
 *   - LocalWorkspacePersistence  -> localStorage (the always-on offline cache;
 *     this is exactly the pre-LEO-196 behaviour and drives the logged-out /
 *     unconfigured experience unchanged).
 *   - SupabaseWorkspacePersistence -> the per-user cloud tables.
 * The provider swaps the active adapter when the auth session changes; every
 * save is fire-and-forget on top of optimistic local state, so a slow or failing
 * cloud write never blocks the UI.
 */
export interface WorkspacePersistence {
  readonly kind: "local" | "supabase";
  load(): Promise<WorkspaceSnapshot>;
  saveFavorites(favorites: FavoriteItem[]): Promise<void>;
  saveSchoolDecisions(decisions: Record<number, SchoolDecision>): Promise<void>;
  savePreferenceProfile(profile: PreferenceProfile): Promise<void>;
}

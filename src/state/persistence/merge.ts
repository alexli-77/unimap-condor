import type { PreferenceProfile } from "../../types";
import type { FavoriteItem, SchoolDecision } from "../../workspace/types";
import type { WorkspaceSnapshot } from "./types";

// First-login merge (local <- + -> cloud). The rule from LEO-196: take the
// *union* of both sides, and when the same item exists on both, prefer the more
// recent change with local winning ties ("冲突以本地新改动为准").

function timeValue(value: string | undefined): number {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

/**
 * Union favorites by `id`. Favorites are effectively immutable once created, so
 * a conflicting id keeps the local copy (local-wins tie-break) but the set is
 * the union of both sources.
 */
export function mergeFavorites(
  local: FavoriteItem[],
  remote: FavoriteItem[]
): FavoriteItem[] {
  const byId = new Map<string, FavoriteItem>();
  remote.forEach((item) => byId.set(item.id, item));
  // Local applied second so it overrides on id collisions.
  local.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
}

/**
 * Union school decisions by `universityId`. On a key present in both, keep the
 * one with the newer `updatedAt`; ties resolve to local.
 */
export function mergeSchoolDecisions(
  local: Record<number, SchoolDecision>,
  remote: Record<number, SchoolDecision>
): Record<number, SchoolDecision> {
  const merged: Record<number, SchoolDecision> = { ...remote };
  Object.entries(local).forEach(([key, localDecision]) => {
    const id = Number(key);
    const remoteDecision = merged[id];
    if (!remoteDecision) {
      merged[id] = localDecision;
      return;
    }
    // Local wins ties (>=), matching "conflicts resolve to local".
    merged[id] =
      timeValue(localDecision.updatedAt) >= timeValue(remoteDecision.updatedAt)
        ? localDecision
        : remoteDecision;
  });
  return merged;
}

/**
 * Pick the preference profile with the newer `updatedAt`; ties resolve to local.
 * An empty (never-edited) profile has an empty/absent `updatedAt` -> time 0, so
 * a real profile on either side always wins over an untouched one.
 */
export function mergePreferenceProfile(
  local: PreferenceProfile,
  remote: PreferenceProfile
): PreferenceProfile {
  return timeValue(local.updatedAt) >= timeValue(remote.updatedAt) ? local : remote;
}

/** Merge a full local snapshot with a full remote snapshot (local-wins ties). */
export function mergeSnapshots(
  local: WorkspaceSnapshot,
  remote: WorkspaceSnapshot
): WorkspaceSnapshot {
  return {
    favorites: mergeFavorites(local.favorites, remote.favorites),
    schoolDecisions: mergeSchoolDecisions(local.schoolDecisions, remote.schoolDecisions),
    preferenceProfile: mergePreferenceProfile(
      local.preferenceProfile,
      remote.preferenceProfile
    )
  };
}

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PreferenceProfile } from "../../types";
import {
  normalizeFavoriteItem,
  normalizePreferenceProfile,
  normalizeSchoolDecisions
} from "../../workspace/helpers";
import { defaultPreferenceProfile } from "../../workspace/constants";
import type { FavoriteItem, SchoolDecision } from "../../workspace/types";
import type { WorkspacePersistence, WorkspaceSnapshot } from "./types";

const nowIso = () => new Date().toISOString();

/**
 * Supabase-backed persistence for a single authenticated user. Each save mirrors
 * the current in-memory collection onto the cloud tables: upsert the present
 * rows, then delete any rows the user no longer has (so removals propagate).
 * Callers treat writes as fire-and-forget on top of optimistic local state.
 */
export class SupabaseWorkspacePersistence implements WorkspacePersistence {
  readonly kind = "supabase" as const;

  constructor(
    private readonly client: SupabaseClient,
    private readonly userId: string
  ) {}

  async load(): Promise<WorkspaceSnapshot> {
    const [favoritesResult, decisionsResult, profileResult] = await Promise.all([
      this.client
        .from("user_favorites")
        .select("favorite_id, payload")
        .eq("user_id", this.userId),
      this.client
        .from("user_school_decisions")
        .select("university_id, payload")
        .eq("user_id", this.userId),
      this.client
        .from("user_preference_profiles")
        .select("payload")
        .eq("user_id", this.userId)
        .maybeSingle()
    ]);

    if (favoritesResult.error) throw favoritesResult.error;
    if (decisionsResult.error) throw decisionsResult.error;
    if (profileResult.error) throw profileResult.error;

    const favorites = (favoritesResult.data ?? [])
      .map((row) => normalizeFavoriteItem(row.payload as Partial<FavoriteItem>))
      .filter(Boolean) as FavoriteItem[];

    const decisionsRecord = Object.fromEntries(
      (decisionsResult.data ?? []).map((row) => [
        Number(row.university_id),
        row.payload as Partial<SchoolDecision>
      ])
    );

    const preferenceProfile = profileResult.data?.payload
      ? normalizePreferenceProfile(profileResult.data.payload)
      : defaultPreferenceProfile;

    return {
      favorites,
      schoolDecisions: normalizeSchoolDecisions(decisionsRecord),
      preferenceProfile
    };
  }

  async saveFavorites(favorites: FavoriteItem[]): Promise<void> {
    if (favorites.length > 0) {
      const rows = favorites.map((favorite) => ({
        user_id: this.userId,
        favorite_id: favorite.id,
        payload: favorite,
        updated_at: nowIso()
      }));
      const { error } = await this.client
        .from("user_favorites")
        .upsert(rows, { onConflict: "user_id,favorite_id" });
      if (error) throw error;
    }
    await this.deleteMissing(
      "user_favorites",
      "favorite_id",
      favorites.map((f) => f.id)
    );
  }

  async saveSchoolDecisions(decisions: Record<number, SchoolDecision>): Promise<void> {
    const entries = Object.entries(decisions);
    if (entries.length > 0) {
      const rows = entries.map(([universityId, decision]) => ({
        user_id: this.userId,
        university_id: Number(universityId),
        payload: decision,
        updated_at: decision.updatedAt || nowIso()
      }));
      const { error } = await this.client
        .from("user_school_decisions")
        .upsert(rows, { onConflict: "user_id,university_id" });
      if (error) throw error;
    }
    await this.deleteMissing(
      "user_school_decisions",
      "university_id",
      entries.map(([universityId]) => Number(universityId))
    );
  }

  async savePreferenceProfile(profile: PreferenceProfile): Promise<void> {
    const { error } = await this.client.from("user_preference_profiles").upsert(
      {
        user_id: this.userId,
        payload: profile,
        updated_at: profile.updatedAt || nowIso()
      },
      { onConflict: "user_id" }
    );
    if (error) throw error;
  }

  // Delete the user's rows in `table` whose `keyColumn` is not in `keepKeys`, so
  // a removed favorite / decision disappears from the cloud too.
  private async deleteMissing(
    table: string,
    keyColumn: string,
    keepKeys: Array<string | number>
  ): Promise<void> {
    let query = this.client.from(table).delete().eq("user_id", this.userId);
    if (keepKeys.length > 0) {
      const list = keepKeys
        .map((key) => (typeof key === "number" ? String(key) : `"${key}"`))
        .join(",");
      query = query.not(keyColumn, "in", `(${list})`);
    }
    const { error } = await query;
    if (error) throw error;
  }
}

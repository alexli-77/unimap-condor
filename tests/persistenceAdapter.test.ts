import { beforeEach, describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { LocalWorkspacePersistence } from "../src/state/persistence/localAdapter";
import { SupabaseWorkspacePersistence } from "../src/state/persistence/supabaseAdapter";
import { defaultPreferenceProfile } from "../src/workspace/constants";
import type { FavoriteItem, SchoolDecision } from "../src/workspace/types";

function favorite(id: string, universityId: number): FavoriteItem {
  return {
    id,
    kind: "school",
    universityId,
    universityName: `School ${universityId}`,
    city: "City",
    country: "Country",
    longitude: 1,
    latitude: 2,
    label: id,
    createdAt: "2026-07-16T00:00:00.000Z"
  };
}

function decision(universityId: number): SchoolDecision {
  return {
    universityId,
    status: "shortlist",
    keepReason: "keep",
    rejectReason: "",
    nextAction: "",
    updatedAt: "2026-07-16T00:00:00.000Z"
  };
}

// Minimal chainable Supabase mock. `tableData` seeds select() results per table;
// `ops` records the write calls the adapter issues.
function createMockClient(tableData: Record<string, { list?: unknown[]; single?: unknown }>) {
  const ops = {
    upserts: [] as Array<{ table: string; rows: unknown }>,
    deletes: [] as Array<{ table: string; notFilter: unknown }>
  };

  const client = {
    from(table: string) {
      let mode: "select" | "upsert" | "delete" = "select";
      let notFilter: unknown = null;
      const builder: Record<string, unknown> = {
        select: () => builder,
        eq: () => builder,
        not: (col: string, op: string, val: string) => {
          notFilter = { col, op, val };
          return builder;
        },
        maybeSingle: () =>
          Promise.resolve({ data: tableData[table]?.single ?? null, error: null }),
        upsert: (rows: unknown) => {
          mode = "upsert";
          ops.upserts.push({ table, rows });
          return builder;
        },
        delete: () => {
          mode = "delete";
          return builder;
        },
        then: (resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) => {
          let result: unknown;
          if (mode === "delete") {
            ops.deletes.push({ table, notFilter });
            result = { error: null };
          } else if (mode === "upsert") {
            result = { error: null };
          } else {
            result = { data: tableData[table]?.list ?? [], error: null };
          }
          return Promise.resolve(result).then(resolve, reject);
        }
      };
      return builder;
    }
  };

  return { client: client as unknown as SupabaseClient, ops };
}

describe("LocalWorkspacePersistence", () => {
  beforeEach(() => localStorage.clear());

  it("identifies as the local adapter", () => {
    expect(new LocalWorkspacePersistence().kind).toBe("local");
  });

  it("round-trips a saved snapshot through localStorage", async () => {
    const adapter = new LocalWorkspacePersistence();
    await adapter.saveFavorites([favorite("school:1:a", 1)]);
    await adapter.saveSchoolDecisions({ 1: decision(1) });
    await adapter.savePreferenceProfile({
      ...defaultPreferenceProfile,
      notes: "local note"
    });

    const snapshot = await adapter.load();
    expect(snapshot.favorites).toHaveLength(1);
    expect(snapshot.favorites[0].id).toBe("school:1:a");
    expect(snapshot.schoolDecisions[1].keepReason).toBe("keep");
    expect(snapshot.preferenceProfile.notes).toBe("local note");
  });

  it("returns an empty snapshot when storage is empty", async () => {
    const snapshot = await new LocalWorkspacePersistence().load();
    expect(snapshot.favorites).toEqual([]);
    expect(snapshot.schoolDecisions).toEqual({});
  });
});

describe("SupabaseWorkspacePersistence", () => {
  it("identifies as the supabase adapter", () => {
    const { client } = createMockClient({});
    expect(new SupabaseWorkspacePersistence(client, "user-1").kind).toBe("supabase");
  });

  it("maps cloud rows into a workspace snapshot", async () => {
    const { client } = createMockClient({
      user_favorites: { list: [{ favorite_id: "school:9:z", payload: favorite("school:9:z", 9) }] },
      user_school_decisions: { list: [{ university_id: 9, payload: decision(9) }] },
      user_preference_profiles: {
        single: { payload: { ...defaultPreferenceProfile, notes: "cloud note" } }
      }
    });

    const snapshot = await new SupabaseWorkspacePersistence(client, "user-1").load();
    expect(snapshot.favorites[0].universityId).toBe(9);
    expect(snapshot.schoolDecisions[9].keepReason).toBe("keep");
    expect(snapshot.preferenceProfile.notes).toBe("cloud note");
  });

  it("upserts favorites and issues a delete so removals propagate", async () => {
    const { client, ops } = createMockClient({});
    await new SupabaseWorkspacePersistence(client, "user-1").saveFavorites([
      favorite("school:1:a", 1)
    ]);

    expect(ops.upserts).toHaveLength(1);
    expect(ops.upserts[0].table).toBe("user_favorites");
    expect(Array.isArray(ops.upserts[0].rows)).toBe(true);
    // A delete is always issued to prune rows the user no longer has.
    expect(ops.deletes.some((d) => d.table === "user_favorites")).toBe(true);
  });

  it("deletes all favorites when saving an empty set", async () => {
    const { client, ops } = createMockClient({});
    await new SupabaseWorkspacePersistence(client, "user-1").saveFavorites([]);
    expect(ops.upserts).toHaveLength(0);
    expect(ops.deletes.some((d) => d.table === "user_favorites")).toBe(true);
  });
});

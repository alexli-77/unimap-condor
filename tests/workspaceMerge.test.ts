// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  mergeFavorites,
  mergePreferenceProfile,
  mergeSchoolDecisions,
  mergeSnapshots
} from "../src/state/persistence/merge";
import { defaultPreferenceProfile } from "../src/workspace/constants";
import type { PreferenceProfile } from "../src/types";
import type { FavoriteItem, SchoolDecision } from "../src/workspace/types";

function favorite(id: string): FavoriteItem {
  return {
    id,
    kind: "school",
    universityId: Number(id.split(":")[1] ?? 1),
    universityName: `School ${id}`,
    city: "City",
    country: "Country",
    longitude: 0,
    latitude: 0,
    label: id,
    createdAt: "2026-07-16T00:00:00.000Z"
  };
}

function decision(universityId: number, updatedAt: string, keepReason: string): SchoolDecision {
  return {
    universityId,
    status: "shortlist",
    keepReason,
    rejectReason: "",
    nextAction: "",
    updatedAt
  };
}

describe("mergeFavorites (union by id, local wins ties)", () => {
  it("takes the union of both sides", () => {
    const merged = mergeFavorites(
      [favorite("school:1:a")],
      [favorite("school:2:b")]
    );
    expect(merged.map((f) => f.id).sort()).toEqual(["school:1:a", "school:2:b"]);
  });

  it("keeps the local copy on an id collision", () => {
    const local = { ...favorite("school:1:a"), label: "local" };
    const remote = { ...favorite("school:1:a"), label: "remote" };
    const merged = mergeFavorites([local], [remote]);
    expect(merged).toHaveLength(1);
    expect(merged[0].label).toBe("local");
  });
});

describe("mergeSchoolDecisions (union by universityId, newer wins, local ties)", () => {
  it("unions non-overlapping decisions", () => {
    const merged = mergeSchoolDecisions(
      { 1: decision(1, "2026-07-01T00:00:00.000Z", "local-1") },
      { 2: decision(2, "2026-07-01T00:00:00.000Z", "remote-2") }
    );
    expect(Object.keys(merged).sort()).toEqual(["1", "2"]);
  });

  it("prefers the newer decision on conflict", () => {
    const merged = mergeSchoolDecisions(
      { 1: decision(1, "2026-07-01T00:00:00.000Z", "local-old") },
      { 1: decision(1, "2026-07-10T00:00:00.000Z", "remote-new") }
    );
    expect(merged[1].keepReason).toBe("remote-new");
  });

  it("resolves an equal-timestamp conflict in favor of local", () => {
    const stamp = "2026-07-05T00:00:00.000Z";
    const merged = mergeSchoolDecisions(
      { 1: decision(1, stamp, "local") },
      { 1: decision(1, stamp, "remote") }
    );
    expect(merged[1].keepReason).toBe("local");
  });
});

describe("mergePreferenceProfile", () => {
  it("keeps the profile with the newer updatedAt", () => {
    const local: PreferenceProfile = {
      ...defaultPreferenceProfile,
      updatedAt: "2026-07-01T00:00:00.000Z",
      notes: "local"
    };
    const remote: PreferenceProfile = {
      ...defaultPreferenceProfile,
      updatedAt: "2026-07-12T00:00:00.000Z",
      notes: "remote"
    };
    expect(mergePreferenceProfile(local, remote).notes).toBe("remote");
  });

  it("prefers a real local profile over an untouched (empty updatedAt) remote", () => {
    const local: PreferenceProfile = {
      ...defaultPreferenceProfile,
      updatedAt: "2026-07-01T00:00:00.000Z",
      notes: "local"
    };
    const remote: PreferenceProfile = { ...defaultPreferenceProfile, updatedAt: "" };
    expect(mergePreferenceProfile(local, remote).notes).toBe("local");
  });
});

describe("mergeSnapshots", () => {
  it("merges all three collections together", () => {
    const merged = mergeSnapshots(
      {
        favorites: [favorite("school:1:a")],
        schoolDecisions: { 1: decision(1, "2026-07-10T00:00:00.000Z", "local") },
        preferenceProfile: {
          ...defaultPreferenceProfile,
          updatedAt: "2026-07-10T00:00:00.000Z",
          notes: "local"
        }
      },
      {
        favorites: [favorite("school:2:b")],
        schoolDecisions: { 1: decision(1, "2026-07-01T00:00:00.000Z", "remote") },
        preferenceProfile: {
          ...defaultPreferenceProfile,
          updatedAt: "2026-07-01T00:00:00.000Z",
          notes: "remote"
        }
      }
    );
    expect(merged.favorites).toHaveLength(2);
    expect(merged.schoolDecisions[1].keepReason).toBe("local");
    expect(merged.preferenceProfile.notes).toBe("local");
  });
});

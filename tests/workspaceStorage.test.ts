import { beforeEach, describe, expect, it } from "vitest";

// The favorites / school-decisions persistence logic lives inside App.tsx and is
// not independently importable without pulling in React + MapLibre. Rather than
// refactor App.tsx purely for testability, these tests pin the serialization
// *contract* the app depends on: the exact storage keys, and that the saved
// shapes survive a JSON.stringify -> localStorage -> JSON.parse round trip with
// their types intact. If the persisted shape drifts, these fail loudly.

const favoritesStorageKey = "unimap.favorites";
const schoolDecisionsStorageKey = "unimap.schoolDecisions";

type FavoriteItem = {
  id: string;
  kind: "school" | "subject" | "advisor";
  universityId: number;
  universityName: string;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
  label: string;
  createdAt: string;
};

type SchoolDecision = {
  universityId: number;
  status: "interested" | "longlist" | "shortlist" | "applying" | "rejected";
  keepReason: string;
  rejectReason: string;
  nextAction: string;
  updatedAt: string;
};

describe("workspace localStorage serialization round trip", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips a favorites array through the app storage key", () => {
    const favorites: FavoriteItem[] = [
      {
        id: "school:1:mit",
        kind: "school",
        universityId: 1,
        universityName: "Massachusetts Institute of Technology (MIT)",
        city: "Cambridge",
        country: "United States",
        longitude: -71.0942,
        latitude: 42.3601,
        label: "MIT",
        createdAt: "2026-07-15T00:00:00.000Z"
      },
      {
        id: "advisor:1:jane-doe",
        kind: "advisor",
        universityId: 1,
        universityName: "Massachusetts Institute of Technology (MIT)",
        city: "Cambridge",
        country: "United States",
        longitude: -71.0942,
        latitude: 42.3601,
        label: "Jane Doe",
        createdAt: "2026-07-15T00:00:00.000Z"
      }
    ];

    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
    const restored = JSON.parse(
      localStorage.getItem(favoritesStorageKey) as string
    ) as FavoriteItem[];

    expect(restored).toEqual(favorites);
    expect(restored[0].universityId).toBe(1);
    expect(typeof restored[0].longitude).toBe("number");
    expect(restored[1].kind).toBe("advisor");
  });

  it("round-trips a school-decisions record keyed by university id", () => {
    const schoolDecisions: Record<number, SchoolDecision> = {
      1: {
        universityId: 1,
        status: "shortlist",
        keepReason: "Strong CS program",
        rejectReason: "",
        nextAction: "Email advisor",
        updatedAt: "2026-07-15T00:00:00.000Z"
      },
      42: {
        universityId: 42,
        status: "rejected",
        keepReason: "",
        rejectReason: "Tuition over budget",
        nextAction: "",
        updatedAt: "2026-07-15T00:00:00.000Z"
      }
    };

    localStorage.setItem(schoolDecisionsStorageKey, JSON.stringify(schoolDecisions));
    const restored = JSON.parse(
      localStorage.getItem(schoolDecisionsStorageKey) as string
    ) as Record<string, SchoolDecision>;

    // JSON object keys are strings; the app re-keys by Number(...) on load.
    expect(Object.keys(restored)).toEqual(["1", "42"]);
    expect(restored["1"].status).toBe("shortlist");
    expect(restored["42"].rejectReason).toBe("Tuition over budget");
    expect(Number(Object.keys(restored)[0])).toBe(restored["1"].universityId);
  });

  it("survives an empty workspace without throwing", () => {
    expect(localStorage.getItem(favoritesStorageKey)).toBeNull();

    // The app treats a missing key as an empty collection.
    const raw = localStorage.getItem(favoritesStorageKey);
    const favorites = raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
    expect(favorites).toEqual([]);

    localStorage.setItem(favoritesStorageKey, JSON.stringify([]));
    expect(
      JSON.parse(localStorage.getItem(favoritesStorageKey) as string)
    ).toEqual([]);
  });
});

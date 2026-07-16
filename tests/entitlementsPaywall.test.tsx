import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { upgradeCopy } from "../src/entitlements";
import { useWorkspace, WorkspaceProvider } from "../src/state/workspaceContext";
import type { FavoriteItem } from "../src/workspace/types";

function makeSchoolFavorite(id: number): FavoriteItem {
  return {
    id: `school:${id}:school-${id}`,
    kind: "school",
    universityId: id,
    universityName: `School ${id}`,
    city: "City",
    country: "Country",
    longitude: 0,
    latitude: 0,
    label: `School ${id}`,
    createdAt: "2026-07-16T00:00:00.000Z"
  };
}

function seedFavorites(count: number) {
  const favorites = Array.from({ length: count }, (_, index) =>
    makeSchoolFavorite(index + 1)
  );
  localStorage.setItem("unimap.favorites", JSON.stringify(favorites));
}

function wrapper({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

describe("workspace soft paywall — saved-school cap", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("blocks the 16th Free school and surfaces the upgrade hint", () => {
    seedFavorites(15);
    const { result } = renderHook(() => useWorkspace(), { wrapper });

    expect(result.current.savedSchoolCount).toBe(15);

    act(() => {
      result.current.toggleFavorite(makeSchoolFavorite(16));
    });

    // The 16th school is not added, and the friendly hint is shown.
    expect(result.current.savedSchoolCount).toBe(15);
    expect(result.current.upgradeHint).toBe(upgradeCopy.savedSchoolsCap);
  });

  it("still allows the 15th school under the cap", () => {
    seedFavorites(14);
    const { result } = renderHook(() => useWorkspace(), { wrapper });

    act(() => {
      result.current.toggleFavorite(makeSchoolFavorite(15));
    });

    expect(result.current.savedSchoolCount).toBe(15);
    expect(result.current.upgradeHint).toBe("");
  });

  it("still lets a capped user remove an existing school (toggle off)", () => {
    seedFavorites(15);
    const { result } = renderHook(() => useWorkspace(), { wrapper });

    act(() => {
      result.current.toggleFavorite(makeSchoolFavorite(15));
    });

    expect(result.current.savedSchoolCount).toBe(14);
    expect(result.current.upgradeHint).toBe("");
  });
});

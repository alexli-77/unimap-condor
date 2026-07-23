import { useMemo } from "react";

// Deterministic pixel identicon (no dependencies). The 8x8 grid is built from a
// hash of the Supabase user id: the left 4 columns are generated and mirrored
// horizontally, so the same user always renders the same avatar. Free users get
// one of several cool-tone palettes (also hash-picked); Pro users share a fixed
// gold palette while keeping their own pattern — upgrading just recolors.

const GRID = 8;
const HALF = GRID / 2;

/** Dark-friendly backdrop shared by every palette. */
const AVATAR_BACKGROUND = "#1e293b";

/** Cool-tone palettes for Free users: blues / teals / purples / greens. */
const COOL_PALETTES: ReadonlyArray<readonly string[]> = [
  ["#7dd3fc", "#38bdf8", "#0284c7"],
  ["#5eead4", "#2dd4bf", "#0d9488"],
  ["#c4b5fd", "#a78bfa", "#7c3aed"],
  ["#86efac", "#4ade80", "#16a34a"]
];

/** Fixed gold palette shared by all Pro users. */
const GOLD_PALETTE: readonly string[] = ["#fde68a", "#fbbf24", "#d97706"];

/** FNV-1a 32-bit string hash — small, stable, good enough for identicons. */
function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** mulberry32 PRNG so one hash deterministically drives the whole pattern. */
function createRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = { x: number; y: number; shade: number };

/** Generate the mirrored on-cells with a palette shade index per cell. */
function buildCells(seed: string): { cells: Cell[]; paletteIndex: number } {
  const hash = hashSeed(seed);
  const rng = createRng(hash);
  const cells: Cell[] = [];
  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < HALF; x += 1) {
      if (rng() < 0.5) continue;
      const shade = Math.floor(rng() * 3);
      cells.push({ x, y, shade });
      cells.push({ x: GRID - 1 - x, y, shade });
    }
  }
  return { cells, paletteIndex: hash % COOL_PALETTES.length };
}

export function PixelAvatar({
  seed,
  isPro,
  size = 32,
  className
}: {
  /** Stable identity key (Supabase user id). */
  seed: string;
  /** Pro recolors to the shared gold palette; the pattern stays the user's own. */
  isPro: boolean;
  size?: number;
  className?: string;
}) {
  const { cells, paletteIndex } = useMemo(() => buildCells(seed), [seed]);
  const palette = isPro ? GOLD_PALETTE : COOL_PALETTES[paletteIndex];

  return (
    <svg
      className={className ? `pixel-avatar ${className}` : "pixel-avatar"}
      width={size}
      height={size}
      viewBox={`0 0 ${GRID} ${GRID}`}
      role="img"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect width={GRID} height={GRID} fill={AVATAR_BACKGROUND} />
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill={palette[cell.shade]}
        />
      ))}
    </svg>
  );
}

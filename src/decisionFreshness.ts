import type { SchoolDecisionFact } from "./types";

// Freshness / confidence helpers for decision facts. Study-abroad data (tuition,
// deadlines, immigration policy) goes stale quickly, so these pure functions turn
// the raw `verifiedAt` / `confidence` fields into the signals the UI surfaces.

export const STALE_MONTHS = 12;
export const LOW_CONFIDENCE_THRESHOLD = 0.6;

export function parseVerifiedAt(verifiedAt?: string): Date | null {
  if (!verifiedAt) return null;
  const parsed = new Date(verifiedAt);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// Whole calendar months between `verifiedAt` and `now` (null when undated/invalid).
export function monthsSince(verifiedAt: string | undefined, now: Date = new Date()) {
  const date = parseVerifiedAt(verifiedAt);
  if (!date) return null;
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth()) -
    (now.getDate() < date.getDate() ? 1 : 0);
  return months < 0 ? 0 : months;
}

// A fact is "stale" once it is at least STALE_MONTHS old. Undated facts are not
// flagged as stale (we simply have no verification date to show).
export function isStale(
  verifiedAt: string | undefined,
  now: Date = new Date(),
  months: number = STALE_MONTHS
): boolean {
  const age = monthsSince(verifiedAt, now);
  return age !== null && age >= months;
}

export function isLowConfidence(
  confidence: number | undefined,
  threshold: number = LOW_CONFIDENCE_THRESHOLD
): boolean {
  return typeof confidence === "number" && confidence < threshold;
}

// Employment / immigration prose already carries an "as of 2026-07" currency
// clause; detecting it lets the UI avoid repeating the same period redundantly.
export function hasAsOfClause(rawLabel: string): boolean {
  return /as of \d{4}-\d{2}/i.test(rawLabel);
}

export type FreshnessSummary = {
  oldest: string | null;
  newest: string | null;
  datedCount: number;
  sourceCount: number;
  staleCount: number;
};

// Roll a group of facts up into one freshness summary for card- and compare-level
// "Data verified between X and Y · N sources" lines.
export function summarizeFreshness(
  facts: SchoolDecisionFact[],
  now: Date = new Date()
): FreshnessSummary {
  const dates = facts
    .map((fact) => fact.verifiedAt)
    .filter((value): value is string => Boolean(value))
    .sort();
  const sources = new Set(
    facts.map((fact) => fact.sourceUrl || fact.evidenceUrl).filter(Boolean)
  );
  const staleCount = facts.filter((fact) => isStale(fact.verifiedAt, now)).length;
  return {
    oldest: dates[0] ?? null,
    newest: dates[dates.length - 1] ?? null,
    datedCount: dates.length,
    sourceCount: sources.size,
    staleCount
  };
}

import { WATERMARK_LABEL } from "./entitlements";
import { defaultRecommendationPolicy } from "./recommendationPolicy";
import type { PreferenceProfile, RankingFeature } from "./types";
import {
  getDefaultSchoolDecision,
  getPreferenceSignals,
  getStatusMeta
} from "./workspace/helpers";
import type { ApplicationStatus, FavoriteItem, SchoolDecision } from "./workspace/types";

const shortlistStatusOrder: ApplicationStatus[] = [
  "shortlist",
  "applying",
  "longlist",
  "interested",
  "rejected"
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function findOrBuildShortlistFeature(
  favorite: FavoriteItem,
  features: RankingFeature[]
): RankingFeature {
  const existing = features.find(
    (item) => item.properties.universityId === favorite.universityId
  );
  if (existing) return existing;
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [favorite.longitude, favorite.latitude]
    },
    properties: {
      universityId: favorite.universityId,
      universityName: favorite.universityName,
      city: favorite.city,
      country: favorite.country,
      sourceName: "",
      sourceUrl: "",
      attribution: ""
    }
  } as RankingFeature;
}

function renderShortlistListItems(items: string[]) {
  if (!items.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

/**
 * Build a self-contained, printable HTML shortlist from the saved workspace.
 * Groups schools by decision status (shortlist first) and includes the fit
 * grade, keep/exclude reasons, concerns, missing info, and next action.
 */
export function buildShortlistHtml(
  favorites: FavoriteItem[],
  schoolDecisions: Record<number, SchoolDecision>,
  preferenceProfile: PreferenceProfile,
  features: RankingFeature[],
  // Free exports carry a small watermark; Pro passes `watermark: false` for a
  // clean file. Defaults to watermarked so a missing caller stays on the safe
  // (Free) side.
  options: { watermark?: boolean } = {}
): string {
  const watermark = options.watermark ?? true;
  const generatedAt = new Date();
  const generatedLabel = generatedAt.toLocaleString();
  const schools = favorites.filter((favorite) => favorite.kind === "school");

  const groups = shortlistStatusOrder
    .map((statusId) => ({
      meta: getStatusMeta(statusId),
      items: schools.filter(
        (favorite) =>
          (schoolDecisions[favorite.universityId]?.status ?? "interested") === statusId
      )
    }))
    .filter((group) => group.items.length);

  const preferenceSignals = getPreferenceSignals(preferenceProfile);
  const preferenceSummary = preferenceSignals.length
    ? `<ul class="pref-list">${preferenceSignals
        .map((signal) => `<li>${escapeHtml(signal)}</li>`)
        .join("")}</ul>`
    : `<p class="muted">No preference profile saved yet.</p>`;

  const sections = groups
    .map((group) => {
      const cards = group.items
        .map((favorite) => {
          const decision =
            schoolDecisions[favorite.universityId] ??
            getDefaultSchoolDecision(favorite.universityId);
          const feature = findOrBuildShortlistFeature(favorite, features);
          const fit = defaultRecommendationPolicy.scoreSchool(feature, preferenceProfile);
          const nextAction = decision.nextAction.trim() || fit.nextAction;
          const rows: string[] = [];
          if (decision.keepReason.trim()) {
            rows.push(
              `<div class="row"><span class="row-label">Why keep</span><p>${escapeHtml(
                decision.keepReason.trim()
              )}</p></div>`
            );
          }
          if (decision.rejectReason.trim()) {
            rows.push(
              `<div class="row"><span class="row-label">Why exclude</span><p>${escapeHtml(
                decision.rejectReason.trim()
              )}</p></div>`
            );
          }
          if (fit.concerns.length) {
            rows.push(
              `<div class="row"><span class="row-label">Concerns</span>${renderShortlistListItems(
                fit.concerns
              )}</div>`
            );
          }
          if (fit.missing.length) {
            rows.push(
              `<div class="row"><span class="row-label">Missing info</span>${renderShortlistListItems(
                fit.missing
              )}</div>`
            );
          }
          if (nextAction.trim()) {
            rows.push(
              `<div class="row"><span class="row-label">Next action</span><p>${escapeHtml(
                nextAction.trim()
              )}</p></div>`
            );
          }
          return `
        <article class="school">
          <header>
            <div>
              <h3>${escapeHtml(favorite.universityName)}</h3>
              <p class="location">${escapeHtml(
                [favorite.city, favorite.country].filter(Boolean).join(", ")
              )}</p>
            </div>
            <span class="fit fit-${fit.level}">${escapeHtml(fit.label)}</span>
          </header>
          ${rows.join("")}
        </article>`;
        })
        .join("");

      return `
      <section class="status-group">
        <h2>${escapeHtml(group.meta.label)} <span class="count">${group.items.length}</span></h2>
        ${cards}
      </section>`;
    })
    .join("");

  const body = groups.length
    ? sections
    : `<p class="muted">No saved schools yet. Star a school and set its status to build a shortlist.</p>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>UniMap Condor shortlist — ${escapeHtml(generatedLabel)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 32px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #172033; background: #f5f7fb; line-height: 1.5; }
  main { max-width: 820px; margin: 0 auto; }
  h1 { font-size: 24px; margin: 0 0 4px; }
  .generated { color: #617087; font-size: 13px; margin: 0 0 20px; }
  .summary { background: #fff; border: 1px solid #e1e7f0; border-radius: 10px; padding: 16px 18px; margin-bottom: 24px; }
  .summary h2 { font-size: 15px; margin: 0 0 8px; }
  .pref-list { margin: 0; padding-left: 18px; columns: 2; column-gap: 24px; font-size: 13px; }
  .status-group { margin-bottom: 26px; }
  .status-group > h2 { font-size: 17px; margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
  .count { display: inline-grid; place-items: center; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px; background: #2563eb; color: #fff; font-size: 12px; }
  .school { background: #fff; border: 1px solid #e1e7f0; border-radius: 10px; padding: 16px 18px; margin-bottom: 12px; }
  .school header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
  .school h3 { font-size: 16px; margin: 0; }
  .location { color: #617087; font-size: 13px; margin: 2px 0 0; }
  .fit { flex: none; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .fit-good { background: #dcfce7; color: #166534; }
  .fit-possible { background: #fef9c3; color: #854d0e; }
  .fit-weak { background: #fee2e2; color: #991b1b; }
  .row { margin-top: 8px; }
  .row-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #8a97ab; margin-bottom: 2px; }
  .row p { margin: 0; font-size: 13.5px; }
  .row ul { margin: 0; padding-left: 18px; font-size: 13.5px; }
  .muted { color: #617087; }
  footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #e1e7f0; color: #617087; font-size: 12px; }
  footer strong { color: #172033; }
  .watermark-note { color: #97a3b6; font-style: italic; }
  /* Fixed so the corner mark repeats on every printed page. */
  .watermark-corner { position: fixed; bottom: 10px; right: 12px; font-size: 10px; letter-spacing: 0.03em; color: #b3bdcb; opacity: 0.85; pointer-events: none; }
  @media print { body { background: #fff; padding: 0; } .school, .summary { break-inside: avoid; } .watermark-corner { position: fixed; } }
</style>
</head>
<body>
<main>
  <h1>CS master's shortlist</h1>
  <p class="generated">Generated ${escapeHtml(generatedLabel)}</p>
  <div class="summary">
    <h2>Your preferences</h2>
    ${preferenceSummary}
  </div>
  ${body}
  <footer>
    <p><strong>Generated by UniMap Condor.</strong></p>
    <p>Fit grades are derived from your saved preferences and connected school data. Rankings and institutional facts remain © their respective sources; verify all figures against official program pages before deciding.</p>
    ${watermark ? `<p class="watermark-note">${escapeHtml(WATERMARK_LABEL)} — upgrade to Pro to export without this mark.</p>` : ""}
  </footer>
</main>
${watermark ? `<div class="watermark-corner">${escapeHtml(WATERMARK_LABEL)}</div>` : ""}
</body>
</html>`;
}

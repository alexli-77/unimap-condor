import { ArrowLeftRight, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../api";
import {
  defaultRecommendationPolicy,
  type RecommendationResult
} from "../../recommendationPolicy";
import type { RankingFeature, SchoolDecisionFacts, UniversityDetail } from "../../types";
import { summarizeFreshness } from "../../decisionFreshness";
import { PRO_MAX_COMPARE_SCHOOLS } from "../../entitlements";
import { useWorkspace } from "../../state/workspaceContext";
import { getDefaultSchoolDecision, getStatusMeta } from "../../workspace/helpers";
import type { SchoolDecision } from "../../workspace/types";

// Build a minimal RankingFeature from a UniversityDetail when the school is not in the
// live ranking index (e.g. added from Saved while a different subject is loaded). Uses the
// best available rank so scoreSchool still returns a usable fit grade.
function synthesizeCompareFeature(detail: UniversityDetail): RankingFeature {
  let bestRank: number | undefined;
  let topSubject: string | undefined;
  detail.rankings.forEach((group) =>
    Object.entries(group.subjects).forEach(([subject, entries]) =>
      entries.forEach((entry) => {
        const value = Number(entry.rankValue);
        if (Number.isFinite(value) && (bestRank === undefined || value < bestRank)) {
          bestRank = value;
          topSubject = subject;
        }
      })
    )
  );
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [0, 0] },
    properties: {
      universityId: detail.id,
      universityName: detail.name,
      city: detail.city,
      country: detail.country,
      sourceName: "",
      sourceUrl: "",
      attribution: "",
      topSubject,
      topSubjectRankValue: bestRank
    }
  } as RankingFeature;
}

function summarizeFundingSignal(facts: SchoolDecisionFacts | null) {
  const funding = facts?.funding ?? [];
  if (!funding.length) return null;
  const amount = funding.flatMap((fact) => fact.amounts).find(Boolean);
  return `${funding.length} verified · ${amount ?? funding[0].title}`;
}

function summarizeWorkSignal(facts: SchoolDecisionFacts | null) {
  const employment = facts?.employment ?? [];
  const immigration = facts?.immigration ?? [];
  if (!employment.length && !immigration.length) return null;
  const parts: string[] = [];
  if (employment.length) parts.push(`${employment.length} employment`);
  if (immigration.length) parts.push(`${immigration.length} immigration`);
  return parts.join(" · ");
}

// Compare rows show a "freshness" signal built from the oldest verified fact, so a
// column carrying stale data is flagged before the user commits to a decision.
function summarizeFreshnessSignal(facts: SchoolDecisionFacts | null) {
  if (!facts) return null;
  const all = [
    ...facts.programs,
    ...facts.funding,
    ...(facts.employment ?? []),
    ...(facts.immigration ?? [])
  ];
  const summary = summarizeFreshness(all);
  if (!summary.oldest) return null;
  return { oldest: summary.oldest, stale: summary.staleCount > 0 };
}

type CompareColumn = {
  detail: UniversityDetail;
  facts: SchoolDecisionFacts | null;
  fit: RecommendationResult;
  decision: SchoolDecision;
};

export function ComparePanel({
  ids,
  featureIndex,
  onRemove
}: {
  ids: number[];
  featureIndex: Map<number, RankingFeature>;
  onRemove: (id: number) => void;
}) {
  const { preferenceProfile, schoolDecisions, entitlements, isPro, openProCard } =
    useWorkspace();
  const maxCompareSchools = entitlements.maxCompareSchools;
  const [details, setDetails] = useState<UniversityDetail[]>([]);
  const [factsById, setFactsById] = useState<Record<number, SchoolDecisionFacts | null>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) {
      setDetails([]);
      setFactsById({});
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    Promise.all(ids.map((id) => api.getUniversity(id, controller.signal)))
      .then(async (loaded) => {
        setDetails(loaded);
        const entries = await Promise.all(
          loaded.map(async (detail) => {
            try {
              const facts = await api.getSchoolDecisionFacts(
                detail.name,
                controller.signal
              );
              return [detail.id, facts] as const;
            } catch {
              return [detail.id, null] as const;
            }
          })
        );
        setFactsById(Object.fromEntries(entries));
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [ids]);

  const columns: CompareColumn[] = details.map((detail) => {
    const facts = factsById[detail.id] ?? null;
    const feature = featureIndex.get(detail.id) ?? synthesizeCompareFeature(detail);
    const fit = defaultRecommendationPolicy.scoreSchool(feature, preferenceProfile, {
      decisionFacts: facts
    });
    const decision = schoolDecisions[detail.id] ?? getDefaultSchoolDecision(detail.id);
    return { detail, facts, fit, decision };
  });

  if (!ids.length) {
    return (
      <section className="panel compare">
        <div className="panel-title">
          <ArrowLeftRight size={18} />
          <h2>Compare</h2>
        </div>
        <div className="compare-empty">
          <strong>Line up decisions side by side</strong>
          <p className="muted">
            Add up to {maxCompareSchools} schools from a detail card (&ldquo;Add to
            compare&rdquo;) or the Saved list. This table lines up fit grade, decision
            status, funding, employment/immigration signals, and open gaps so you can
            choose, not just browse.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel compare">
      <div className="panel-title">
        <ArrowLeftRight size={18} />
        <h2>Compare</h2>
      </div>
      <p className="compare-hint muted">
        Decision comparison · up to {maxCompareSchools} schools
        {!isPro ? (
          <>
            {" · "}
            <button type="button" className="compare-upgrade-link" onClick={openProCard}>
              Pro compares {PRO_MAX_COMPARE_SCHOOLS}
            </button>
          </>
        ) : null}
      </p>
      {loading && (
        <p className="muted inline-loading">
          <Loader2 className="spin" size={16} />
          Loading comparison
        </p>
      )}
      <div className="compare-table-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="compare-dim-head" scope="col">
                Dimension
              </th>
              {columns.map((col) => (
                <th key={col.detail.id} className="compare-school-head" scope="col">
                  <div>
                    <strong>{col.detail.name}</strong>
                    <span>
                      {col.detail.city}, {col.detail.country}
                    </span>
                  </div>
                  <button
                    className="icon-button"
                    aria-label={`Remove ${col.detail.name}`}
                    onClick={() => onRemove(col.detail.id)}
                  >
                    <X size={14} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Fit grade</th>
              {columns.map((col) => (
                <td key={col.detail.id}>
                  <span className={`compare-fit fit-${col.fit.level}`}>
                    {col.fit.label}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Decision status</th>
              {columns.map((col) => (
                <td key={col.detail.id}>{getStatusMeta(col.decision.status).label}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Funding / tuition</th>
              {columns.map((col) => {
                const summary = summarizeFundingSignal(col.facts);
                return (
                  <td key={col.detail.id}>
                    {summary ?? <span className="compare-nodata">No data</span>}
                  </td>
                );
              })}
            </tr>
            <tr>
              <th scope="row">Employment / immigration</th>
              {columns.map((col) => {
                const summary = summarizeWorkSignal(col.facts);
                return (
                  <td key={col.detail.id}>
                    {summary ?? <span className="compare-nodata">No data</span>}
                  </td>
                );
              })}
            </tr>
            <tr>
              <th scope="row">Data freshness</th>
              {columns.map((col) => {
                const signal = summarizeFreshnessSignal(col.facts);
                return (
                  <td key={col.detail.id}>
                    {signal ? (
                      <span className="compare-freshness">
                        Oldest {signal.oldest}
                        {signal.stale ? (
                          <span className="freshness-badge stale">May be outdated</span>
                        ) : null}
                      </span>
                    ) : (
                      <span className="compare-nodata">No data</span>
                    )}
                  </td>
                );
              })}
            </tr>
            <tr>
              <th scope="row">Missing info</th>
              {columns.map((col) => (
                <td key={col.detail.id}>
                  <span className="compare-missing">{col.fit.missing.length}</span>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Keep reason / next action</th>
              {columns.map((col) => {
                const note =
                  col.decision.keepReason.trim() || col.decision.nextAction.trim();
                return (
                  <td key={col.detail.id}>
                    {note ? note : <span className="compare-nodata">Not set</span>}
                  </td>
                );
              })}
            </tr>
            <tr className="compare-ranking-row">
              <th scope="row">
                Ranking summary
                <span className="compare-ref">Reference</span>
              </th>
              {columns.map((col) => (
                <td key={col.detail.id}>
                  <RankingSummary detail={col.detail} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="compare-source muted">
        Fit grade and Missing info reuse your Preference Profile signals. Ranking summary
        is a reference only — open each school&rsquo;s Rankings tab for full sources.
      </p>
    </section>
  );
}

function RankingSummary({ detail }: { detail: UniversityDetail }) {
  const rows = detail.rankings.flatMap((group) =>
    Object.entries(group.subjects).flatMap(([subject, entries]) =>
      entries.slice(0, 1).map((entry) => ({
        source: group.source.id,
        subject,
        year: entry.year,
        rank: entry.rankValue
      }))
    )
  );
  return (
    <div className="mini-table">
      {rows.slice(0, 5).map((row) => (
        <div key={`${row.source}-${row.subject}-${row.year}`}>
          <span>{row.source}</span>
          <span>{row.subject}</span>
          <strong>{row.rank}</strong>
        </div>
      ))}
    </div>
  );
}

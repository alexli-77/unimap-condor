import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import {
  defaultRecommendationPolicy,
  findMatchingTerms,
  normalizeSignal,
  splitPreferenceTerms,
  textMatchesTerm
} from "../../../recommendationPolicy";
import type {
  PreferenceProfile,
  RankingFeature,
  SchoolDecisionFact,
  SchoolDecisionFacts
} from "../../../types";
import { useSchoolDecisionFacts } from "../../../hooks/useSchoolDecisionFacts";
import { useWorkspace } from "../../../state/workspaceContext";
import { getStatusMeta, hasPreferenceProfile } from "../../../workspace/helpers";
import type { SchoolDecision } from "../../../workspace/types";
import { SchoolDataFallback } from "../../SchoolDataFallback";
import { ExternalChip, InlineLoading } from "../../ui";

function getDecisionFactTags(fact: SchoolDecisionFact) {
  return [
    fact.degreeLevel,
    fact.department,
    fact.duration,
    fact.programFormat,
    fact.topic,
    ...fact.amounts
  ].filter(Boolean) as string[];
}

function buildDecisionGaps(
  facts: SchoolDecisionFacts | null,
  preferenceProfile: PreferenceProfile,
  decision: SchoolDecision
) {
  const gaps: string[] = [];
  const programs = facts?.programs ?? [];
  const funding = facts?.funding ?? [];
  const factText = [...programs, ...funding]
    .map(
      (fact) => `${fact.title} ${fact.rawLabel} ${getDecisionFactTags(fact).join(" ")}`
    )
    .join(" ");

  if (!programs.length)
    gaps.push("Program options are not verified for this school yet.");
  if (!funding.length)
    gaps.push("Funding or tuition facts are not verified for this school yet.");
  if (!/deadline|before|december|february|august|september|fall|winter/i.test(factText)) {
    gaps.push("Application deadline needs a direct source check.");
  }
  if (
    (preferenceProfile.fundingRequirement === "required" ||
      preferenceProfile.maxTuition.trim()) &&
    !/funding|tuition|support|fee|assistantship|\$|cad/i.test(factText)
  ) {
    gaps.push("Budget or funding requirement needs a stronger evidence item.");
  }
  if (preferenceProfile.degreeLevel && programs.length) {
    const desiredDegree = normalizeSignal(preferenceProfile.degreeLevel);
    const hasDegree = programs.some((program) =>
      normalizeSignal(
        [program.degreeLevel, program.title, program.rawLabel].join(" ")
      ).includes(desiredDegree)
    );
    if (!hasDegree)
      gaps.push(`No verified ${preferenceProfile.degreeLevel} program match yet.`);
  }
  if (!decision.keepReason.trim() && decision.status !== "rejected") {
    gaps.push("Add one keep reason before moving this into Shortlist.");
  }
  if (decision.status === "rejected" && !decision.rejectReason.trim()) {
    gaps.push("Add the exclusion reason so this decision is reusable later.");
  }

  return gaps.slice(0, 5);
}

function buildDecisionInterpretation(
  feature: RankingFeature,
  facts: SchoolDecisionFacts | null,
  preferenceProfile: PreferenceProfile,
  decision: SchoolDecision
) {
  const p = feature.properties;
  const programs = facts?.programs ?? [];
  const funding = facts?.funding ?? [];
  const employment = facts?.employment ?? [];
  const immigration = facts?.immigration ?? [];
  const allFacts = [...programs, ...funding];
  const factText = allFacts
    .map(
      (fact) => `${fact.title} ${fact.rawLabel} ${getDecisionFactTags(fact).join(" ")}`
    )
    .join(" ");
  const policyResult = defaultRecommendationPolicy.scoreSchool(
    feature,
    preferenceProfile,
    {
      decisionFacts: facts
    }
  );
  const matched: string[] = [...policyResult.matched];
  const concerns: string[] = [...policyResult.concerns];
  const missing = [
    ...buildDecisionGaps(facts, preferenceProfile, decision),
    ...policyResult.missing
  ];

  const targetCountries = splitPreferenceTerms(preferenceProfile.targetCountries);
  if (targetCountries.length) {
    if (targetCountries.some((country) => textMatchesTerm(p.country, country))) {
      matched.push(`Location matches target country: ${p.country}.`);
    } else {
      concerns.push(`Country is ${p.country}, outside the current target country list.`);
    }
  }

  const targetCities = splitPreferenceTerms(preferenceProfile.targetCities);
  if (targetCities.length) {
    if (targetCities.some((city) => textMatchesTerm(p.city, city))) {
      matched.push(`City matches target city: ${p.city}.`);
    } else {
      concerns.push(`City is ${p.city}, not one of the current target cities.`);
    }
  }

  if (preferenceProfile.degreeLevel && programs.length) {
    const desiredDegree = normalizeSignal(preferenceProfile.degreeLevel);
    const degreeMatches = programs.filter((program) =>
      normalizeSignal(
        [program.degreeLevel, program.title, program.rawLabel].join(" ")
      ).includes(desiredDegree)
    );
    if (degreeMatches.length) {
      matched.push(
        `Verified ${preferenceProfile.degreeLevel} option: ${degreeMatches
          .slice(0, 2)
          .map((program) => program.title)
          .join(" / ")}.`
      );
    }
  }

  const subjectTerms = splitPreferenceTerms(
    [preferenceProfile.subjectAreas, preferenceProfile.researchKeywords]
      .filter(Boolean)
      .join(",")
  );
  if (subjectTerms.length) {
    const matchedTerms = findMatchingTerms(subjectTerms, [
      factText,
      p.subject ?? "",
      p.topSubject ?? "",
      ...Object.keys(p.normalizedInvertedSubjectRanks ?? {})
    ]);
    if (matchedTerms.length) {
      matched.push(`Subject signal found: ${matchedTerms.slice(0, 3).join(", ")}.`);
    } else {
      missing.push(
        "Subject or research keywords need validation in faculty/research data."
      );
    }
  }

  if (preferenceProfile.fundingRequirement === "required") {
    if (/guarantee|guaranteed|support|funding|assistantship|\$/i.test(factText)) {
      matched.push("Funding evidence exists, but terms still need program-level review.");
    } else {
      concerns.push("Funding is required, but no verified funding fact is connected.");
    }
  } else if (funding.length) {
    matched.push("Funding or tuition facts are available for comparison.");
  }

  if (preferenceProfile.maxTuition.trim()) {
    if (/\$|tuition|fee/i.test(factText)) {
      missing.push(
        `Compare listed tuition/funding amounts against ${preferenceProfile.budgetCurrency} ${preferenceProfile.maxTuition}.`
      );
    } else {
      missing.push("Tuition amount is needed before budget comparison.");
    }
  }

  if (
    preferenceProfile.researchPriority === "high" &&
    !programs.some((program) => /research|thesis|phd/i.test(program.rawLabel))
  ) {
    missing.push(
      "Research-track strength needs supervisor or thesis-track confirmation."
    );
  }
  if (preferenceProfile.employmentPriority === "high") {
    if (employment.length) {
      matched.push(
        `Employment/co-op evidence: ${employment
          .slice(0, 2)
          .map((fact) => fact.title)
          .join("; ")}.`
      );
    } else {
      missing.push(
        "Employment outcomes or co-op/city job-market notes are not connected yet."
      );
    }
  }
  if (preferenceProfile.immigrationPriority === "high") {
    if (immigration.length) {
      const immigrationText = immigration
        .map((fact) => `${fact.title} ${fact.rawLabel}`)
        .join(" ");
      if (
        /pgwp|post-graduation work permit|permanent residence|nominee|express entry|peq|csq/i.test(
          immigrationText
        )
      ) {
        matched.push(`Immigration pathway evidence: ${immigration[0].title}.`);
      }
      if (
        /closed|suspended|waitlist|no longer|requires? french|french-language|french language/i.test(
          immigrationText
        )
      ) {
        concerns.push(
          "Some immigration pathways changed recently (stream closed/suspended or added requirements); verify current provincial rules."
        );
      }
    } else {
      missing.push("Immigration pathway notes are not connected yet.");
    }
  }

  if (decision.keepReason.trim()) {
    matched.push(`Your keep reason: ${decision.keepReason.trim()}`);
  }
  if (decision.rejectReason.trim()) {
    concerns.push(`Your exclusion concern: ${decision.rejectReason.trim()}`);
  }

  const uniqueMissing = [...new Set(missing)].slice(0, 5);
  const uniqueMatched = [...new Set(matched)].slice(0, 5);
  const uniqueConcerns = [...new Set(concerns)].slice(0, 4);

  const nextAction = decision.nextAction.trim()
    ? decision.nextAction
    : uniqueMissing.some((gap) => gap.toLowerCase().includes("deadline"))
      ? "Open the official admissions page and record the next application deadline."
      : uniqueConcerns.length
        ? "Resolve the top concern before moving this school to Shortlist."
        : uniqueMissing.length
          ? "Fill the highest-impact missing fact before changing status."
          : decision.status === "shortlist"
            ? "Compare this school against two nearby shortlist candidates."
            : policyResult.nextAction;

  const summary = hasPreferenceProfile(preferenceProfile)
    ? uniqueConcerns.length
      ? "This school has usable signals, but at least one preference-sensitive concern needs review."
      : uniqueMatched.length
        ? policyResult.summary
        : "Connected facts are available, but they do not explain fit yet."
    : "Add a Preference Profile to turn neutral facts into fit, concern, and next-action signals.";

  return {
    summary,
    matched: uniqueMatched,
    concerns: uniqueConcerns,
    missing: uniqueMissing,
    nextAction
  };
}

export function DecisionPanel({
  feature,
  decision
}: {
  feature: RankingFeature;
  decision: SchoolDecision;
}) {
  const { preferenceProfile } = useWorkspace();
  const p = feature.properties;
  const { facts, loading } = useSchoolDecisionFacts(feature);
  const programs = facts?.programs ?? [];
  const funding = facts?.funding ?? [];
  const employment = facts?.employment ?? [];
  const immigration = facts?.immigration ?? [];
  const totalFacts =
    programs.length + funding.length + employment.length + immigration.length;
  const interpretation = useMemo(
    () => buildDecisionInterpretation(feature, facts, preferenceProfile, decision),
    [feature, facts, preferenceProfile, decision]
  );
  const status = getStatusMeta(decision.status);

  return (
    <div className="tab-panel decision-panel">
      {loading && <InlineLoading label="Loading decision facts" />}

      <div className="decision-brief">
        <div>
          <span>Status</span>
          <strong>{status.label}</strong>
        </div>
        <div>
          <span>Verified facts</span>
          <strong>{totalFacts}</strong>
        </div>
        <div>
          <span>Open gaps</span>
          <strong>{interpretation.missing.length}</strong>
        </div>
      </div>

      <div className="decision-interpretation-card">
        <div className="decision-interpretation-head">
          <strong>Preference interpretation</strong>
          <span>
            {hasPreferenceProfile(preferenceProfile) ? "Profile-aware" : "Needs profile"}
          </span>
        </div>
        <p>{interpretation.summary}</p>
        <div className="decision-signal-columns">
          <DecisionSignalList
            title="Why it may fit"
            items={interpretation.matched}
            empty="No preference match yet."
          />
          <DecisionSignalList
            title="Concerns"
            items={interpretation.concerns}
            empty="No concern from connected facts."
          />
        </div>
      </div>

      <div className="decision-next-card">
        <strong>Next action</strong>
        <p>{interpretation.nextAction}</p>
      </div>

      {!loading && totalFacts === 0 ? (
        <SchoolDataFallback universityName={p.universityName} context="decision" />
      ) : null}

      {programs.length ? <DecisionFactSection title="Programs" facts={programs} /> : null}

      {funding.length ? (
        <DecisionFactSection title="Funding & tuition" facts={funding} />
      ) : null}

      {employment.length ? (
        <DecisionFactSection title="Employment & co-op" facts={employment} />
      ) : null}

      {immigration.length ? (
        <DecisionFactSection title="Immigration pathways" facts={immigration} />
      ) : null}

      {totalFacts > 0 ? (
        <div className="decision-gaps-card">
          <strong>Missing info</strong>
          {interpretation.missing.length ? (
            <ul>
              {interpretation.missing.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          ) : (
            <p>No blocking gaps from connected facts.</p>
          )}
        </div>
      ) : null}

      <div className="decision-source-row">
        <span>{facts?.sourceLabel ?? "Decision facts"}</span>
        {[...programs, ...funding, ...employment, ...immigration]
          .slice(0, 2)
          .map((fact) => (
            <ExternalChip key={fact.id} href={fact.evidenceUrl} label="Source" />
          ))}
      </div>
    </div>
  );
}

function DecisionSignalList({
  title,
  items,
  empty
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="decision-signal-list">
      <strong>{title}</strong>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{empty}</p>
      )}
    </div>
  );
}

function DecisionFactSection({
  title,
  facts
}: {
  title: string;
  facts: SchoolDecisionFact[];
}) {
  return (
    <section className="decision-fact-section">
      <div className="decision-section-head">
        <strong>{title}</strong>
        <span>{facts.length}</span>
      </div>
      <div className="decision-fact-list">
        {facts.map((fact) => (
          <DecisionFactItem key={fact.id} fact={fact} />
        ))}
      </div>
    </section>
  );
}

function DecisionFactItem({ fact }: { fact: SchoolDecisionFact }) {
  const tags = getDecisionFactTags(fact).slice(0, 4);

  return (
    <details className="decision-fact">
      <summary>
        <div>
          <strong>{fact.title}</strong>
          <span>{tags.join(" · ") || "Verified official fact"}</span>
        </div>
        <ChevronDown size={16} />
      </summary>
      <div className="collapsible-body">
        <p>{fact.rawLabel}</p>
        {tags.length ? (
          <div className="tag-cloud compact-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
        <div className="decision-fact-actions">
          <ExternalChip href={fact.evidenceUrl} label="Official source" />
        </div>
      </div>
    </details>
  );
}

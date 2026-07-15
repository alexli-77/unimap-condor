import type {
  AdvisorCard,
  FacultyDepartmentSummary,
  OpenDataProfile,
  PreferenceProfile,
  RankingFeature,
  SchoolDecisionFacts
} from "./types";

export type RecommendationLevel = "strong" | "possible" | "weak";

export type RecommendationResult = {
  score: number;
  level: RecommendationLevel;
  label: string;
  summary: string;
  matched: string[];
  concerns: string[];
  missing: string[];
  nextAction: string;
};

export type RecommendationPolicy = {
  scoreSchool: (
    feature: RankingFeature,
    preference: PreferenceProfile,
    context?: {
      openDataProfile?: OpenDataProfile | null;
      decisionFacts?: SchoolDecisionFacts | null;
    }
  ) => RecommendationResult;
  scoreDepartment: (
    department: FacultyDepartmentSummary,
    preference: PreferenceProfile,
    context?: {
      advisors?: AdvisorCard[];
    }
  ) => RecommendationResult;
  scoreAdvisor: (
    advisor: AdvisorCard,
    preference: PreferenceProfile
  ) => RecommendationResult;
};

type RecommendationDraft = {
  score: number;
  matched: string[];
  concerns: string[];
  missing: string[];
};

const priorityWeight = {
  low: 0,
  medium: 1,
  high: 2
} as const;

export function normalizeSignal(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function splitPreferenceTerms(value: string) {
  const aliases: Record<string, string[]> = {
    ai: ["artificial intelligence", "machine learning"],
    cs: ["computer science"],
    ds: ["data science"],
    hci: ["human computer interaction", "human ai interaction"],
    ml: ["machine learning"],
    nlp: ["natural language processing"],
    se: ["software engineering"]
  };

  return [
    ...new Set(
      value
        .split(/[,，;；/|、\n]+/)
        .map((item) => normalizeSignal(item))
        .filter(Boolean)
        .flatMap((term) => {
          const tokenAliases = term.split(" ").flatMap((token) => aliases[token] ?? []);
          return [term, ...(aliases[term] ?? []), ...tokenAliases];
        })
    )
  ];
}

export function textMatchesTerm(text: string, term: string) {
  const normalizedText = normalizeSignal(text);
  const normalizedTerm = normalizeSignal(term);
  if (!normalizedText || !normalizedTerm) return false;
  return (
    normalizedText.includes(normalizedTerm) || normalizedTerm.includes(normalizedText)
  );
}

export function findMatchingTerms(terms: string[], candidates: string[]) {
  return terms.filter((term) =>
    candidates.some((candidate) => textMatchesTerm(candidate, term))
  );
}

function uniq(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

function getPreferenceSubjectTerms(preference: PreferenceProfile) {
  return splitPreferenceTerms(
    [preference.subjectAreas, preference.researchKeywords, preference.degreeLevel]
      .filter(Boolean)
      .join(",")
  ).filter((term) => term.length > 2);
}

function getKeywordTerms(preference: PreferenceProfile) {
  return splitPreferenceTerms(preference.researchKeywords).filter(
    (term) => term.length > 2
  );
}

function getAreaTerms(preference: PreferenceProfile) {
  return splitPreferenceTerms(
    [preference.subjectAreas, preference.degreeLevel].filter(Boolean).join(",")
  ).filter((term) => term.length > 2);
}

function weightedMatchScore(
  keywordTerms: string[],
  areaTerms: string[],
  keywordCandidates: string[],
  areaCandidates?: string[]
) {
  const keywordMatches = findMatchingTerms(keywordTerms, keywordCandidates);
  const areaOnlyMatches = findMatchingTerms(
    areaTerms,
    areaCandidates ?? keywordCandidates
  ).filter((t) => !keywordMatches.includes(t));
  // keyword match (explicit research intent) outweighs broad area match
  return {
    score: Math.min(35, keywordMatches.length * 20 + areaOnlyMatches.length * 5),
    matches: [...keywordMatches, ...areaOnlyMatches]
  };
}

function rankSignal(feature: RankingFeature) {
  const p = feature.properties;
  const rank = p.rankValue ?? p.topSubjectRankValue;
  if (!rank) return null;
  if (rank <= 50) return { score: 8, label: `Strong ranking signal: #${rank}` };
  if (rank <= 150) return { score: 4, label: `Usable ranking signal: #${rank}` };
  return { score: -4, label: `Ranking is outside top 150: #${rank}` };
}

function getLevel(score: number): RecommendationLevel {
  if (score >= 35) return "strong";
  if (score >= 8) return "possible";
  return "weak";
}

function buildResult(
  draft: RecommendationDraft,
  labels: Record<RecommendationLevel, string>,
  summaries: Record<RecommendationLevel, string>,
  nextActions: Record<RecommendationLevel, string>
): RecommendationResult {
  const level = getLevel(draft.score);
  return {
    score: Math.round(draft.score),
    level,
    label: labels[level],
    summary: summaries[level],
    matched: uniq(draft.matched).slice(0, 5),
    concerns: uniq(draft.concerns).slice(0, 4),
    missing: uniq(draft.missing).slice(0, 5),
    nextAction: nextActions[level]
  };
}

function scoreSchool(
  feature: RankingFeature,
  preference: PreferenceProfile,
  context?: {
    openDataProfile?: OpenDataProfile | null;
    decisionFacts?: SchoolDecisionFacts | null;
  }
): RecommendationResult {
  const p = feature.properties;
  const programs = context?.decisionFacts?.programs ?? [];
  const funding = context?.decisionFacts?.funding ?? [];
  const employment = context?.decisionFacts?.employment ?? [];
  const immigration = context?.decisionFacts?.immigration ?? [];
  const factText = [...programs, ...funding]
    .map(
      (fact) =>
        `${fact.title} ${fact.rawLabel} ${fact.degreeLevel ?? ""} ${fact.topic ?? ""} ${fact.department ?? ""} ${fact.amounts.join(" ")}`
    )
    .join(" ");
  const subjectTerms = getPreferenceSubjectTerms(preference);
  const subjectCandidates = [
    p.subject,
    p.topSubject,
    ...Object.keys(p.normalizedInvertedSubjectRanks ?? {}),
    ...(context?.openDataProfile?.topics.map((topic) => topic.name) ?? []),
    factText
  ].filter(Boolean) as string[];
  const targetCountries = splitPreferenceTerms(preference.targetCountries);
  const targetCities = splitPreferenceTerms(preference.targetCities);
  const draft: RecommendationDraft = { score: 0, matched: [], concerns: [], missing: [] };

  if (targetCountries.length) {
    if (targetCountries.some((country) => textMatchesTerm(p.country, country))) {
      draft.score += 20;
      draft.matched.push(`Country matches preference: ${p.country}.`);
    } else {
      draft.score -= 15;
      draft.concerns.push(`Country is ${p.country}, outside the target country list.`);
    }
  } else {
    draft.missing.push("Target country is not set.");
  }

  if (targetCities.length) {
    if (targetCities.some((city) => textMatchesTerm(p.city, city))) {
      draft.score += 10;
      draft.matched.push(`City matches preference: ${p.city}.`);
    } else if (!preference.acceptsSmallCities) {
      draft.score -= 5;
      draft.concerns.push(`City is ${p.city}, not one of the target cities.`);
    } else {
      draft.missing.push(
        `Check whether ${p.city} fits your city-size and lifestyle preferences.`
      );
    }
  } else {
    draft.missing.push("Target city is not set.");
  }

  if (subjectTerms.length) {
    const matches = findMatchingTerms(subjectTerms, subjectCandidates);
    if (matches.length) {
      draft.score += Math.min(24, matches.length * 8);
      draft.matched.push(`Subject/research match: ${matches.slice(0, 3).join(", ")}.`);
    } else {
      draft.score -= 10;
      draft.concerns.push(
        "No clear subject or research keyword match in connected school data."
      );
      draft.missing.push("Check department and advisor-level research evidence.");
    }
  } else {
    draft.missing.push("Subject areas or research keywords are not set.");
  }

  if (preference.degreeLevel) {
    const desiredDegree = normalizeSignal(preference.degreeLevel);
    const degreeMatches = programs.filter((program) =>
      normalizeSignal(
        [program.degreeLevel, program.title, program.rawLabel].join(" ")
      ).includes(desiredDegree)
    );
    if (degreeMatches.length) {
      draft.score += 12;
      draft.matched.push(`Verified ${preference.degreeLevel} option exists.`);
    } else if (programs.length) {
      draft.score -= 8;
      draft.concerns.push(`No verified ${preference.degreeLevel} program match yet.`);
    } else {
      draft.missing.push(
        `Program data is needed to verify ${preference.degreeLevel} fit.`
      );
    }
  }

  if (preference.fundingRequirement === "required") {
    if (
      /guarantee|guaranteed|support|funding|assistantship|scholarship|\$/i.test(factText)
    ) {
      draft.score += 12;
      draft.matched.push("Funding evidence exists, but exact terms still need review.");
    } else {
      draft.score -= 18;
      draft.concerns.push("Funding is required, but connected evidence is missing.");
    }
  } else if (funding.length) {
    draft.score += 4;
    draft.matched.push("Funding or tuition facts are available for comparison.");
  } else {
    draft.missing.push("Funding and tuition facts are not connected yet.");
  }

  if (preference.maxTuition.trim()) {
    if (/\$|tuition|fee/i.test(factText)) {
      draft.missing.push(
        `Compare listed amounts against ${preference.budgetCurrency} ${preference.maxTuition}.`
      );
    } else {
      draft.score -= 4;
      draft.missing.push("Tuition amount is needed before budget comparison.");
    }
  }

  const ranking = rankSignal(feature);
  if (ranking) {
    draft.score += ranking.score;
    if (ranking.score > 0) draft.matched.push(ranking.label);
    else draft.concerns.push(ranking.label);
  } else {
    draft.missing.push("Ranking value is missing for this source or subject.");
  }

  if (preference.researchPriority === "high") {
    if (subjectTerms.length || context?.openDataProfile?.topics.length) draft.score += 4;
    else
      draft.missing.push(
        "Research priority is high, but research topics are not connected."
      );
  }
  if (preference.employmentPriority === "high") {
    if (employment.length) {
      draft.score += 6;
      const labels = employment
        .slice(0, 2)
        .map((fact) => fact.title)
        .join("; ");
      draft.matched.push(`Employment/co-op evidence: ${labels}.`);
    } else {
      draft.missing.push(
        "Employment outcomes, co-op, or job-market notes are not connected yet."
      );
    }
  }
  if (preference.immigrationPriority === "high") {
    if (immigration.length) {
      const immigrationText = immigration
        .map((fact) => `${fact.title} ${fact.rawLabel}`)
        .join(" ");
      if (
        /pgwp|post-graduation work permit|permanent residence|nominee|express entry|peq|csq/i.test(
          immigrationText
        )
      ) {
        draft.score += 6;
        draft.matched.push(`Immigration pathway evidence: ${immigration[0].title}.`);
      }
      // Flag recent policy tightening so an active pathway does not read as risk-free.
      if (
        /closed|suspended|waitlist|no longer|requires? french|french-language|french language/i.test(
          immigrationText
        )
      ) {
        draft.concerns.push(
          "Some immigration pathways changed recently (stream closed/suspended or added requirements); verify current provincial rules."
        );
      }
    } else {
      draft.missing.push("Immigration pathway notes are not connected yet.");
    }
  }

  return buildResult(
    draft,
    {
      strong: "Strong fit",
      possible: "Possible fit",
      weak: "Weak fit"
    },
    {
      strong: "Connected evidence matches several important preferences.",
      possible:
        "There are useful fit signals, but at least one major item needs checking.",
      weak: "Current evidence does not support a strong fit yet."
    },
    {
      strong: draft.missing.length
        ? "Verify the highest-impact missing facts before Shortlist."
        : "Compare it with nearby shortlist candidates.",
      possible: draft.concerns.length
        ? "Resolve the top concern before moving this to Shortlist."
        : "Fill missing evidence and decide whether it belongs in Longlist.",
      weak: "Check department/advisor evidence before investing more time."
    }
  );
}

function scoreDepartment(
  department: FacultyDepartmentSummary,
  preference: PreferenceProfile,
  context?: {
    advisors?: AdvisorCard[];
  }
): RecommendationResult {
  const advisors = context?.advisors ?? [];
  const keywordTerms = getKeywordTerms(preference);
  const areaTerms = getAreaTerms(preference);
  const allTerms = [...new Set([...keywordTerms, ...areaTerms])];
  const departmentText = [
    department.facultyName,
    department.name,
    ...department.roles,
    ...department.expertise
  ].join(" ");
  const linkedAdvisors = advisors.filter((advisor) => {
    const advisorDepartment = normalizeSignal(advisor.department ?? "");
    const departmentName = normalizeSignal(department.name);
    return (
      advisorDepartment.includes(departmentName) ||
      departmentName.includes(advisorDepartment) ||
      textMatchesTerm(advisor.department ?? "", department.name)
    );
  });
  const advisorText = linkedAdvisors
    .map((advisor) =>
      [
        advisor.fullName,
        advisor.department,
        advisor.fitSummary,
        advisor.contactAngle,
        ...advisor.researchAreas,
        ...advisor.targetPrograms
      ]
        .filter(Boolean)
        .join(" ")
    )
    .join(" ");
  const draft: RecommendationDraft = { score: 0, matched: [], concerns: [], missing: [] };
  const { score: matchScore, matches } = weightedMatchScore(keywordTerms, areaTerms, [
    departmentText,
    advisorText
  ]);

  if (matches.length) {
    draft.score += Math.min(28, matchScore);
    draft.matched.push(`Matches profile terms: ${matches.slice(0, 3).join(", ")}.`);
  } else if (allTerms.length) {
    draft.concerns.push(
      "No direct profile-term match in department or linked advisor evidence."
    );
  } else {
    draft.missing.push(
      "Add subject or research keywords to personalize department ranking."
    );
  }

  if (
    /computer|informatique|software|logiciel|data|mila|engineering/i.test(departmentText)
  ) {
    draft.score += 8;
    draft.matched.push("Department identity has a CS/software/data/engineering signal.");
  }

  if (linkedAdvisors.length) {
    draft.score += Math.min(18, linkedAdvisors.length * 6);
    draft.matched.push(
      `${linkedAdvisors.length} recommended advisor${linkedAdvisors.length === 1 ? "" : "s"} linked.`
    );
  } else {
    draft.missing.push(
      "No curated advisor recommendation is linked to this department yet."
    );
  }

  if (department.count >= 20) {
    draft.score += 5;
    draft.matched.push(
      `${department.count} faculty entries give this department a useful exploration surface.`
    );
  } else if (department.count < 5) {
    draft.missing.push("Department faculty coverage is still thin.");
  }

  if (preference.researchPriority === "high" && !linkedAdvisors.length) {
    draft.score -= 6;
    draft.concerns.push(
      "Research priority is high, but supervisor-level matches are not curated yet."
    );
  }

  return buildResult(
    draft,
    {
      strong: "Strong department match",
      possible: "Possible department match",
      weak: "Needs more evidence"
    },
    {
      strong:
        "This department has profile matches and enough evidence to keep exploring.",
      possible: "This department has some useful signals, but needs more verification.",
      weak: "Current department evidence is too thin or too generic."
    },
    {
      strong: "Open faculty entries and save 1-2 potential supervisors.",
      possible: "Check program pages and advisor profiles before saving.",
      weak: "Add more keywords or verify department-level data first."
    }
  );
}

function scoreAdvisor(
  advisor: AdvisorCard,
  preference: PreferenceProfile
): RecommendationResult {
  const keywordTerms = getKeywordTerms(preference);
  const areaTerms = getAreaTerms(preference);
  const allTerms = [...new Set([...keywordTerms, ...areaTerms])];
  // researchText: for area matching — includes curator framing and dept context
  const researchText = [
    ...advisor.researchAreas,
    advisor.fitSummary,
    advisor.contactAngle,
    advisor.lab,
    advisor.title,
    advisor.department
  ]
    .filter(Boolean)
    .join(" ");
  const draft: RecommendationDraft = { score: 0, matched: [], concerns: [], missing: [] };
  // keyword matching against researchAreas only — distinguishes "they research X" from "frame outreach around X"
  const { score: matchScore, matches } = weightedMatchScore(
    keywordTerms,
    areaTerms,
    advisor.researchAreas,
    [researchText]
  );

  if (matches.length) {
    draft.score += matchScore;
    draft.matched.push(`Research/profile match: ${matches.slice(0, 3).join(", ")}.`);
  } else if (allTerms.length) {
    draft.concerns.push("No direct match to current subject or research keywords.");
  } else {
    draft.missing.push(
      "Add subject or research keywords to personalize advisor ranking."
    );
  }

  if (advisor.priorityScore) {
    draft.score += Math.min(12, Math.max(0, advisor.priorityScore - 60) / 4);
    draft.matched.push(
      `Curated advisor signal: ${advisor.priority ?? advisor.priorityScore}.`
    );
  }

  if (preference.researchPriority === "high") {
    if (advisor.researchAreas.length) {
      draft.score += 8;
      draft.matched.push(
        "Research priority is high and advisor research areas are available."
      );
    } else {
      draft.score -= 6;
      draft.missing.push("Advisor research areas need verification.");
    }
  }

  if (preference.degreeLevel) {
    const degreeMatches = findMatchingTerms(
      splitPreferenceTerms(preference.degreeLevel),
      [advisor.targetPrograms.join(" "), advisor.fitSummary]
    );
    if (degreeMatches.length) {
      draft.score += 8;
      draft.matched.push(
        `Target program signal: ${degreeMatches.slice(0, 2).join(", ")}.`
      );
    } else {
      draft.missing.push(
        `Check whether this advisor supervises ${preference.degreeLevel} students.`
      );
    }
  }

  if (advisor.politicalSensitivity) {
    draft.concerns.push(
      `Handle outreach carefully: sensitivity ${advisor.politicalSensitivity}.`
    );
  }

  if (
    preference.employmentPriority === "high" &&
    /software|systems|engineering|industry|data/i.test(researchText)
  ) {
    draft.score += 4;
    draft.matched.push("Employment priority has an applied software/systems signal.");
  }

  if (preference.immigrationPriority === "high") {
    draft.missing.push(
      "Advisor fit does not answer immigration fit; check school/city notes."
    );
  }

  return buildResult(
    draft,
    {
      strong: "Strong advisor match",
      possible: "Possible advisor match",
      weak: "Weak advisor match"
    },
    {
      strong: "Advisor evidence connects well with the current preference profile.",
      possible: "Advisor evidence has useful overlap, but needs profile-level checking.",
      weak: "Current evidence does not show a strong advisor fit."
    },
    {
      strong: "Open the profile and check recent projects before outreach.",
      possible: "Verify current lab topics and supervision fit.",
      weak: "Keep as background context unless new evidence appears."
    }
  );
}

export const defaultRecommendationPolicy: RecommendationPolicy = {
  scoreSchool,
  scoreDepartment,
  scoreAdvisor
};

import type {
  AdvisorCard,
  FacultyDepartmentSummary,
  PreferenceProfile,
  RankingFeature,
  SchoolDecisionFacts
} from "../../src/types";

function preference(overrides: Partial<PreferenceProfile>): PreferenceProfile {
  return {
    schemaVersion: 1,
    updatedAt: "2026-06-16T00:00:00.000Z",
    degreeLevel: "",
    targetCountries: "",
    targetCities: "",
    budgetCurrency: "CAD",
    maxTuition: "",
    fundingRequirement: "flexible",
    subjectAreas: "",
    researchKeywords: "",
    gpa: "",
    languageScores: "",
    background: "",
    employmentPriority: "medium",
    researchPriority: "medium",
    immigrationPriority: "medium",
    acceptsSmallCities: false,
    acceptsCourseBased: false,
    acceptsNichePrograms: false,
    notes: "",
    ...overrides
  };
}

function school(
  universityId: number,
  universityName: string,
  country: string,
  city: string,
  subject: string,
  rankValue: number
): RankingFeature {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [0, 0]
    },
    properties: {
      universityId,
      universityName,
      country,
      city,
      sourceName: "QS",
      sourceUrl: "https://example.com/ranking",
      attribution: "Fixture",
      subject,
      topSubject: subject,
      rankValue,
      normalizedInvertedSubjectRanks: {
        [subject]: rankValue
      }
    }
  };
}

function facts(
  universityName: string,
  options: {
    programTopic?: string;
    degreeLevel?: string;
    fundingText?: string;
    employmentTitle?: string;
    employmentText?: string;
    immigrationTitle?: string;
    immigrationText?: string;
  }
): SchoolDecisionFacts {
  return {
    universityName,
    sourceLabel: "Fixture facts",
    programs: options.programTopic
      ? [
          {
            id: `${universityName}-program`,
            institutionName: universityName,
            recordType: "program",
            title: options.programTopic,
            degreeLevel: options.degreeLevel,
            topic: options.programTopic,
            amounts: [],
            rawLabel: `${options.degreeLevel ?? ""} ${options.programTopic}`,
            evidenceUrl: "https://example.com/program",
            sourceUrl: "https://example.com/program",
            confidence: 1
          }
        ]
      : [],
    funding: options.fundingText
      ? [
          {
            id: `${universityName}-funding`,
            institutionName: universityName,
            recordType: "tuition_funding",
            title: "Funding",
            amounts: ["CAD 33612"],
            rawLabel: options.fundingText,
            evidenceUrl: "https://example.com/funding",
            sourceUrl: "https://example.com/funding",
            confidence: 1
          }
        ]
      : [],
    employment: options.employmentText
      ? [
          {
            id: `${universityName}-employment`,
            institutionName: universityName,
            recordType: "employment",
            title: options.employmentTitle ?? "Co-op pipeline",
            amounts: [],
            rawLabel: options.employmentText,
            evidenceUrl: "https://example.com/employment",
            sourceUrl: "https://example.com/employment",
            confidence: 0.9,
            verifiedAt: "2026-07-15"
          }
        ]
      : [],
    immigration: options.immigrationText
      ? [
          {
            id: `${universityName}-immigration`,
            institutionName: universityName,
            recordType: "immigration",
            title: options.immigrationTitle ?? "PGWP eligibility",
            amounts: [],
            rawLabel: options.immigrationText,
            evidenceUrl: "https://example.com/immigration",
            sourceUrl: "https://example.com/immigration",
            confidence: 0.85,
            verifiedAt: "2026-07-15"
          }
        ]
      : []
  };
}

function advisor(
  id: string,
  fullName: string,
  researchAreas: string[],
  priorityScore: number,
  department = "Computer Science"
): AdvisorCard {
  return {
    id,
    fullName,
    institutionName: "Fixture University",
    institutionAliases: ["Fixture University"],
    department,
    priority: priorityScore >= 90 ? "A+" : "A",
    priorityScore,
    fitSummary: researchAreas.join(", "),
    contactAngle: `Discuss ${researchAreas.slice(0, 2).join(" and ")} fit.`,
    researchAreas,
    targetPrograms: ["Computer Science", "Software Engineering", "AI research"],
    outreachStatus: "Fixture"
  };
}

function department(
  name: string,
  expertise: string[],
  count: number
): FacultyDepartmentSummary {
  return {
    name,
    facultyName: "Faculty of Engineering",
    count,
    expertise,
    roles: ["Professor", "Associate Professor"]
  };
}

export const recommendationScenarios = [
  {
    id: "canada-ai-funding-required",
    description: "Canada + CS/AI + funding required should reward Canadian schools with AI and funding evidence.",
    preference: preference({
      degreeLevel: "PhD",
      targetCountries: "Canada",
      subjectAreas: "Computer Science, AI",
      researchKeywords: "machine learning",
      fundingRequirement: "required",
      researchPriority: "high",
      immigrationPriority: "high"
    }),
    schools: [
      {
        id: "mcmaster",
        feature: school(1, "McMaster University", "Canada", "Hamilton", "Computer Science", 140),
        facts: facts("McMaster University", {
          degreeLevel: "PhD",
          programTopic: "Computer Science and Artificial Intelligence",
          fundingText: "PhD students receive guaranteed support through teaching or research assistantship funding."
        })
      },
      {
        id: "usc",
        feature: school(2, "University of Southern California", "United States", "Los Angeles", "Computer Science", 80),
        facts: facts("University of Southern California", {
          degreeLevel: "PhD",
          programTopic: "Computer Science and Artificial Intelligence"
        })
      }
    ],
    departments: [
      department("Department of Computing and Software", ["Computer science", "Software engineering", "Artificial intelligence"], 51),
      department("Department of Civil Engineering", ["Civil engineering", "Materials"], 32)
    ],
    advisors: [
      advisor("ml-canada", "Machine Learning Canada", ["Machine learning", "Artificial intelligence"], 90, "Department of Computing and Software"),
      advisor("systems-only", "Systems Only", ["Distributed systems"], 92, "Department of Computing and Software")
    ],
    expectations: {
      topSchool: "mcmaster",
      topDepartment: "Department of Computing and Software",
      topAdvisor: "ml-canada",
      schoolMatchedIncludes: "Funding evidence exists"
    }
  },
  {
    id: "us-software-engineering",
    description: "US + software engineering should favor software/programming-languages advisors over generic AI advisors.",
    preference: preference({
      degreeLevel: "MS",
      targetCountries: "United States",
      targetCities: "Los Angeles, Davis",
      subjectAreas: "Computer Science",
      researchKeywords: "software engineering, program analysis",
      employmentPriority: "high",
      researchPriority: "medium"
    }),
    schools: [
      {
        id: "ucla",
        feature: school(3, "University of California, Los Angeles", "United States", "Los Angeles", "Computer Science", 35),
        facts: facts("University of California, Los Angeles", {
          degreeLevel: "MS",
          programTopic: "Computer Science Software Engineering"
        })
      },
      {
        id: "mcmaster",
        feature: school(4, "McMaster University", "Canada", "Hamilton", "Computer Science", 140),
        facts: facts("McMaster University", {
          degreeLevel: "MS",
          programTopic: "Computer Science"
        })
      }
    ],
    departments: [
      department("Computer Science Department", ["Computer science", "Software and systems"], 74),
      department("Electrical and Computer Engineering Department", ["Electrical engineering", "Signals"], 98)
    ],
    advisors: [
      advisor("software-se", "Software Engineering Advisor", ["Software engineering", "Program analysis", "Developer tools"], 82),
      advisor("generic-ai", "Generic AI Advisor", ["Artificial intelligence", "Machine learning"], 92)
    ],
    expectations: {
      topSchool: "ucla",
      topDepartment: "Computer Science Department",
      topAdvisor: "software-se",
      advisorMatchedIncludes: "software engineering"
    }
  },
  {
    id: "hci-decision-support",
    description: "AI + HCI + decision support should surface HCI/decision-support advisors before pure systems advisors.",
    preference: preference({
      degreeLevel: "PhD",
      targetCountries: "United States",
      subjectAreas: "AI, HCI",
      researchKeywords: "decision support, recommendation, human ai interaction",
      researchPriority: "high"
    }),
    schools: [
      {
        id: "usc",
        feature: school(5, "University of Southern California", "United States", "Los Angeles", "Computer Science", 80),
        facts: facts("University of Southern California", {
          degreeLevel: "PhD",
          programTopic: "Computer Science Human-AI Decision Support"
        })
      },
      {
        id: "ucdavis",
        feature: school(6, "University of California, Davis", "United States", "Davis", "Computer Science", 110),
        facts: facts("University of California, Davis", {
          degreeLevel: "PhD",
          programTopic: "Computer Science Systems"
        })
      }
    ],
    departments: [
      department("Thomas Lord Department of Computer Science", ["Human-AI interaction", "Recommendation", "Computer science"], 58),
      department("Ming Hsieh Department of Electrical and Computer Engineering", ["Hardware", "Signals"], 46)
    ],
    advisors: [
      advisor("hci-decision", "HCI Decision Advisor", ["Human-AI interaction", "Decision support", "Recommendation"], 81),
      advisor("systems", "Systems Advisor", ["Distributed systems", "Infrastructure"], 91)
    ],
    expectations: {
      topSchool: "usc",
      topDepartment: "Thomas Lord Department of Computer Science",
      topAdvisor: "hci-decision",
      advisorMatchedIncludes: "decision support"
    }
  },
  {
    id: "cs-ai-keywords-se-over-generic-ai",
    description: "When subjectAreas='CS / AI' but researchKeywords='LLM, software engineering', an advisor whose research matches the explicit keywords should outscore a generic AI/ML advisor with no keyword match.",
    preference: preference({
      degreeLevel: "PhD",
      targetCountries: "Canada",
      targetCities: "Montreal",
      subjectAreas: "CS / AI",
      researchKeywords: "LLM, software engineering",
      fundingRequirement: "required",
      researchPriority: "high",
      employmentPriority: "medium",
      immigrationPriority: "high"
    }),
    schools: [
      {
        id: "mcmaster",
        feature: school(7, "McMaster University", "Canada", "Hamilton", "Computer Science", 140),
        facts: facts("McMaster University", {
          degreeLevel: "PhD",
          programTopic: "Software Engineering",
          fundingText: "PhD students receive guaranteed funding through research assistantships."
        })
      },
      {
        id: "ucla",
        feature: school(8, "University of California, Los Angeles", "United States", "Los Angeles", "Computer Science", 35),
        facts: facts("University of California, Los Angeles", {
          degreeLevel: "PhD",
          programTopic: "Computer Science and Artificial Intelligence"
        })
      }
    ],
    departments: [
      department("Department of Computing and Software", ["Computer science", "Software engineering", "Artificial intelligence"], 51),
      department("Department of Electrical and Computer Engineering", ["Electrical engineering", "Signals", "Hardware"], 40)
    ],
    advisors: [
      advisor(
        "se-llm-advisor",
        "Software Engineering LLM Advisor",
        ["Software engineering", "LLM code generation", "Program analysis"],
        82,
        "Department of Computing and Software"
      ),
      advisor(
        "generic-ai-broad",
        "Generic AI Broad Advisor",
        ["Artificial intelligence", "Machine learning", "Computer science"],
        91,
        "Department of Computing and Software"
      )
    ],
    expectations: {
      topSchool: "mcmaster",
      topDepartment: "Department of Computing and Software",
      topAdvisor: "se-llm-advisor",
      advisorMatchedIncludes: "software engineering"
    }
  },
  {
    id: "canada-employment-immigration-priority",
    description:
      "When employment and immigration priorities are high, a Canadian school with connected co-op and PGWP facts should outrank an otherwise-identical school with no such facts, and its explanation should cite the employment evidence.",
    preference: preference({
      targetCountries: "Canada",
      subjectAreas: "Computer Science",
      employmentPriority: "high",
      immigrationPriority: "high"
    }),
    schools: [
      {
        id: "waterloo",
        feature: school(9, "University of Waterloo", "Canada", "Waterloo", "Computer Science", 60),
        facts: facts("University of Waterloo", {
          employmentTitle: "MMath co-op work term",
          employmentText:
            "The MMath Computer Science co-operative program requires a full-time industry co-op work term.",
          immigrationTitle: "Post-Graduation Work Permit eligibility",
          immigrationText:
            "Master's graduates are eligible for a 3-year Post-Graduation Work Permit (PGWP)."
        })
      },
      {
        id: "plainschool",
        feature: school(10, "Plain Canadian University", "Canada", "Ottawa", "Computer Science", 60),
        facts: facts("Plain Canadian University", {})
      }
    ],
    departments: [
      department("Cheriton School of Computer Science", ["Computer science", "Software engineering"], 60),
      department("Department of Physics", ["Physics", "Astronomy"], 30)
    ],
    advisors: [
      advisor("cs-advisor", "CS Advisor", ["Computer science", "Software engineering"], 88, "Cheriton School of Computer Science"),
      advisor("physics-advisor", "Physics Advisor", ["Astrophysics"], 70, "Department of Physics")
    ],
    expectations: {
      topSchool: "waterloo",
      topDepartment: "Cheriton School of Computer Science",
      topAdvisor: "cs-advisor",
      schoolMatchedIncludes: "Employment/co-op evidence"
    }
  }
] as const;

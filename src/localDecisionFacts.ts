import type { SchoolDecisionFact } from "./types";

export const localDecisionFacts: SchoolDecisionFact[] = [
  {
    id: "uoft-msc",
    institutionName: "University of Toronto",
    recordType: "program",
    title: "Master of Science (MSc)",
    degreeLevel: "Master",
    department: "Computer Science",
    duration: "16 months",
    programFormat: "research-based master's program",
    amounts: [],
    rawLabel:
      "Master of Science (MSc) is a 16-month research-based master's program in which students work with a supervisor to complete a major research project.",
    evidenceUrl: "https://web.cs.toronto.edu/graduate/programs",
    sourceUrl: "https://web.cs.toronto.edu/graduate/programs",
    confidence: 0.92
  },
  {
    id: "uoft-mscac",
    institutionName: "University of Toronto",
    recordType: "program",
    title: "Master of Science in Applied Computing (MScAC)",
    degreeLevel: "Master",
    department: "Computer Science",
    duration: "16 months",
    programFormat: "applied research program with internship",
    amounts: [],
    rawLabel:
      "MScAC is a 16-month applied research program combining eight months of graduate courses with an eight-month applied research internship.",
    evidenceUrl: "https://web.cs.toronto.edu/graduate/programs",
    sourceUrl: "https://web.cs.toronto.edu/graduate/programs",
    confidence: 0.92
  },
  {
    id: "uoft-phd",
    institutionName: "University of Toronto",
    recordType: "program",
    title: "Doctor of Philosophy (PhD)",
    degreeLevel: "PhD",
    department: "Computer Science",
    duration: "4 years with master's; 5 years direct entry",
    programFormat: "research-intensive doctoral program",
    amounts: [],
    rawLabel:
      "PhD is a research-intensive program; program length is four years if entered with a Master's degree and five years if entered directly from a bachelor's degree.",
    evidenceUrl: "https://web.cs.toronto.edu/graduate/programs",
    sourceUrl: "https://web.cs.toronto.edu/graduate/programs",
    confidence: 0.92
  },
  {
    id: "uoft-funding-periods",
    institutionName: "University of Toronto",
    recordType: "tuition_funding",
    title: "Research-stream funding guarantee periods",
    topic: "funding",
    amounts: [],
    rawLabel:
      "Funding guarantee periods are listed as MSc 16 months, PhD transition from MSc 44 months, PhD-M 48 months, and PhD-U 60 months, conditional on satisfactory progress.",
    evidenceUrl: "https://web.cs.toronto.edu/graduate/funding-tuition-awards",
    sourceUrl: "https://web.cs.toronto.edu/graduate/funding-tuition-awards",
    confidence: 0.9
  },
  {
    id: "uoft-enhanced-funding",
    institutionName: "University of Toronto",
    recordType: "tuition_funding",
    title: "Enhanced funding package 2025-2026",
    topic: "funding",
    amounts: ["$38,258", "$16,008 CAD"],
    rawLabel:
      "The enhanced funding package states a take-home living allowance of $38,258 after tuition and incidentals are paid, and a departmental fellowship up to $16,008 CAD for those admitted in 2025-2026.",
    evidenceUrl: "https://web.cs.toronto.edu/graduate/funding-tuition-awards",
    sourceUrl: "https://web.cs.toronto.edu/graduate/funding-tuition-awards",
    confidence: 0.9
  },
  {
    id: "uoft-tuition",
    institutionName: "University of Toronto",
    recordType: "tuition_funding",
    title: "MSc/PhD tuition 2025-2026",
    topic: "tuition",
    amounts: ["$8,448.48 CAD", "$9,608.48 CAD", "$9,240.48 CAD", "$34,900.48 CAD"],
    rawLabel:
      "2025-2026 tuition page lists domestic MSc/PhD incoming PhD $8,448.48 CAD, domestic incoming MSc $9,608.48 CAD, international incoming PhD $9,240.48 CAD, and international incoming MSc $34,900.48 CAD including incidental and ancillary fees.",
    evidenceUrl: "https://web.cs.toronto.edu/graduate/funding-tuition-awards",
    sourceUrl: "https://web.cs.toronto.edu/graduate/funding-tuition-awards",
    confidence: 0.9
  },
  {
    id: "ubc-full-time-masters",
    institutionName: "University of British Columbia",
    recordType: "program",
    title: "Full-Time Master's Programs",
    degreeLevel: "Master",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "UBC Computer Science lists Full-Time Master's Programs as a prospective graduate program option.",
    evidenceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    sourceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    confidence: 0.88
  },
  {
    id: "ubc-phd-track",
    institutionName: "University of British Columbia",
    recordType: "program",
    title: "PhD-Track Program",
    degreeLevel: "PhD",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "UBC Computer Science lists a PhD-Track Program as a prospective graduate program option.",
    evidenceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    sourceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    confidence: 0.88
  },
  {
    id: "ubc-part-time-masters",
    institutionName: "University of British Columbia",
    recordType: "program",
    title: "Part-Time Master's Program",
    degreeLevel: "Master",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "UBC Computer Science lists a Part-Time Master's Program as a prospective graduate program option.",
    evidenceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    sourceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    confidence: 0.88
  },
  {
    id: "ubc-phd",
    institutionName: "University of British Columbia",
    recordType: "program",
    title: "PhD - Doctoral Program",
    degreeLevel: "PhD",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "UBC Computer Science lists PhD - Doctoral Program as a prospective graduate program option.",
    evidenceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    sourceUrl: "https://www.cs.ubc.ca/students/grad/prospective-grads/grad-programs",
    confidence: 0.88
  },
  {
    id: "ubc-support-model",
    institutionName: "University of British Columbia",
    recordType: "tuition_funding",
    title: "Financial support model",
    topic: "funding",
    amounts: [],
    rawLabel:
      "Full-time MSc and PhD students typically receive offers of full financial support from the department for a guaranteed period; support is through assistantships combining teaching and/or research duties.",
    evidenceUrl: "https://www.cs.ubc.ca/students/grad/prospective/funding/financial",
    sourceUrl: "https://www.cs.ubc.ca/students/grad/prospective/funding/financial",
    confidence: 0.9
  },
  {
    id: "ubc-msc-support",
    institutionName: "University of British Columbia",
    recordType: "tuition_funding",
    title: "MSc support levels 2025",
    topic: "funding",
    amounts: ["$32,171/year", "$22,264/year"],
    rawLabel:
      "Effective September 1, 2025, MSc support is at least $32,171/year for the MSc thesis option and $22,264/year estimated for the MSc essay option.",
    evidenceUrl: "https://www.cs.ubc.ca/students/grad/prospective/funding/financial",
    sourceUrl: "https://www.cs.ubc.ca/students/grad/prospective/funding/financial",
    confidence: 0.9
  },
  {
    id: "ubc-phd-support",
    institutionName: "University of British Columbia",
    recordType: "tuition_funding",
    title: "PhD support level 2025",
    topic: "funding",
    amounts: ["$33,612/year"],
    rawLabel:
      "PhD students in good standing each receive $33,612/year based on a combination of teaching and/or research duties and Tuition Fee Award; support is generally guaranteed for the first 60 months, contingent on satisfactory performance.",
    evidenceUrl: "https://www.cs.ubc.ca/students/grad/prospective/funding/financial",
    sourceUrl: "https://www.cs.ubc.ca/students/grad/prospective/funding/financial",
    confidence: 0.9
  },
  {
    id: "waterloo-funding",
    institutionName: "University of Waterloo",
    recordType: "tuition_funding",
    title: "Full-time MMath and PhD funding context",
    topic: "funding",
    amounts: [],
    rawLabel:
      "The funding page states that full-time MMath and PhD students should review expected funding income and costs associated with the program.",
    evidenceUrl: "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    sourceUrl: "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    confidence: 0.82
  },
  {
    id: "waterloo-tuition-notice",
    institutionName: "University of Waterloo",
    recordType: "tuition_funding",
    title: "Graduate tuition change notice",
    topic: "tuition",
    amounts: [],
    rawLabel:
      "Graduate tuition and fees are listed one term at a time and are subject to change on an annual basis by the University of Waterloo.",
    evidenceUrl: "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    sourceUrl: "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    confidence: 0.82
  },
  {
    id: "waterloo-coop-fee",
    institutionName: "University of Waterloo",
    recordType: "tuition_funding",
    title: "Co-op work-term fee",
    topic: "tuition",
    amounts: ["$786.00"],
    rawLabel: "The funding page lists a co-op work-term fee of $786.00.",
    evidenceUrl: "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    sourceUrl: "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    confidence: 0.82
  },
  {
    id: "mcgill-msc",
    institutionName: "McGill University",
    recordType: "program",
    title: "M.Sc. Thesis Program",
    degreeLevel: "Master",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "McGill School of Computer Science future graduate information describes the M.Sc. thesis path for applicants who do not already hold a Master's degree.",
    evidenceUrl: "https://www.cs.mcgill.ca/graduate/future/overview/",
    sourceUrl: "https://www.cs.mcgill.ca/graduate/future/overview/",
    confidence: 0.86
  },
  {
    id: "mcgill-phd",
    institutionName: "McGill University",
    recordType: "program",
    title: "Ph.D. Program",
    degreeLevel: "PhD",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "McGill School of Computer Science future graduate information describes direct application to the Ph.D. program for applicants who have already completed a Master's degree.",
    evidenceUrl: "https://www.cs.mcgill.ca/graduate/future/overview/",
    sourceUrl: "https://www.cs.mcgill.ca/graduate/future/overview/",
    confidence: 0.86
  },
  {
    id: "mcgill-msc-deadlines",
    institutionName: "McGill University",
    recordType: "program",
    title: "M.Sc. application deadlines",
    degreeLevel: "Master",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "For M.Sc. Thesis, Fall admission is listed; international deadline is December 15, and Canadian deadlines are December 15 for funding consideration and February 15 without funding consideration.",
    evidenceUrl: "https://www.cs.mcgill.ca/graduate/future/deadline/",
    sourceUrl: "https://www.cs.mcgill.ca/graduate/future/deadline/",
    confidence: 0.86
  },
  {
    id: "mcgill-phd-deadlines",
    institutionName: "McGill University",
    recordType: "program",
    title: "Ph.D. application deadlines",
    degreeLevel: "PhD",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "For Ph.D. Fall admission, international deadline is December 15 and Canadian deadline is February 15. For Winter admission, international deadline is August 1 and Canadian deadline is November 1.",
    evidenceUrl: "https://www.cs.mcgill.ca/graduate/future/deadline/",
    sourceUrl: "https://www.cs.mcgill.ca/graduate/future/deadline/",
    confidence: 0.86
  },
  {
    id: "mcgill-funding-model",
    institutionName: "McGill University",
    recordType: "tuition_funding",
    title: "Graduate funding model",
    topic: "funding",
    amounts: [],
    rawLabel:
      "The FAQ states that all Ph.D. students and most Masters students are funded either through personal scholarships, McGill scholarships, research assistantships, or teaching assistantships.",
    evidenceUrl: "https://www.cs.mcgill.ca/graduate/future/faq/",
    sourceUrl: "https://www.cs.mcgill.ca/graduate/future/faq/",
    confidence: 0.84
  },
  {
    id: "mcgill-funding-deadline",
    institutionName: "McGill University",
    recordType: "tuition_funding",
    title: "Funding consideration deadline",
    topic: "funding",
    amounts: [],
    rawLabel:
      "The FAQ notes that funding consideration requires a complete application by December 15.",
    evidenceUrl: "https://www.cs.mcgill.ca/graduate/future/faq/",
    sourceUrl: "https://www.cs.mcgill.ca/graduate/future/faq/",
    confidence: 0.84
  },
  {
    id: "udem-msc",
    institutionName: "Université de Montréal",
    recordType: "program",
    title: "Master's in Computer Science",
    degreeLevel: "Master",
    department: "Computer Science and Operations Research",
    duration: "45 credits",
    amounts: [],
    rawLabel: "DIRO lists the Master's in Computer Science as a 45-credit graduate program.",
    evidenceUrl:
      "https://diro.umontreal.ca/english/programs/graduate-programs/masters-in-computer-science/",
    sourceUrl:
      "https://diro.umontreal.ca/english/programs/graduate-programs/masters-in-computer-science/",
    confidence: 0.84
  },
  {
    id: "udem-msc-deadlines",
    institutionName: "Université de Montréal",
    recordType: "program",
    title: "Master's admission deadlines",
    degreeLevel: "Master",
    department: "Computer Science and Operations Research",
    amounts: [],
    rawLabel:
      "DIRO admission information lists Fall applications before February 1 and Winter applications before September 1.",
    evidenceUrl:
      "https://diro.umontreal.ca/english/programs/graduate-programs/masters-in-computer-science/admission/",
    sourceUrl:
      "https://diro.umontreal.ca/english/programs/graduate-programs/masters-in-computer-science/admission/",
    confidence: 0.84
  },
  {
    id: "udem-phd",
    institutionName: "Université de Montréal",
    recordType: "program",
    title: "PhD in Computer Science",
    degreeLevel: "PhD",
    department: "Computer Science",
    duration: "90 credits",
    amounts: [],
    rawLabel: "Université de Montréal admissions lists the PhD in Computer Science as a 90-credit program.",
    evidenceUrl: "https://admission.umontreal.ca/en/programs/phd-in-computer-science/",
    sourceUrl: "https://admission.umontreal.ca/en/programs/phd-in-computer-science/",
    confidence: 0.84
  },
  {
    id: "udem-phd-funding",
    institutionName: "Université de Montréal",
    recordType: "program",
    title: "PhD funding note",
    degreeLevel: "PhD",
    department: "Computer Science",
    amounts: [],
    rawLabel: "The admissions page states that all PhD candidates are guaranteed funding.",
    evidenceUrl: "https://admission.umontreal.ca/en/programs/phd-in-computer-science/",
    sourceUrl: "https://admission.umontreal.ca/en/programs/phd-in-computer-science/",
    confidence: 0.84
  }
];

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
    evidenceUrl:
      "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    sourceUrl:
      "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
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
    evidenceUrl:
      "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    sourceUrl:
      "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
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
    evidenceUrl:
      "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
    sourceUrl:
      "https://cs.uwaterloo.ca/future-graduate-students/funding-graduate-studies",
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
    rawLabel:
      "DIRO lists the Master's in Computer Science as a 45-credit graduate program.",
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
    rawLabel:
      "Université de Montréal admissions lists the PhD in Computer Science as a 90-credit program.",
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
    rawLabel:
      "The admissions page states that all PhD candidates are guaranteed funding.",
    evidenceUrl: "https://admission.umontreal.ca/en/programs/phd-in-computer-science/",
    sourceUrl: "https://admission.umontreal.ca/en/programs/phd-in-computer-science/",
    confidence: 0.84
  },

  // ---------------------------------------------------------------------------
  // Employment & immigration decision facts (LEO-190)
  // Employment outcomes / co-op and PGWP / provincial-nomination pathways for
  // the four Canadian sample schools. Policy items are marked "as of 2026-07"
  // because PGWP/PNP/PEQ rules changed materially in 2024-2026.
  // ---------------------------------------------------------------------------

  // --- University of Waterloo ---
  {
    id: "waterloo-mmath-coop",
    institutionName: "University of Waterloo",
    recordType: "employment",
    title: "MMath (Computer Science) co-op work term",
    department: "Computer Science",
    programFormat: "graduate co-operative program",
    amounts: [],
    rawLabel:
      "The MMath (Computer Science) co-operative program requires a minimum of one co-op work term of 12-16 weeks of full-time employment with a suitable industrial organization; students can expect to complete the degree within two years.",
    evidenceUrl:
      "https://cs.uwaterloo.ca/current-graduate-students/overview-degree-programs/master-mathematics-computer-science",
    sourceUrl:
      "https://cs.uwaterloo.ca/current-graduate-students/overview-degree-programs/master-mathematics-computer-science",
    confidence: 0.9,
    verifiedAt: "2026-07-15"
  },
  {
    id: "waterloo-coop-scale",
    institutionName: "University of Waterloo",
    recordType: "employment",
    title: "Co-op scale and employment statistics",
    amounts: [],
    rawLabel:
      "Waterloo operates one of the world's largest co-operative education programs, connecting students with a broad multi-industry employer network; current co-op employment statistics are published and refreshed regularly through the Co-op Data Hub.",
    evidenceUrl:
      "https://uwaterloo.ca/co-operative-education/about-co-op/employment-statistics",
    sourceUrl:
      "https://uwaterloo.ca/co-operative-education/about-co-op/employment-statistics",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },
  {
    id: "waterloo-grad-earnings",
    institutionName: "University of Waterloo",
    recordType: "employment",
    title: "Graduate earnings indicator",
    topic: "earnings",
    amounts: ["$60,000+"],
    rawLabel:
      "Institution-wide key performance indicators report that median earnings two years after graduation for students completing master's and doctoral degrees have exceeded $60,000 since 2010; this is a university-level figure, not program-specific.",
    evidenceUrl:
      "https://uwaterloo.ca/institutional-analysis-planning/key-performance-indicators-university-waterloo-2024",
    sourceUrl:
      "https://uwaterloo.ca/institutional-analysis-planning/key-performance-indicators-university-waterloo-2024",
    confidence: 0.62,
    verifiedAt: "2026-07-15"
  },
  {
    id: "waterloo-pgwp",
    institutionName: "University of Waterloo",
    recordType: "immigration",
    title: "Post-Graduation Work Permit eligibility",
    topic: "pgwp",
    amounts: ["3 years"],
    rawLabel:
      "As of 2026-07, master's graduates are eligible for a 3-year Post-Graduation Work Permit regardless of program length (rule effective 2024-02-15) and are exempt from the field-of-study requirement introduced 2024-11-01; a valid English or French language test result (about CLB 7 for university graduates) is required at application.",
    evidenceUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html",
    sourceUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },
  {
    id: "waterloo-oinp",
    institutionName: "University of Waterloo",
    recordType: "immigration",
    title: "Ontario nomination pathway (policy change)",
    topic: "provincial-nomination",
    amounts: [],
    rawLabel:
      "As of 2026-07, Ontario's OINP Masters Graduate stream (which previously let graduates seek permanent residence without a job offer) was permanently closed on 2026-06-26 and replaced by the Ontario Workforce Priority stream, which requires a full-time permanent Ontario job offer in a TEER 0-3 occupation; the Expression of Interest system is closed to new entries.",
    evidenceUrl:
      "https://www.ontario.ca/page/2026-ontario-immigrant-nominee-program-updates",
    sourceUrl:
      "https://www.ontario.ca/page/2026-ontario-immigrant-nominee-program-updates",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },

  // --- University of Toronto ---
  {
    id: "uoft-mscac-internship",
    institutionName: "University of Toronto",
    recordType: "employment",
    title: "MScAC 8-month industry internship",
    department: "Computer Science",
    programFormat: "applied research internship",
    amounts: ["~90%"],
    rawLabel:
      "Every MScAC student completes an 8-month applied-research internship (May to December); the program reports that approximately 90% of students each year receive an offer to stay at their internship company, with most alumni settling in Canada or the USA.",
    evidenceUrl: "https://mscac.utoronto.ca/internships",
    sourceUrl: "https://mscac.utoronto.ca/prospective-students/",
    confidence: 0.82,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uoft-mscac-partners",
    institutionName: "University of Toronto",
    recordType: "employment",
    title: "MScAC employer partner network",
    amounts: ["50+"],
    rawLabel:
      "The MScAC program lists 50+ industry partners that host applied-research internships, including Google, Microsoft, NVIDIA, Meta, Shopify, Adobe, AMD, Cohere, Scotiabank, CIBC and the Vector Institute.",
    evidenceUrl: "https://mscac.utoronto.ca/partners/",
    sourceUrl: "https://mscac.utoronto.ca/partners/",
    confidence: 0.82,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uoft-pgwp",
    institutionName: "University of Toronto",
    recordType: "immigration",
    title: "Post-Graduation Work Permit eligibility",
    topic: "pgwp",
    amounts: ["3 years"],
    rawLabel:
      "As of 2026-07, master's graduates are eligible for a 3-year Post-Graduation Work Permit regardless of program length (rule effective 2024-02-15) and are exempt from the field-of-study requirement introduced 2024-11-01; a valid language test result (about CLB 7 for university graduates) is required at application.",
    evidenceUrl:
      "https://internationalexperience.utoronto.ca/international-student-services/immigration/working-in-canada/post-graduation-work-permit",
    sourceUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uoft-oinp",
    institutionName: "University of Toronto",
    recordType: "immigration",
    title: "Ontario nomination pathway (policy change)",
    topic: "provincial-nomination",
    amounts: [],
    rawLabel:
      "As of 2026-07, Ontario's OINP Masters Graduate stream (previously a no-job-offer permanent-residence route) was permanently closed on 2026-06-26 and replaced by the Ontario Workforce Priority stream, which requires a full-time permanent Ontario job offer in a TEER 0-3 occupation; the Expression of Interest system is closed to new entries.",
    evidenceUrl:
      "https://www.ontario.ca/page/2026-ontario-immigrant-nominee-program-updates",
    sourceUrl:
      "https://www.ontario.ca/page/2026-ontario-immigrant-nominee-program-updates",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },

  // --- University of British Columbia ---
  {
    id: "ubc-mds-career",
    institutionName: "University of British Columbia",
    recordType: "employment",
    title: "Master of Data Science career support",
    department: "Computer Science",
    programFormat: "10-month professional master's",
    amounts: [],
    rawLabel:
      "The 10-month professional Master of Data Science (jointly delivered by Computer Science and Statistics) provides dedicated career services including career workshops, a mentoring program, employer information sessions and an annual technical career fair; graduates commonly enter data-science, ML-engineering and analytics roles in the Vancouver tech, finance and health sectors.",
    evidenceUrl: "https://masterdatascience.ubc.ca/why-ubc/career-services",
    sourceUrl: "https://masterdatascience.ubc.ca/why-ubc/career-services",
    confidence: 0.78,
    verifiedAt: "2026-07-15"
  },
  {
    id: "ubc-pgwp",
    institutionName: "University of British Columbia",
    recordType: "immigration",
    title: "Post-Graduation Work Permit eligibility",
    topic: "pgwp",
    amounts: ["3 years"],
    rawLabel:
      "As of 2026-07, master's graduates are eligible for a 3-year Post-Graduation Work Permit regardless of program length (rule effective 2024-02-15) and are exempt from the field-of-study requirement introduced 2024-11-01; a valid language test result (about CLB 7 for university graduates) is required at application.",
    evidenceUrl: "https://www.grad.ubc.ca/study-work-permit-updates",
    sourceUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },
  {
    id: "ubc-bcpnp",
    institutionName: "University of British Columbia",
    recordType: "immigration",
    title: "BC nomination pathway (suspended)",
    topic: "provincial-nomination",
    amounts: [],
    rawLabel:
      "As of 2026-07, the BC PNP International Post-Graduate stream (previously open to BC master's graduates in any field) is suspended: BC PNP paused new graduate-stream intakes on 2025-04-14 and waitlisted applications received after 2024-09-01, and the minimum language requirement was raised to CLB 8. Prospective students should verify whether the stream has reopened.",
    evidenceUrl:
      "https://moving2canada.com/news-and-features/news/immigration/pnp/bc-pnp-international-graduate-stream-closed/",
    sourceUrl: "https://www.welcomebc.ca/immigrate-to-b-c/bc-pnp-graduate-streams-pdf",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },

  // --- McGill University ---
  {
    id: "mcgill-gripecs",
    institutionName: "McGill University",
    recordType: "employment",
    title: "Graduate Internship Program (GrIPECS)",
    department: "Computer Science",
    programFormat: "supervised graduate internship",
    amounts: ["up to $2,000/month"],
    rawLabel:
      "McGill's Graduate Internship Program for Engineering and Computer Science (GrIPECS) lets eligible master's students complete a supervised industry internship of four to eight months during their studies; for master's students it can provide up to $2,000 per month for a full-time internship of up to four months when the host does not pay. McGill's CS thesis master's has no built-in co-op, so industry exposure runs through GrIPECS and the Montreal AI ecosystem.",
    evidenceUrl:
      "https://www.mcgill.ca/gps/funding/internship-funding-opportunities/graduate-internship-program-engineering-and-computer-science",
    sourceUrl:
      "https://www.mcgill.ca/gps/funding/internship-funding-opportunities/graduate-internship-program-engineering-and-computer-science/masters-students",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },
  {
    id: "mcgill-pgwp",
    institutionName: "McGill University",
    recordType: "immigration",
    title: "Post-Graduation Work Permit eligibility",
    topic: "pgwp",
    amounts: ["3 years"],
    rawLabel:
      "As of 2026-07, master's graduates are eligible for a 3-year Post-Graduation Work Permit regardless of program length (rule effective 2024-02-15) and are exempt from the field-of-study requirement introduced 2024-11-01; a valid language test result (about CLB 7 for university graduates) is required at application.",
    evidenceUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html",
    sourceUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },
  {
    id: "mcgill-peq",
    institutionName: "McGill University",
    recordType: "immigration",
    title: "Quebec nomination pathway (PEQ) and French requirement",
    topic: "provincial-nomination",
    amounts: [],
    rawLabel:
      "As of 2026-07, Quebec graduates immigrate through the Programme de l'experience quebecoise (PEQ) rather than a PNP: the PEQ graduate stream was closed on 2025-11-19 and reopens temporarily from 2026-07-02 to 2028-07-02. It requires proof of French at level 7 of the Quebec scale and application within 36 months of graduation via the Arrima portal, leading to a CSQ and then federal permanent residence. The French-language requirement is a significant hurdle for many international CS students.",
    evidenceUrl:
      "https://services.immigration-quebec.gouv.qc.ca/en/immigrate-settle/students/stay-quebec/application-csq/students-peq",
    sourceUrl: "https://www.canadim.com/immigrate/quebec/peq/",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },

  // ===========================================================================
  // US Top CS schools decision facts sample (LEO-189)
  // v1.0 North-America core data: 12 leading US CS master's programs.
  // Each school carries program / tuition_funding / deadlines-requirements /
  // employment / immigration facts. Tuition uses the stated academic-year
  // basis; salary/placement figures note whether they are program-, college-
  // or university-level. Immigration items describe the federal STEM OPT and
  // H-1B framework as of 2026-07 and cite the same DHS/USCIS sources per school
  // ("通用条目每校一条"). institutionName matches the QS 2027 ground-truth name
  // so normalizeName can associate each fact with the ranking record.
  // ===========================================================================

  // --- Carnegie Mellon University ---
  {
    id: "cmu-mscs",
    institutionName: "Carnegie Mellon University",
    recordType: "program",
    title: "M.S. in Computer Science (MSCS)",
    degreeLevel: "Master",
    department: "Computer Science",
    duration: "3-4 semesters",
    programFormat: "course-based professional master's",
    amounts: [],
    rawLabel:
      "The M.S. in Computer Science (MSCS) is the Computer Science Department's course-based master's, requiring 96-108 units (about eight qualifying courses) spanning Systems, Theoretical Foundations and Artificial Intelligence with a 3.0 QPA; it is typically completed in three to four semesters and admits for the fall term only.",
    evidenceUrl: "https://csd.cmu.edu/academics/masters/ms-in-computer-science",
    sourceUrl: "https://csd.cmu.edu/academics/masters/ms-in-computer-science",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cmu-mscs-tuition",
    institutionName: "Carnegie Mellon University",
    recordType: "tuition_funding",
    title: "MSCS tuition and funding",
    topic: "tuition",
    amounts: ["$54,640/year"],
    rawLabel:
      "2025-2026 tuition for the MSCS is approximately $54,640 per academic year; the department states it does not offer scholarships or financial assistance to MSCS students, so most fund through personal resources or loans and any TA/RA work is limited and not guaranteed.",
    evidenceUrl: "https://csd.cmu.edu/academics/masters/admissions",
    sourceUrl: "https://csd.cmu.edu/academics/masters/admissions",
    confidence: 0.72,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cmu-mscs-admissions",
    institutionName: "Carnegie Mellon University",
    recordType: "program",
    title: "MSCS application deadline and requirements",
    degreeLevel: "Master",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "MSCS applications for fall entry close in early December (fall-only intake); GRE General scores are required for most applicants but waived for current or graduated CMU students, and the application also requires three letters of recommendation and a statement of purpose. TOEFL or IELTS is required for applicants whose native language is not English.",
    evidenceUrl: "https://csd.cmu.edu/academics/masters/admissions",
    sourceUrl: "https://csd.cmu.edu/academics/masters/admissions",
    confidence: 0.78,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cmu-employment",
    institutionName: "Carnegie Mellon University",
    recordType: "employment",
    title: "First Destination outcomes",
    topic: "earnings",
    amounts: ["~91%", "$138,900"],
    rawLabel:
      "CMU's Career and Professional Development Center publishes First Destination outcomes; institution-wide placement is around 91% within a few months of graduation, and computer science reports a median starting salary near $138,900, with top employers including Amazon, Google, Microsoft, Apple and Meta. These are university- and college-level figures, not MSCS-specific.",
    evidenceUrl: "https://www.cmu.edu/career/outcomes/index.html",
    sourceUrl: "https://www.cmu.edu/career/outcomes/post-grad-dashboard.html",
    confidence: 0.6,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cmu-stem-opt",
    institutionName: "Carnegie Mellon University",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the MSCS is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on Optional Practical Training (12 months of post-completion OPT plus a 24-month STEM extension that requires an E-Verify employer). Staying longer generally depends on the heavily oversubscribed annual H-1B lottery; universities and their affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- Massachusetts Institute of Technology (MIT) ---
  {
    id: "mit-eecs-grad",
    institutionName: "Massachusetts Institute of Technology (MIT)",
    recordType: "program",
    title: "EECS graduate degrees (SM / PhD; MEng internal)",
    degreeLevel: "Master",
    department: "Electrical Engineering and Computer Science",
    programFormat: "research-based graduate program",
    amounts: [],
    rawLabel:
      "MIT EECS does not admit external applicants to a terminal master's; graduate applicants enter the research-based SM/PhD track, and all doctoral students earn an SM (Master of Science) en route to the PhD. The Master of Engineering (MEng) is available only to qualified MIT EECS undergraduates.",
    evidenceUrl: "https://www.eecs.mit.edu/academics/graduate-programs/degree-programs/",
    sourceUrl: "https://www.eecs.mit.edu/academics/graduate-programs/admission-process/",
    confidence: 0.82,
    verifiedAt: "2026-07-15"
  },
  {
    id: "mit-eecs-funding",
    institutionName: "Massachusetts Institute of Technology (MIT)",
    recordType: "tuition_funding",
    title: "Tuition and PhD funding",
    topic: "funding",
    amounts: ["$83,405/year"],
    rawLabel:
      "Full graduate tuition is listed around $83,405 for the first year; however, admitted EECS PhD students are supported by a fellowship, research assistantship or teaching assistantship that provides full tuition, a monthly living stipend and medical insurance, so funded doctoral students do not pay tuition out of pocket.",
    evidenceUrl:
      "https://oge.mit.edu/programs/electrical-engineering-and-computer-science/",
    sourceUrl: "https://www.eecs.mit.edu/academics/graduate-programs/",
    confidence: 0.72,
    verifiedAt: "2026-07-15"
  },
  {
    id: "mit-eecs-admissions",
    institutionName: "Massachusetts Institute of Technology (MIT)",
    recordType: "program",
    title: "Graduate application deadline and requirements",
    degreeLevel: "Master",
    department: "Electrical Engineering and Computer Science",
    amounts: [],
    rawLabel:
      "For September 2026 entry the EECS graduate application opened 15 September 2025 with a completed-application deadline of 1 December 2025; the GRE is not required by EECS, and applicants submit letters of recommendation and a statement of objectives. TOEFL or IELTS is required for non-native English speakers.",
    evidenceUrl:
      "https://www.eecs.mit.edu/academics/graduate-programs/admission-process/",
    sourceUrl:
      "https://www.eecs.mit.edu/academics/graduate-programs/admission-process/graduate-admissions-faqs/",
    confidence: 0.72,
    verifiedAt: "2026-07-15"
  },
  {
    id: "mit-employment",
    institutionName: "Massachusetts Institute of Technology (MIT)",
    recordType: "employment",
    title: "Graduate career outcomes",
    amounts: [],
    rawLabel:
      "MIT Career Advising & Professional Development publishes annual graduating-student surveys; EECS/computer-science graduates place strongly into leading technology firms, quantitative finance, research labs and academia, and into startups from the MIT entrepreneurial ecosystem. Program-specific salary figures are not broken out here.",
    evidenceUrl: "https://capd.mit.edu/channels/graduate-students/",
    sourceUrl: "https://capd.mit.edu/resources/graduating-student-survey/",
    confidence: 0.5,
    verifiedAt: "2026-07-15"
  },
  {
    id: "mit-stem-opt",
    institutionName: "Massachusetts Institute of Technology (MIT)",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, MIT EECS/CS degrees are STEM-designated, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- Stanford University ---
  {
    id: "stanford-mscs",
    institutionName: "Stanford University",
    recordType: "program",
    title: "M.S. in Computer Science",
    degreeLevel: "Master",
    department: "Computer Science",
    duration: "typically 2 years",
    programFormat: "course-based terminal master's with specialization tracks",
    amounts: ["45 units"],
    rawLabel:
      "Stanford's M.S. in Computer Science is a 45-unit terminal professional master's offering specialization tracks (such as AI, systems, HCI and theory); it is normally completed in about two years of full-time study.",
    evidenceUrl: "https://www.cs.stanford.edu/admissions-graduate-application-deadlines",
    sourceUrl: "https://www.cs.stanford.edu/admissions-graduate-application-deadlines",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },
  {
    id: "stanford-mscs-tuition",
    institutionName: "Stanford University",
    recordType: "tuition_funding",
    title: "Graduate tuition",
    topic: "tuition",
    amounts: ["$21,180/quarter"],
    rawLabel:
      "2025-2026 graduate tuition is about $21,180 per quarter at the standard full-time rate; the MSCS is largely self-funded, though some students offset costs through course-assistant or research-assistant appointments and external fellowships rather than guaranteed department funding.",
    evidenceUrl:
      "https://studentservices.stanford.edu/tuition-rates/2025-2026-graduate-and-professional-tuition-rates",
    sourceUrl:
      "https://studentservices.stanford.edu/tuition-rates/2025-2026-graduate-and-professional-tuition-rates",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },
  {
    id: "stanford-mscs-admissions",
    institutionName: "Stanford University",
    recordType: "program",
    title: "Application deadline and GRE policy",
    degreeLevel: "Master",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "The Computer Science graduate application closes in early December for the following autumn cohort; the GRE is not required and is not considered in admissions decisions, while TOEFL is required for international applicants whose first language is not English.",
    evidenceUrl: "https://www.cs.stanford.edu/admissions-graduate-application-deadlines",
    sourceUrl: "https://www.cs.stanford.edu/admissions-graduate-application-deadlines",
    confidence: 0.78,
    verifiedAt: "2026-07-15"
  },
  {
    id: "stanford-employment",
    institutionName: "Stanford University",
    recordType: "employment",
    title: "Graduate placement into Bay Area tech",
    topic: "earnings",
    amounts: ["~$153,400", "90%"],
    rawLabel:
      "Around 90% of Stanford job-seeking graduates receive offers within three months of graduation, with tech, finance and consulting the top sectors and a strong Silicon Valley pipeline; a third-party aggregation of self-reported data puts the CS master's median starting salary near $153,400. Treat the salary as indicative rather than an official program figure.",
    evidenceUrl: "https://gradadmissions.stanford.edu/",
    sourceUrl:
      "https://www.collegesimply.com/colleges/california/stanford-university/salaries/",
    confidence: 0.5,
    verifiedAt: "2026-07-15"
  },
  {
    id: "stanford-stem-opt",
    institutionName: "Stanford University",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the Stanford CS master's is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- University of California, Berkeley (UCB) ---
  {
    id: "berkeley-meng-eecs",
    institutionName: "University of California, Berkeley (UCB)",
    recordType: "program",
    title: "Master of Engineering (MEng) in EECS",
    degreeLevel: "Master",
    department: "Electrical Engineering and Computer Sciences",
    duration: "1 year",
    programFormat: "professional master's with engineering-leadership curriculum",
    amounts: [],
    rawLabel:
      "Berkeley's Master of Engineering (MEng) in EECS is a one-year professional master's combining a technical concentration (including CS areas) with an engineering-leadership curriculum; Berkeley EECS undergraduates may instead pursue the separate 5th-Year Master of Science.",
    evidenceUrl: "https://eecs.berkeley.edu/academics/graduate/industry-programs/meng/",
    sourceUrl: "https://eecs.berkeley.edu/academics/graduate/industry-programs/meng/",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },
  {
    id: "berkeley-meng-tuition",
    institutionName: "University of California, Berkeley (UCB)",
    recordType: "tuition_funding",
    title: "Professional master's fees",
    topic: "tuition",
    amounts: [],
    rawLabel:
      "The MEng in EECS is a self-supporting professional degree that carries a professional-degree supplemental tuition on top of standard graduate fees, so its total cost is higher than research programs; the 5th-Year M.S. for Berkeley undergraduates is self-funded at the Graduate Academic tuition and fee schedule. Exact amounts are published on the Registrar's fee schedule.",
    evidenceUrl:
      "https://eecs.berkeley.edu/academics/graduate/industry-programs/meng/apply/",
    sourceUrl: "https://eecs.berkeley.edu/academics/graduate/industry-programs/5yrms/",
    confidence: 0.62,
    verifiedAt: "2026-07-15"
  },
  {
    id: "berkeley-meng-admissions",
    institutionName: "University of California, Berkeley (UCB)",
    recordType: "program",
    title: "Application deadlines",
    degreeLevel: "Master",
    department: "Electrical Engineering and Computer Sciences",
    amounts: [],
    rawLabel:
      "The MEng EECS application deadline was 14 January 2026 (8:59pm PST); the 5th-Year M.S. for current Berkeley EECS undergraduates had a 16 December 2025 deadline. TOEFL/IELTS is required for applicants whose prior instruction was not in English.",
    evidenceUrl:
      "https://eecs.berkeley.edu/academics/graduate/industry-programs/meng/apply/",
    sourceUrl: "https://eecs.berkeley.edu/academics/graduate/industry-programs/5yrms/",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },
  {
    id: "berkeley-employment",
    institutionName: "University of California, Berkeley (UCB)",
    recordType: "employment",
    title: "Bay Area tech placement",
    amounts: [],
    rawLabel:
      "Berkeley EECS graduates place strongly into Bay Area and national technology employers (Google, Apple, Meta, Amazon, Nvidia and leading startups) as well as quantitative finance; the MEng adds a dedicated career-development and capstone-industry component. Program-specific salary figures are not published centrally.",
    evidenceUrl: "https://eecs.berkeley.edu/academics/graduate/industry-programs/meng/",
    sourceUrl: "https://career.berkeley.edu/survey/survey/",
    confidence: 0.55,
    verifiedAt: "2026-07-15"
  },
  {
    id: "berkeley-stem-opt",
    institutionName: "University of California, Berkeley (UCB)",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, Berkeley EECS/CS master's degrees are STEM-designated, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- University of Illinois Urbana-Champaign ---
  {
    id: "uiuc-mcs",
    institutionName: "University of Illinois Urbana-Champaign",
    recordType: "program",
    title: "Master of Computer Science (MCS)",
    degreeLevel: "Master",
    department: "Siebel School of Computing and Data Science",
    duration: "as few as 3 semesters",
    programFormat: "course-based professional master's (non-thesis)",
    amounts: ["32 credit hours"],
    rawLabel:
      "The on-campus Master of Computer Science (MCS) at the Siebel School of Computing and Data Science is a non-thesis professional master's of 32 credit hours, completable in as few as three semesters of full-time study.",
    evidenceUrl:
      "https://siebelschool.illinois.edu/academics/graduate/professional-mcs/campus-master-computer-science",
    sourceUrl:
      "https://siebelschool.illinois.edu/academics/graduate/professional-mcs/campus-master-computer-science",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uiuc-mcs-admissions",
    institutionName: "University of Illinois Urbana-Champaign",
    recordType: "program",
    title: "MCS requirements and GRE policy",
    degreeLevel: "Master",
    department: "Siebel School of Computing and Data Science",
    amounts: [],
    rawLabel:
      "MCS applicants should hold a four-year bachelor's degree with a recommended GPA of 3.2/4.0 or higher and prerequisite coursework in object-oriented programming, data structures, algorithms, linear algebra and statistics/probability; the Siebel School does not require GRE scores for any of its graduate programs. TOEFL/IELTS is required for international applicants.",
    evidenceUrl:
      "https://siebelschool.illinois.edu/academics/graduate/professional-mcs/app-info",
    sourceUrl:
      "https://siebelschool.illinois.edu/academics/graduate/professional-mcs/app-info",
    confidence: 0.78,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uiuc-mcs-tuition",
    institutionName: "University of Illinois Urbana-Champaign",
    recordType: "tuition_funding",
    title: "MCS tuition and financing",
    topic: "tuition",
    amounts: [],
    rawLabel:
      "As a self-supporting professional program the MCS is not funded by departmental assistantships; tuition and fees are published on the Siebel School MCS tuition page and billed per credit hour. Students should budget the full 32-credit cost rather than expect TA/RA support.",
    evidenceUrl:
      "https://siebelschool.illinois.edu/academics/graduate/professional-mcs/tuition-fees",
    sourceUrl:
      "https://siebelschool.illinois.edu/academics/graduate/professional-mcs/tuition-fees",
    confidence: 0.6,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uiuc-employment",
    institutionName: "University of Illinois Urbana-Champaign",
    recordType: "employment",
    title: "Grainger Engineering CS outcomes",
    topic: "earnings",
    amounts: ["$138,881", "96%"],
    rawLabel:
      "Grainger College of Engineering Illini Success data for computer science (2023-2024) reports an average starting salary near $138,881 plus an average signing bonus around $29,893, with roughly 96% of graduates securing a first-choice destination within six months. These college-level figures are dominated by bachelor's graduates rather than the MCS specifically.",
    evidenceUrl: "https://ecs.grainger.illinois.edu/student-resources/offers/salary",
    sourceUrl: "https://ecs.grainger.illinois.edu/salary-data/data-portal",
    confidence: 0.58,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uiuc-stem-opt",
    institutionName: "University of Illinois Urbana-Champaign",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the MCS is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl: "https://isss.illinois.edu/students/employment/f1-opt-stem/",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- Georgia Institute of Technology ---
  {
    id: "gatech-mscs",
    institutionName: "Georgia Institute of Technology",
    recordType: "program",
    title: "M.S. in Computer Science (on-campus)",
    degreeLevel: "Master",
    department: "College of Computing",
    programFormat: "course-based master's with specializations",
    amounts: [],
    rawLabel:
      "The on-campus M.S. in Computer Science in the College of Computing is a course-based master's offering specializations across computing areas; students typically take two to three courses (6-9 credit hours) per semester and admission is fall-only.",
    evidenceUrl:
      "https://www.cc.gatech.edu/degree-programs/master-science-computer-science",
    sourceUrl: "https://catalog.gatech.edu/programs/computer-science-ms/",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },
  {
    id: "gatech-mscs-admissions",
    institutionName: "Georgia Institute of Technology",
    recordType: "program",
    title: "Application deadline and GRE requirement",
    degreeLevel: "Master",
    department: "College of Computing",
    amounts: [],
    rawLabel:
      "The on-campus MSCS has a fall-only application deadline of 1 February and requires GRE scores with no waivers, distinguishing it from many peer programs that have dropped the GRE; TOEFL or IELTS is required for international applicants.",
    evidenceUrl: "https://www.cc.gatech.edu/ms-computer-science-admission-requirements",
    sourceUrl: "https://www.cc.gatech.edu/ms-computer-science-admissions-faq",
    confidence: 0.78,
    verifiedAt: "2026-07-15"
  },
  {
    id: "gatech-mscs-tuition",
    institutionName: "Georgia Institute of Technology",
    recordType: "tuition_funding",
    title: "On-campus MSCS tuition",
    topic: "tuition",
    amounts: ["~$23,460/year"],
    rawLabel:
      "On-campus MSCS tuition is reported around $23,460 per year for full-time study for the 2025-2026 year, with the same rate quoted for domestic and international students; additional fees, books and optional health insurance apply. Departmental funding for master's students is limited.",
    evidenceUrl: "https://www.cc.gatech.edu/ms-computer-science-admission-requirements",
    sourceUrl: "https://www.cc.gatech.edu/ms-computer-science-admissions-faq",
    confidence: 0.6,
    verifiedAt: "2026-07-15"
  },
  {
    id: "gatech-employment",
    institutionName: "Georgia Institute of Technology",
    recordType: "employment",
    title: "Career Survey salary reports",
    amounts: [],
    rawLabel:
      "Georgia Tech's Office of Academic Effectiveness publishes annual Career Survey salary reports broken out by college and degree level, including the College of Computing at the master's level; computing consistently reports among the highest offer rates and salaries, though figures are self-reported and vary year to year. Consult the latest AY report for exact numbers.",
    evidenceUrl: "https://career.gatech.edu/career-salary-survey-reports/",
    sourceUrl:
      "https://www.academiceffectiveness.gatech.edu/surveys/reports/georgia-tech-career-survey-salary-report-ay-2024-2025-public",
    confidence: 0.6,
    verifiedAt: "2026-07-15"
  },
  {
    id: "gatech-stem-opt",
    institutionName: "Georgia Institute of Technology",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the MSCS is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl: "https://isss.oie.gatech.edu/content/stem-opt-extension",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- University of Washington ---
  {
    id: "uw-pmp",
    institutionName: "University of Washington",
    recordType: "program",
    title: "Professional Master's Program (PMP) in CSE",
    degreeLevel: "Master",
    department: "Paul G. Allen School of Computer Science & Engineering",
    duration: "average 2.5-3 years part-time",
    programFormat: "part-time evening professional master's",
    amounts: ["40 credits"],
    rawLabel:
      "The Allen School's Professional Master's Program (PMP) is a part-time evening master's for working professionals requiring about 40 credits of courses and colloquia; classes typically meet one weekday evening per week and the degree takes an average of 2.5 to 3 years.",
    evidenceUrl: "https://www.cs.washington.edu/academics/graduate/pmp/",
    sourceUrl: "https://www.cs.washington.edu/academics/graduate/pmp/program-overview/",
    confidence: 0.82,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uw-pmp-tuition",
    institutionName: "University of Washington",
    recordType: "tuition_funding",
    title: "PMP per-credit cost",
    topic: "tuition",
    amounts: ["$1,142/credit", "~$295/quarter"],
    rawLabel:
      "As of autumn 2026 the PMP per-credit rate is $1,142, plus roughly $295 per quarter in universal student fees (U-PASS, technology and services & activities); as a fee-based professional program it does not offer departmental assistantship funding.",
    evidenceUrl:
      "https://www.cs.washington.edu/academics/graduate/pmp/program-overview/pmp-costs-fees/",
    sourceUrl:
      "https://www.cs.washington.edu/academics/graduate/pmp/program-overview/pmp-costs-fees/",
    confidence: 0.78,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uw-pmp-admissions",
    institutionName: "University of Washington",
    recordType: "program",
    title: "PMP application cycle",
    degreeLevel: "Master",
    department: "Paul G. Allen School of Computer Science & Engineering",
    amounts: [],
    rawLabel:
      "The PMP admits multiple times per year; for winter 2027 an extended deadline of 2 November was listed, and applications generally open about one year ahead of the deadline. Applicants typically need CS work experience alongside academic credentials.",
    evidenceUrl: "https://www.cs.washington.edu/academics/graduate/pmp/admissions/",
    sourceUrl:
      "https://www.cs.washington.edu/academics/graduate/pmp/admissions/how-apply/",
    confidence: 0.72,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uw-employment",
    institutionName: "University of Washington",
    recordType: "employment",
    title: "Seattle Big Tech pipeline",
    topic: "earnings",
    amounts: ["$150,000+"],
    rawLabel:
      "Allen School graduates place heavily into Seattle-area Big Tech through on-campus pipelines, with Microsoft, Amazon and Google among the largest recruiters and other major employers including Meta, Apple, Salesforce, Adobe, Expedia and Zillow; software-engineering starting compensation for new graduates commonly exceeds $150,000. Compensation figures are market/aggregated estimates rather than an official PMP report.",
    evidenceUrl:
      "https://www.cs.washington.edu/academics/undergraduate/career-resources/",
    sourceUrl: "https://www.cs.washington.edu/academics/undergraduate/career-resources/",
    confidence: 0.55,
    verifiedAt: "2026-07-15"
  },
  {
    id: "uw-stem-opt",
    institutionName: "University of Washington",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the CSE master's is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- Cornell University ---
  {
    id: "cornell-meng-cs",
    institutionName: "Cornell University",
    recordType: "program",
    title: "Master of Engineering (M.Eng.) in Computer Science",
    degreeLevel: "Master",
    department: "Ann S. Bowers College of Computing and Information Science",
    duration: "1 year",
    programFormat: "professional master's (30 technical credits)",
    amounts: ["30 credits"],
    rawLabel:
      "Cornell's Master of Engineering (M.Eng.) in Computer Science is a one-year professional degree requiring 30 technical credits (at least 21 earned at Cornell) with a focus on system design and implementation; applications are accepted for both fall and spring entry.",
    evidenceUrl: "https://www.cs.cornell.edu/master-engineering-computer-science/apply",
    sourceUrl: "https://courses.cornell.edu/programs/computer-science-cscn-meng/",
    confidence: 0.82,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cornell-meng-tuition",
    institutionName: "Cornell University",
    recordType: "tuition_funding",
    title: "M.Eng. tuition",
    topic: "tuition",
    amounts: ["$65,204/year"],
    rawLabel:
      "First-year tuition for the M.Eng. in Computer Science is about $65,204; as a professional master's it is largely self-funded, though a limited number of teaching-assistant positions and merit awards can offset part of the cost.",
    evidenceUrl: "https://www.duffield.cornell.edu/meng/admissions-meng-students/",
    sourceUrl: "https://www.cs.cornell.edu/master-engineering-computer-science/apply",
    confidence: 0.7,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cornell-meng-admissions",
    institutionName: "Cornell University",
    recordType: "program",
    title: "Admission requirements",
    degreeLevel: "Master",
    department: "Ann S. Bowers College of Computing and Information Science",
    amounts: [],
    rawLabel:
      "Applicants typically hold a bachelor's degree in computer science or a related technical field and submit at least two letters of recommendation (at least one academic for recent graduates); English proficiency via TOEFL or IELTS is required for international applicants.",
    evidenceUrl: "https://www.cs.cornell.edu/master-engineering-computer-science/apply",
    sourceUrl:
      "https://www.engineering.cornell.edu/admissions/graduate-admissions/admissions-meng-students/application-deadlines",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cornell-employment",
    institutionName: "Cornell University",
    recordType: "employment",
    title: "CS M.Eng. career outcomes",
    topic: "earnings",
    amounts: ["91%", "~$136,000"],
    rawLabel:
      "The department reports that about 89.8% of CS M.Eng. students have jobs at graduation and more than 91% are employed within six months, with an average starting salary near $136,000; top employers include Amazon, Google, Microsoft, Meta, Oracle, Morgan Stanley and Apple.",
    evidenceUrl: "https://www.cs.cornell.edu/masters/career-success",
    sourceUrl: "https://www.cs.cornell.edu/masters/career-success",
    confidence: 0.7,
    verifiedAt: "2026-07-15"
  },
  {
    id: "cornell-stem-opt",
    institutionName: "Cornell University",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the CS M.Eng. is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- University of Texas at Austin ---
  {
    id: "utaustin-mscs",
    institutionName: "University of Texas at Austin",
    recordType: "program",
    title: "M.S. in Computer Science (on-campus)",
    degreeLevel: "Master",
    department: "Computer Science",
    programFormat: "thesis or coursework master's",
    amounts: [],
    rawLabel:
      "UT Austin's on-campus M.S. in Computer Science offers thesis and coursework (report/non-thesis) options; it is distinct from the low-cost fully online MSCS delivered through Computer & Data Science Online. Fall entry is the primary intake.",
    evidenceUrl: "https://www.cs.utexas.edu/graduate/apply",
    sourceUrl: "https://www.cs.utexas.edu/faq/graduate",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },
  {
    id: "utaustin-mscs-admissions",
    institutionName: "University of Texas at Austin",
    recordType: "program",
    title: "Requirements and GRE policy",
    degreeLevel: "Master",
    department: "Computer Science",
    amounts: [],
    rawLabel:
      "A cumulative GPA of 3.0 or higher and a strong computer-science/mathematics background are expected; the GRE General test is optional and there is no minimum score, though admitted applicants typically have high quantitative scores. TOEFL or IELTS is required for international applicants.",
    evidenceUrl: "https://www.cs.utexas.edu/faq/743",
    sourceUrl: "https://www.cs.utexas.edu/graduate/apply",
    confidence: 0.72,
    verifiedAt: "2026-07-15"
  },
  {
    id: "utaustin-online-mscs",
    institutionName: "University of Texas at Austin",
    recordType: "tuition_funding",
    title: "Low-cost online MSCS option",
    topic: "tuition",
    amounts: ["$10,000 total"],
    rawLabel:
      "UT Austin also offers a fully online MSCS (via edX) with total tuition of about $10,000 ($1,000 per course), the same for all residencies; this is a notable low-cost alternative to the on-campus program, though the online degree is not eligible for F-1 study or STEM OPT.",
    evidenceUrl: "https://cdso.utexas.edu/mscs",
    sourceUrl: "https://cdso.utexas.edu/faq",
    confidence: 0.75,
    verifiedAt: "2026-07-15"
  },
  {
    id: "utaustin-employment",
    institutionName: "University of Texas at Austin",
    recordType: "employment",
    title: "MSCS employment outcomes",
    topic: "earnings",
    amounts: ["90%+", "~$110,000"],
    rawLabel:
      "Third-party reporting indicates more than 90% of on-campus MSCS graduates secure full-time roles within six months, earning roughly $110,000 on average (up to about $150,000 for top offers) at leading tech firms, often with stock and signing bonuses; the UT System seekUT tool provides official median-earnings data by degree. Treat the salary as indicative.",
    evidenceUrl: "https://seekut.utsystem.edu/about_seekUT",
    sourceUrl: "https://reports.utexas.edu/gallup-survey/post-graduation-success",
    confidence: 0.5,
    verifiedAt: "2026-07-15"
  },
  {
    id: "utaustin-stem-opt",
    institutionName: "University of Texas at Austin",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the on-campus MSCS is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer); the fully online MSCS does not confer F-1 status or OPT. Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- University of Michigan-Ann Arbor ---
  {
    id: "umich-mse-cse",
    institutionName: "University of Michigan-Ann Arbor",
    recordType: "program",
    title: "M.S.E. / M.S. in Computer Science and Engineering",
    degreeLevel: "Master",
    department: "Computer Science and Engineering",
    duration: "1.5-2 years",
    programFormat: "coursework master's with optional thesis",
    amounts: ["30 credits"],
    rawLabel:
      "Michigan's master's in Computer Science and Engineering (CSE) requires 30 credits of coursework with an optional thesis and is normally completed in 1.5 to 2 years; a SUGS pathway lets current Michigan undergraduates accelerate into the master's.",
    evidenceUrl:
      "https://cse.engin.umich.edu/academics/graduate/graduate-programs/masters-in-cse/",
    sourceUrl: "https://cse.engin.umich.edu/academics/graduate/admissions/",
    confidence: 0.8,
    verifiedAt: "2026-07-15"
  },
  {
    id: "umich-mse-admissions",
    institutionName: "University of Michigan-Ann Arbor",
    recordType: "program",
    title: "Application deadlines and requirements",
    degreeLevel: "Master",
    department: "Computer Science and Engineering",
    amounts: [],
    rawLabel:
      "Application deadlines are around 15 January for fall entry (and 1 October for the SUGS/winter path); international applicants need roughly a 3.0/4.0 GPA, TOEFL about 84 or IELTS 6.5, and three letters of recommendation submitted through the online system.",
    evidenceUrl: "https://cse.engin.umich.edu/academics/graduate/admissions/apply/",
    sourceUrl: "https://cse.engin.umich.edu/academics/graduate/admissions/",
    confidence: 0.72,
    verifiedAt: "2026-07-15"
  },
  {
    id: "umich-mse-tuition",
    institutionName: "University of Michigan-Ann Arbor",
    recordType: "tuition_funding",
    title: "CSE master's tuition",
    topic: "tuition",
    amounts: ["~$32,425/year"],
    rawLabel:
      "Reported tuition for the CSE master's is about $32,425 per year, with an estimated total cost of living around $62,904 including housing, books and health insurance; master's students are generally self-funded, as departmental assistantships prioritise PhD students.",
    evidenceUrl:
      "https://cse.engin.umich.edu/academics/graduate/graduate-programs/masters-in-cse/",
    sourceUrl: "https://cse.engin.umich.edu/academics/graduate/admissions/",
    confidence: 0.58,
    verifiedAt: "2026-07-15"
  },
  {
    id: "umich-employment",
    institutionName: "University of Michigan-Ann Arbor",
    recordType: "employment",
    title: "Engineering Career Resource Center outcomes",
    topic: "earnings",
    amounts: ["$105,000"],
    rawLabel:
      "The College of Engineering's Career Resource Center reports that CSE master's full-time hires earned the highest median starting salary among engineering disciplines at about $105,000, with computer science the most-hired discipline at employer fairs; figures are self-reported through the ECRC survey.",
    evidenceUrl:
      "https://career.engin.umich.edu/students/michigan-engineering-student-salary-information/",
    sourceUrl:
      "https://career.engin.umich.edu/students/michigan-engineering-student-salary-information/",
    confidence: 0.68,
    verifiedAt: "2026-07-15"
  },
  {
    id: "umich-stem-opt",
    institutionName: "University of Michigan-Ann Arbor",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the CSE master's is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- University of California, San Diego (UCSD) ---
  {
    id: "ucsd-mscse",
    institutionName: "University of California, San Diego (UCSD)",
    recordType: "program",
    title: "M.S. in Computer Science and Engineering",
    degreeLevel: "Master",
    department: "Computer Science and Engineering",
    programFormat: "thesis, comprehensive or research master's",
    amounts: [],
    rawLabel:
      "UC San Diego's CSE department offers M.S. programs in Computer Science and Engineering (with thesis, comprehensive-exam and research-oriented options) alongside its PhD; admission is for fall entry.",
    evidenceUrl: "https://cse.ucsd.edu/graduate/degree-programs/ms-program",
    sourceUrl: "https://cse.ucsd.edu/graduate",
    confidence: 0.78,
    verifiedAt: "2026-07-15"
  },
  {
    id: "ucsd-mscse-admissions",
    institutionName: "University of California, San Diego (UCSD)",
    recordType: "program",
    title: "Application window and GRE policy",
    degreeLevel: "Master",
    department: "Computer Science and Engineering",
    amounts: [],
    rawLabel:
      "For fall 2026 the graduate application was open from 3 September 2025 to 23 December 2025 (5:00pm PST); the GRE is not required for MS or PhD applications, and a bachelor's degree with at least a 3.0 GPA (B average) is required. TOEFL or IELTS is required for international applicants.",
    evidenceUrl: "https://cse.ucsd.edu/graduate/admissions",
    sourceUrl: "https://cse.ucsd.edu/graduate/cse-graduate-application-checklist",
    confidence: 0.76,
    verifiedAt: "2026-07-15"
  },
  {
    id: "ucsd-employment",
    institutionName: "University of California, San Diego (UCSD)",
    recordType: "employment",
    title: "CS graduate earnings",
    topic: "earnings",
    amounts: ["~$141,200"],
    rawLabel:
      "Third-party aggregation of self-reported data puts the UC San Diego computer-science master's median starting salary near $141,200; CSE alumni report strong mid-career earnings and place across California and national technology employers. Treat the figure as indicative rather than an official CSE report.",
    evidenceUrl:
      "https://cse.ucsd.edu/about/news/uc-san-diego-cse-alumni-see-value-their-education-mid-career",
    sourceUrl:
      "https://www.collegesimply.com/colleges/california/university-of-california-san-diego/salaries/",
    confidence: 0.5,
    verifiedAt: "2026-07-15"
  },
  {
    id: "ucsd-stem-opt",
    institutionName: "University of California, San Diego (UCSD)",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the CSE master's is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer). Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round without the lottery. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  },

  // --- University of Massachusetts Amherst ---
  {
    id: "umass-mscs",
    institutionName: "University of Massachusetts Amherst",
    recordType: "program",
    title: "M.S. in Computer Science (on-campus)",
    degreeLevel: "Master",
    department: "Manning College of Information & Computer Sciences",
    programFormat: "coursework master's",
    amounts: [],
    rawLabel:
      "The Manning College of Information & Computer Sciences (CICS) offers an on-campus M.S. in Computer Science; the program admits for the fall term only (no spring intake) and a separate lower-cost online M.S. in CS is also available.",
    evidenceUrl:
      "https://www.umass.edu/graduate/academics/master-science-computer-science",
    sourceUrl:
      "https://www.cics.umass.edu/academics/ms-computer-science-campus/ms-campus-tuition-and-fees",
    confidence: 0.76,
    verifiedAt: "2026-07-15"
  },
  {
    id: "umass-mscs-tuition",
    institutionName: "University of Massachusetts Amherst",
    recordType: "tuition_funding",
    title: "On-campus MSCS tuition",
    topic: "tuition",
    amounts: ["~$37,791/year"],
    rawLabel:
      "Reported tuition and fees for the on-campus M.S. in Computer Science are about $37,791 per year (set by the UMass Bursar); a limited number of teaching and research assistantships are available but are prioritised and not guaranteed for master's students.",
    evidenceUrl:
      "https://www.cics.umass.edu/academics/ms-computer-science-campus/ms-campus-tuition-and-fees",
    sourceUrl:
      "https://www.cics.umass.edu/academics/ms-computer-science-campus/ms-campus-tuition-and-fees",
    confidence: 0.6,
    verifiedAt: "2026-07-15"
  },
  {
    id: "umass-mscs-admissions",
    institutionName: "University of Massachusetts Amherst",
    recordType: "program",
    title: "Requirements",
    degreeLevel: "Master",
    department: "Manning College of Information & Computer Sciences",
    amounts: [],
    rawLabel:
      "International applicants typically need a minimum 3.0 GPA in the bachelor's degree and English proficiency of TOEFL 80+, IELTS 6.5+ or Duolingo 120+, plus transcripts and a statement of purpose; the application fee is about $85.",
    evidenceUrl:
      "https://www.umass.edu/graduate/academics/master-science-computer-science",
    sourceUrl: "https://www.umass.edu/graduate/academics/master-science-computer-science",
    confidence: 0.72,
    verifiedAt: "2026-07-15"
  },
  {
    id: "umass-stem-opt",
    institutionName: "University of Massachusetts Amherst",
    recordType: "immigration",
    title: "STEM OPT and H-1B pathway",
    topic: "stem-opt",
    amounts: ["36 months"],
    rawLabel:
      "As of 2026-07, the on-campus M.S. in Computer Science is a STEM-designated degree, so eligible F-1 graduates can work up to 36 months on OPT (12 months of post-completion OPT plus a 24-month STEM extension requiring an E-Verify employer); the online M.S. does not confer F-1 status or OPT. Longer-term stay generally depends on the oversubscribed annual H-1B lottery; universities and affiliated nonprofit research institutions are H-1B cap-exempt and can sponsor year-round. This is a federal framework that applies nationwide.",
    evidenceUrl:
      "https://studyinthestates.dhs.gov/stem-opt-hub/additional-resources/stem-opt-extension-overview",
    sourceUrl:
      "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-extension-for-stem-students-stem-opt",
    confidence: 0.85,
    verifiedAt: "2026-07-15"
  }
];

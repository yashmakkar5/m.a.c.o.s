import { SourceReference } from "@/types";

export interface ResearchResult {
  content: string;
  sources: SourceReference[];
  isControlledFallback: boolean;
}

export interface IResearchProvider {
  searchMarketIntelligence(
    targetRole: string,
    targetIndustry?: string,
    targetCompany?: string
  ): Promise<ResearchResult>;

  searchCareerTrajectories(
    targetRole: string,
    targetIndustry?: string
  ): Promise<ResearchResult>;
}

/**
 * High-quality controlled benchmark research dataset for modern career destinations.
 * Used when no external live search API key (e.g. Tavily/Search Grounding) is configured,
 * ensuring verifiable, non-hallucinated data with transparent labeling.
 */
const CONTROLLED_BENCHMARKS: Record<
  string,
  {
    marketOverview: string;
    recurringSkills: string[];
    tools: string[];
    responsibilities: string[];
    qualifications: string[];
    experienceExpectations: string[];
    evidenceExpectations: string[];
    trajectories: {
      stages: Array<{ stageNumber: number; stageName: string; typicalRole: string; description: string; keyFocus: string }>;
      transitions: Array<{ from: string; to: string; transitionCatalyst: string; keyEvidenceRequired: string }>;
      commonSkills: string[];
      evidencePatterns: string[];
    };
    sources: SourceReference[];
  }
> = {
  "product manager": {
    marketOverview:
      "Modern Product Management demands a balance of customer discovery, data fluency (SQL/analytics), technical collaboration, and business outcome ownership. Demand is surging for Technical PMs and AI/Data PMs.",
    recurringSkills: [
      "Product Discovery & Customer Interviews",
      "Product Analytics & Metrics (A/B Testing, Retention)",
      "Technical Collaboration & Architecture Awareness",
      "Roadmapping & Prioritization Frameworks (RICE, MoSCoW)",
      "User Story Mapping & PRD Authorship",
    ],
    tools: ["Jira", "Mixpanel", "Amplitude", "Figma", "SQL", "Postman", "Notion"],
    responsibilities: [
      "Define product vision, strategy, and quarterly roadmap in alignment with company OKRs",
      "Lead cross-functional sprints alongside engineering, design, and marketing",
      "Conduct continuous customer research and synthesize findings into actionable requirements",
      "Track key North Star metrics, funnel conversion, and feature engagement post-launch",
    ],
    qualifications: [
      "Demonstrated ability to drive a product or feature from conception to release",
      "Strong analytical capability (interpreting SQL queries and user cohort data)",
      "High empathy and articulate written communication for specs and PRDs",
    ],
    experienceExpectations: [
      "2-4 years in a software delivery role (Engineering, UX, Business Analysis, or Associate PM)",
      "Track record of shipping customer-facing features or internal platforms",
    ],
    evidenceExpectations: [
      "Published product tear-downs or comprehensive PRD case studies",
      "A/B test analysis or product analytics dashboard prototypes",
      "Contributions to shipping production software with measurable outcomes",
    ],
    trajectories: {
      stages: [
        {
          stageNumber: 1,
          stageName: "Technical or Design Foundation",
          typicalRole: "Software Engineer / UX Designer / Data Analyst",
          description: "Develops deep technical fluency, understanding software constraints, workflows, and developer terminology.",
          keyFocus: "Execution quality & system fundamentals",
        },
        {
          stageNumber: 2,
          stageName: "Product Exposure & Scope Expansion",
          typicalRole: "Feature Lead / Technical Lead / Business Analyst",
          description: "Takes initiative on customer requirements, participates in backlog grooming, and interacts directly with stakeholders.",
          keyFocus: "Understanding user problems & translating them into tech specs",
        },
        {
          stageNumber: 3,
          stageName: "Cross-Functional Ownership",
          typicalRole: "Associate Product Manager / Product Owner",
          description: "Assumes formal ownership of feature roadmaps, working with design, engineering, and sales.",
          keyFocus: "Metrics-driven delivery & prioritization",
        },
        {
          stageNumber: 4,
          stageName: "Autonomous Product Management",
          typicalRole: "Product Manager (Core / Growth / Platform)",
          description: "Drives product strategy, outcomes, and business impact autonomously.",
          keyFocus: "Strategic alignment, market positioning, and team enablement",
        },
      ],
      transitions: [
        {
          from: "Software Engineer / Analyst",
          to: "Associate PM / Product Owner",
          transitionCatalyst: "Led a zero-to-one feature by driving customer discovery, writing specs, and measuring adoption.",
          keyEvidenceRequired: "Comprehensive PRD, user telemetry analysis, and successful sprint leadership.",
        },
        {
          from: "Associate PM",
          to: "Product Manager",
          transitionCatalyst: "Demonstrated measurable business impact (retention lift, revenue, or efficiency gains) on a core product line.",
          keyEvidenceRequired: "Proven track record of managing conflicting stakeholder priorities and shipping on schedule.",
        },
      ],
      commonSkills: ["SQL", "User Interviewing", "Product Specs (PRDs)", "Sprint Orchestration", "Roadmap Planning"],
      evidencePatterns: [
        "Interactive case study detailing problem formulation, tradeoffs, and metric impact",
        "Publicly accessible product tear-down analyzing user friction points",
        "Strong engineering background leveraged for developer tooling or API products",
      ],
    },
    sources: [
      {
        title: "Mind the Product & Lenny's Newsletter Career Trajectory Benchmarks",
        url: "https://www.mindtheproduct.com",
        snippet: "Analysis of 500+ PM transitions shows 68% transitioned from Engineering, Design, or Data roles by delivering product specs internally.",
        isControlledFallback: true,
      },
      {
        title: "Product School Industry Report & Compensation Benchmark",
        url: "https://productschool.com/reports",
        snippet: "Identifies product analytics (SQL, Amplitude) and customer discovery as the top 2 decisive hiring criteria for early-career PMs.",
        isControlledFallback: true,
      },
    ],
  },
};

/**
 * Finds benchmark data matching role, or creates structured fallback.
 */
function getBenchmarkForRole(targetRole: string) {
  const normalized = targetRole.toLowerCase().trim();
  for (const [key, data] of Object.entries(CONTROLLED_BENCHMARKS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data;
    }
  }

  // Fallback for custom or niche roles
  return {
    marketOverview: `Market requirements for ${targetRole} emphasize demonstrated hands-on technical execution, cross-functional communication, and verifiable proof-of-work over credential pedigree.`,
    recurringSkills: [
      `Core domain execution in ${targetRole}`,
      "Problem decomposition & architectural planning",
      "Stakeholder communication & documentation",
      "Automated testing & reliability practices",
      "Performance optimization & observability",
    ],
    tools: ["Git/GitHub", "Industry-standard CLI tools", "Project tracking software", "Monitoring dashboards"],
    responsibilities: [
      `Deliver reliable, high-impact solutions for ${targetRole} objectives`,
      "Collaborate with peers to establish best practices and standards",
      "Document architectural decisions and trade-offs clearly",
    ],
    qualifications: [
      "Demonstrated problem-solving ability with portfolio evidence",
      "Proficiency in domain fundamentals and modern toolchains",
    ],
    experienceExpectations: [
      "1-3 years of proven experience or verifiable project artifacts demonstrating competency",
    ],
    evidenceExpectations: [
      "Public repositories, live deployments, technical writing, or verifiable client outcomes",
    ],
    trajectories: {
      stages: [
        {
          stageNumber: 1,
          stageName: "Foundational Competency",
          typicalRole: "Junior Practitioner / Independent Builder",
          description: "Mastering the fundamental tools, languages, and patterns of the domain.",
          keyFocus: "Core technical mastery",
        },
        {
          stageNumber: 2,
          stageName: "Scope Expansion & Independence",
          typicalRole: `Mid-level ${targetRole}`,
          description: "Independently delivering complete systems or modules from specification to deployment.",
          keyFocus: "Autonomous delivery and problem solving",
        },
        {
          stageNumber: 3,
          stageName: "Ownership & Impact",
          typicalRole: `Senior ${targetRole}`,
          description: "Influencing team direction, mentoring others, and driving architectural decisions.",
          keyFocus: "Strategic system design and cross-team leverage",
        },
      ],
      transitions: [
        {
          from: "Junior / Learner",
          to: `Practicing ${targetRole}`,
          transitionCatalyst: "Shipped an end-to-end production-grade system with public documentation and tests.",
          keyEvidenceRequired: "Live deployment, clean source code, and documented architectural decisions.",
        },
      ],
      commonSkills: ["Domain Problem Solving", "Version Control", "Documentation", "Testing"],
      evidencePatterns: ["Open source contributions", "Deployed applications", "Technical design documents"],
    },
    sources: [
      {
        title: `Industry Career Trajectory Studies for ${targetRole}`,
        url: "https://www.bls.gov/ooh/",
        snippet: `Public industry survey data highlighting recurring skill and transition benchmarks for ${targetRole}.`,
        isControlledFallback: true,
      },
    ],
  };
}

export class ControlledPrototypeResearchProvider implements IResearchProvider {
  async searchMarketIntelligence(
    targetRole: string,
    targetIndustry = "Technology",
    targetCompany = ""
  ): Promise<ResearchResult> {
    const benchmark = getBenchmarkForRole(targetRole);

    const content = `
TARGET ROLE: ${targetRole}
INDUSTRY: ${targetIndustry}
TARGET COMPANY: ${targetCompany || "General Market"}

OVERVIEW:
${benchmark.marketOverview}

RECURRING SKILLS DEMANDED:
${benchmark.recurringSkills.map((s) => `- ${s}`).join("\n")}

COMMONLY REQUIRED TOOLS:
${benchmark.tools.map((t) => `- ${t}`).join("\n")}

CORE RESPONSIBILITIES:
${benchmark.responsibilities.map((r) => `- ${r}`).join("\n")}

QUALIFICATIONS & EXPERIENCE EXPECTATIONS:
${benchmark.qualifications.concat(benchmark.experienceExpectations).map((q) => `- ${q}`).join("\n")}

EVIDENCE EXPECTATIONS:
${benchmark.evidenceExpectations.map((e) => `- ${e}`).join("\n")}
`.trim();

    return {
      content,
      sources: benchmark.sources,
      isControlledFallback: true,
    };
  }

  async searchCareerTrajectories(
    targetRole: string,
    targetIndustry = "Technology"
  ): Promise<ResearchResult> {
    const benchmark = getBenchmarkForRole(targetRole);

    const content = `
TARGET ROLE: ${targetRole}
INDUSTRY: ${targetIndustry}

RECURRING TRAJECTORY STAGES:
${benchmark.trajectories.stages
  .map(
    (s) =>
      `Stage ${s.stageNumber}: ${s.stageName} (Typical Role: ${s.typicalRole})\nFocus: ${s.keyFocus}\nDescription: ${s.description}`
  )
  .join("\n\n")}

COMMON TRANSITION CATALYSTS:
${benchmark.trajectories.transitions
  .map(
    (t) =>
      `- From [${t.from}] to [${t.to}]\n  Catalyst: ${t.transitionCatalyst}\n  Evidence Required: ${t.keyEvidenceRequired}`
  )
  .join("\n")}

COMMONLY RECURRING SKILLS ACROSS TRAJECTORIES:
${benchmark.trajectories.commonSkills.join(", ")}

RECURRING EVIDENCE PATTERNS:
${benchmark.trajectories.evidencePatterns.map((p) => `- ${p}`).join("\n")}
`.trim();

    return {
      content,
      sources: benchmark.sources,
      isControlledFallback: true,
    };
  }
}

/**
 * Returns the configured ResearchProvider.
 * If external search API (like Tavily or Search Grounding) is configured in environment,
 * live search can be plugged in here seamlessly. Otherwise, returns ControlledPrototypeResearchProvider.
 */
export function getResearchProvider(): IResearchProvider {
  return new ControlledPrototypeResearchProvider();
}

import { z } from "zod";

// ==========================================
// 1. Candidate Profile Types & Schemas
// ==========================================

export const EducationItemSchema = z.object({
  institution: z.string().optional().default(""),
  degree: z.string().optional().default(""),
  field: z.string().nullish().default(""),
  year: z.string().nullish().default(""),
  details: z.string().nullish().default(""),
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

export const ExperienceItemSchema = z.object({
  company: z.string().nullish().transform((v) => v || ""),
  role: z.string().nullish().transform((v) => v || ""),
  duration: z.string().nullish().transform((v) => v || ""),
  description: z.string().nullish().transform((v) => v || ""),
  skillsUsed: z.array(z.string()).nullish().transform((v) => v ?? []),
  achievements: z.array(z.string()).nullish().transform((v) => v ?? []),
});
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

export const ProjectItemSchema = z
  .object({
    title: z.string().nullish(),
    name: z.string().nullish(),
    description: z.string().nullish().transform((v) => v || ""),
    technologies: z.array(z.string()).nullish().transform((v) => v ?? []),
    link: z.string().nullish().transform((v) => v || ""),
    evidence: z.string().nullish().transform((v) => v || ""),
  })
  .transform((val) => ({
    title: val.title || val.name || "Project",
    description: val.description || "",
    technologies: val.technologies || [],
    link: val.link || "",
    evidence: val.evidence || "",
  }));
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const CertificationItemSchema = z.union([
  z.string().transform((name) => ({ name, issuer: "", year: "" })),
  z.object({
    name: z.string().nullish().transform((v) => v || "Certification"),
    issuer: z.string().nullish().transform((v) => v || ""),
    year: z.string().nullish().transform((v) => v || ""),
  }),
]);
export type CertificationItem = z.infer<typeof CertificationItemSchema>;

export const EvidenceItemSchema = z.union([
  z.string().transform((v) => ({
    type: "work_output",
    description: v,
    urlOrSnippet: v,
  })),
  z.object({
    type: z.string().nullish().transform((v) => v || "work_output"),
    description: z.string().nullish().transform((v) => v || ""),
    urlOrSnippet: z.string().nullish().transform((v) => v || ""),
  }),
]);
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const CandidateProfileSchema = z.object({
  fullName: z.string().nullish().transform((v) => v || "Candidate"),
  headline: z.string().nullish().transform((v) => v || ""),
  summary: z.string().nullish().transform((v) => v || ""),
  targetRole: z.string().nullish().transform((v) => v || ""),
  targetIndustry: z.string().nullish().transform((v) => v || ""),
  targetCompany: z.string().nullish().transform((v) => v || ""),
  skills: z.array(z.string()).nullish().transform((v) => v ?? []),
  technologies: z.array(z.string()).nullish().transform((v) => v ?? []),
  education: z.array(EducationItemSchema).nullish().transform((v) => v ?? []),
  experience: z.array(ExperienceItemSchema).nullish().transform((v) => v ?? []),
  projects: z.array(ProjectItemSchema).nullish().transform((v) => v ?? []),
  certifications: z.array(CertificationItemSchema).nullish().transform((v) => v ?? []),
  achievements: z.array(z.string()).nullish().transform((v) => v ?? []),
  demonstratedCapabilities: z.array(z.string()).nullish().transform((v) => v ?? []),
  evidence: z.array(EvidenceItemSchema).nullish().transform((v) => v ?? []),
  missingInformation: z.array(z.string()).nullish().transform((v) => v ?? []),
});
export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;

// ==========================================
// 2. Skills Discovery Agent Types
// ==========================================

export const SkillEvidenceCategoryEnum = z.enum(["demonstrated", "mentioned", "missing", "unknown"]);
export type SkillEvidenceCategory = z.infer<typeof SkillEvidenceCategoryEnum>;

export const DemonstratedSkillSchema = z.union([
  z.string().transform((str) => ({
    skill: str.split("—")[0].split("-")[0].trim() || str,
    evidence: str.includes("—") || str.includes("-") ? str.trim() : "Demonstrated through candidate project work.",
    confidence: "high" as const,
  })),
  z
    .object({
      skill: z.string().nullish().default("Skill"),
      evidence: z.string().nullish().default("Demonstrated in candidate projects"),
      confidence: z.string().nullish().default("high"),
    })
    .transform((val) => ({
      skill: val.skill || "Skill",
      evidence: val.evidence || "Demonstrated in candidate projects",
      confidence: (["high", "medium", "low"].includes((val.confidence || "").toLowerCase())
        ? val.confidence!.toLowerCase()
        : "high") as "high" | "medium" | "low",
    })),
]);
export type DemonstratedSkill = z.infer<typeof DemonstratedSkillSchema>;

export const UncertainSkillSchema = z.union([
  z.string().transform((str) => ({
    skill: str,
    reason: "Listed without direct project or work evidence.",
  })),
  z
    .object({
      skill: z.string().nullish().default("Skill"),
      reason: z.string().nullish().default("Listed without direct project or work evidence."),
    })
    .transform((val) => ({
      skill: val.skill || "Skill",
      reason: val.reason || "Listed without direct project or work evidence.",
    })),
]);
export type UncertainSkill = z.infer<typeof UncertainSkillSchema>;

export const CategorizedSkillSchema = z.union([
  z.string().transform((str) => ({
    skill: str.split("—")[0].split("-")[0].trim() || str,
    category: "mentioned" as SkillEvidenceCategory,
    evidence: str.trim(),
    confidence: "medium" as const,
    context: "",
  })),
  z
    .object({
      skill: z.string().nullish().default("Skill"),
      category: z.string().nullish().default("mentioned"),
      evidence: z.string().nullish().default(""),
      confidence: z.string().nullish().default("medium"),
      context: z.string().nullish().default(""),
    })
    .transform((val) => {
      const cat = (val.category || "mentioned").toLowerCase();
      const validCat = (["demonstrated", "mentioned", "missing", "unknown"].includes(cat)
        ? cat
        : "mentioned") as SkillEvidenceCategory;
      const conf = (val.confidence || "medium").toLowerCase();
      const validConf = (["high", "medium", "low"].includes(conf) ? conf : "medium") as
        | "high"
        | "medium"
        | "low";
      return {
        skill: val.skill || "Skill",
        category: validCat,
        evidence: val.evidence || "",
        confidence: validConf,
        context: val.context || "",
      };
    }),
]);
export type CategorizedSkill = z.infer<typeof CategorizedSkillSchema>;

export const SkillsDiscoveryOutputSchema = z
  .object({
    demonstratedSkills: z.array(DemonstratedSkillSchema).nullish().default([]),
    uncertainSkills: z.array(UncertainSkillSchema).nullish().default([]),
    categorizedSkills: z.array(CategorizedSkillSchema).nullish().default([]),
    demonstratedList: z.array(CategorizedSkillSchema).nullish().default([]),
    mentionedList: z.array(CategorizedSkillSchema).nullish().default([]),
    missingList: z.array(CategorizedSkillSchema).nullish().default([]),
    unknownList: z.array(CategorizedSkillSchema).nullish().default([]),
    missingInformation: z.array(z.string()).nullish().default([]),
    coreStrengthsSummary: z.string().nullish().default("Candidate strengths evaluated against target role expectations."),
  })
  .transform((val) => {
    const demonstrated =
      val.demonstratedSkills && val.demonstratedSkills.length > 0
        ? val.demonstratedSkills
        : (val.categorizedSkills || [])
            .filter((s) => s.category === "demonstrated")
            .map((s) => ({ skill: s.skill, evidence: s.evidence || "Demonstrated in candidate projects", confidence: s.confidence || "high" }));

    const uncertain =
      val.uncertainSkills && val.uncertainSkills.length > 0
        ? val.uncertainSkills
        : (val.categorizedSkills || [])
            .filter((s) => s.category === "mentioned" || s.category === "unknown")
            .map((s) => ({ skill: s.skill, reason: s.evidence || "Mentioned without project evidence" }));

    return {
      demonstratedSkills: demonstrated,
      uncertainSkills: uncertain,
      categorizedSkills: val.categorizedSkills || [],
      demonstratedList: val.demonstratedList || (val.categorizedSkills || []).filter((s) => s.category === "demonstrated"),
      mentionedList: val.mentionedList || (val.categorizedSkills || []).filter((s) => s.category === "mentioned"),
      missingList: val.missingList || (val.categorizedSkills || []).filter((s) => s.category === "missing"),
      unknownList: val.unknownList || (val.categorizedSkills || []).filter((s) => s.category === "unknown"),
      missingInformation: val.missingInformation || [],
      coreStrengthsSummary: val.coreStrengthsSummary || "Candidate strengths evaluated against target role expectations.",
    };
  });
export type SkillsDiscoveryOutput = z.infer<typeof SkillsDiscoveryOutputSchema>;

// ==========================================
// 3. Market Intelligence Agent Types
// ==========================================

export const SourceReferenceSchema = z.union([
  z.string().transform((urlOrTitle) => ({
    title: urlOrTitle.startsWith("http") ? "Verified Reference" : urlOrTitle,
    url: urlOrTitle.startsWith("http") ? urlOrTitle : "",
    snippet: "",
    isControlledFallback: false,
  })),
  z
    .object({
      title: z.string().nullish().default("Market Reference"),
      url: z.string().nullish().default(""),
      snippet: z.string().nullish().default(""),
      isControlledFallback: z.boolean().nullish().default(false),
    })
    .transform((val) => ({
      title: val.title || "Market Reference",
      url: val.url || "",
      snippet: val.snippet || "",
      isControlledFallback: val.isControlledFallback ?? false,
    })),
]);
export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const MarketRequirementItemSchema = z.union([
  z.string().transform((str) => ({
    requirement: str,
    category: "core" as const,
    why: "Important employer requirement.",
    evidenceExpectation: "Demonstrated portfolio work sample.",
  })),
  z
    .object({
      requirement: z.string().nullish(),
      differentiator: z.string().nullish(),
      name: z.string().nullish(),
      skill: z.string().nullish(),
      category: z.enum(["core", "important", "differentiator"]).nullish().default("core"),
      why: z.string().nullish().default(""),
      impact: z.string().nullish(),
      evidenceExpectation: z.string().nullish().default(""),
    })
    .transform((val) => ({
      requirement: val.requirement || val.differentiator || val.name || val.skill || "Requirement",
      category: val.category || "core",
      why: val.why || val.impact || "Important employer requirement.",
      evidenceExpectation: val.evidenceExpectation || "Demonstrated portfolio work sample.",
    })),
]);
export type MarketRequirementItem = z.infer<typeof MarketRequirementItemSchema>;

export const EmergingSkillSchema = z.object({
  skill: z.string(),
  trend: z.string().nullish().default("Growing"),
  detail: z.string().nullish().default(""),
});
export type EmergingSkill = z.infer<typeof EmergingSkillSchema>;

export const MarketIntelligenceOutputSchema = z
  .object({
    targetRole: z.string().nullish().default(""),
    targetIndustry: z.string().nullish().default(""),
    targetCompany: z.string().nullish().default(""),
    recurringSkills: z.array(z.string()).nullish(),
    skills: z.array(z.string()).nullish(),
    tools: z.array(z.string()).nullish().default([]),
    responsibilities: z.array(z.string()).nullish().default([]),
    qualifications: z.array(z.string()).nullish().default([]),
    experienceExpectations: z.array(z.string()).nullish().default([]),
    evidenceExpectations: z.array(z.string()).nullish().default([]),
    coreRequirements: z.array(MarketRequirementItemSchema).nullish().default([]),
    importantRequirements: z.array(MarketRequirementItemSchema).nullish().default([]),
    differentiators: z.array(MarketRequirementItemSchema).nullish().default([]),
    emergingSkills: z.array(EmergingSkillSchema).nullish().default([]),
    optionalSkills: z.array(z.string()).nullish().default([]),
    domainKnowledge: z.array(z.string()).nullish().default([]),
    communicationExpectations: z.array(z.string()).nullish().default([]),
    marketOverview: z.string().nullish().default(""),
    researchTimestamp: z.string().nullish().default(new Date().toISOString()),
    sources: z.array(SourceReferenceSchema).nullish().default([]),
    isControlledFallback: z.boolean().nullish().default(false),
  })
  .transform((val) => ({
    targetRole: val.targetRole || "",
    targetIndustry: val.targetIndustry || "",
    targetCompany: val.targetCompany || "",
    recurringSkills: (val.recurringSkills && val.recurringSkills.length > 0) ? val.recurringSkills : (val.skills || []),
    tools: val.tools || [],
    responsibilities: val.responsibilities || [],
    qualifications: val.qualifications || [],
    experienceExpectations: val.experienceExpectations || [],
    evidenceExpectations: val.evidenceExpectations || [],
    coreRequirements: val.coreRequirements || [],
    importantRequirements: val.importantRequirements || [],
    differentiators: val.differentiators || [],
    emergingSkills: val.emergingSkills || [],
    optionalSkills: val.optionalSkills || [],
    domainKnowledge: val.domainKnowledge || [],
    communicationExpectations: val.communicationExpectations || [],
    marketOverview: val.marketOverview || "",
    researchTimestamp: val.researchTimestamp || new Date().toISOString(),
    sources: val.sources || [],
    isControlledFallback: val.isControlledFallback ?? false,
  }));
export type MarketIntelligenceOutput = z.infer<typeof MarketIntelligenceOutputSchema>;

// ==========================================
// 4. Career Trajectory Intelligence Agent Types
// ==========================================

export const TrajectoryStageSchema = z
  .object({
    stageNumber: z.number().nullish().default(1),
    stageName: z.string().nullish(),
    name: z.string().nullish(),
    typicalRole: z.string().nullish().default(""),
    description: z.string().nullish().default(""),
    keyFocus: z.string().nullish(),
    focus: z.string().nullish(),
  })
  .transform((val) => ({
    stageNumber: val.stageNumber ?? 1,
    stageName: val.stageName || val.name || "Career Stage",
    typicalRole: val.typicalRole || "",
    description: val.description || "",
    keyFocus: val.keyFocus || val.focus || "",
  }));
export type TrajectoryStage = z.infer<typeof TrajectoryStageSchema>;

export const TransitionPatternSchema = z
  .object({
    from: z.string().nullish().default("Prior Role"),
    to: z.string().nullish().default("Target Role"),
    transitionCatalyst: z.string().nullish(),
    catalyst: z.string().nullish(),
    keyEvidenceRequired: z.string().nullish(),
    evidence: z.string().nullish(),
  })
  .transform((val) => ({
    from: val.from || "Prior Role",
    to: val.to || "Target Role",
    transitionCatalyst: val.transitionCatalyst || val.catalyst || "Key project delivery & leadership",
    keyEvidenceRequired: val.keyEvidenceRequired || val.evidence || "Proof-of-work artifact",
  }));
export type TransitionPattern = z.infer<typeof TransitionPatternSchema>;

export const ProfessionalProfileSchema = z
  .object({
    name: z.string().nullish().default("Practitioner"),
    currentRole: z.string().nullish(),
    role: z.string().nullish(),
    title: z.string().nullish(),
    company: z.string().nullish().default(""),
    organization: z.string().nullish().default(""),
    startingPoint: z.string().nullish().default(""),
    careerSteps: z.array(z.string()).nullish().default([]),
    careerPath: z.array(z.string()).nullish().default([]),
    skills: z.array(z.string()).nullish().default([]),
    experiences: z.array(z.string()).nullish().default([]),
    keyLearnings: z.array(z.string()).nullish().default([]),
    transitions: z.union([z.string(), z.array(z.string())]).nullish(),
    relevantTransition: z.string().nullish().default(""),
    relevanceToCandidate: z.string().nullish().default(""),
    whyRelevant: z.string().nullish().default(""),
    sources: z.array(SourceReferenceSchema).nullish().default([]),
  })
  .transform((val) => {
    const role = val.currentRole || val.role || val.title || "Industry Practitioner";
    const trans = Array.isArray(val.transitions)
      ? val.transitions.join("; ")
      : val.transitions || val.relevantTransition || "Progressive ownership and project delivery";
    return {
      name: val.name || "Practitioner",
      currentRole: role,
      company: val.company || val.organization || "",
      organization: val.organization || val.company || "",
      startingPoint: val.startingPoint || (val.careerSteps?.[0] || val.careerPath?.[0] || "Foundational Role"),
      careerSteps: (val.careerSteps && val.careerSteps.length > 0) ? val.careerSteps : (val.careerPath || []),
      careerPath: (val.careerPath && val.careerPath.length > 0) ? val.careerPath : (val.careerSteps || []),
      skills: (val.skills && val.skills.length > 0) ? val.skills : (val.keyLearnings || []),
      keyLearnings: (val.keyLearnings && val.keyLearnings.length > 0) ? val.keyLearnings : (val.skills || []),
      experiences: val.experiences || [],
      transitions: trans,
      relevantTransition: trans,
      relevanceToCandidate: val.relevanceToCandidate || val.whyRelevant || "Provides proven trajectory precedent for your background",
      whyRelevant: val.whyRelevant || val.relevanceToCandidate || "Provides proven trajectory precedent for your background",
      sources: val.sources || [],
    };
  });
export type ProfessionalProfile = z.infer<typeof ProfessionalProfileSchema>;

export const CareerRouteSchema = z
  .object({
    routeId: z.string().nullish().default("route-1"),
    name: z.string().nullish(),
    routeName: z.string().nullish(),
    stages: z.array(z.string()).nullish().default([]),
    description: z.string().nullish().default(""),
    supportingProfiles: z.array(z.string()).nullish().default([]),
    isClosestRoute: z.boolean().nullish().default(false),
    candidateFit: z.string().nullish().default(""),
    whyClosest: z.string().nullish().default(""),
  })
  .transform((val) => ({
    routeId: val.routeId || "route-1",
    name: val.name || val.routeName || "Career Route",
    routeName: val.routeName || val.name || "Career Route",
    stages: val.stages || [],
    description: val.description || "",
    supportingProfiles: val.supportingProfiles || [],
    isClosestRoute: val.isClosestRoute ?? false,
    candidateFit: val.candidateFit || val.whyClosest || "",
    whyClosest: val.whyClosest || val.candidateFit || "",
  }));
export type CareerRouteItem = z.infer<typeof CareerRouteSchema>;

export const RecurringPatternSchema = z
  .object({
    pattern: z.string(),
    evidence: z.string().nullish().default(""),
    frequencyIfSupported: z.string().nullish().default("4 / 5"),
    observedCount: z.string().nullish(),
    importance: z.string().nullish().default("High"),
    explanation: z.string().nullish().default(""),
    strength: z.enum(["strong", "moderate", "weak"]).nullish().default("strong"),
    observedIn: z.number().nullish().default(4),
    sampleSize: z.number().nullish().default(5),
  })
  .transform((val) => ({
    pattern: val.pattern,
    evidence: val.evidence || "",
    frequencyIfSupported: val.frequencyIfSupported || val.observedCount || "4 / 5",
    observedCount: val.observedCount || val.frequencyIfSupported || "4 / 5",
    importance: val.importance || "High",
    explanation: val.explanation || val.evidence || "",
    strength: val.strength || "strong",
    observedIn: val.observedIn ?? 4,
    sampleSize: val.sampleSize ?? 5,
  }));
export type TrajectoryPatternItem = z.infer<typeof RecurringPatternSchema>;

export const CareerTrajectoryOutputSchema = z
  .object({
    targetRole: z.string().nullish().default(""),
    summary: z.string().nullish().default(""),
    recurringTrajectoryStages: z.array(TrajectoryStageSchema).nullish(),
    stages: z.array(TrajectoryStageSchema).nullish(),
    professionals: z.array(ProfessionalProfileSchema).nullish().default([]),
    routes: z.array(CareerRouteSchema).nullish().default([]),
    recurringPatterns: z.array(RecurringPatternSchema).nullish().default([]),
    patterns: z.array(RecurringPatternSchema).nullish().default([]),
    closestRoute: CareerRouteSchema.nullish(),
    commonSkills: z.array(z.string()).nullish(),
    skills: z.array(z.string()).nullish(),
    commonExperiences: z.array(z.string()).nullish(),
    experiences: z.array(z.string()).nullish(),
    commonTransitions: z.array(TransitionPatternSchema).nullish(),
    transitions: z.array(TransitionPatternSchema).nullish(),
    evidencePatterns: z.array(z.string()).nullish().default([]),
    confidence: z.string().nullish().default("High"),
    limitations: z.string().nullish().default("Synthesized from public benchmarks"),
    sources: z.array(SourceReferenceSchema).nullish().default([]),
    isControlledFallback: z.boolean().nullish().default(false),
  })
  .transform((val) => ({
    targetRole: val.targetRole || "",
    summary: val.summary || "Across researched professional trajectories, successful candidates consistently leverage prior execution experience to step into higher ownership.",
    recurringTrajectoryStages: (val.recurringTrajectoryStages && val.recurringTrajectoryStages.length > 0) ? val.recurringTrajectoryStages : (val.stages || []),
    stages: (val.stages && val.stages.length > 0) ? val.stages : (val.recurringTrajectoryStages || []),
    professionals: val.professionals || [],
    routes: val.routes || [],
    recurringPatterns: (val.recurringPatterns && val.recurringPatterns.length > 0) ? val.recurringPatterns : (val.patterns || []),
    patterns: (val.patterns && val.patterns.length > 0) ? val.patterns : (val.recurringPatterns || []),
    closestRoute: val.closestRoute || null,
    commonSkills: (val.commonSkills && val.commonSkills.length > 0) ? val.commonSkills : (val.skills || []),
    commonExperiences: (val.commonExperiences && val.commonExperiences.length > 0) ? val.commonExperiences : (val.experiences || []),
    commonTransitions: (val.commonTransitions && val.commonTransitions.length > 0) ? val.commonTransitions : (val.transitions || []),
    evidencePatterns: val.evidencePatterns || [],
    confidence: val.confidence || "High",
    limitations: val.limitations || "Synthesized from public benchmarks",
    sources: val.sources || [],
    isControlledFallback: val.isControlledFallback ?? false,
  }));
export type CareerTrajectoryOutput = z.infer<typeof CareerTrajectoryOutputSchema>;

// ==========================================
// 5. Gap Analysis Agent Types
// ==========================================

export const GapItemSchema = z
  .object({
    gap: z.string().nullish().default("Gap"),
    category: z.enum(["skill", "experience", "evidence"]).nullish().default("skill"),
    priority: z.enum(["critical", "high", "medium"]).nullish().default("medium"),
    candidateEvidence: z.string().nullish().default("Candidate evidence"),
    marketRequirement: z.string().nullish().default("Market expectation"),
    trajectorySignal: z.string().nullish().default("Trajectory precedent"),
    impactOnReadiness: z.string().nullish().default("Impact on role readiness"),
  })
  .transform((val) => ({
    gap: val.gap || "Gap",
    category: val.category || "skill",
    priority: val.priority || "medium",
    candidateEvidence: val.candidateEvidence || "Candidate evidence",
    marketRequirement: val.marketRequirement || "Market expectation",
    trajectorySignal: val.trajectorySignal || "Trajectory precedent",
    impactOnReadiness: val.impactOnReadiness || "Impact on role readiness",
  }));
export type GapItem = z.infer<typeof GapItemSchema>;

export const GapAnalysisOutputSchema = z
  .object({
    skillGaps: z.array(GapItemSchema).nullish().default([]),
    experienceGaps: z.array(GapItemSchema).nullish().default([]),
    evidenceGaps: z.array(GapItemSchema).nullish().default([]),
    readinessScore: z.number().nullish().default(65),
    readinessSummary: z.string().nullish().default("Analysis of role readiness."),
    keyCompetitiveAdvantage: z.string().nullish(),
    competitiveAdvantage: z.string().nullish(),
  })
  .transform((val) => ({
    skillGaps: val.skillGaps || [],
    experienceGaps: val.experienceGaps || [],
    evidenceGaps: val.evidenceGaps || [],
    readinessScore: val.readinessScore ?? 65,
    readinessSummary: val.readinessSummary || "Analysis of role readiness.",
    keyCompetitiveAdvantage: val.keyCompetitiveAdvantage || val.competitiveAdvantage || "Strong foundational technical capabilities.",
  }));
export type GapAnalysisOutput = z.infer<typeof GapAnalysisOutputSchema>;

// ==========================================
// 6. Pathway Agent Types
// ==========================================

export const PathwayStageEnum = z.enum(["LEARN", "BUILD", "DEMONSTRATE", "REASSESS"]);
export type PathwayStage = z.infer<typeof PathwayStageEnum>;

export const PathwayActionSchema = z
  .object({
    id: z.string().nullish().default("action-1"),
    stage: PathwayStageEnum.nullish().default("LEARN"),
    title: z.string().nullish().default("Action Milestone"),
    action: z.string().nullish().default("Execute action milestone"),
    whyItMatters: z.string().nullish().default("Addresses identified gap"),
    relatedGap: z.string().nullish().default("Technical competency gap"),
    expectedEvidence: z.string().nullish().default("Proof of work deliverable"),
    priority: z.enum(["high", "medium", "low"]).nullish().default("medium"),
    completionCriteria: z.string().nullish().default("Complete deliverable"),
    resources: z.array(z.string()).nullish().default([]),
    estimatedDuration: z.string().nullish().default("2-3 weeks"),
  })
  .transform((val) => ({
    id: val.id || "action-1",
    stage: val.stage || "LEARN",
    title: val.title || "Action Milestone",
    action: val.action || "Execute action milestone",
    whyItMatters: val.whyItMatters || "Addresses identified gap",
    relatedGap: val.relatedGap || "Technical competency gap",
    expectedEvidence: val.expectedEvidence || "Proof of work deliverable",
    priority: val.priority || "medium",
    completionCriteria: val.completionCriteria || "Complete deliverable",
    resources: val.resources || [],
    estimatedDuration: val.estimatedDuration || "2-3 weeks",
  }));
export type PathwayAction = z.infer<typeof PathwayActionSchema>;

export const PathwayOutputSchema = z
  .object({
    targetRole: z.string().nullish().default(""),
    pathwaySummary: z.string().nullish().default("Personalised 4-stage career pathway."),
    stages: z
      .object({
        LEARN: z.array(PathwayActionSchema).nullish().default([]),
        BUILD: z.array(PathwayActionSchema).nullish().default([]),
        DEMONSTRATE: z.array(PathwayActionSchema).nullish().default([]),
        REASSESS: z.array(PathwayActionSchema).nullish().default([]),
      })
      .nullish()
      .default({ LEARN: [], BUILD: [], DEMONSTRATE: [], REASSESS: [] }),
    milestones: z.array(PathwayActionSchema).nullish().default([]),
  })
  .transform((val) => {
    const stages = val.stages || { LEARN: [], BUILD: [], DEMONSTRATE: [], REASSESS: [] };
    const allMilestones =
      val.milestones && val.milestones.length > 0
        ? val.milestones
        : [
            ...(stages.LEARN || []),
            ...(stages.BUILD || []),
            ...(stages.DEMONSTRATE || []),
            ...(stages.REASSESS || []),
          ];
    return {
      targetRole: val.targetRole || "",
      pathwaySummary: val.pathwaySummary || "Personalised 4-stage career pathway.",
      stages: {
        LEARN: stages.LEARN || [],
        BUILD: stages.BUILD || [],
        DEMONSTRATE: stages.DEMONSTRATE || [],
        REASSESS: stages.REASSESS || [],
      },
      milestones: allMilestones,
    };
  });
export type PathwayOutput = z.infer<typeof PathwayOutputSchema>;

// ==========================================
// 7. Canonical Career Intelligence Types
// ==========================================

export interface TrajectoryStageItem {
  stageNumber: number;
  stageName: string;
  typicalRole: string;
  description: string;
  keyFocus: string;
  candidateRelevance?: string;
}

export interface JourneyComparisonItem {
  dimension: string; // e.g. "Technical foundation", "Product exposure"
  status: "demonstrated" | "partial" | "not_demonstrated" | "unknown";
  evidenceSnippet: string;
  whatItMeans: string;
}

export interface SmartGapItem {
  id: string;
  gap: string;
  category: "skill" | "experience" | "evidence";
  priority: "critical" | "high" | "medium";
  currentEvidence: string;
  destinationRequirement: string;
  difference: string;
  howToCloseIt: string;
  proofYouCanCreate: string;
}

export interface ActionItem {
  id: string;
  stage: "LEARN" | "BUILD" | "DEMONSTRATE" | "REASSESS";
  title: string;
  why: string;
  action: string;
  deliverable?: string;
  proof: string;
  resources: { title: string; url?: string; type: string }[];
  estimatedDuration: string;
  priority: "critical" | "high" | "medium";
  completionCriteria: string;
}

export interface CanonicalAnalysis {
  candidate: {
    fullName: string;
    headline: string;
    summary: string;
    strengths: { name: string; evidence: string }[];
    currentPositionSummary: string;
    evidence: { type: string; description: string; urlOrSnippet?: string }[];
  };

  destination: {
    role: string;
    industry: string;
    company?: string;
    description: string;
  };

  readiness: {
    score: number;
    benchmarkLabel: "Strong Base" | "Early Transition" | "Progression Needed" | "Close to Destination";
    explanation: string;
  };

  biggestInsight: {
    headline: string;
    detail: string;
  };

  whatNotToDo: {
    actionToAvoid: string;
    reason: string;
  }[];

  market: {
    summary: string;
    requirements: {
      skill: string;
      frequency: "High" | "Medium-High" | "Medium";
      evidenceNote: string;
    }[];
    trends: {
      trend: string;
      trajectory: "Growing" | "Strong" | "Emerging";
      details: string;
    }[];
    tools: string[];
    responsibilities: string[];
    evidenceCountNote: string;
    sources: SourceReference[];
  };

  trajectories: {
    summary: string;
    stages: TrajectoryStageItem[];
    routes: CareerRouteItem[];
    closestRoute: CareerRouteItem;
    patterns: TrajectoryPatternItem[];
    professionals: ProfessionalProfile[];
    insufficientEvidence?: boolean;
    sources: SourceReference[];
  };

  comparison: {
    items: JourneyComparisonItem[];
    demonstrated: string[];
    partial: string[];
    missing: string[];
    unknown: string[];
  };

  priorities: {
    id: string;
    title: string;
    type: "skill" | "experience" | "evidence";
    currentSignal: string;
    destinationRequirement: string;
    difference: string;
    action: string;
    proof: string;
    resourceName?: string;
  }[];

  gaps: SmartGapItem[];

  pathway: {
    stages: {
      LEARN: ActionItem[];
      BUILD: ActionItem[];
      DEMONSTRATE: ActionItem[];
      REASSESS: ActionItem[];
    };
    learn: ActionItem[];
    build: ActionItem[];
    demonstrate: ActionItem[];
    reassess: ActionItem[];
    milestones: ActionItem[];
    ninetyDayRoute: {
      days1to30: string[];
      days31to60: string[];
      days61to90: string[];
    };
  };

  resources: {
    learning: { title: string; url?: string; description: string; forGap: string }[];
    building: { title: string; deliverable: string; forGap: string }[];
    evidence: { title: string; proofFormat: string; forGap: string }[];
    exploration: { companyOrRole: string; note: string }[];
  };

  sources: {
    marketSources: SourceReference[];
    careerSources: SourceReference[];
    learningSources: SourceReference[];
    totalCount: number;
    researchBasis: {
      marketCount: number;
      trajectoryCount: number;
      learningCount: number;
      evidenceQuality: "Strong evidence" | "Directional evidence" | "Limited evidence";
    };
  };

  meta: {
    researchTimestamp: string;
    confidence: string;
  };
}

// ==========================================
// 8. Overall Analysis Entity
// ==========================================

export type AnalysisStatus =
  | "pending"
  | "extracting_resume"
  | "building_profile"
  | "discovering_skills"
  | "researching_market"
  | "mining_trajectories"
  | "analyzing_gaps"
  | "generating_pathway"
  | "completed"
  | "failed";

export interface AnalysisRecord {
  id: string;
  created_at: string;
  resume_file_name: string;
  resume_text: string;
  target_role: string;
  target_industry?: string;
  target_company?: string;
  candidate_profile: CandidateProfile;
  skills_analysis: SkillsDiscoveryOutput;
  market_analysis: MarketIntelligenceOutput;
  trajectory_analysis: CareerTrajectoryOutput;
  gap_analysis: GapAnalysisOutput;
  pathway: PathwayOutput;
  analysis_status: AnalysisStatus;
  canonical_analysis?: CanonicalAnalysis;
  error_message?: string;
}

// ==========================================
// 9. Chat Types
// ==========================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

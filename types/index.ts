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

export const EvidenceItemSchema = z.object({
  type: z.string().nullish().transform((v) => v || "work_output"),
  description: z.string().nullish().transform((v) => v || ""),
  urlOrSnippet: z.string().nullish().transform((v) => v || ""),
});
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

export const DemonstratedSkillSchema = z.object({
  skill: z.string(),
  evidence: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});
export type DemonstratedSkill = z.infer<typeof DemonstratedSkillSchema>;

export const UncertainSkillSchema = z.object({
  skill: z.string(),
  reason: z.string(),
});
export type UncertainSkill = z.infer<typeof UncertainSkillSchema>;

export const SkillsDiscoveryOutputSchema = z.object({
  demonstratedSkills: z.array(DemonstratedSkillSchema),
  uncertainSkills: z.array(UncertainSkillSchema),
  missingInformation: z.array(z.string()),
  coreStrengthsSummary: z.string(),
});
export type SkillsDiscoveryOutput = z.infer<typeof SkillsDiscoveryOutputSchema>;

// ==========================================
// 3. Market Intelligence Agent Types
// ==========================================

export const SourceReferenceSchema = z.object({
  title: z.string().nullish().default("Market Reference"),
  url: z.string().nullish().default(""),
  snippet: z.string().nullish().default(""),
  isControlledFallback: z.boolean().nullish().default(false),
});
export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const MarketIntelligenceOutputSchema = z
  .object({
    targetRole: z.string().nullish().default(""),
    targetIndustry: z.string().nullish().default(""),
    recurringSkills: z.array(z.string()).nullish(),
    skills: z.array(z.string()).nullish(),
    tools: z.array(z.string()).nullish().default([]),
    responsibilities: z.array(z.string()).nullish().default([]),
    qualifications: z.array(z.string()).nullish().default([]),
    experienceExpectations: z.array(z.string()).nullish().default([]),
    evidenceExpectations: z.array(z.string()).nullish().default([]),
    marketOverview: z.string().nullish().default(""),
    sources: z.array(SourceReferenceSchema).nullish().default([]),
    isControlledFallback: z.boolean().nullish().default(false),
  })
  .transform((val) => ({
    targetRole: val.targetRole || "",
    targetIndustry: val.targetIndustry || "",
    recurringSkills: (val.recurringSkills && val.recurringSkills.length > 0) ? val.recurringSkills : (val.skills || []),
    tools: val.tools || [],
    responsibilities: val.responsibilities || [],
    qualifications: val.qualifications || [],
    experienceExpectations: val.experienceExpectations || [],
    evidenceExpectations: val.evidenceExpectations || [],
    marketOverview: val.marketOverview || "",
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

export const CareerTrajectoryOutputSchema = z
  .object({
    targetRole: z.string().nullish().default(""),
    recurringTrajectoryStages: z.array(TrajectoryStageSchema).nullish(),
    stages: z.array(TrajectoryStageSchema).nullish(),
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
    recurringTrajectoryStages: (val.recurringTrajectoryStages && val.recurringTrajectoryStages.length > 0) ? val.recurringTrajectoryStages : (val.stages || []),
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
// 7. Overall Analysis Entity
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
  error_message?: string;
}

// ==========================================
// 8. Chat Types
// ==========================================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

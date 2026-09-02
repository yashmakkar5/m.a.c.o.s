import { z } from "zod";

// ==========================================
// 1. Candidate Profile Types & Schemas
// ==========================================

export const EducationItemSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional().default(""),
  year: z.string().optional().default(""),
  details: z.string().optional().default(""),
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

export const ExperienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration: z.string().optional().default(""),
  description: z.string().optional().default(""),
  skillsUsed: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

export const ProjectItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).default([]),
  link: z.string().optional().default(""),
  evidence: z.string().optional().default(""),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

export const CertificationItemSchema = z.object({
  name: z.string(),
  issuer: z.string().optional().default(""),
  year: z.string().optional().default(""),
});
export type CertificationItem = z.infer<typeof CertificationItemSchema>;

export const EvidenceItemSchema = z.object({
  type: z.string(), // e.g., "github", "project", "publication", "work_output"
  description: z.string(),
  urlOrSnippet: z.string().optional().default(""),
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const CandidateProfileSchema = z.object({
  fullName: z.string().optional().default("Candidate"),
  headline: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  targetRole: z.string(),
  targetIndustry: z.string().optional().default(""),
  targetCompany: z.string().optional().default(""),
  skills: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  education: z.array(EducationItemSchema).default([]),
  experience: z.array(ExperienceItemSchema).default([]),
  projects: z.array(ProjectItemSchema).default([]),
  certifications: z.array(CertificationItemSchema).default([]),
  achievements: z.array(z.string()).default([]),
  demonstratedCapabilities: z.array(z.string()).default([]),
  evidence: z.array(EvidenceItemSchema).default([]),
  missingInformation: z.array(z.string()).default([]),
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
  title: z.string(),
  url: z.string().optional().default(""),
  snippet: z.string(),
  isControlledFallback: z.boolean().default(false),
});
export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const MarketIntelligenceOutputSchema = z.object({
  targetRole: z.string(),
  targetIndustry: z.string(),
  recurringSkills: z.array(z.string()),
  tools: z.array(z.string()),
  responsibilities: z.array(z.string()),
  qualifications: z.array(z.string()),
  experienceExpectations: z.array(z.string()),
  evidenceExpectations: z.array(z.string()),
  marketOverview: z.string(),
  sources: z.array(SourceReferenceSchema).default([]),
  isControlledFallback: z.boolean().default(false),
});
export type MarketIntelligenceOutput = z.infer<typeof MarketIntelligenceOutputSchema>;

// ==========================================
// 4. Career Trajectory Intelligence Agent Types
// ==========================================

export const TrajectoryStageSchema = z.object({
  stageNumber: z.number(),
  stageName: z.string(),
  typicalRole: z.string(),
  description: z.string(),
  keyFocus: z.string(),
});
export type TrajectoryStage = z.infer<typeof TrajectoryStageSchema>;

export const TransitionPatternSchema = z.object({
  from: z.string(),
  to: z.string(),
  transitionCatalyst: z.string(), // e.g. "Shipped high-impact cross-functional project"
  keyEvidenceRequired: z.string(),
});
export type TransitionPattern = z.infer<typeof TransitionPatternSchema>;

export const CareerTrajectoryOutputSchema = z.object({
  targetRole: z.string(),
  recurringTrajectoryStages: z.array(TrajectoryStageSchema),
  commonSkills: z.array(z.string()),
  commonExperiences: z.array(z.string()),
  commonTransitions: z.array(TransitionPatternSchema),
  evidencePatterns: z.array(z.string()),
  confidence: z.string(),
  limitations: z.string(),
  sources: z.array(SourceReferenceSchema).default([]),
  isControlledFallback: z.boolean().default(false),
});
export type CareerTrajectoryOutput = z.infer<typeof CareerTrajectoryOutputSchema>;

// ==========================================
// 5. Gap Analysis Agent Types
// ==========================================

export const GapItemSchema = z.object({
  gap: z.string(),
  category: z.enum(["skill", "experience", "evidence"]),
  priority: z.enum(["critical", "high", "medium"]),
  candidateEvidence: z.string(), // what candidate currently has or lacks
  marketRequirement: z.string(), // why the market demands it
  trajectorySignal: z.string(),  // how professionals consistently acquire it
  impactOnReadiness: z.string(),
});
export type GapItem = z.infer<typeof GapItemSchema>;

export const GapAnalysisOutputSchema = z.object({
  skillGaps: z.array(GapItemSchema),
  experienceGaps: z.array(GapItemSchema),
  evidenceGaps: z.array(GapItemSchema),
  readinessScore: z.number().min(0).max(100),
  readinessSummary: z.string(),
  keyCompetitiveAdvantage: z.string(),
});
export type GapAnalysisOutput = z.infer<typeof GapAnalysisOutputSchema>;

// ==========================================
// 6. Pathway Agent Types
// ==========================================

export const PathwayStageEnum = z.enum(["LEARN", "BUILD", "DEMONSTRATE", "REASSESS"]);
export type PathwayStage = z.infer<typeof PathwayStageEnum>;

export const PathwayActionSchema = z.object({
  id: z.string(),
  stage: PathwayStageEnum,
  title: z.string(),
  action: z.string(),
  whyItMatters: z.string(),
  relatedGap: z.string(),
  expectedEvidence: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  completionCriteria: z.string(),
  resources: z.array(z.string()).optional().default([]),
  estimatedDuration: z.string().optional().default(""),
});
export type PathwayAction = z.infer<typeof PathwayActionSchema>;

export const PathwayOutputSchema = z.object({
  targetRole: z.string(),
  pathwaySummary: z.string(),
  stages: z.object({
    LEARN: z.array(PathwayActionSchema),
    BUILD: z.array(PathwayActionSchema),
    DEMONSTRATE: z.array(PathwayActionSchema),
    REASSESS: z.array(PathwayActionSchema),
  }),
  milestones: z.array(PathwayActionSchema),
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

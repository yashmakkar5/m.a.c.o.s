/**
 * Core domain types for mac OS (AI Career Navigation platform)
 *
 * NOTE: These are modular type contracts defining data structures
 * for profile ingestion, market requirements, gap analysis, and pathways.
 */

export interface UserProfile {
  id?: string;
  name?: string;
  targetRole: string;
  skills: string[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  evidenceUrls?: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration?: string;
  description?: string;
  skillsUsed: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface MarketRequirement {
  role: string;
  requiredSkills: string[];
  preferredSkills: string[];
  recurringPatterns: string[];
}

export interface GapAnalysis {
  skillGaps: string[];
  experienceGaps: string[];
  evidenceGaps: string[];
}

export type PathwayStage = "LEARN" | "BUILD" | "DEMONSTRATE" | "REASSESS";

export interface PathwayMilestone {
  id: string;
  stage: PathwayStage;
  title: string;
  description: string;
  resources?: string[];
  evidenceArtifact?: string;
  status: "pending" | "in_progress" | "completed";
}

export interface CareerMap {
  targetRole: string;
  summary: string;
  milestones: PathwayMilestone[];
}

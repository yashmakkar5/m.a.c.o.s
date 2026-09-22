/**
 * Placey (M.A.C.O.S.) — Azure AI Foundry Cloud Agent Runners
 * Course AI-103: Azure AI Apps and Agents Developer
 * 
 * Thin cloud-dispatchers that format candidate input payloads and invoke
 * the 5 registered Cloud Agents in Azure AI Foundry (yashplacey-resource / yashplacey).
 * No local duplicate prompts or mock personas stored here.
 */

import { generateStructuredJson, AZURE_FOUNDRY_AGENTS } from "./foundryClient";
import { getResearchProvider } from "@/lib/research/researchProvider";
import {
  CandidateProfile,
  CandidateProfileSchema,
  SkillsDiscoveryOutput,
  SkillsDiscoveryOutputSchema,
  MarketIntelligenceOutput,
  MarketIntelligenceOutputSchema,
  CareerTrajectoryOutput,
  CareerTrajectoryOutputSchema,
  GapAnalysisOutput,
  GapAnalysisOutputSchema,
  PathwayOutput,
  PathwayOutputSchema,
} from "@/types";

// ============================================================================
// 1. Candidate Profile Extraction (Structured Ingestion)
// ============================================================================
export interface ExtractProfileParams {
  resumeText: string;
  targetRole: string;
  targetIndustry?: string;
  targetCompany?: string;
  additionalContext?: string;
}

export async function extractCandidateProfile({
  resumeText,
  targetRole,
  targetIndustry = "",
  targetCompany = "",
  additionalContext = "",
}: ExtractProfileParams): Promise<CandidateProfile> {
  const prompt = `
Extract the candidate's structured profile for destination "${targetRole}":
- Target Role: "${targetRole}"
- Target Industry: "${targetIndustry || "Technology / Software"}"
- Target Company: "${targetCompany || "Unspecified"}"
- Additional Notes: "${additionalContext || "None"}"

RESUME CONTENT:
"""
${resumeText}
"""

Extract education, experience, projects, stated skills, tools, and explicitly list any missing information or unverified claims.
`.trim();

  const profile = await generateStructuredJson<CandidateProfile>({
    prompt,
    schema: CandidateProfileSchema,
  });

  return {
    ...profile,
    targetRole,
    targetIndustry: targetIndustry || profile.targetIndustry || "Technology",
    targetCompany: targetCompany || profile.targetCompany || "",
  };
}

// ============================================================================
// 2. Skills Discovery Agent (Cloud Agent: SkillsDiscoveryAgent v4)
// ============================================================================
export async function runSkillsDiscoveryAgent(
  profile: CandidateProfile
): Promise<SkillsDiscoveryOutput> {
  const prompt = `
Evaluate demonstrated capabilities vs unevidenced claims for candidate targeting "${profile.targetRole}":

CANDIDATE TARGET:
- Role: ${profile.targetRole}
- Industry: ${profile.targetIndustry || "Technology"}
- Company: ${profile.targetCompany || "Market"}

CANDIDATE PROFILE:
- Full Name: ${profile.fullName} (${profile.headline || "Practitioner"})
- Summary: ${profile.summary || "None provided"}
- Education: ${profile.education.map((e) => `${e.degree} from ${e.institution}`).join("; ") || "None listed"}
- Experience: ${profile.experience.map((e) => `${e.role} at ${e.company} (${e.duration}): ${e.description}`).join("\n") || "None listed"}
- Projects: ${profile.projects.map((p) => `${p.title}: ${p.description} (Tech: ${p.technologies.join(", ")}; Artifact: ${p.link || p.evidence || "None"})`).join("\n") || "None listed"}
- Skills & Tools: ${[...profile.skills, ...profile.technologies].join(", ") || "None listed"}

Categorize all competencies into demonstratedList, mentionedList, missingList, unknownList, and populate demonstratedSkills & uncertainSkills with honest proof evaluations.
`.trim();

  return await generateStructuredJson<SkillsDiscoveryOutput>({
    agent: AZURE_FOUNDRY_AGENTS.skills,
    prompt,
    schema: SkillsDiscoveryOutputSchema,
  });
}

// ============================================================================
// 3. Market Intelligence Agent (Cloud Agent: marketIntelligenceAgent v2)
// ============================================================================
export interface RunMarketAgentParams {
  targetRole: string;
  targetIndustry?: string;
  targetCompany?: string;
}

export async function runMarketIntelligenceAgent({
  targetRole,
  targetIndustry = "Technology",
  targetCompany = "",
}: RunMarketAgentParams): Promise<MarketIntelligenceOutput> {
  const provider = getResearchProvider();
  const research = await provider.searchMarketIntelligence(targetRole, targetIndustry, targetCompany);

  const prompt = `
Synthesize comprehensive, evidence-backed market intelligence for:
TARGET ROLE: ${targetRole}
TARGET INDUSTRY: ${targetIndustry}
TARGET COMPANY: ${targetCompany || "General Tech Market"}

RESEARCH BRIEFING:
"""
${research.content}
"""

Extract coreRequirements, importantRequirements, differentiators, experienceExpectations, evidenceExpectations, recurringSkills, tools, responsibilities, and emergingSkills. Strictly no SAP.
`.trim();

  const output = await generateStructuredJson<MarketIntelligenceOutput>({
    agent: AZURE_FOUNDRY_AGENTS.market,
    prompt,
    schema: MarketIntelligenceOutputSchema,
  });

  return {
    ...output,
    sources: research.sources,
    isControlledFallback: research.isControlledFallback,
  };
}

// ============================================================================
// 4. Career Trajectory Intelligence Agent (Cloud Agent: careerTrajectoryIntelligenceAgent v2)
// ============================================================================
export interface RunTrajectoryAgentParams {
  targetRole: string;
  targetIndustry?: string;
  candidateProfile?: CandidateProfile;
}

export async function runCareerTrajectoryAgent({
  targetRole,
  targetIndustry = "Technology",
  candidateProfile,
}: RunTrajectoryAgentParams): Promise<CareerTrajectoryOutput> {
  const provider = getResearchProvider();
  const research = await provider.searchCareerTrajectories(targetRole, targetIndustry);

  const candidateContext = candidateProfile
    ? `CANDIDATE: ${candidateProfile.fullName}, ${candidateProfile.headline}. Demonstrated: ${candidateProfile.demonstratedCapabilities.slice(0, 5).join("; ")}.`
    : "Candidate with technical background.";

  const prompt = `
Synthesize real career trajectory patterns for destination "${targetRole}":
${candidateContext}

RESEARCH CONTEXT:
"""
${research.content}
"""

REQUIREMENTS:
1. Feature 3-5 REAL NAMED PROFESSIONALS (e.g. Swyx / Shawn Wang, Kelsey Hightower, Julia Evans, Mitchell Hashimoto, or prominent relatable practitioners).
2. For each person: their startingPoint, careerSteps, transition catalyst, skills, and exact emulation blueprint for this candidate.
3. Identify recurringPatterns, routes, closestRoute, and transition catalysts.
4. Strictly no SAP.
`.trim();

  const output = await generateStructuredJson<CareerTrajectoryOutput>({
    agent: AZURE_FOUNDRY_AGENTS.trajectory,
    prompt,
    schema: CareerTrajectoryOutputSchema,
  });

  return {
    ...output,
    sources: research.sources,
    isControlledFallback: research.isControlledFallback,
  };
}

// ============================================================================
// 5. Gap Analysis Specialist Agent (Cloud Agent: gapAnalysisSpecialist v2)
// ============================================================================
export interface RunGapAnalysisParams {
  candidateProfile: CandidateProfile;
  skillsAnalysis: SkillsDiscoveryOutput;
  marketAnalysis: MarketIntelligenceOutput;
  trajectoryAnalysis: CareerTrajectoryOutput;
}

export async function runGapAnalysisAgent({
  candidateProfile,
  skillsAnalysis,
  marketAnalysis,
  trajectoryAnalysis,
}: RunGapAnalysisParams): Promise<GapAnalysisOutput> {
  const prompt = `
Perform triple triangulation gap analysis for candidate targeting "${candidateProfile.targetRole}":

1. CANDIDATE EVIDENCE:
- Name: ${candidateProfile.fullName} (${candidateProfile.headline})
- Demonstrated: ${skillsAnalysis.demonstratedSkills.map((s) => `${s.skill} (${s.evidence})`).join("; ")}
- Uncertain / Missing: ${skillsAnalysis.uncertainSkills.map((u) => u.skill).join(", ")}

2. MARKET DEMAND:
- Skills: ${marketAnalysis.recurringSkills.join(", ")}
- Tools: ${marketAnalysis.tools.join(", ")}
- Evidence Demanded: ${marketAnalysis.evidenceExpectations.join("; ")}

3. TRAJECTORY SIGNALS:
- Precedents: ${trajectoryAnalysis.professionals.map((p) => `${p.name}: ${p.transitions}`).join("; ")}

Identify skillGaps, experienceGaps, evidenceGaps, an objective readinessScore (0-100), and keyCompetitiveAdvantage. Strictly no SAP.
`.trim();

  return await generateStructuredJson<GapAnalysisOutput>({
    agent: AZURE_FOUNDRY_AGENTS.gap,
    prompt,
    schema: GapAnalysisOutputSchema,
  });
}

// ============================================================================
// 6. Pathway Architect Agent (Cloud Agent: pathwayArchitectAgent v2)
// ============================================================================
export interface RunPathwayAgentParams {
  candidateProfile: CandidateProfile;
  gapAnalysis: GapAnalysisOutput;
}

export async function runPathwayAgent({
  candidateProfile,
  gapAnalysis,
}: RunPathwayAgentParams): Promise<PathwayOutput> {
  const prompt = `
Architect a tactical 4-stage action pathway (LEARN, BUILD, DEMONSTRATE, REASSESS) for candidate targeting "${candidateProfile.targetRole}":

CANDIDATE & GAPS:
- Candidate: ${candidateProfile.fullName}, Readiness: ${gapAnalysis.readinessScore}/100, Advantage: ${gapAnalysis.keyCompetitiveAdvantage}
- Skill Gaps: ${gapAnalysis.skillGaps.map((g) => `[${g.priority}] ${g.gap}`).join("; ")}
- Experience Gaps: ${gapAnalysis.experienceGaps.map((g) => `[${g.priority}] ${g.gap}`).join("; ")}
- Evidence Gaps: ${gapAnalysis.evidenceGaps.map((g) => `[${g.priority}] ${g.gap}`).join("; ")}

Provide tactical actions for each of the 4 phases with concrete expectedEvidence and completionCriteria. Strictly no SAP.
`.trim();

  return await generateStructuredJson<PathwayOutput>({
    agent: AZURE_FOUNDRY_AGENTS.pathway,
    prompt,
    schema: PathwayOutputSchema,
  });
}

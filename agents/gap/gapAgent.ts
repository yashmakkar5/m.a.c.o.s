import { generateStructuredJson, AZURE_FOUNDRY_AGENTS } from "@/lib/ai/foundryClient";

import {
  CandidateProfile,
  CareerTrajectoryOutput,
  GapAnalysisOutput,
  GapAnalysisOutputSchema,
  MarketIntelligenceOutput,
  SkillsDiscoveryOutput,
} from "@/types";

const GAP_AGENT_SYSTEM_PROMPT = `
You are the Gap Analysis Specialist for Placey (M.A.C.O.S.).
Your purpose is to perform a rigorous, honest triangulation between:
1. What the candidate currently has and demonstrates (Candidate Profile + Skills Discovery)
2. What the market actively demands (Market Intelligence)
3. How real professionals successfully bridged these exact transitions (Career Trajectory Precedents)

STRICT TRIANGULATION RULES:
1. TRIPLE TRIANGULATION: Every identified gap MUST be justified by:
   - "candidateEvidence": What the candidate currently demonstrates or lacks with exact context
   - "marketRequirement": The specific industry requirement or hiring filter it relates to
   - "trajectorySignal": The trajectory stage or breakthrough catalyst that successful transitioners used to bridge this gap
2. Categorize gaps strictly into:
   - "skillGaps": Missing technical capabilities, architectures, or tools
   - "experienceGaps": Missing scope of responsibility, system scale, or project lifecycle depth
   - "evidenceGaps": Missing proof-of-work (e.g., lack of public repository, live URL, metrics dashboard, written design spec)
3. Prioritize each gap as "critical", "high", or "medium".
4. Determine an objective "readinessScore" (0 - 100) based on verified evidence matching, not hiring probability.
5. Identify the candidate's "keyCompetitiveAdvantage": What unique strength does their existing background bring to this target role?
6. NO SAP: Absolutely do not mention, reference, or suggest SAP in any form. Focus on modern cloud, web, and distributed technologies.
7. Return structured JSON matching GapAnalysisOutputSchema.
`.trim();

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
Perform gap analysis for candidate targeting "${candidateProfile.targetRole}".

1. CANDIDATE PROFILE & DEMONSTRATED SKILLS:
- Full Name / Title: ${candidateProfile.fullName} (${candidateProfile.headline})
- Demonstrated Skills: ${skillsAnalysis.demonstratedSkills.map((s) => `${s.skill} (Evidence: ${s.evidence}, Conf: ${s.confidence})`).join("; ")}
- Uncertain Skills: ${skillsAnalysis.uncertainSkills.map((u) => `${u.skill} (Reason: ${u.reason})`).join("; ")}
- Missing Information: ${skillsAnalysis.missingInformation.join("; ")}
- Work Experience Summary: ${candidateProfile.experience.map((e) => `${e.role} at ${e.company} (${e.duration})`).join("; ")}
- Projects: ${candidateProfile.projects.map((p) => `${p.title}: ${p.description}`).join("; ")}

2. MARKET REQUIREMENTS:
- Recurring Skills: ${marketAnalysis.recurringSkills.join(", ")}
- Tools: ${marketAnalysis.tools.join(", ")}
- Responsibilities: ${marketAnalysis.responsibilities.join("; ")}
- Qualifications & Experience: ${marketAnalysis.qualifications.join("; ")}
- Evidence Expectations: ${marketAnalysis.evidenceExpectations.join("; ")}

3. TRAJECTORY PATTERNS:
- Recurring Stages: ${trajectoryAnalysis.recurringTrajectoryStages.map((s) => `Stage ${s.stageNumber}: ${s.stageName}`).join(" -> ")}
- Key Transition Catalysts: ${trajectoryAnalysis.commonTransitions.map((t) => `${t.from} -> ${t.to} via ${t.transitionCatalyst}`).join("; ")}
- Evidence Patterns: ${trajectoryAnalysis.evidencePatterns.join("; ")}

Execute the comparative analysis and return the structured GapAnalysisOutput conforming strictly to the schema.
`.trim();

  return await generateStructuredJson<GapAnalysisOutput>({
    agent: AZURE_FOUNDRY_AGENTS.gap,
    systemInstruction: GAP_AGENT_SYSTEM_PROMPT,
    prompt,
    schema: GapAnalysisOutputSchema,
  });
}

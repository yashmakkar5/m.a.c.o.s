import { generateStructuredJson } from "@/lib/ai/geminiClient";
import {
  CandidateProfile,
  CareerTrajectoryOutput,
  GapAnalysisOutput,
  GapAnalysisOutputSchema,
  MarketIntelligenceOutput,
  SkillsDiscoveryOutput,
} from "@/types";

const GAP_AGENT_SYSTEM_PROMPT = `
You are the Gap Analysis Specialist for M.A.C.O.S. (My Adaptive Career Orchestration System).
Your purpose is to perform a rigorous triangulation between:
1. What the candidate currently has and demonstrates (Candidate Profile + Skills Discovery)
2. What the current market actively requires (Market Intelligence)
3. How successful professionals navigated transitions into this role (Career Trajectory Intelligence)

STRICT RULES:
1. TRIPLE TRIANGULATION: Every identified gap MUST be justified by:
   - "candidateEvidence": What the candidate currently demonstrates or lacks
   - "marketRequirement": The specific industry requirement it relates to
   - "trajectorySignal": The trajectory stage or transition catalyst where this was pivotal
2. Categorize gaps strictly into:
   - "skillGaps": Missing competencies or technical capabilities
   - "experienceGaps": Missing scope of responsibility, team dynamics, or project lifecycle depth
   - "evidenceGaps": Missing proof-of-work (e.g., lack of published case study, live metrics, public demo)
3. Prioritize each gap as "critical", "high", or "medium".
4. Determine an objective "readinessScore" (0 - 100) reflecting current readiness for an entry/transition into the role.
5. Identify the candidate's "keyCompetitiveAdvantage": What unique strength does their existing background bring to this target role? (e.g., an engineer transitioning to PM has deep empathy for developer constraints).
6. Return structured JSON matching GapAnalysisOutputSchema.
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
    systemInstruction: GAP_AGENT_SYSTEM_PROMPT,
    prompt,
    schema: GapAnalysisOutputSchema,
  });
}

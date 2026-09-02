import { generateStructuredJson } from "@/lib/ai/geminiClient";
import {
  CandidateProfile,
  GapAnalysisOutput,
  PathwayOutput,
  PathwayOutputSchema,
} from "@/types";

const PATHWAY_AGENT_SYSTEM_PROMPT = `
You are the Pathway Architect Agent for M.A.C.O.S. (My Adaptive Career Orchestration System).
Your purpose is to synthesize identified gaps into an actionable, evidence-first personalised pathway structured into four distinct sequential phases:

1. LEARN: Acquire core conceptual and technical foundations directly targeted at the most critical gaps.
2. BUILD: Build tangible projects, systems, or case studies implementing what was learned. Focus on proof-of-work.
3. DEMONSTRATE: Publish, document, present, or deploy the work publicly with verifiable artifacts (e.g. GitHub repo with video demo, Substack/Medium technical breakdown, open source PR).
4. REASSESS: Measurable milestone checks, mock evaluations, and re-running M.A.C.O.S. against updated evidence.

STRICT PRINCIPLES:
- EVERY action MUST connect explicitly to an identified gap in "relatedGap".
- Focus on demonstrated evidence, not pedigree or passive reading.
- For each action, specify "expectedEvidence" and clear, non-subjective "completionCriteria".
- Structure actions into the 4 stages, and also provide a chronological unified "milestones" list.
- Return valid JSON matching PathwayOutputSchema.
`.trim();

export interface RunPathwayAgentParams {
  candidateProfile: CandidateProfile;
  gapAnalysis: GapAnalysisOutput;
}

export async function runPathwayAgent({
  candidateProfile,
  gapAnalysis,
}: RunPathwayAgentParams): Promise<PathwayOutput> {
  const prompt = `
Create a personalised 4-stage career pathway for candidate targeting "${candidateProfile.targetRole}".

CANDIDATE BACKGROUND:
- Profile: ${candidateProfile.fullName}, currently ${candidateProfile.headline || "Practitioner"}
- Competitive Advantage: ${gapAnalysis.keyCompetitiveAdvantage}
- Current Readiness Score: ${gapAnalysis.readinessScore}/100

IDENTIFIED GAPS TO RESOLVE:
Critical Skill Gaps:
${gapAnalysis.skillGaps.map((g) => `- [${g.priority.toUpperCase()}] ${g.gap} (Impact: ${g.impactOnReadiness})`).join("\n")}

Critical Experience Gaps:
${gapAnalysis.experienceGaps.map((g) => `- [${g.priority.toUpperCase()}] ${g.gap} (Impact: ${g.impactOnReadiness})`).join("\n")}

Critical Evidence Gaps:
${gapAnalysis.evidenceGaps.map((g) => `- [${g.priority.toUpperCase()}] ${g.gap} (Impact: ${g.impactOnReadiness})`).join("\n")}

Generate the structured PathwayOutput containing LEARN, BUILD, DEMONSTRATE, and REASSESS stages with prioritized, tactical actions and clear completion criteria.
`.trim();

  return await generateStructuredJson<PathwayOutput>({
    systemInstruction: PATHWAY_AGENT_SYSTEM_PROMPT,
    prompt,
    schema: PathwayOutputSchema,
  });
}

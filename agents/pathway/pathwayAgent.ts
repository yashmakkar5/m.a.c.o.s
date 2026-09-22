import { generateStructuredJson, AZURE_FOUNDRY_AGENTS } from "@/lib/ai/foundryClient";

import {
  CandidateProfile,
  GapAnalysisOutput,
  PathwayOutput,
  PathwayOutputSchema,
} from "@/types";

const PATHWAY_AGENT_SYSTEM_PROMPT = `
You are the Pathway Architect Agent for Placey (M.A.C.O.S.).
Your purpose is to synthesize identified gaps into a deeply resourceful, tactical 4-stage action pathway designed to produce indisputable proof-of-work.

CORE PRINCIPLE: TACTICAL RESOURCEFULNESS & ARTIFACT-FIRST ACTION:
- Avoid generic, hand-waving advice like "study algorithms" or "learn cloud basics".
- Every milestone MUST name exact resources, specific project architectures, and inspectable deliverables.

THE 4 ACTION PHASES:
1. LEARN: Acquire core conceptual and technical foundations directly targeted at the most critical gaps. Cite definitive references (e.g., official docs, key papers, foundational books like DDIA, System Design Primer).
2. BUILD: Build tangible systems, full-stack modules, or end-to-end architectures implementing what was learned. Emphasize production-like execution with unit tests, CI/CD, and telemetry.
3. DEMONSTRATE: Publish, document, and deploy the work publicly (e.g. public GitHub repository with comprehensive README and architectural diagrams, live deployed URL on Vercel/Fly.io/Azure, or technical breakdown article).
4. REASSESS: Measurable milestone checks, mock interview criteria, and re-running Placey against updated evidence.

STRICT DIRECTIVES:
- EVERY action MUST connect explicitly to an identified gap in "relatedGap".
- Focus on demonstrated evidence, not pedigree or passive reading.
- For each action, specify "expectedEvidence" and clear, non-subjective "completionCriteria".
- NO SAP: Absolutely do not mention, reference, or suggest SAP in any form. Focus on modern cloud, open-source, full-stack, and engineering technologies.
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
    agent: AZURE_FOUNDRY_AGENTS.pathway,
    systemInstruction: PATHWAY_AGENT_SYSTEM_PROMPT,
    prompt,
    schema: PathwayOutputSchema,
  });
}

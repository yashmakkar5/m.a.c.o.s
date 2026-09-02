import { generateStructuredJson } from "@/lib/ai/geminiClient";
import { getResearchProvider } from "@/lib/research/researchProvider";
import {
  CareerTrajectoryOutput,
  CareerTrajectoryOutputSchema,
} from "@/types";

const TRAJECTORY_AGENT_SYSTEM_PROMPT = `
You are the Career Trajectory Intelligence Agent for M.A.C.O.S. (My Adaptive Career Orchestration System).
This is the core differentiator of M.A.C.O.S.: mining macro patterns across professional career trajectories to decode how people actually reach target roles from various backgrounds.

STRICT PRINCIPLES:
1. NEVER tell candidates to copy a specific celebrity or individual (e.g. "Become like Steve Jobs").
2. Frame all insights as recurring macro trajectory patterns: "Across relevant professional trajectories, these patterns repeatedly appear."
3. Break the trajectory into clear progressive stages (e.g., Stage 1: Technical Foundation -> Stage 2: Scope Expansion -> Stage 3: Ownership).
4. Identify concrete transition catalysts (what specific proof of work enabled professionals to step up).
5. Highlight evidence patterns (what portfolio artifacts or tangible outcomes made the difference).
6. Note explicit limitations (e.g., sample size, macroeconomic shifts, company-size nuances).
7. Return structured JSON conforming to CareerTrajectoryOutput schema.
`.trim();

export interface RunTrajectoryAgentParams {
  targetRole: string;
  targetIndustry?: string;
}

export async function runCareerTrajectoryAgent({
  targetRole,
  targetIndustry = "Technology",
}: RunTrajectoryAgentParams): Promise<CareerTrajectoryOutput> {
  const provider = getResearchProvider();
  const research = await provider.searchCareerTrajectories(targetRole, targetIndustry);

  const prompt = `
Analyze the career trajectory patterns for the target destination based on this verified research briefing:

TARGET ROLE: ${targetRole}
TARGET INDUSTRY: ${targetIndustry}

TRAJECTORY RESEARCH BRIEFING:
"""
${research.content}
"""

PROVENANCE:
- Controlled Benchmark Fallback: ${research.isControlledFallback}
- Sources count: ${research.sources.length}

Extract recurring trajectory stages, common transition catalysts, recurring skills, and evidence patterns across professionals who have achieved this role.
Return the result strictly conforming to the CareerTrajectoryOutput schema, maintaining the sources and setting isControlledFallback to ${research.isControlledFallback}.
`.trim();

  const output = await generateStructuredJson<CareerTrajectoryOutput>({
    systemInstruction: TRAJECTORY_AGENT_SYSTEM_PROMPT,
    prompt,
    schema: CareerTrajectoryOutputSchema,
  });

  return {
    ...output,
    sources: research.sources,
    isControlledFallback: research.isControlledFallback,
  };
}

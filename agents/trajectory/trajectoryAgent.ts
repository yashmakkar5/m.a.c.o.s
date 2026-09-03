import { generateStructuredJson } from "@/lib/ai/geminiClient";
import { getResearchProvider } from "@/lib/research/researchProvider";
import {
  CandidateProfile,
  CareerTrajectoryOutput,
  CareerTrajectoryOutputSchema,
} from "@/types";

const TRAJECTORY_AGENT_SYSTEM_PROMPT = `
You are the elite Career Trajectory Intelligence Agent for M.A.C.O.S. (My Adaptive Career Orchestration System).
This is the central intelligence engine of M.A.C.O.S.: decoding how real professionals have ACTUALLY progressed toward the target destination.

CORE PRINCIPLES:
1. NOT CELEBRITY WORSHIP:
   - The purpose is to learn from people who have already navigated this exact transition.
   - Prioritize RELEVANCE over fame. Feature professionals who transitioned through diverse routes (technical, analytical, operational).

2. PERSON-LEVEL JOURNEY SYNTHESIS:
   - Research approximately 3–7 relevant professionals with publicly documented career histories.
   - For each person, document the chronological journey:
     PERSON -> Where they started -> Important transition -> Important skills acquired -> Important experiences -> Current destination.
   - Detail their specific relevance to this candidate's background.

3. PATTERN FREQUENCY DETECTION:
   - Aggregate recurring macro patterns across researched profiles.
   - Example: "4 / 5 had prior technical execution experience", "5 / 5 demonstrated product ownership before formal title".
   - Only state counts when genuinely supported by the research profiles. If sample size is small or varied, say "Several profiles show..." without inventing percentages.

4. MULTIPLE VALIDATED ROUTES:
   - Identify 2-3 distinct routes to the destination (e.g. Technical -> Product, Analytical -> Product, Domain Operations -> Product).
   - Never imply only one single rigid path exists.

5. CANDIDATE'S CLOSEST ROUTE:
   - Determine which route is most compatible with this candidate's existing demonstrated background.
   - Explain WHY with clear, evidence-based reasoning.

CRITICAL TRUST RULES:
- Never fabricate people, career histories, companies, skills, or sources.
- Every researched professional must have a source citation.
- If public evidence is lacking, state "Insufficient public evidence found" rather than inventing data.
- Return structured output conforming strictly to the CareerTrajectoryOutput schema.
`.trim();

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
    ? `
CANDIDATE BACKGROUND FOR COMPARISON & ROUTE MATCHING:
- Current Headline: ${candidateProfile.headline || "Practitioner"}
- Current Role: ${candidateProfile.experience?.[0]?.role || "Early Career"}
- Education: ${candidateProfile.education.map((e) => `${e.degree} in ${e.field || "CS/Engineering"}`).join("; ") || "Technical background"}
- Demonstrated Capabilities: ${candidateProfile.demonstratedCapabilities.slice(0, 5).join("; ") || "Software development & engineering"}
- Key Projects: ${candidateProfile.projects.map((p) => p.title).join(", ") || "Technical projects"}
`
    : "Candidate has foundational technical and software delivery capabilities.";

  const prompt = `
Analyze real career trajectory patterns for the destination "${targetRole}" based on the following verified research briefing:

TARGET ROLE: ${targetRole}
TARGET INDUSTRY: ${targetIndustry}

${candidateContext}

VERIFIED RESEARCH BRIEFING:
"""
${research.content}
"""

PROVENANCE:
- Controlled Benchmark Fallback: ${research.isControlledFallback}
- Sources count: ${research.sources.length}

INSTRUCTIONS:
1. Synthesize 3-5 real "professionals" with their chronological journeys:
   - "startingPoint": Where they started
   - "careerSteps": Sequence of roles
   - "transitions": Major catalytic transition
   - "skills": Core skills acquired
   - "experiences": Key experiences
   - "relevanceToCandidate": Specific alignment with this candidate's profile
   - "sources": Publicly documented source citations
2. Identify "recurringPatterns" with supported frequency (e.g., "4 / 5") and explanations.
3. Define 2-3 distinct "routes" to the destination.
4. Select the candidate's "closestRoute", setting isClosestRoute to true, and explain WHY in "whyClosest".
5. Populate "stages", "commonSkills", "commonExperiences", and "commonTransitions".
6. Return structured output adhering strictly to CareerTrajectoryOutput schema.
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

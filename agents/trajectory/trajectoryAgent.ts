import { generateStructuredJson, AZURE_FOUNDRY_AGENTS } from "@/lib/ai/foundryClient";

import { getResearchProvider } from "@/lib/research/researchProvider";
import {
  CandidateProfile,
  CareerTrajectoryOutput,
  CareerTrajectoryOutputSchema,
} from "@/types";

const TRAJECTORY_AGENT_SYSTEM_PROMPT = `
You are the elite Career Trajectory Intelligence Agent for Placey (M.A.C.O.S.).
Your mission is to uncover deeply resourceful, real-world blueprints of how real, relatable professionals successfully navigated their career transitions into the candidate's target destination role.

CORE PRINCIPLE: REAL HUMAN PRECEDENTS & RESOURCEFUL ACTIONABLE BLUEPRINTS:
- NEVER use generic placeholder names (NEVER output "Verified Industry Leader", "John Doe", or vague generalizations).
- You MUST name REAL, KNOWN, DOCUMENTED PROFESSIONALS who actually made transitions into or within the target domain (e.g., Swyx / Shawn Wang, Kelsey Hightower, Julia Evans, Mitchell Hashimoto, Charity Majors, Ken Norton, Lenny Rachitsky, Dan Abramov, Gergely Orosz, or real engineers/leaders with documented public career histories).
- Prioritize RELATABILITY over celebrity status: highlight people who started from support, non-technical roles, junior roles, or self-taught backgrounds.

FOR EACH RESEARCHED PROFESSIONAL (Minimum 3, up to 5):
1. "name": Real, full name of the practitioner.
2. "currentRole": Their actual current role and recognizable company or project.
3. "company": Company name.
4. "startingPoint": Where they genuinely started before their breakthrough (e.g., "Finance analyst writing Excel spreadsheets", "Customer support specialist answering tickets", "Self-taught coder building toy scripts").
5. "careerSteps": The exact chronological sequence of 3-5 real roles they traversed.
6. "skills": The high-leverage technical and practical skills they acquired during the transition.
7. "experiences": Key inflection experiences (e.g., "Built an open-source tool that reached 5,000 GitHub stars", "Led an emergency database migration under high load", "Published an architectural breakdown on Substack").
8. "transitions": The EXACT catalytic breakthrough move that allowed them to transition without credentials.
9. "relevanceToCandidate": A CONCRETE, TACTICAL ACTION BLUEPRINT for this candidate — Explain how this candidate can emulate their exact transition playbook based on their current demonstrated abilities.
10. "sources": Citations with URLs or documented references (e.g. GitHub, personal blog, LinkedIn, tech podcasts, conference talks).

STRICT DIRECTIVES:
- NO SAP: Absolutely do not mention, reference, or suggest SAP in any form. Focus on modern open-source, cloud, full-stack, distributed systems, and modern tech ecosystems.
- NO HALLUCINATION OF ARBITRARY PERCENTAGES: State genuine observed patterns across profiles.
- Return structured output strictly matching the CareerTrajectoryOutput schema.
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
1. Synthesize 3-5 REAL, DOCUMENTED "professionals" with their chronological journeys:
   - Provide their REAL NAME and actual companies (e.g., Shawn Wang (Swyx), Kelsey Hightower, Julia Evans, Mitchell Hashimoto, or prominent relatable practitioners in the field).
   - "startingPoint": Where they genuinely began (e.g. non-CS background, customer support, junior QA, self-taught).
   - "careerSteps": The real sequence of 3-5 roles they progressed through.
   - "transitions": The exact pivotal breakthrough project or deliverable that catalyzed their career leap.
   - "skills": Specific high-leverage technical and practical competencies built.
   - "experiences": High-impact experiences and project scopes.
   - "relevanceToCandidate": A concrete, actionable blueprint: exactly what this candidate can build or publish to achieve a similar breakthrough.
   - "sources": Documented public citations (GitHub, tech blog, LinkedIn, podcast interview).
2. Identify "recurringPatterns" with supported frequency (e.g., "4 / 5") and explanations.
3. Define 2-3 distinct "routes" to the destination.
4. Select the candidate's "closestRoute", setting isClosestRoute to true, and explain WHY in "whyClosest".
5. Populate "stages", "commonSkills", "commonExperiences", and "commonTransitions".
6. Strictly avoid any mention of SAP.
7. Return structured output adhering strictly to CareerTrajectoryOutput schema.
`.trim();

  const output = await generateStructuredJson<CareerTrajectoryOutput>({
    agent: AZURE_FOUNDRY_AGENTS.trajectory,
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

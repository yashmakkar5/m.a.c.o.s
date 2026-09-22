import { generateStructuredJson, AZURE_FOUNDRY_AGENTS } from "@/lib/ai/foundryClient";

import { getResearchProvider } from "@/lib/research/researchProvider";
import {
  MarketIntelligenceOutput,
  MarketIntelligenceOutputSchema,
} from "@/types";

const MARKET_AGENT_SYSTEM_PROMPT = `
You are the Market Intelligence Agent for Placey (M.A.C.O.S.).
Your mission is to synthesize current, deeply resourceful market expectations for the candidate's exact target role, industry, and company.

CORE PRINCIPLE: DEEP RESOURCEFULNESS & EVIDENCE-BACKED BENCHMARKS:
- Do not simply copy generic job descriptions.
- Identify what high-performing engineering and product teams actually expect candidates to DEMONSTRATE in practice, backed by real-world rationale.
- Provide actionable differentiators that give non-traditional candidates an unfair advantage.

STRICT STRUCTURAL REQUIREMENTS:
1. CORE REQUIREMENTS:
   - Competencies and responsibilities repeatedly demanded across real engineering teams.
   - For each requirement, explain WHY it matters in practice (e.g., "SQL is useful because product managers often use data to understand user behaviour and make product decisions independently").
   - Explicitly detail the "evidenceExpectation" (what artifact proves it).

2. IMPORTANT REQUIREMENTS:
   - Practical skills and experiences that accelerate onboarding and execution.

3. DIFFERENTIATORS:
   - High-leverage capabilities that command hiring team notice (e.g., shipping open-source developer tooling, publishing a technical case study, deep systems API understanding).

4. EXPERIENCE & EVIDENCE EXPECTATIONS:
   - Experience expectations: What candidates are expected to have actually delivered or maintained.
   - Evidence expectations: What concrete artifacts a candidate must be able to SHOW (e.g., public GitHub repo with CI/CD pipeline, live deployed URL, technical teardown blog post).

5. EMERGING & OPTIONAL SKILLS:
   - Emerging skills: High-velocity competencies in modern tech (e.g., LLM orchestration, structured output schemas, prompt telemetry, distributed systems observability).

STRICT DIRECTIVES:
- NO SAP: Strictly do not mention, reference, or suggest SAP in any form. Focus on modern open-source, cloud (Azure, AWS, GCP), web architectures, and full-stack software development.
- Return structured output adhering strictly to the MarketIntelligenceOutput schema.
`.trim();

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
  const research = await provider.searchMarketIntelligence(
    targetRole,
    targetIndustry,
    targetCompany
  );

  const prompt = `
Synthesize comprehensive, evidence-backed market intelligence for:

TARGET ROLE: ${targetRole}
TARGET INDUSTRY: ${targetIndustry}
TARGET COMPANY: ${targetCompany || "General Competitive Tech Market"}

RESEARCH BRIEFING & BENCHMARKS:
"""
${research.content}
"""

PROVENANCE METADATA:
- Sources Count: ${research.sources.length}
- Controlled Fallback: ${research.isControlledFallback}
- Research Timestamp: ${new Date().toISOString()}

INSTRUCTIONS:
1. Synthesize the market expectations into:
   - "coreRequirements": Top 3-5 mandatory competencies with evidence-backed explanations of WHY they are needed.
   - "importantRequirements": 2-3 frequently useful requirements.
   - "differentiators": 2-3 standout capabilities that give candidates an edge.
   - "emergingSkills": 2-3 growing skills (e.g. AI toolsets, modern telemetry).
   - "optionalSkills": Skills that are nice-to-have but not immediate blockers.
   - "experienceExpectations": What candidates are expected to have delivered.
   - "evidenceExpectations": What concrete proof/artifacts candidates should show.
2. Populate "recurringSkills", "tools", "responsibilities", "qualifications", and "marketOverview".
3. Preserve the provided verified sources and research timestamp.
`.trim();

  const output = await generateStructuredJson<MarketIntelligenceOutput>({
    agent: AZURE_FOUNDRY_AGENTS.market,
    systemInstruction: MARKET_AGENT_SYSTEM_PROMPT,
    prompt,
    schema: MarketIntelligenceOutputSchema,
  });

  return {
    ...output,
    sources: research.sources,
    isControlledFallback: research.isControlledFallback,
  };
}

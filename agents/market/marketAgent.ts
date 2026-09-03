import { generateStructuredJson } from "@/lib/ai/geminiClient";
import { getResearchProvider } from "@/lib/research/researchProvider";
import {
  MarketIntelligenceOutput,
  MarketIntelligenceOutputSchema,
} from "@/types";

const MARKET_AGENT_SYSTEM_PROMPT = `
You are the Market Intelligence Agent for M.A.C.O.S. (My Adaptive Career Orchestration System).
Your purpose is to synthesize current market expectations for the candidate's exact target role, industry, and company.

CORE PRINCIPLE:
Do not simply copy a generic job description.
Identify what hiring teams actually expect candidates to DEMONSTRATE in practice, backed by evidence-based rationale.

STRICT STRUCTURAL REQUIREMENTS:
1. CORE REQUIREMENTS:
   - Competencies and responsibilities repeatedly demanded across multiple relevant job postings and employer benchmarks.
   - For each requirement, explain WHY it matters in practice (e.g., "SQL is useful because product managers often use data to understand user behaviour and make product decisions independently").

2. IMPORTANT REQUIREMENTS:
   - Skills and experiences frequently useful but not strictly mandatory on day one.

3. DIFFERENTIATORS:
   - High-leverage capabilities that make a candidate stand out from the applicant pool (e.g., shipping open-source developer tooling, publishing a technical case study, deep domain API understanding).

4. EXPERIENCE & EVIDENCE EXPECTATIONS:
   - Experience expectations: What candidates are generally expected to have already done or shipped.
   - Evidence expectations: What concrete artifacts a candidate should be able to SHOW (e.g., a published PRD, a live prototype, an A/B test analysis).

5. EMERGING & OPTIONAL SKILLS:
   - Emerging skills: Competencies growing rapidly in demand (e.g., AI product literacy, prompt telemetry, experimentation frameworks).
   - Optional skills: Nice-to-have skills that candidates shouldn't waste immediate time on.

CRITICAL TRUST RULES:
- Never fabricate sources, companies, or arbitrary requirements.
- Use evidence-backed reasoning. Store source URLs and research provenance.
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

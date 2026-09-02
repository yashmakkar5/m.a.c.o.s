import { generateStructuredJson } from "@/lib/ai/geminiClient";
import { getResearchProvider } from "@/lib/research/researchProvider";
import {
  MarketIntelligenceOutput,
  MarketIntelligenceOutputSchema,
} from "@/types";

const MARKET_AGENT_SYSTEM_PROMPT = `
You are the Market Intelligence Agent for M.A.C.O.S. (My Adaptive Career Orchestration System).
Your purpose is to synthesize verified market data regarding what a target career role actually demands today.

STRICT PRINCIPLES:
1. NEVER fabricate live sources or invent arbitrary requirements.
2. Ground all insights directly in the supplied market research briefing.
3. Distinguish baseline qualifications from decisive evidence expectations.
4. Return structured JSON conforming to the MarketIntelligenceOutput schema.
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
Synthesize the market expectations for the target role based on the following verified research briefing:

TARGET ROLE: ${targetRole}
TARGET INDUSTRY: ${targetIndustry}
TARGET COMPANY: ${targetCompany || "General Market"}

RESEARCH BRIEFING:
"""
${research.content}
"""

PROVENANCE:
- Controlled Benchmark Fallback: ${research.isControlledFallback}
- Sources count: ${research.sources.length}

Format the output strictly conforming to the MarketIntelligenceOutput schema, preserving the provided sources and setting isControlledFallback to ${research.isControlledFallback}.
`.trim();

  const output = await generateStructuredJson<MarketIntelligenceOutput>({
    systemInstruction: MARKET_AGENT_SYSTEM_PROMPT,
    prompt,
    schema: MarketIntelligenceOutputSchema,
  });

  // Ensure source provenance is preserved
  return {
    ...output,
    sources: research.sources,
    isControlledFallback: research.isControlledFallback,
  };
}

import { generateStructuredJson } from "@/lib/ai/geminiClient";
import { CandidateProfile, CandidateProfileSchema } from "@/types";

const PROFILE_EXTRACTOR_SYSTEM_PROMPT = `
You are the Profile Extraction Specialist for M.A.C.O.S. (My Adaptive Career Orchestration System).
Your objective is to ingest raw candidate resume text along with their target career ambitions, and extract an objective, strictly accurate structured profile.

CRITICAL RULES:
1. NEVER INVENT OR HALLUCINATE INFORMATION. Every skill, project, role, or qualification must be traceable to the candidate's input.
2. DISTINGUISH EVIDENCE FROM CLAIMS:
   - "demonstratedCapabilities": Things the candidate has demonstrably built, shipped, or delivered with tangible evidence.
   - "skills" & "technologies": Specific tools, languages, and competencies mentioned.
   - "evidence": Specific artifacts, links, metrics, or tangible project outputs.
3. EXPLICITLY IDENTIFY MISSING INFORMATION in the "missingInformation" array (e.g., "Missing metrics for project impacts", "No verifiable link provided for DevFlow project", "No stated proficiency in cloud deployment").
4. Return strictly valid JSON adhering to the CandidateProfile schema.
`.trim();

export interface ExtractProfileParams {
  resumeText: string;
  targetRole: string;
  targetIndustry?: string;
  targetCompany?: string;
  additionalContext?: string;
}

export async function extractCandidateProfile({
  resumeText,
  targetRole,
  targetIndustry = "",
  targetCompany = "",
  additionalContext = "",
}: ExtractProfileParams): Promise<CandidateProfile> {
  const userPrompt = `
Analyze the following candidate resume and career destination parameters:

TARGET CAREER DESTINATION:
- Target Role: "${targetRole}"
- Target Industry: "${targetIndustry || "Technology / Software"}"
- Target Company: "${targetCompany || "Unspecified"}"

ADDITIONAL CANDIDATE NOTES:
${additionalContext ? `"${additionalContext}"` : "None provided."}

RAW RESUME TEXT:
"""
${resumeText}
"""

Extract the candidate's education, experience, projects, certifications, achievements, technologies, demonstrated capabilities, tangible evidence items, and explicitly list any missing information or ambiguities.
Return the result strictly conforming to the requested schema.
`.trim();

  return await generateStructuredJson<CandidateProfile>({
    systemInstruction: PROFILE_EXTRACTOR_SYSTEM_PROMPT,
    prompt: userPrompt,
    schema: CandidateProfileSchema,
  });
}

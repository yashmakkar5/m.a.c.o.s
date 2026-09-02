import { NextRequest, NextResponse } from "next/server";
import { getAnalysisRecordById } from "@/lib/supabase/analysisRepository";
import { generateChatResponse } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysisId, messages, section, focusedItem } = body;

    if (!analysisId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "analysisId and non-empty messages array are required." },
        { status: 400 }
      );
    }

    const analysis = await getAnalysisRecordById(analysisId);
    if (!analysis) {
      return NextResponse.json(
        { success: false, error: "Analysis record not found for the provided ID." },
        { status: 404 }
      );
    }

    const contextSummary = `
CONTEXT FOR CANDIDATE:
- Target Role: ${analysis.target_role}
- Target Industry: ${analysis.target_industry || "Technology"}
- Target Company: ${analysis.target_company || "None specified"}
- Candidate: ${analysis.candidate_profile?.fullName || "Candidate"} (${analysis.candidate_profile?.headline || "Practitioner"})
- Overall Readiness Score: ${analysis.gap_analysis?.readinessScore ?? "N/A"}/100 (Evidence-matching benchmark, not a hiring probability)
- Competitive Advantage: ${analysis.gap_analysis?.keyCompetitiveAdvantage || "Demonstrated foundational technical execution"}

DEMONSTRATED SKILLS:
${analysis.skills_analysis?.demonstratedSkills?.map((s) => `- ${s.skill} (Evidence: ${s.evidence}, Confidence: ${s.confidence})`).join("\n") || "None"}

UNCERTAIN SKILLS / MISSING INFO:
${analysis.skills_analysis?.uncertainSkills?.map((u) => `- ${u.skill} (${u.reason})`).join("\n") || "None"}

CRITICAL GAPS:
Skill Gaps: ${analysis.gap_analysis?.skillGaps?.map((g) => `${g.gap} [${g.priority}]: ${g.candidateEvidence} vs ${g.marketRequirement}`).join("; ") || "None"}
Experience Gaps: ${analysis.gap_analysis?.experienceGaps?.map((g) => `${g.gap} [${g.priority}]: ${g.candidateEvidence} vs ${g.marketRequirement}`).join("; ") || "None"}
Evidence Gaps: ${analysis.gap_analysis?.evidenceGaps?.map((g) => `${g.gap} [${g.priority}]: ${g.candidateEvidence} vs ${g.marketRequirement}`).join("; ") || "None"}

RECOMMENDED 4-STAGE PATHWAY:
LEARN: ${analysis.pathway?.stages?.LEARN?.map((a) => a.title).join("; ") || "None"}
BUILD: ${analysis.pathway?.stages?.BUILD?.map((a) => a.title).join("; ") || "None"}
DEMONSTRATE: ${analysis.pathway?.stages?.DEMONSTRATE?.map((a) => a.title).join("; ") || "None"}
REASSESS: ${analysis.pathway?.stages?.REASSESS?.map((a) => a.title).join("; ") || "None"}

TRAJECTORY PATTERNS:
${analysis.trajectory_analysis?.recurringTrajectoryStages?.map((s) => `Stage ${s.stageNumber}: ${s.stageName}`).join(" -> ") || "None"}
${section ? `\nUSER IS CURRENTLY VIEWING: ${section}` : ""}
${focusedItem ? `FOCUSED ITEM / CONTEXT: ${focusedItem}` : ""}
`.trim();

    const systemInstruction = `
You are "Ask M.A.C.O.S.", a clear, human, and empathetic career navigation mentor.
You have access to the user's complete verified Career Orchestration analysis.

COMMUNICATION STYLE (STRICT RULES):
1. USE PLAIN ENGLISH: Speak like an experienced, thoughtful senior mentor advising a student or career switcher.
2. PREFER SHORT SENTENCES & CLEAR VERBS: Avoid dense academic AI jargon (e.g. avoid "competency deficit", "multidimensional quantitative evaluation", "trajectory-derived telemetry").
3. PUT THE MAIN CONCLUSION FIRST:
   - "Here's what this means for you:"
   - "Your biggest gap is..."
   - "You already have..."
   - "The reason this matters is..."
   - "Your next best step is..."
4. PERSONALIZED REASONING OVER GENERIC ADVICE:
   - When asked "Why is this my biggest gap?" or "Why did you recommend this project?", contrast what the candidate ALREADY has with what is missing.
   - Example: "Your profile already shows strong software engineering skills, so M.A.C.O.S. isn't recommending another coding tutorial. The missing piece is product-level evidence like user specs or metrics instrumentation. That's why this is your top priority."
5. AVOID EXAGGERATED CERTAINTY: Never guarantee hiring outcomes. State clearly what is fact from the resume vs. what is inferred from market patterns.
6. CONCISE BULLET POINTS: Keep answers direct, friendly, and structured.
`.trim();

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      content: m.content,
    }));

    const enhancedMessages = [
      {
        role: "user" as const,
        content: `Here is the current verified analysis data:\n\n${contextSummary}\n\nPlease keep this context in mind for all answers.`,
      },
      {
        role: "model" as const,
        content: `I have thoroughly reviewed your career analysis for ${analysis.target_role}. I'm here to explain what your gaps mean, why specific steps are recommended, and what you should tackle first.`,
      },
      ...formattedMessages,
    ];

    const reply = await generateChatResponse({
      systemInstruction,
      messages: enhancedMessages,
    });

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error in chat";
    console.error("[POST /api/chat Error]:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

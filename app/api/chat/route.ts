import { NextRequest, NextResponse } from "next/server";
import { getAnalysisRecordById } from "@/lib/supabase/analysisRepository";
import { generateChatResponse } from "@/lib/ai/geminiClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysisId, messages } = body;

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
- Overall Readiness Score: ${analysis.gap_analysis?.readinessScore ?? "N/A"}/100
- Competitive Advantage: ${analysis.gap_analysis?.keyCompetitiveAdvantage || "Demonstrated foundational skills"}

DEMONSTRATED SKILLS:
${analysis.skills_analysis?.demonstratedSkills?.map((s) => `- ${s.skill} (Evidence: ${s.evidence}, Confidence: ${s.confidence})`).join("\n") || "None"}

UNCERTAIN SKILLS / MISSING INFO:
${analysis.skills_analysis?.uncertainSkills?.map((u) => `- ${u.skill} (${u.reason})`).join("\n") || "None"}

CRITICAL GAPS:
Skill Gaps: ${analysis.gap_analysis?.skillGaps?.map((g) => `${g.gap} [${g.priority}]`).join("; ") || "None"}
Experience Gaps: ${analysis.gap_analysis?.experienceGaps?.map((g) => `${g.gap} [${g.priority}]`).join("; ") || "None"}
Evidence Gaps: ${analysis.gap_analysis?.evidenceGaps?.map((g) => `${g.gap} [${g.priority}]`).join("; ") || "None"}

RECOMMENDED PATHWAY:
LEARN: ${analysis.pathway?.stages?.LEARN?.map((a) => a.title).join("; ") || "None"}
BUILD: ${analysis.pathway?.stages?.BUILD?.map((a) => a.title).join("; ") || "None"}
DEMONSTRATE: ${analysis.pathway?.stages?.DEMONSTRATE?.map((a) => a.title).join("; ") || "None"}
REASSESS: ${analysis.pathway?.stages?.REASSESS?.map((a) => a.title).join("; ") || "None"}

TRAJECTORY PATTERNS OBSERVED:
${analysis.trajectory_analysis?.recurringTrajectoryStages?.map((s) => `Stage ${s.stageNumber}: ${s.stageName}`).join(" -> ") || "None"}
`.trim();

    const systemInstruction = `
You are "Ask M.A.C.O.S.", the context-aware career navigation mentor for this user.
You have access to the user's complete validated Career Orchestration analysis.

STRICT BEHAVIOR RULES:
1. Ground all answers in the stored analysis above.
2. If asked "Why is this my biggest gap?" or "Why did you recommend this project?", explain using the specific candidate evidence, market requirements, and trajectory signals captured in the analysis.
3. Be candid, encouraging, tactical, and evidence-first. Do not give vague platitudes like "network more" without actionable steps.
4. If asked about topics outside this specific analysis, explicitly state: "[General Career Guidance]" before answering.
5. Keep answers concise, articulate, and formatted with clean markdown bullet points.
`.trim();

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      content: m.content,
    }));

    // Inject context into the prompt
    const enhancedMessages = [
      {
        role: "user" as const,
        content: `Here is the current verified analysis data:\n\n${contextSummary}\n\nPlease keep this context in mind for all answers.`,
      },
      {
        role: "model" as const,
        content: `I have thoroughly ingested your career analysis for ${analysis.target_role}. I am ready to answer any questions about your gaps, milestones, market requirements, or trajectory patterns.`,
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

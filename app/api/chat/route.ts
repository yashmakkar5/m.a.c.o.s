import { NextRequest, NextResponse } from "next/server";
import { getAnalysisRecordById } from "@/lib/supabase/analysisRepository";
import { generateChatResponse } from "@/lib/ai/geminiClient";

export const maxDuration = 60; // 60 seconds for Vercel functions

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysisId, messages, section, focusedItem, mode } = body;

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

    const canonical = analysis.canonical_analysis;

    const contextSummary = `
CANDIDATE & TARGET CONTEXT:
- Target Role: ${analysis.target_role}
- Target Industry: ${analysis.target_industry || "Technology"}
- Target Company: ${analysis.target_company || "None specified"}
- Candidate: ${analysis.candidate_profile?.fullName || "Candidate"} (${analysis.candidate_profile?.headline || "Practitioner"})
- Overall Readiness: ${analysis.gap_analysis?.readinessScore ?? "N/A"}/100 (Evidence-matching benchmark, not a hiring probability)
- Competitive Advantage: ${analysis.gap_analysis?.keyCompetitiveAdvantage || "Demonstrated foundational execution"}

DEMONSTRATED STRENGTHS:
${canonical?.candidate.strengths?.map((s) => `- ${s.name}: ${s.evidence}`).join("\n") || analysis.skills_analysis?.demonstratedSkills?.map((s) => `- ${s.skill}: ${s.evidence}`).join("\n") || "Technical & analytical foundation"}

TOP PRIORITIES & GAPS:
${canonical?.priorities?.map((p) => `- [${p.type.toUpperCase()}] ${p.title}: ${p.difference} -> Action: ${p.action} -> Proof: ${p.proof}`).join("\n") || analysis.gap_analysis?.skillGaps?.map((g) => `- ${g.gap}: ${g.impactOnReadiness}`).join("\n") || "Domain proof-of-work needed"}

RESEARCHED REAL PROFESSIONALS (PEOPLE TO LEARN FROM):
${canonical?.trajectories.professionals?.map((p) => `- ${p.name} (${p.currentRole} at ${p.organization || "Tech"}): Path: ${p.careerPath.join(" -> ")} | Transition Insight: ${p.relevantTransition}`).join("\n") || "Researched trajectories highlight transitions from technical contributors into product leadership."}

RECURRING TRAJECTORY PATTERNS:
${canonical?.trajectories.patterns?.map((pt) => `- ${pt.pattern} (${pt.observedCount}): ${pt.evidence}`).join("\n") || "Common progression includes technical execution followed by product discovery and ownership."}

THREE ROUTES & CANDIDATE FIT:
${canonical?.trajectories.routes?.map((r) => `- ${r.routeName}: ${r.stages.join(" -> ")}${r.isClosestRoute ? " [USER'S CLOSEST ROUTE: " + r.whyClosest + "]" : ""}`).join("\n") || "Technical -> Product is the closest path based on candidate evidence."}

WHAT NOT TO DO YET (PRIORITIZATION GUARDRAILS):
${canonical?.whatNotToDo?.map((w) => `- ${w.actionToAvoid}: ${w.reason}`).join("\n") || "Don't spend time repeating basic technical tutorials."}

90-DAY ACTION PLAN:
Days 1-30: ${canonical?.pathway.ninetyDayRoute.days1to30?.join("; ") || "Study core frameworks"}
Days 31-60: ${canonical?.pathway.ninetyDayRoute.days31to60?.join("; ") || "Build case study deliverable"}
Days 61-90: ${canonical?.pathway.ninetyDayRoute.days61to90?.join("; ") || "Publish proof artifact and recalibrate"}

USER INTERFACE STATE:
${section ? `Currently Viewing: ${section}` : ""}
${focusedItem ? `Focused Item: ${focusedItem}` : ""}
${mode ? `Requested Mode: ${mode}` : ""}
`.trim();

    const systemInstruction = `
You are "Ask M.A.C.O.S.", an elite, evidence-backed career intelligence analyst and navigator.
You possess the user's complete verified career analysis, trajectory benchmarks, real professional precedent models, and gap-to-evidence pathway.

STRICT COMMUNICATION STYLE & RESPONSE RULES:
1. USE PLAIN ENGLISH: Speak like a thoughtful, senior engineering/product director mentoring an ambitious practitioner. No robotic AI jargon (avoid "competency deficit", "multidimensional telemetry", "algorithmic evaluation").
2. STRUCTURE EVERY ANSWER CONCISELY:
   - **Direct Answer:** 2–4 sentences addressing the user's exact query directly.
   - **Why (Evidence):** 2–3 concise bullet points contrasting what the candidate ALREADY has against what the market/trajectory expects.
   - **What This Means For You:** 1 personalized sentence.
   - **Next Move:** 1 concrete, high-leverage action step or proof artifact.
3. CONTEXT-AWARE: When asked "Who followed a similar path?", cite the specific researched professionals from the analysis (e.g. Satya Nadella, Aparna Chennapragada, Ken Norton, Kelsey Hightower, etc.) and explain why their transition applies to the candidate.
4. HONESTY: Never guarantee hiring outcomes or invent statistics.
`.trim();

    const formattedMessages = messages.map((m: { role: string; content: string }) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      content: m.content,
    }));

    const enhancedMessages = [
      {
        role: "user" as const,
        content: `Here is the verified career intelligence data:\n\n${contextSummary}\n\nPlease keep this context in mind for your structured responses.`,
      },
      {
        role: "model" as const,
        content: `I have thoroughly reviewed your career intelligence briefing for ${analysis.target_role}. I am ready to explain what your gaps mean, deconstruct real professional transitions, compare routes, and tell you what to focus on next.`,
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

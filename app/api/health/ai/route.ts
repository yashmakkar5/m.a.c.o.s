import { NextResponse } from "next/server";
import { isGeminiConfigured, pingGemini, DEFAULT_GEMINI_MODEL } from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isGeminiConfigured()) {
    return NextResponse.json({
      configured: false,
      provider: "Gemini",
      status: "not_configured",
      model: DEFAULT_GEMINI_MODEL,
      error: "Gemini authentication failed: GEMINI_API_KEY is not configured.",
    }, { status: 503 });
  }

  const result = await pingGemini();

  if (result.success) {
    return NextResponse.json({
      configured: true,
      provider: "Gemini",
      status: "ok",
      model: result.model,
      latencyMs: result.latencyMs,
    });
  }

  return NextResponse.json(
    {
      configured: true,
      provider: "Gemini",
      status: "error",
      model: result.model,
      error: result.error || "Failed to communicate with Gemini API.",
    },
    { status: 502 }
  );
}

import { NextResponse } from "next/server";
import { isGeminiConfigured, pingGemini } from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isGeminiConfigured()) {
    return NextResponse.json({
      configured: false,
      provider: "Gemini",
      status: "not_configured",
    });
  }

  const result = await pingGemini();

  if (result.success) {
    return NextResponse.json({
      configured: true,
      provider: "Gemini",
      status: "ok",
      latencyMs: result.latencyMs,
    });
  }

  return NextResponse.json(
    {
      configured: true,
      provider: "Gemini",
      status: "error",
      message: result.error || "Failed to communicate with Gemini API.",
    },
    { status: 502 }
  );
}

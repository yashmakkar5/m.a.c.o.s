import { NextResponse } from "next/server";
import { isAzureFoundryConfigured, pingAzureFoundry, DEFAULT_AZURE_MODEL } from "@/lib/ai/azureFoundry";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAzureFoundryConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        provider: "Azure AI Foundry (AI-103)",
        status: "not_configured",
        model: DEFAULT_AZURE_MODEL,
        error: "Azure AI Foundry authentication failed: AZURE_AI_FOUNDRY_API_KEY is not configured.",
      },
      { status: 503 }
    );
  }

  const result = await pingAzureFoundry();

  if (result.success) {
    return NextResponse.json({
      configured: true,
      provider: "Azure AI Foundry (AI-103)",
      status: "ok",
      model: result.model,
      latencyMs: result.latencyMs,
    });
  }

  return NextResponse.json(
    {
      configured: true,
      provider: "Azure AI Foundry (AI-103)",
      status: "error",
      model: result.model,
      error: result.error || "Failed to communicate with Azure AI Foundry API.",
    },
    { status: 502 }
  );
}

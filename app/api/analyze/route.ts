import { NextRequest, NextResponse } from "next/server";
import { parseResumeBuffer, validateResumeFile } from "@/lib/parsing/resumeParser";
import { orchestrateCareerAnalysis } from "@/agents/orchestrator/careerOrchestrator";

export const maxDuration = 60; // 60 seconds for Vercel functions

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume") as File | null;
    const targetRole = (formData.get("targetRole") as string | null)?.trim();
    const targetIndustry = ((formData.get("targetIndustry") as string | null) || "").trim();
    const targetCompany = ((formData.get("targetCompany") as string | null) || "").trim();
    const additionalContext = ((formData.get("additionalContext") as string | null) || "").trim();

    // 1. Validate Target Role
    if (!targetRole) {
      return NextResponse.json(
        { success: false, error: "Please provide a target role (e.g., 'Product Manager', 'AI Engineer')." },
        { status: 400 }
      );
    }

    // 2. Validate Resume File Presence
    if (!resumeFile || !(resumeFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: "A resume document (.pdf or .docx) is required for career analysis." },
        { status: 400 }
      );
    }

    // 3. Validate File Format and Size
    const validation = validateResumeFile(resumeFile.name, resumeFile.size, resumeFile.type);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 4. Extract Text from File Buffer
    const arrayBuffer = await resumeFile.arrayBuffer();
    const parseResult = await parseResumeBuffer(arrayBuffer, resumeFile.name);

    if (!parseResult.text || parseResult.text.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract sufficient text from the document. Please verify the file is not scanned, password-protected, or image-only.",
        },
        { status: 400 }
      );
    }

    // 5. Run Career Orchestrator
    const completedAnalysis = await orchestrateCareerAnalysis({
      resumeFileName: resumeFile.name,
      resumeText: parseResult.text,
      targetRole,
      targetIndustry: targetIndustry || "Technology",
      targetCompany,
      additionalContext,
    });

    return NextResponse.json({
      success: true,
      analysisId: completedAnalysis.id,
      data: completedAnalysis,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
    console.error("[POST /api/analyze Error]:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

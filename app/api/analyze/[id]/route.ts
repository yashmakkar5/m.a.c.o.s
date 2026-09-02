import { NextRequest, NextResponse } from "next/server";
import { getAnalysisRecordById } from "@/lib/supabase/analysisRepository";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Analysis ID is required." },
        { status: 400 }
      );
    }

    const record = await getAnalysisRecordById(id);

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Analysis record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { isSupabaseServerConfigured, pingSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({
      configured: false,
      provider: "Supabase",
      status: "not_configured",
      message: "Supabase environment variables (URL/Key) are not configured.",
    });
  }

  const result = await pingSupabase();

  if (result.success) {
    return NextResponse.json({
      configured: true,
      provider: "Supabase",
      status: "ok",
      latencyMs: result.latencyMs,
      tableFound: result.tableFound ?? true,
    });
  }

  return NextResponse.json(
    {
      configured: true,
      provider: "Supabase",
      status: "error",
      message: result.error || "Failed to communicate with Supabase PostgreSQL database.",
    },
    { status: 502 }
  );
}

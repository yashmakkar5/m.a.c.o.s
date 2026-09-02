import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, RefreshCw, AlertTriangle, Activity, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGeminiConfigured, pingGemini } from "@/lib/ai/gemini";
import { isSupabaseServerConfigured, pingSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  // 1. Application check
  const appStatus = {
    name: "Application Server",
    status: "OK",
    badge: "Operational",
    isOk: true,
    detail: "Next.js 16 (Turbopack) server running and serving routes.",
  };

  // 2. Gemini Live Check
  const geminiConfigured = isGeminiConfigured();
  let geminiStatus = {
    name: "Gemini AI Engine",
    status: "Not configured",
    badge: "Missing Key",
    isOk: false,
    detail: "Add GEMINI_API_KEY to .env.local to enable AI orchestration.",
  };

  if (geminiConfigured) {
    const ping = await pingGemini();
    if (ping.success) {
      geminiStatus = {
        name: "Gemini AI Engine",
        status: "Connected",
        badge: `${ping.model} (${ping.latencyMs}ms)`,
        isOk: true,
        detail: `Official Google GenAI SDK connected to ${ping.model} and responsive.`,
      };
    } else {
      geminiStatus = {
        name: "Gemini AI Engine",
        status: "Error",
        badge: "API Failed",
        isOk: false,
        detail: ping.error || "Unable to reach Gemini API. Verify key permissions.",
      };
    }
  }

  // 3. Supabase Live Check
  const supabaseConfigured = isSupabaseServerConfigured();
  let supabaseStatus = {
    name: "Supabase PostgreSQL & Storage",
    status: "Not configured",
    badge: "Missing Keys",
    isOk: false,
    detail: "Add Supabase credentials to .env.local (resilient in-memory fallback active).",
  };

  if (supabaseConfigured) {
    const ping = await pingSupabase();
    if (ping.success) {
      supabaseStatus = {
        name: "Supabase PostgreSQL & Storage",
        status: "Connected",
        badge: `Live (${ping.latencyMs}ms)`,
        isOk: true,
        detail: ping.tableFound === false
          ? "Connected to PostgreSQL, but 'analyses' table is not yet created. Run the migration SQL."
          : "Supabase PostgreSQL connected, authenticated, and 'analyses' table verified.",
      };
    } else {
      supabaseStatus = {
        name: "Supabase PostgreSQL & Storage",
        status: "Error",
        badge: "Query Failed",
        isOk: false,
        detail: ping.error || "Unable to reach Supabase PostgreSQL database.",
      };
    }
  }

  const checks = [appStatus, geminiStatus, supabaseStatus];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 text-white">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs text-[#9a93a5] hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-[#d5d0dd]">
          <Activity className="h-3.5 w-3.5 text-[#c26e73]" />
          <span>System Health & Remote Telemetry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          M.A.C.O.S. System Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-[#9a93a5] max-w-2xl">
          Real-time diagnostic monitor testing Next.js, Google Gemini, and Supabase connectivity without exposing secret values.
        </p>
      </div>

      {/* Main Health Diagnostic Panel */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="divide-y divide-white/[0.06]">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-start justify-between py-5 first:pt-0 last:pb-0 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm sm:text-base text-white">{check.name}:</p>
                  <span className="font-extrabold text-sm text-[#d5d0dd]">{check.status}</span>
                </div>
                <p className="text-xs text-[#9a93a5] leading-relaxed">{check.detail}</p>
              </div>

              <div className="shrink-0">
                {check.isOk ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 shadow-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {check.badge}
                  </span>
                ) : check.status === "Error" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400 shadow-xs">
                    <XCircle className="h-3.5 w-3.5" />
                    {check.badge}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400 shadow-xs">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {check.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Developer Endpoints Reference */}
        <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-4 text-xs space-y-2">
          <p className="font-bold text-white uppercase tracking-wider text-[10px]">
            API Health Check Endpoints
          </p>
          <ul className="space-y-1.5 text-[#9a93a5] text-[11px]">
            <li className="flex items-center justify-between">
              <span>Overall Server Status:</span>
              <code className="font-mono bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded text-white">/api/health</code>
            </li>
            <li className="flex items-center justify-between">
              <span>Gemini Connection Ping:</span>
              <code className="font-mono bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded text-[#ac1ed6]">/api/health/ai</code>
            </li>
            <li className="flex items-center justify-between">
              <span>Supabase Database Query:</span>
              <code className="font-mono bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded text-[#c26e73]">/api/health/db</code>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <Link href="/debug">
            <Button variant="outline" size="sm" className="rounded-full border-white/15 bg-white/[0.03] text-[#d5d0dd] hover:bg-white/[0.08] hover:text-white gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Re-check Status
            </Button>
          </Link>
          <Link href="/analyze">
            <Button size="sm" className="rounded-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white font-bold text-xs gap-1.5 shadow-md shadow-[#ac1ed6]/20">
              <span>Go to /analyze</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

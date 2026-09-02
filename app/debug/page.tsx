import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGeminiConfigured, pingGemini } from "@/lib/ai/gemini";
import { isSupabaseServerConfigured, pingSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  // 1. Application check
  const appStatus = {
    name: "Application",
    status: "OK",
    badge: "Operational",
    isOk: true,
    detail: "Next.js 16 (Turbopack) server running correctly.",
  };

  // 2. Gemini Live Check
  const geminiConfigured = isGeminiConfigured();
  let geminiStatus = {
    name: "Gemini AI",
    status: "Not configured",
    badge: "Missing GEMINI_API_KEY",
    isOk: false,
    detail: "Add GEMINI_API_KEY to .env.local to enable AI orchestration.",
  };

  if (geminiConfigured) {
    const ping = await pingGemini();
    if (ping.success) {
      geminiStatus = {
        name: "Gemini AI",
        status: "Connected",
        badge: `Connected (${ping.latencyMs}ms)`,
        isOk: true,
        detail: "Official Google GenAI SDK initialized and responsive.",
      };
    } else {
      geminiStatus = {
        name: "Gemini AI",
        status: "Error",
        badge: "API Call Failed",
        isOk: false,
        detail: ping.error || "Unable to reach Gemini API. Verify API key and network connectivity.",
      };
    }
  }

  // 3. Supabase Live Check
  const supabaseConfigured = isSupabaseServerConfigured();
  let supabaseStatus = {
    name: "Supabase Database",
    status: "Not configured",
    badge: "Missing Keys",
    isOk: false,
    detail: "Add Supabase credentials to .env.local (resilient in-memory store active).",
  };

  if (supabaseConfigured) {
    const ping = await pingSupabase();
    if (ping.success) {
      supabaseStatus = {
        name: "Supabase Database",
        status: "Connected",
        badge: `Connected (${ping.latencyMs}ms)`,
        isOk: true,
        detail: ping.tableFound === false
          ? "Connected to PostgreSQL, but 'analyses' table is not yet created. Run the migration SQL."
          : "Supabase PostgreSQL connected and 'analyses' table verified.",
      };
    } else {
      supabaseStatus = {
        name: "Supabase Database",
        status: "Error",
        badge: "Query Failed",
        isOk: false,
        detail: ping.error || "Unable to reach Supabase PostgreSQL database.",
      };
    }
  }

  const checks = [appStatus, geminiStatus, supabaseStatus];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Home
          </Link>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Infrastructure Health Monitor
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          M.A.C.O.S. System Health
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Real-time diagnostics verifying Next.js, Gemini API, and Supabase connectivity without exposing secrets.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-6 shadow-xs">
        <div className="divide-y">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-start justify-between py-4 first:pt-0 last:pb-0 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">{check.name}:</p>
                  <span className="font-bold text-sm text-foreground">{check.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {check.isOk ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {check.badge}
                  </span>
                ) : check.status === "Error" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive border border-destructive/20">
                    <XCircle className="h-3.5 w-3.5" />
                    {check.badge}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {check.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-muted/50 p-4 text-xs space-y-2 border">
          <p className="font-semibold text-foreground">API Health Check Endpoints:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>
              Overall Server: <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/api/health</code>
            </li>
            <li>
              Gemini Connection: <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/api/health/ai</code>
            </li>
            <li>
              Supabase Connection: <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/api/health/db</code>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link href="/debug">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Re-check Status
            </Button>
          </Link>
          <Link href="/analyze">
            <Button size="sm" className="text-xs">
              Go to /analyze
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

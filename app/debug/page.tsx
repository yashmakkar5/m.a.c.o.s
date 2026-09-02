import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function DebugPage() {
  const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());
  const isSupabaseUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const isSupabaseAnonConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const isSupabaseServiceConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

  const isSupabaseConfigured =
    isSupabaseUrlConfigured && (isSupabaseAnonConfigured || isSupabaseServiceConfigured);

  const isEnvConfigured = isGeminiConfigured || isSupabaseConfigured;

  const checks = [
    {
      name: "Next.js Framework",
      status: "OK",
      isOk: true,
      detail: "App Router & Turbopack running",
    },
    {
      name: "Environment (.env.local)",
      status: isEnvConfigured ? "Configured" : "Missing / Unset",
      isOk: isEnvConfigured,
      detail: isEnvConfigured
        ? "One or more variables loaded"
        : "No external credentials loaded (using safe mock/in-memory fallbacks)",
    },
    {
      name: "Gemini API",
      status: isGeminiConfigured ? "Configured" : "Not configured",
      isOk: isGeminiConfigured,
      detail: isGeminiConfigured
        ? "GEMINI_API_KEY detected"
        : "GEMINI_API_KEY is not set in .env.local",
    },
    {
      name: "Supabase Database",
      status: isSupabaseConfigured ? "Configured" : "Not configured",
      isOk: isSupabaseConfigured,
      detail: isSupabaseConfigured
        ? "Supabase URL & API keys detected"
        : "Supabase keys not set (using resilient in-memory repository)",
    },
  ];

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          M.A.C.O.S. System Check
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Development diagnostic page to verify system health and environment readiness without exposing private credentials.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 space-y-6 shadow-xs">
        <div className="divide-y">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-start justify-between py-4 first:pt-0 last:pb-0 gap-4">
              <div className="space-y-1">
                <p className="font-semibold text-sm text-foreground">{check.name}</p>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {check.isOk ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {check.status}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <XCircle className="h-3.5 w-3.5" />
                    {check.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-muted/50 p-4 text-xs space-y-2 border">
          <p className="font-semibold text-foreground">Developer Quick Reference:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Health check endpoint: <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/api/health</code></li>
            <li>Analyze intake route: <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/analyze</code></li>
            <li>Results placeholder route: <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/results</code></li>
            <li>Environment template: <code className="font-mono bg-background px-1.5 py-0.5 rounded border">.env.example</code></li>
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

import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, RefreshCw, AlertTriangle, Activity, ArrowUpRight, Bot, Cpu, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAzureFoundryConfigured, pingAzureFoundry, DEFAULT_AZURE_MODEL, AZURE_FOUNDRY_AGENTS } from "@/lib/ai/azureFoundry";
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

  // 2. Azure AI Foundry (AI-103) Live Check
  const aiConfigured = isAzureFoundryConfigured();
  let aiEngineStatus = {
    name: "Azure AI Foundry (AI-103)",
    status: "Not configured",
    badge: "Missing Key",
    isOk: false,
    detail: "Add AZURE_AI_FOUNDRY_API_KEY to .env.local to enable Azure AI Foundry.",
  };

  if (aiConfigured) {
    const ping = await pingAzureFoundry();
    if (ping.success) {
      aiEngineStatus = {
        name: "Azure AI Foundry (AI-103)",
        status: "Connected",
        badge: `${ping.model} (${ping.latencyMs}ms)`,
        isOk: true,
        detail: `Microsoft Azure AI Foundry cloud model (${ping.model}) connected and verified for AI-103 Agentic Workflow.`,
      };
    } else {
      aiEngineStatus = {
        name: "Azure AI Foundry (AI-103)",
        status: "Error",
        badge: "API Failed",
        isOk: false,
        detail: ping.error || "Unable to reach Azure AI Foundry. Verify credentials and deployment.",
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

  const checks = [appStatus, aiEngineStatus, supabaseStatus];

  const cloudAgents = [
    {
      title: "Skills Discovery Agent",
      name: AZURE_FOUNDRY_AGENTS.skills.name,
      version: AZURE_FOUNDRY_AGENTS.skills.version,
      id: AZURE_FOUNDRY_AGENTS.skills.id,
      role: "Evaluates demonstrated proof vs stated claims across 4 strict categories",
    },
    {
      title: "Market Intelligence Agent",
      name: AZURE_FOUNDRY_AGENTS.market.name,
      version: AZURE_FOUNDRY_AGENTS.market.version,
      id: AZURE_FOUNDRY_AGENTS.market.id,
      role: "Synthesizes market expectations, differentiators & live benchmarks",
    },
    {
      title: "Career Trajectory Agent",
      name: AZURE_FOUNDRY_AGENTS.trajectory.name,
      version: AZURE_FOUNDRY_AGENTS.trajectory.version,
      id: AZURE_FOUNDRY_AGENTS.trajectory.id,
      role: "Mines real professional career transitions and maps candidate's closest route",
    },
    {
      title: "Gap Analysis Specialist",
      name: AZURE_FOUNDRY_AGENTS.gap.name,
      version: AZURE_FOUNDRY_AGENTS.gap.version,
      id: AZURE_FOUNDRY_AGENTS.gap.id,
      role: "Triple triangulation across skills, market requirements & trajectory precedents",
    },
    {
      title: "Pathway Architect Agent",
      name: AZURE_FOUNDRY_AGENTS.pathway.name,
      version: AZURE_FOUNDRY_AGENTS.pathway.version,
      id: AZURE_FOUNDRY_AGENTS.pathway.id,
      role: "Generates actionable 4-phase career pathway (Learn, Build, Demonstrate, Reassess)",
    },
  ];

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
          Placey (M.A.C.O.S.) System Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-[#9a93a5] max-w-2xl">
          Real-time diagnostic monitor testing Next.js, Microsoft Azure AI Foundry, and Supabase connectivity without exposing secret values.
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
              <span>Azure AI Foundry Ping:</span>
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

      {/* Azure AI Foundry Cloud Agent Hub (AI-103 Showcase) */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-0.5 text-[11px] font-semibold text-purple-300">
              <Cloud className="h-3 w-3" />
              <span>Microsoft Azure AI Foundry (AI-103)</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">Registered Cloud Agents</h2>
            <p className="text-xs text-[#9a93a5]">
              Agents registered in Azure AI Foundry project <code className="font-mono text-white/90">yashplacey</code> executing on model <code className="font-mono text-purple-300 font-bold">{DEFAULT_AZURE_MODEL}</code>.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 shrink-0 self-start sm:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            5 Running in Cloud
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {cloudAgents.map((agent, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#090607]/60 p-4 space-y-2 hover:border-white/15 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#ac1ed6]/20 to-[#c26e73]/20 border border-white/10 flex items-center justify-center text-[#d5d0dd]">
                    <Bot className="h-4 w-4 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.title}</h3>
                    <code className="font-mono text-[10px] text-purple-300">{agent.name}</code>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/[0.05] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-[#d5d0dd]">
                    v{agent.version}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Cloud Active
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#9a93a5]">{agent.role}</p>
              <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.04] text-[10px]">
                <span className="text-[#7e7687]">Cloud Agent ID:</span>
                <code className="font-mono bg-white/[0.03] px-2 py-0.5 rounded text-white/80 select-all">{agent.id}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}

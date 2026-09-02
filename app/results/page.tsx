import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResultsPlaceholderPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 text-white">
      <div className="space-y-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Link
            href="/analyze"
            className="text-xs text-[#9a93a5] hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to /analyze
          </Link>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-[#d5d0dd]">
          <Sparkles className="h-3.5 w-3.5 text-[#ac1ed6]" />
          <span>M.A.C.O.S. Career Map Results</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Career Navigation Results
        </h1>
        <p className="text-sm sm:text-base text-[#9a93a5] max-w-2xl">
          This route renders complete multi-agent analysis once an intake pipeline executes. Below is the architecture of what is generated for every candidate.
        </p>
      </div>

      {/* Development State Notice */}
      <div className="rounded-3xl border border-[#ac1ed6]/30 bg-[#ac1ed6]/10 p-6 sm:p-7 space-y-3 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <h3 className="font-bold text-white text-base">
              Career Map Pipeline Active & Connected
            </h3>
            <p className="text-[#d5d0dd] leading-relaxed">
              When you submit your resume and target role at <code className="font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 text-white">/analyze</code>, the orchestrator executes real Gemini agents and redirects directly to your unique, permanent Career Map.
            </p>
          </div>
        </div>
      </div>

      {/* Planned Sections Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#757080]">
            Core Output Pillars Generated Per Analysis
          </h2>
          <span className="text-[11px] font-mono text-[#ac1ed6]">6 AI Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-3 shadow-md hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <TrendingUp className="h-4 w-4 text-[#ac1ed6]" />
                1. Career Trajectory Intelligence
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#757080]" />
            </div>
            <p className="text-xs text-[#9a93a5] leading-relaxed">
              Macro progression stages and transition catalysts extracted from relevant public professional trajectories.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-3 shadow-md hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <AlertCircle className="h-4 w-4 text-[#c26e73]" />
                2. Triangulated Gap Map
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#757080]" />
            </div>
            <p className="text-xs text-[#9a93a5] leading-relaxed">
              Prioritized Skill, Experience, and Evidence gaps justified by Candidate Evidence + Market Demand + Trajectory Signals.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-3 shadow-md hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                3. Personalised 4-Stage Pathway
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#757080]" />
            </div>
            <p className="text-xs text-[#9a93a5] leading-relaxed">
              Tactical action items organized into LEARN → BUILD → DEMONSTRATE → REASSESS with explicit completion criteria.
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-3 shadow-md hover:border-white/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Compass className="h-4 w-4 text-purple-400" />
                4. Grounded &quot;Ask M.A.C.O.S.&quot; Assistant
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#757080]" />
            </div>
            <p className="text-xs text-[#9a93a5] leading-relaxed">
              Conversational assistant answering follow-up questions strictly grounded in the candidate&apos;s stored analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Link href="/analyze" className="w-full sm:w-auto">
          <Button size="lg" className="w-full rounded-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white font-bold gap-2 shadow-lg shadow-[#ac1ed6]/25">
            Build My Career Map
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/debug" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full rounded-full border-white/15 bg-white/[0.03] text-[#d5d0dd] hover:bg-white/[0.08] hover:text-white">
            View System Diagnostics (/debug)
          </Button>
        </Link>
      </div>
    </div>
  );
}

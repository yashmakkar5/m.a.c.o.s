import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Sparkles,
  GitBranch,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Hammer,
  Megaphone,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Career Navigation Platform</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
              M.A.C.O.S.
            </h1>
            <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground">
              My Adaptive Career Orchestration System
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-primary pt-2">
              &ldquo;Don&apos;t just match to a job. Navigate to a career.&rdquo;
            </p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-1">
              An AI-powered career navigation system that connects where you are, where you want to go, and the evidence-first path between them.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/analyze">
              <Button size="lg" className="h-12 px-8 text-sm sm:text-base font-semibold gap-2 shadow-md">
                <Compass className="h-5 w-5" />
                Build My Career Map
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Flow Indicator */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border bg-card/60 p-3 shadow-xs">
                <span className="text-primary font-bold">1. Profile</span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">Real resume & evidence</p>
              </div>
              <div className="rounded-xl border bg-card/60 p-3 shadow-xs">
                <span className="text-primary font-bold">2. Destination</span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">Target role & industry</p>
              </div>
              <div className="rounded-xl border bg-card/60 p-3 shadow-xs">
                <span className="text-primary font-bold">3. Intelligence</span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">Market & trajectory mining</p>
              </div>
              <div className="rounded-xl border bg-card/60 p-3 shadow-xs">
                <span className="text-primary font-bold">4. Action Pathway</span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">Learn → Build → Demonstrate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Differentiator: Career Trajectory Intelligence */}
      <section className="py-16 md:py-24 border-b">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Core Differentiator
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Career Trajectory Intelligence
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Most platforms just keyword-match resumes against job descriptions. M.A.C.O.S. learns from real public professional career trajectories to decode recurring transition patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Macro Transition Patterns
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We do NOT tell you to copy a specific celebrity or individual. We identify recurring transition catalysts that enabled hundreds of professionals to step into your target role.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Evidence Over Pedigree
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Pedigree doesn&apos;t define capability. M.A.C.O.S. extracts demonstrated proof-of-work—what you have built, shipped, and verified—leveling the playing field for non-traditional candidates.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GitBranch className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">
                Triple Gap Triangulation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every identified gap is triangulated against three data points: Candidate Evidence, Market Demand, and Career Trajectory Signals. No generic or disconnected advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Stage Action Methodology */}
      <section className="py-16 md:py-24 border-b bg-muted/20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              The M.A.C.O.S. Engine
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              LEARN → BUILD → DEMONSTRATE → REASSESS
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Actionable milestone planning designed to build verifiable proof-of-work step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                <BookOpen className="h-4 w-4" />
                LEARN
              </div>
              <p className="text-xs text-muted-foreground">
                Targeted conceptual study to master core foundational gaps identified in your analysis.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <Hammer className="h-4 w-4" />
                BUILD
              </div>
              <p className="text-xs text-muted-foreground">
                Create concrete proof-of-work systems, case studies, or production applications.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <Megaphone className="h-4 w-4" />
                DEMONSTRATE
              </div>
              <p className="text-xs text-muted-foreground">
                Publish code, write-ups, or live deployments with measurable telemetry and documentation.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-2">
              <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
                <RotateCcw className="h-4 w-4" />
                REASSESS
              </div>
              <p className="text-xs text-muted-foreground">
                Re-evaluate your readiness score and update your career trajectory map continuously.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link href="/analyze">
              <Button size="lg" className="gap-2 font-semibold">
                Start Career Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-muted-foreground border-t">
        <p>© 2026 M.A.C.O.S. (My Adaptive Career Orchestration System). Built for the AI Hackathon.</p>
        <p className="mt-1">Focused on evidence, capability, and inclusive career mobility.</p>
      </footer>
    </main>
  );
}

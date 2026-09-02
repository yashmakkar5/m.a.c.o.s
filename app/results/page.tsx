import Link from "next/link";
import { Compass, ArrowLeft, ArrowRight, ShieldCheck, TrendingUp, Sparkles, AlertCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResultsPlaceholderPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Link
            href="/analyze"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to /analyze
          </Link>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          M.A.C.O.S. Career Map Results
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Career Navigation Results
        </h1>
        <p className="text-sm text-muted-foreground">
          This route will receive and render real multi-agent analysis once an analysis pipeline is executed.
        </p>
      </div>

      {/* Development State Notice */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h3 className="font-bold text-foreground">
              Routing & Foundation Verification Active
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              You are viewing the <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/results</code> route. In the full workflow, when a user submits their resume and career destination at <code className="font-mono bg-background px-1.5 py-0.5 rounded border">/analyze</code>, the orchestrator redirects to an analysis-specific route with verified results.
            </p>
          </div>
        </div>
      </div>

      {/* Planned Sections Preview */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Planned Results Structure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <TrendingUp className="h-4 w-4" />
              1. Career Trajectory Intelligence
            </div>
            <p className="text-xs text-muted-foreground">
              Macro progression stages and transition catalysts extracted from relevant public professional trajectories.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
              <AlertCircle className="h-4 w-4" />
              2. Triangulated Gap Map
            </div>
            <p className="text-xs text-muted-foreground">
              Prioritized Skill, Experience, and Evidence gaps justified by Candidate Evidence + Market Demand + Trajectory Signals.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-500 font-semibold text-sm">
              <BookOpen className="h-4 w-4" />
              3. Personalised 4-Stage Pathway
            </div>
            <p className="text-xs text-muted-foreground">
              Tactical action items organized into LEARN → BUILD → DEMONSTRATE → REASSESS with explicit completion criteria.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
              <Compass className="h-4 w-4" />
              4. Grounded &quot;Ask M.A.C.O.S.&quot; Chat
            </div>
            <p className="text-xs text-muted-foreground">
              Conversational assistant answering follow-up questions strictly grounded in the candidate&apos;s stored analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link href="/analyze" className="w-full sm:w-auto">
          <Button size="lg" className="w-full gap-2 font-semibold text-sm">
            Go to /analyze
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/debug" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full text-sm">
            View System Diagnostics (/debug)
          </Button>
        </Link>
      </div>
    </div>
  );
}

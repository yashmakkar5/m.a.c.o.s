"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  Building,
  CheckCircle2,
  FileText,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  Loader2,
  Info,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisRecord } from "@/types";
import { TrajectoryVisualizer } from "@/components/career/TrajectoryVisualizer";
import { GapCard } from "@/components/career/GapCard";
import { PathwayTimeline } from "@/components/career/PathwayTimeline";
import { AskMacOsDrawer } from "@/components/chat/AskMacOsDrawer";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pathway" | "trajectories" | "gaps" | "market" | "profile">("pathway");

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/analyze/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Could not retrieve analysis record.");
        }

        setAnalysis(data.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading analysis");
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalysis();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Loading your Career Map...
        </p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Analysis Not Found</h2>
        <p className="text-sm text-muted-foreground">
          {error || "The requested career map could not be found or has expired."}
        </p>
        <Link href="/analyze">
          <Button size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Build New Career Map
          </Button>
        </Link>
      </div>
    );
  }

  const {
    target_role,
    target_industry,
    target_company,
    candidate_profile,
    skills_analysis,
    market_analysis,
    trajectory_analysis,
    gap_analysis,
    pathway,
  } = analysis;

  const readinessScore = gap_analysis?.readinessScore ?? 65;

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Bar */}
      <div className="border-b bg-card/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/analyze"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" /> Back
                </Link>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Career Map
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                {target_role}
                {target_company && (
                  <span className="text-sm sm:text-base font-normal text-muted-foreground">
                    at {target_company}
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">
                Candidate: <strong>{candidate_profile?.fullName || "Candidate"}</strong> • Industry: {target_industry || "Technology"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Readiness Score Card */}
              <div className="flex items-center gap-3 rounded-xl border bg-background px-3 py-2 shadow-2xs">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Readiness
                  </span>
                  <span className="text-lg font-black text-primary">
                    {readinessScore}
                    <span className="text-xs font-normal text-muted-foreground">/100</span>
                  </span>
                </div>
                <div className="h-8 w-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="bg-primary w-full transition-all duration-1000"
                    style={{ height: `${readinessScore}%` }}
                  />
                </div>
              </div>

              {/* Chat CTA */}
              <Button
                onClick={() => setIsChatOpen(true)}
                className="gap-2 shadow-sm font-semibold"
                size="sm"
              >
                <MessageSquare className="h-4 w-4" />
                Ask M.A.C.O.S.
              </Button>
            </div>
          </div>

          {/* Research Provenance Banner */}
          {market_analysis?.isControlledFallback && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/60 px-3 py-1.5 text-[11px] text-muted-foreground border">
              <span className="flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-primary" />
                <span>
                  <strong>Prototype Provenance:</strong> Market and trajectory intelligence synthesized from verified controlled benchmark datasets.
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase text-primary font-bold">
                Controlled Research Data
              </span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t mt-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("pathway")}
              className={`pb-2 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "pathway"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              Personalised Pathway ({pathway?.milestones?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("trajectories")}
              className={`pb-2 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "trajectories"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Trajectory Intelligence
            </button>
            <button
              onClick={() => setActiveTab("gaps")}
              className={`pb-2 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "gaps"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              Triangulated Gap Map
            </button>
            <button
              onClick={() => setActiveTab("market")}
              className={`pb-2 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "market"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              Market Expectations
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-2 border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Current Profile & Evidence
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Competitive Advantage Card */}
        {gap_analysis?.keyCompetitiveAdvantage && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 flex items-start gap-3">
            <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs sm:text-sm">
              <span className="font-bold text-foreground">
                Your Primary Competitive Advantage:
              </span>
              <p className="text-muted-foreground">
                {gap_analysis.keyCompetitiveAdvantage}
              </p>
            </div>
          </div>
        )}

        {/* TAB 1: Personalised Pathway */}
        {activeTab === "pathway" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                4-Stage Personalised Action Pathway
              </h2>
              <p className="text-xs text-muted-foreground">
                Sequential, evidence-first roadmap moving from knowledge acquisition to measurable public proof-of-work.
              </p>
            </div>
            {pathway && <PathwayTimeline pathway={pathway} />}
          </div>
        )}

        {/* TAB 2: Career Trajectory Intelligence */}
        {activeTab === "trajectories" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Macro Career Trajectory Patterns
              </h2>
              <p className="text-xs text-muted-foreground">
                Aggregated insights from professionals who successfully navigated the transition into {target_role}.
              </p>
            </div>
            {trajectory_analysis && <TrajectoryVisualizer trajectory={trajectory_analysis} />}
          </div>
        )}

        {/* TAB 3: Triangulated Gap Map */}
        {activeTab === "gaps" && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Triangulated Gap Analysis
              </h2>
              <p className="text-xs text-muted-foreground">
                Every gap is strictly supported by: Your Evidence + Market Requirement + Trajectory Signal.
              </p>
            </div>

            {/* Skill Gaps */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                1. Skill Competency Gaps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gap_analysis?.skillGaps?.map((gap, i) => (
                  <GapCard key={i} gap={gap} />
                ))}
              </div>
            </div>

            {/* Experience Gaps */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                2. Experience & Scope Gaps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gap_analysis?.experienceGaps?.map((gap, i) => (
                  <GapCard key={i} gap={gap} />
                ))}
              </div>
            </div>

            {/* Evidence Gaps */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                3. Evidence & Proof-of-Work Gaps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gap_analysis?.evidenceGaps?.map((gap, i) => (
                  <GapCard key={i} gap={gap} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Market Expectations */}
        {activeTab === "market" && market_analysis && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Current Market Requirements
              </h2>
              <p className="text-xs text-muted-foreground">
                Synthesized expectations from industry job postings and role benchmarks for {target_role}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-card p-5 space-y-3">
                <h3 className="font-bold text-sm text-foreground">Recurring Demanded Skills</h3>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {market_analysis.recurringSkills.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-5 space-y-3">
                <h3 className="font-bold text-sm text-foreground">Required Tools & Frameworks</h3>
                <div className="flex flex-wrap gap-1.5">
                  {market_analysis.tools.map((t, i) => (
                    <span key={i} className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-card p-5 space-y-3">
                <h3 className="font-bold text-sm text-foreground">Core Responsibilities</h3>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {market_analysis.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-5 space-y-3">
                <h3 className="font-bold text-sm text-foreground">Decisive Evidence Expectations</h3>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {market_analysis.evidenceExpectations.map((e, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Citations / Sources */}
            {market_analysis.sources && market_analysis.sources.length > 0 && (
              <div className="rounded-xl border bg-card p-5 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Research Sources & Citations
                </h3>
                <div className="space-y-2 text-xs">
                  {market_analysis.sources.map((src, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 border-b pb-2 last:border-0">
                      <div>
                        <p className="font-semibold text-foreground">{src.title}</p>
                        <p className="text-muted-foreground text-[11px] mt-0.5">{src.snippet}</p>
                      </div>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-[11px] shrink-0"
                        >
                          Source <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Current Profile & Demonstrated Skills */}
        {activeTab === "profile" && candidate_profile && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Extracted Profile & Demonstrated Capabilities
              </h2>
              <p className="text-xs text-muted-foreground">
                Objective parsing of your resume distinguishing proven evidence from stated buzzwords.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demonstrated Skills */}
              <div className="rounded-xl border bg-card p-5 space-y-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Demonstrated Skills (Supported by Evidence)
                </h3>
                <div className="space-y-2">
                  {skills_analysis?.demonstratedSkills?.map((ds, i) => (
                    <div key={i} className="rounded-lg bg-muted/40 p-2.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{ds.skill}</span>
                        <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase">
                          {ds.confidence} confidence
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        <strong>Evidence:</strong> {ds.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uncertain Skills */}
              <div className="rounded-xl border bg-card p-5 space-y-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Uncertain Skills (Stated Without Direct Evidence)
                </h3>
                <div className="space-y-2">
                  {skills_analysis?.uncertainSkills?.map((us, i) => (
                    <div key={i} className="rounded-lg bg-muted/40 p-2.5 text-xs space-y-1">
                      <span className="font-semibold text-foreground">{us.skill}</span>
                      <p className="text-[11px] text-muted-foreground">{us.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work & Projects Breakdown */}
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="font-bold text-sm text-foreground">Parsed Projects & Experience</h3>
              <div className="space-y-3 text-xs">
                {candidate_profile.experience.map((e, i) => (
                  <div key={i} className="border-b pb-3 last:border-0">
                    <p className="font-semibold text-foreground">{e.role} — {e.company} ({e.duration})</p>
                    <p className="text-muted-foreground mt-0.5">{e.description}</p>
                  </div>
                ))}
                {candidate_profile.projects.map((p, i) => (
                  <div key={i} className="border-b pb-3 last:border-0">
                    <p className="font-semibold text-foreground">Project: {p.title}</p>
                    <p className="text-muted-foreground mt-0.5">{p.description}</p>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="text-primary text-[11px] hover:underline">
                        {p.link}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Grounded Conversational Assistant */}
      <AskMacOsDrawer
        analysisId={analysis.id}
        targetRole={analysis.target_role}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

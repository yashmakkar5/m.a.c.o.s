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
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  BookOpen,
  ArrowUpRight,
  Target,
  Send,
  HelpCircle,
  Clock,
  GitFork,
  ShieldCheck,
  Ban,
  Check,
  CircleDot,
  UserCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisRecord, CanonicalAnalysis } from "@/types";
import { buildCanonicalAnalysis } from "@/lib/analysis/canonicalNormalizer";
import { AskMacOsDrawer } from "@/components/chat/AskMacOsDrawer";

type TabKey =
  | "snapshot"
  | "trajectories"
  | "gaps"
  | "pathway"
  | "market"
  | "resources"
  | "sources";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(null);
  const [canonical, setCanonical] = useState<CanonicalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("snapshot");

  // Contextual Chat states
  const [selectedFocusItem, setSelectedFocusItem] = useState<string | undefined>(undefined);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);
  const [inlineQuestion, setInlineQuestion] = useState("");

  const handleAskWhy = (question: string, contextItem: string) => {
    setSelectedFocusItem(contextItem);
    setChatInitialQuestion(question);
    setIsChatOpen(true);
  };

  const handleInlineAsk = (query?: string) => {
    const q = query || inlineQuestion;
    if (!q.trim()) return;
    setChatInitialQuestion(q.trim());
    setSelectedFocusItem(undefined);
    setInlineQuestion("");
    setIsChatOpen(true);
  };

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/analyze/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Could not retrieve analysis record.");
        }

        const record = data.data as AnalysisRecord;
        setAnalysis(record);

        // Normalize or use existing canonical analysis
        const canon =
          record.canonical_analysis ||
          buildCanonicalAnalysis({
            candidateProfile: record.candidate_profile,
            skillsAnalysis: record.skills_analysis,
            marketAnalysis: record.market_analysis,
            trajectoryAnalysis: record.trajectory_analysis,
            gapAnalysis: record.gap_analysis,
            pathway: record.pathway,
            targetRole: record.target_role,
            targetIndustry: record.target_industry,
            targetCompany: record.target_company,
          });

        setCanonical(canon);
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-16 space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-xl shadow-[#ac1ed6]/30 animate-pulse">
          <Compass className="h-7 w-7 animate-spin" />
        </div>
        <p className="text-sm font-bold text-white tracking-wide">
          Synthesizing Your Career Intelligence Map...
        </p>
        <p className="text-xs text-[#9a93a5]">
          Decoding real professional trajectories & market evidence
        </p>
      </div>
    );
  }

  if (error || !analysis || !canonical) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Career Map Not Found</h2>
          <p className="text-sm text-[#9a93a5] max-w-md mx-auto">
            {error || "The requested career map could not be retrieved from the database."}
          </p>
        </div>
        <Link href="/analyze">
          <Button size="lg" className="rounded-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white font-bold gap-2">
            <ArrowLeft className="h-4 w-4" />
            Build New Career Map
          </Button>
        </Link>
      </div>
    );
  }

  const {
    candidate,
    destination,
    readiness,
    biggestInsight,
    whatNotToDo,
    market,
    trajectories,
    comparison,
    priorities,
    gaps,
    pathway,
    resources,
    sources,
  } = canonical;

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "snapshot", label: "Career Map & Snapshot", icon: Sparkles },
    { key: "trajectories", label: "Trajectory Intelligence", icon: TrendingUp },
    { key: "gaps", label: "Where Your Route Differs", icon: Target },
    { key: "pathway", label: "Action Pathway (90-Day)", icon: BookOpen },
    { key: "market", label: "Market Intelligence", icon: Layers },
    { key: "resources", label: "Resource Center", icon: FileText },
    { key: "sources", label: "Research Evidence", icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen bg-[#090607] pb-24 text-white">
      {/* TOP STICKY BAR: DESTINATION HERO & READINESS INDICATOR */}
      <div className="border-b border-white/[0.08] bg-[#090607]/85 sticky top-16 z-30 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link
                  href="/analyze"
                  className="text-xs text-[#9a93a5] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> New Intake
                </Link>
                <span className="text-white/20">•</span>
                <span className="text-xs font-mono text-[#ac1ed6] font-bold">CAREER INTELLIGENCE MAP</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {destination.role}
                </h1>
                {destination.company && (
                  <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 text-xs text-[#d5d0dd] flex items-center gap-1">
                    <Building className="h-3 w-3 text-[#c26e73]" />
                    {destination.company}
                  </span>
                )}
                {destination.industry && (
                  <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-xs text-[#9a93a5]">
                    {destination.industry}
                  </span>
                )}
              </div>
            </div>

            {/* Readiness Indicator & Ask MACOS Button */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-2xl bg-[#121016] border border-white/[0.08] px-4 py-2 shadow-sm">
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/[0.08]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#ac1ed6]"
                      strokeDasharray={`${readiness.score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-extrabold text-white">
                    {readiness.score}%
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-[#757080] tracking-wider">
                    Evidence Match
                  </p>
                  <p className="text-xs font-bold text-emerald-400">
                    {readiness.benchmarkLabel}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSelectedFocusItem(undefined);
                  setChatInitialQuestion(undefined);
                  setIsChatOpen(true);
                }}
                size="sm"
                className="gap-2 rounded-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:opacity-95 text-white border-0 font-bold text-xs h-10 px-4 shadow-md shadow-[#ac1ed6]/20 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask M.A.C.O.S.</span>
              </Button>
            </div>
          </div>

          {/* TAB NAVIGATION BAR */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/25"
                      : "bg-white/[0.04] text-[#9a93a5] hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT PANELS */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================================= */}
        {/* SCREEN 1: YOUR CAREER MAP & EXECUTIVE SNAPSHOT */}
        {/* ========================================================================= */}
        {activeTab === "snapshot" && (
          <div className="space-y-10">
            {/* 1. VISUAL HERO JOURNEY ROUTE: YOU ARE HERE -> NEXT MILESTONE -> TARGET */}
            <div className="rounded-3xl border border-white/[0.12] bg-[#121016] p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                      Your Career Route Map
                    </h2>
                    <p className="text-xs text-[#9a93a5]">
                      Visual progression connecting where you stand today directly to your destination
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1 text-xs font-mono text-[#d5d0dd]">
                  Closest Route: {trajectories.closestRoute.routeName.split(":")[1] || "Technical → Product"}
                </span>
              </div>

              {/* Horizontal Stepper Path (Hero Route) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Node 1: YOU ARE HERE */}
                <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 space-y-2 relative">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-400">
                    <Check className="h-2.5 w-2.5" /> You Are Here
                  </span>
                  <h4 className="font-bold text-sm text-white">
                    {candidate.strengths[0]?.name || "Foundational Execution"}
                  </h4>
                  <p className="text-xs text-[#9a93a5] leading-relaxed">
                    Verified competence in {candidate.strengths.map((s) => s.name).join(", ")}.
                  </p>
                </div>

                {/* Node 2: NEXT MILESTONE */}
                <div className="rounded-2xl border-2 border-[#ac1ed6]/50 bg-[#ac1ed6]/5 p-4 space-y-2 relative">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ac1ed6]/20 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#d5d0dd]">
                    <CircleDot className="h-2.5 w-2.5 text-[#ac1ed6]" /> Next Milestone
                  </span>
                  <h4 className="font-bold text-sm text-white">
                    {priorities[0]?.title || "Product Exposure & Scope Expansion"}
                  </h4>
                  <p className="text-xs text-[#9a93a5] leading-relaxed">
                    {priorities[0]?.action || "Author product requirements and define event telemetry."}
                  </p>
                </div>

                {/* Node 3: DOMAIN OWNERSHIP */}
                <div className="rounded-2xl border border-white/[0.08] bg-[#090607]/80 p-4 space-y-2 relative">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#757080]">
                    Bridge 02
                  </span>
                  <h4 className="font-bold text-sm text-white">
                    Measurable Decision Ownership
                  </h4>
                  <p className="text-xs text-[#9a93a5] leading-relaxed">
                    Published case studies proving trade-off rationale and feature outcomes.
                  </p>
                </div>

                {/* Node 4: TARGET DESTINATION */}
                <div className="rounded-2xl border-2 border-[#c26e73]/50 bg-gradient-to-br from-[#c26e73]/15 to-[#ac1ed6]/15 p-4 space-y-2 relative">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#c26e73]/25 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                    <Target className="h-2.5 w-2.5" /> Destination
                  </span>
                  <h4 className="font-bold text-sm text-white">
                    {destination.role}
                  </h4>
                  <p className="text-xs text-[#9a93a5] leading-relaxed">
                    {destination.industry || "Technology"} • {destination.company || "Target Benchmark"}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. THE THREE-CARD EXECUTIVE SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: YOU BRING */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    What You Bring
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="space-y-3 text-xs">
                  {candidate.strengths.slice(0, 3).map((st, i) => (
                    <div key={i} className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3 space-y-1">
                      <h4 className="font-bold text-white text-xs">{st.name}</h4>
                      <p className="text-[11px] text-[#9a93a5]">{st.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: YOU NEED TO BUILD */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c26e73]">
                    What You Need To Build
                  </span>
                  <Target className="h-4 w-4 text-[#c26e73]" />
                </div>
                <div className="space-y-3 text-xs">
                  {priorities.slice(0, 3).map((pr, i) => (
                    <div key={i} className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-xs">{pr.title}</h4>
                        <span className="text-[9px] font-mono text-[#c26e73] uppercase">{pr.type}</span>
                      </div>
                      <p className="text-[11px] text-[#9a93a5] line-clamp-2">{pr.difference}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: YOUR NEXT MOVE */}
              <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#ac1ed6]/15 via-[#121016] to-[#c26e73]/15 p-6 space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                      Your Single Next Move
                    </span>
                    <Sparkles className="h-4 w-4 text-[#ac1ed6]" />
                  </div>
                  <h4 className="text-base font-extrabold text-white leading-snug">
                    {priorities[0]?.action || "Build one end-to-end product case study with user prioritization and metrics."}
                  </h4>
                  <div className="rounded-2xl bg-[#090607]/80 p-3 border border-white/[0.06] space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      Proof you will create:
                    </span>
                    <p className="text-[11px] text-[#d5d0dd]">
                      {priorities[0]?.proof || "A published Notion PRD case study with prioritized user stories."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleAskWhy(
                      `Why is "${priorities[0]?.action}" my single highest-leverage next move?`,
                      priorities[0]?.title || "Next Move"
                    )
                  }
                  className="rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-[#ac1ed6]" />
                  <span>Why is this my next move?</span>
                </button>
              </div>
            </div>

            {/* 3. THE BIGGEST CAREER INSIGHT */}
            <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-r from-[#ac1ed6]/20 via-[#121016] to-[#c26e73]/20 p-6 sm:p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md shrink-0 mt-0.5">
                  <Award className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#ac1ed6]">
                      The Biggest Career Insight
                    </span>
                    <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[9px] font-mono text-[#d5d0dd]">
                      Personalized Strategy
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                    {biggestInsight.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9a93a5] leading-relaxed">
                    {biggestInsight.detail}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. DON'T SPEND YOUR ENERGY HERE YET (Guardrails) */}
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
                <Ban className="h-4 w-4" />
                <span>Don&apos;t Spend Your Energy Here Yet (Noise Filter)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {whatNotToDo.map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-4 space-y-1.5">
                    <h5 className="font-bold text-white text-xs">{item.actionToAvoid}</h5>
                    <p className="text-[11px] text-[#9a93a5] leading-relaxed">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. INLINE ASK M.A.C.O.S. COPILOT WIDGET */}
            <div className="rounded-3xl border border-[#ac1ed6]/30 bg-gradient-to-r from-[#ac1ed6]/10 via-[#121016] to-[#c26e73]/10 p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Ask M.A.C.O.S.</h3>
                  <p className="text-xs text-[#9a93a5]">
                    Ask anything about your career intelligence briefing. I will answer using the verified analysis.
                  </p>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Where do I stand right now?",
                  "Why is this my biggest gap?",
                  "Who followed a similar transition?",
                  "I only have 3 months. What should I prioritize?",
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInlineAsk(chip)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#ac1ed6]/50 text-xs text-[#d5d0dd] hover:text-white px-3.5 py-1.5 transition-all text-left"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Inline Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleInlineAsk();
                }}
                className="flex items-center gap-2 pt-2"
              >
                <input
                  type="text"
                  value={inlineQuestion}
                  onChange={(e) => setInlineQuestion(e.target.value)}
                  placeholder="Ask a question about your route, verified precedents, or proof..."
                  className="flex-1 rounded-full border border-white/10 bg-[#121016] px-5 py-3 text-xs text-white placeholder:text-[#757080] focus:border-[#ac1ed6] focus:outline-none focus:ring-1 focus:ring-[#ac1ed6]"
                />
                <button
                  type="submit"
                  disabled={!inlineQuestion.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/25 disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TRAJECTORY INTELLIGENCE (HERO FEATURE: REAL PEOPLE & PATTERNS) */}
        {/* ========================================================================= */}
        {activeTab === "trajectories" && (
          <div className="space-y-10">
            {/* Header / Intro */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ac1ed6]">
                Hero Feature • Evidence-Backed Precedents
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                How People Actually Got There
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5] max-w-3xl">
                We studied relevant professional journeys to find the patterns behind the destination. These are real career transitions demonstrating that technical and analytical practitioners consistently break in through visible ownership.
              </p>
            </div>

            {/* 1. PEOPLE TO LEARN FROM */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#d5d0dd] flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#ac1ed6]" />
                People Who Took This Journey ({trajectories.professionals.length} Verified References)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trajectories.professionals.map((person, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 flex flex-col justify-between shadow-lg hover:border-[#ac1ed6]/40 transition-all"
                  >
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-extrabold text-base text-white">{person.name}</h4>
                        <p className="text-xs text-[#ac1ed6] font-medium">{person.currentRole}</p>
                      </div>

                      {/* Step-by-Step Career Path */}
                      <div className="rounded-2xl bg-[#090607]/90 p-3.5 border border-white/[0.06] space-y-1.5 text-xs">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#757080]">
                          Career Path:
                        </span>
                        <div className="space-y-1">
                          {person.careerPath.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 text-[11px] text-[#d5d0dd]">
                              <span className="text-[#ac1ed6] font-bold">→</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* The Interesting Part / Transition */}
                      <div className="space-y-1 text-xs">
                        <span className="text-[10px] font-bold uppercase text-[#c26e73]">
                          The Transition Insight:
                        </span>
                        <p className="text-[11px] text-[#9a93a5] leading-relaxed">
                          {person.relevantTransition}
                        </p>
                      </div>

                      {/* What to Learn */}
                      <div className="space-y-1 text-xs pt-1 border-t border-white/[0.04]">
                        <span className="text-[10px] font-bold uppercase text-white">
                          What You Can Learn:
                        </span>
                        <ul className="space-y-1 text-[11px] text-[#9a93a5]">
                          {person.keyLearnings.map((learn, lIdx) => (
                            <li key={lIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{learn}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sources */}
                    {person.sources && person.sources.length > 0 && (
                      <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#757080] flex items-center justify-between">
                        <span>Public Source:</span>
                        <a
                          href={person.sources[0]?.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#ac1ed6] hover:underline flex items-center gap-0.5 truncate max-w-[200px]"
                        >
                          {person.sources[0]?.title || "Executive Bio"} <ArrowUpRight className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. WHAT THEIR JOURNEYS HAVE IN COMMON (Pattern Frequency Engine) */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ac1ed6]">
                  Pattern Frequency Engine
                </span>
                <h3 className="text-lg font-bold text-white">
                  What The Trajectories Have In Common
                </h3>
                <p className="text-xs text-[#9a93a5]">
                  Calculated directly from researched profiles. These examples are directional evidence, not a universal career formula.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {trajectories.patterns.map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-white font-mono text-[#ac1ed6]">
                        {p.observedCount}
                      </span>
                      <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] font-mono text-[#d5d0dd] uppercase">
                        {p.strength} pattern
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-white">{p.pattern}</h5>
                    <p className="text-[11px] text-[#9a93a5] leading-relaxed">{p.evidence}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. THERE IS MORE THAN ONE WAY THERE (Three Routes to Destination) */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-6 shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c26e73]">
                  Multi-Route Navigation
                </span>
                <h3 className="text-lg font-bold text-white">
                  There Is More Than One Way There
                </h3>
                <p className="text-xs text-[#9a93a5]">
                  We identified three validated routes into {destination.role}. We highlighted the route closest to your existing capabilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trajectories.routes.map((rt) => (
                  <div
                    key={rt.routeId}
                    className={`rounded-3xl p-6 space-y-4 flex flex-col justify-between transition-all ${
                      rt.isClosestRoute
                        ? "border-2 border-[#ac1ed6] bg-[#ac1ed6]/10 shadow-lg shadow-[#ac1ed6]/20"
                        : "border border-white/[0.08] bg-[#090607]/80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#757080]">
                          {rt.routeName.split(":")[0]}
                        </span>
                        {rt.isClosestRoute && (
                          <span className="rounded-full bg-[#ac1ed6] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                            Your Closest Route
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-white">
                        {rt.routeName.split(":")[1] || rt.routeName}
                      </h4>

                      <div className="space-y-1.5 text-xs text-[#d5d0dd] pt-1">
                        {rt.stages.map((stg, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-[11px]">
                            <span className="text-[#c26e73] font-bold">{sIdx + 1}.</span>
                            <span>{stg}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-[#9a93a5] leading-relaxed pt-2 border-t border-white/[0.06]">
                        {rt.description}
                      </p>
                    </div>

                    {rt.isClosestRoute && (
                      <div className="rounded-2xl bg-[#090607]/90 p-3 border border-[#ac1ed6]/30 text-xs text-[#d5d0dd] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-[#ac1ed6]">
                          Why This Route Is Closest:
                        </span>
                        <p className="text-[11px] text-[#9a93a5] leading-relaxed">
                          {rt.whyClosest}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. YOU VS THE JOURNEY (Visual Comparison Table) */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#d5d0dd]">
                  Evidence Matrix
                </span>
                <h3 className="text-lg font-bold text-white">
                  You vs The Journey Requirements
                </h3>
                <p className="text-xs text-[#9a93a5]">
                  A direct comparison showing which trajectory capabilities you already demonstrate vs what is still developing.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#d5d0dd]">
                  <thead className="border-b border-white/[0.08] text-[10px] uppercase font-bold text-[#757080] tracking-wider">
                    <tr>
                      <th className="py-3 pr-4">Journey Pattern</th>
                      <th className="py-3 px-4">Your Status</th>
                      <th className="py-3 px-4">Observed Evidence</th>
                      <th className="py-3 pl-4">What This Means For You</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {comparison.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4 font-bold text-white">{item.dimension}</td>
                        <td className="py-3.5 px-4">
                          {item.status === "demonstrated" && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              ✓ Demonstrated
                            </span>
                          )}
                          {item.status === "partial" && (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                              ◐ Partial evidence
                            </span>
                          )}
                          {item.status === "not_demonstrated" && (
                            <span className="inline-flex items-center gap-1 text-red-400 font-bold">
                              ○ Not yet demonstrated
                            </span>
                          )}
                          {item.status === "unknown" && (
                            <span className="inline-flex items-center gap-1 text-[#757080] font-bold">
                              ? Unknown
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#9a93a5] text-[11px] max-w-xs">{item.evidenceSnippet}</td>
                        <td className="py-3.5 pl-4 text-white text-[11px]">{item.whatItMeans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. RECURRING PROGRESSION STAGES (Non-empty) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#d5d0dd] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#ac1ed6]" />
                Recurring Progression Stages ({trajectories.stages.length} Milestones Identified)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {trajectories.stages.map((stage) => (
                  <div
                    key={stage.stageNumber}
                    className="rounded-3xl border border-white/[0.08] bg-[#121016] p-5 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-xs font-extrabold text-white">
                        {stage.stageNumber}
                      </span>
                      <h4 className="font-bold text-sm text-white">{stage.stageName}</h4>
                      <p className="text-[11px] font-mono text-[#ac1ed6]">{stage.typicalRole}</p>
                      <p className="text-xs text-[#9a93a5] leading-relaxed">{stage.description}</p>
                    </div>
                    <div className="pt-2 border-t border-white/[0.06] text-[10px] text-[#757080]">
                      <strong className="text-white">Core Focus: </strong>{stage.keyFocus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WHERE YOUR ROUTE DIFFERS (SMARTER GAP MAP) */}
        {/* ========================================================================= */}
        {activeTab === "gaps" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c26e73]">
                Prioritization Engine • Non-Repetitive
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Where Your Route Differs (Highest-Impact Gaps)
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5] max-w-3xl">
                We do not overwhelm you with 20 minor deficiencies. These are only the high-impact differences between your profile and target role expectations, clearly distinguished into Skill, Experience, and Evidence.
              </p>
            </div>

            {/* Smarter Gap Cards Grid */}
            <div className="space-y-4">
              {gaps.map((gap, idx) => (
                <div
                  key={gap.id || idx}
                  className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#c26e73]/20 border border-[#c26e73]/40 text-[#c26e73] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          {gap.priority} Priority
                        </span>
                        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] font-mono text-[#d5d0dd] uppercase">
                          {gap.category === "evidence" ? "Evidence Gap (Proof Needed)" : gap.category === "experience" ? "Experience Gap" : "Skill Gap"}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-white">{gap.gap}</h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAskWhy(`How can I prove capability for "${gap.gap}"?`, gap.gap)}
                      className="rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-[#ac1ed6]/50 text-[#d5d0dd] hover:text-white px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all self-start"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-[#ac1ed6]" />
                      <span>How to prove this?</span>
                    </button>
                  </div>

                  {/* 4-Part Structure: Current Evidence -> Destination -> How to Close -> Proof */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl bg-[#090607]/80 p-4 border border-white/[0.06] space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#757080]">Current Evidence in Profile:</span>
                        <p className="text-white text-xs mt-0.5">{gap.currentEvidence}</p>
                      </div>
                      <div className="pt-2 border-t border-white/[0.04]">
                        <span className="text-[10px] font-bold uppercase text-[#c26e73]">Destination Requirement:</span>
                        <p className="text-[#9a93a5] text-xs mt-0.5">{gap.destinationRequirement}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#090607]/80 p-4 border border-white/[0.06] space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#ac1ed6]">How To Close It:</span>
                        <p className="text-white text-xs mt-0.5">{gap.howToCloseIt}</p>
                      </div>
                      <div className="pt-2 border-t border-white/[0.04]">
                        <span className="text-[10px] font-bold uppercase text-emerald-400">Proof You Can Create:</span>
                        <p className="text-[#d5d0dd] text-xs mt-0.5 font-medium">{gap.proofYouCanCreate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACTION PATHWAY (90-DAY ROUTE & STAGES) */}
        {/* ========================================================================= */}
        {activeTab === "pathway" && (
          <div className="space-y-10">
            {/* 90-Day Plan Header */}
            <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-r from-[#ac1ed6]/15 via-[#121016] to-[#c26e73]/15 p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Your Next 90 Days</h3>
                  <p className="text-xs text-[#9a93a5]">
                    A structured timeline to turn your ambition into verifiable proof-of-work.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                {/* 0-30 Days */}
                <div className="rounded-2xl bg-[#090607]/85 border border-white/[0.08] p-4 space-y-2">
                  <span className="rounded-full bg-blue-500/20 text-blue-400 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                    Days 1–30 • Learn & Frame
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-[#d5d0dd] pt-1">
                    {pathway.ninetyDayRoute.days1to30.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#ac1ed6] font-bold">→</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 31-60 Days */}
                <div className="rounded-2xl bg-[#090607]/85 border border-white/[0.08] p-4 space-y-2">
                  <span className="rounded-full bg-[#c26e73]/20 text-[#c26e73] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                    Days 31–60 • Build Deliverable
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-[#d5d0dd] pt-1">
                    {pathway.ninetyDayRoute.days31to60.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#c26e73] font-bold">→</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 61-90 Days */}
                <div className="rounded-2xl bg-[#090607]/85 border border-white/[0.08] p-4 space-y-2">
                  <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase">
                    Days 61–90 • Demonstrate & Reassess
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-[#d5d0dd] pt-1">
                    {pathway.ninetyDayRoute.days61to90.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">→</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Detailed Sequential Phases (LEARN, BUILD, DEMONSTRATE, REASSESS) */}
            <div className="space-y-8">
              {(["LEARN", "BUILD", "DEMONSTRATE", "REASSESS"] as const).map((stage) => {
                const actions = pathway.stages[stage];
                const stageColor =
                  stage === "LEARN"
                    ? "text-blue-400 border-blue-500/30"
                    : stage === "BUILD"
                    ? "text-[#c26e73] border-[#c26e73]/30"
                    : stage === "DEMONSTRATE"
                    ? "text-emerald-400 border-emerald-500/30"
                    : "text-[#ac1ed6] border-[#ac1ed6]/30";

                return (
                  <div key={stage} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${stageColor}`}>
                        Phase: {stage}
                      </span>
                      <span className="text-xs text-[#757080]">
                        ({actions.length} {actions.length === 1 ? "Action" : "Actions"})
                      </span>
                    </div>

                    <div className="space-y-4">
                      {actions.map((act) => (
                        <div
                          key={act.id}
                          className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-base text-white">{act.title}</h4>
                              <p className="text-xs text-[#9a93a5] mt-1">{act.action}</p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-xs font-mono text-[#d5d0dd] shrink-0">
                              <Clock className="h-3 w-3 text-[#ac1ed6]" />
                              {act.estimatedDuration}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                            <div className="rounded-2xl bg-[#090607]/80 p-3 border border-white/[0.06]">
                              <span className="text-[10px] font-bold uppercase text-[#c26e73]">Why This Matters:</span>
                              <p className="text-[11px] text-[#9a93a5] mt-0.5">{act.why}</p>
                            </div>
                            <div className="rounded-2xl bg-[#090607]/80 p-3 border border-white/[0.06]">
                              <span className="text-[10px] font-bold uppercase text-emerald-400">Deliverable / Proof:</span>
                              <p className="text-[11px] text-[#d5d0dd] mt-0.5 font-medium">{act.proof}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: WHAT THE MARKET LOOKS LIKE */}
        {/* ========================================================================= */}
        {activeTab === "market" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                Market Intelligence • Verified Requirements
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                What The Market Actually Expects Today
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                {market.evidenceCountNote}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Common Requirements */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#ac1ed6]" />
                  Most Common Requirements & Frequency
                </h3>
                <div className="space-y-2.5">
                  {market.requirements.map((req, i) => (
                    <div key={i} className="rounded-2xl bg-[#090607]/80 p-3.5 border border-white/[0.06] flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-white">{req.skill}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        req.frequency === "High" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {req.frequency} Demand
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What is Changing (Emerging Signals) */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#c26e73]" />
                  What Is Changing (Emerging Signals)
                </h3>
                <div className="space-y-3">
                  {market.trends.map((tr, i) => (
                    <div key={i} className="rounded-2xl bg-[#090607]/80 p-4 border border-white/[0.06] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{tr.trend}</span>
                        <span className="text-[10px] font-mono text-[#c26e73] font-bold uppercase">{tr.trajectory}</span>
                      </div>
                      <p className="text-[11px] text-[#9a93a5]">{tr.details}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  <h4 className="text-xs font-bold text-white">Standard Tooling Stack:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {market.tools.map((t, i) => (
                      <span key={i} className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-[11px] font-mono text-[#d5d0dd]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: RESOURCE CENTER (Resource -> Action -> Evidence) */}
        {/* ========================================================================= */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Actionable Resource Center
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Resources To Move Forward
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                We do not dump 50 random links. Every resource below is directly mapped to a specific priority action and deliverable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Resources */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#ac1ed6]" />
                  Learn: Conceptual Foundations
                </h3>
                <div className="space-y-3 text-xs">
                  {resources.learning.map((res, i) => (
                    <div key={i} className="rounded-2xl bg-[#090607]/80 p-4 border border-white/[0.06] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{res.title}</span>
                        {res.url && (
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#ac1ed6] hover:underline flex items-center gap-1 text-[10px]"
                          >
                            Visit Resource <ArrowUpRight className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-[#9a93a5]">{res.description}</p>
                      <span className="inline-block text-[10px] font-mono text-[#757080]">
                        Targeted Gap: {res.forGap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Building & Evidence */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Build & Demonstrate: Proof Deliverables
                </h3>
                <div className="space-y-3 text-xs">
                  {resources.building.map((bld, i) => (
                    <div key={i} className="rounded-2xl bg-[#090607]/80 p-4 border border-white/[0.06] space-y-1.5">
                      <span className="font-bold text-white text-xs">{bld.title}</span>
                      <p className="text-[11px] text-[#d5d0dd]">Deliverable: {bld.deliverable}</p>
                      <span className="inline-block text-[10px] font-mono text-[#757080]">
                        Targeted Gap: {bld.forGap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: RESEARCH SOURCES & EVIDENCE */}
        {/* ========================================================================= */}
        {activeTab === "sources" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#757080]">
                Research Center
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Research Behind Your Career Map
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                Transparent evidence basis: {sources.researchBasis.marketCount} market sources • {sources.researchBasis.trajectoryCount} professional trajectories • {sources.researchBasis.learningCount} learning frameworks. Quality rating: <strong className="text-white">{sources.researchBasis.evidenceQuality}</strong>.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
              <h3 className="font-bold text-sm text-white">All Consulted Evidence Sources ({sources.totalCount})</h3>
              <div className="space-y-2">
                {[...sources.marketSources, ...sources.careerSources, ...sources.learningSources].map((src, i) => (
                  <div key={i} className="rounded-2xl bg-[#090607]/80 p-3.5 border border-white/[0.06] text-xs flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white">{src.title}</span>
                      <p className="text-[11px] text-[#9a93a5] line-clamp-1">{src.snippet || src.url}</p>
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ac1ed6] hover:underline flex items-center gap-1 text-[11px] shrink-0"
                      >
                        Source Link <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING ASK MACOS TRIGGER BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => {
            setSelectedFocusItem(undefined);
            setChatInitialQuestion(undefined);
            setIsChatOpen(true);
          }}
          size="lg"
          className="h-14 px-6 rounded-full bg-gradient-to-r from-[#ac1ed6] via-[#b32dd4] to-[#c26e73] hover:opacity-95 text-white shadow-xl shadow-[#ac1ed6]/30 border border-white/20 font-bold gap-2.5 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="h-5 w-5" />
          <span>Ask M.A.C.O.S.</span>
        </Button>
      </div>

      {/* GROUNDED CHAT DRAWER */}
      <AskMacOsDrawer
        analysisId={id}
        targetRole={destination.role}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeSection={activeTab}
        focusedItem={selectedFocusItem}
        initialQuestion={chatInitialQuestion}
      />
    </div>
  );
}

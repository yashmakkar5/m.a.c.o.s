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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisRecord, GapItem } from "@/types";
import { TrajectoryVisualizer } from "@/components/career/TrajectoryVisualizer";
import { GapCard } from "@/components/career/GapCard";
import { PathwayTimeline } from "@/components/career/PathwayTimeline";
import { AskMacOsDrawer } from "@/components/chat/AskMacOsDrawer";

type TabKey =
  | "snapshot"
  | "trajectories"
  | "gaps"
  | "pathway"
  | "market"
  | "profile"
  | "sources";

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
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-16 space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-xl shadow-[#ac1ed6]/30 animate-pulse">
          <Compass className="h-7 w-7 animate-spin" />
        </div>
        <p className="text-sm font-bold text-white tracking-wide">
          Rendering your M.A.C.O.S. Career Map...
        </p>
        <p className="text-xs text-[#9a93a5]">
          Triangulating candidate evidence with trajectory intelligence
        </p>
      </div>
    );
  }

  if (error || !analysis) {
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

  const sources = [
    ...(market_analysis?.sources || []),
    ...(trajectory_analysis?.sources || []),
  ];

  const readinessScore = gap_analysis?.readinessScore ?? 65;

  // Extract Top 3 Strengths
  const topStrengths = (skills_analysis?.demonstratedSkills?.slice(0, 3) || []).map((s, i) => ({
    num: `0${i + 1}`,
    name: s.skill,
    explanation: s.evidence || "Demonstrated repeatedly across your past projects.",
  }));

  // Extract Top 3 Gaps (Skill, Experience, or Evidence)
  const allGaps: GapItem[] = [
    ...(gap_analysis?.skillGaps || []),
    ...(gap_analysis?.experienceGaps || []),
    ...(gap_analysis?.evidenceGaps || []),
  ];
  const topGaps = allGaps.slice(0, 3).map((g, i) => ({
    num: `0${i + 1}`,
    name: g.gap,
    category: g.category,
    explanation:
      g.category === "evidence"
        ? "You may have the ability, but your profile doesn't yet show proof of it."
        : g.impactOnReadiness,
  }));

  // Extract Next Best Moves (3-4 milestones)
  const nextBestMoves = (pathway?.milestones?.slice(0, 4) || []).map((m, i) => ({
    num: `${i + 1}`,
    title: m.title,
    action: m.action,
    duration: m.estimatedDuration || "2-3 weeks",
    priority: m.priority,
  }));

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "snapshot", label: "Career Snapshot", icon: Sparkles },
    { key: "trajectories", label: "Trajectory Intelligence", icon: TrendingUp },
    { key: "gaps", label: "Gap Map", icon: Target },
    { key: "pathway", label: "Action Pathway", icon: BookOpen },
    { key: "market", label: "Market Demand", icon: Layers },
    { key: "profile", label: "Current Evidence", icon: FileText },
    { key: "sources", label: "Research Sources", icon: ExternalLink },
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
                <span className="text-xs font-mono text-[#ac1ed6] font-bold">CAREER MAP</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {target_role}
                </h1>
                {target_company && (
                  <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2.5 py-0.5 text-xs text-[#d5d0dd] flex items-center gap-1">
                    <Building className="h-3 w-3 text-[#c26e73]" />
                    {target_company}
                  </span>
                )}
                {target_industry && (
                  <span className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-xs text-[#9a93a5]">
                    {target_industry}
                  </span>
                )}
              </div>
            </div>

            {/* Readiness Gauge & Ask MACOS Button */}
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
                      strokeDasharray={`${readinessScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-extrabold text-white">
                    {readinessScore}%
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-[#757080] tracking-wider">
                    Evidence Match
                  </p>
                  <p className="text-xs font-bold text-emerald-400">
                    {readinessScore >= 70 ? "Strong Base" : "Progression Needed"}
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

          {/* TAB NAVIGATION BAR (Pill buttons) */}
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
        {/* TAB 1: YOUR CAREER SNAPSHOT (10-SECOND EXECUTIVE SUMMARY) */}
        {/* ========================================================================= */}
        {activeTab === "snapshot" && (
          <div className="space-y-8">
            {/* 1. TOP CARDS: DESTINATION & CURRENT POSITION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Destination Card */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-7 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ac1ed6]">
                    Your Destination
                  </span>
                  <Target className="h-4 w-4 text-[#ac1ed6]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {target_role}
                  </h3>
                  <p className="text-xs text-[#9a93a5] mt-1">
                    {target_industry || "Technology"} • {target_company || "General Industry Target"}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#090607]/80 p-3.5 border border-white/[0.06] text-xs text-[#d5d0dd] space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#757080]">
                    What Companies Look For
                  </div>
                  <p className="text-[11px] text-[#9a93a5] leading-relaxed">
                    {market_analysis?.marketOverview
                      ? market_analysis.marketOverview.slice(0, 140) + "..."
                      : "Verified hands-on execution and demonstrable domain projects."}
                  </p>
                </div>
              </div>

              {/* Current Position Card */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-7 space-y-4 shadow-lg lg:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c26e73]">
                    Your Current Position
                  </span>
                  <Compass className="h-4 w-4 text-[#c26e73]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {candidate_profile?.fullName || "Candidate"}
                    {candidate_profile?.headline ? ` — ${candidate_profile.headline}` : ""}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#d5d0dd] mt-2 leading-relaxed">
                    You already have a strong foundation in{" "}
                    <strong className="text-white">
                      {candidate_profile?.skills?.slice(0, 3).join(", ") || "core technical execution"}
                    </strong>
                    . Your primary challenge is converting that ability into visible evidence and domain-specific track record for{" "}
                    <strong className="text-[#c26e73]">{target_role}</strong>.
                  </p>
                </div>

                {/* Readiness Explained honestly */}
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">
                      Career Readiness: {readinessScore}/100
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400/80">
                      Evidence Match Benchmark
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9a93a5] leading-relaxed">
                    Based on the requirements and evidence available in your profile. This score indicates how much of the required proof is currently documented in your profile. It is an evidence benchmark, not an absolute hiring guarantee.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. THE BIGGEST CAREER INSIGHT (Visually Prominent Card) */}
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
                      Personalized Edge
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                    {gap_analysis?.keyCompetitiveAdvantage
                      ? `Your unique advantage: ${gap_analysis.keyCompetitiveAdvantage}`
                      : "You don't need to learn more coding languages. Your next advantage comes from converting your existing technical ability into visible domain proof."}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9a93a5] leading-relaxed">
                    Transitioning candidates often waste months collecting more general certifications. For {target_role}, the hiring market rewards concrete case studies and demonstrable project ownership over academic credentials.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. TOP 3 STRENGTHS & TOP 3 GAPS (Side by side comparison) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TOP 3 STRENGTHS */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-7 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                      Your Top 3 Strengths
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#757080]">What you already have</span>
                </div>

                <div className="space-y-3.5">
                  {topStrengths.length > 0 ? (
                    topStrengths.map((str, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-4 flex items-start gap-3.5"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs shrink-0">
                          {str.num}
                        </span>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm text-white">{str.name}</h4>
                          <p className="text-xs text-[#9a93a5] leading-relaxed">
                            {str.explanation}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#9a93a5]">
                      Foundational technical background demonstrated from your resume.
                    </p>
                  )}
                </div>
              </div>

              {/* TOP 3 GAPS */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-7 space-y-5 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-[#c26e73]" />
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                      Your Top 3 Gaps
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#757080]">What is missing</span>
                </div>

                <div className="space-y-3.5">
                  {topGaps.length > 0 ? (
                    topGaps.map((gap, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-4 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c26e73]/15 border border-[#c26e73]/30 text-[#c26e73] font-mono font-bold text-xs shrink-0">
                            {gap.num}
                          </span>
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-sm text-white">{gap.name}</h4>
                            <p className="text-xs text-[#9a93a5] leading-relaxed">
                              {gap.explanation}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleAskWhy(
                              `Why is "${gap.name}" considered one of my top gaps, and what is the best way to close it?`,
                              gap.name
                            )
                          }
                          className="text-[11px] font-semibold text-[#ac1ed6] hover:text-[#c26e73] flex items-center gap-1 shrink-0 transition-colors"
                        >
                          <HelpCircle className="h-3 w-3" />
                          <span>Why?</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#9a93a5]">
                      No critical gaps identified.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. YOUR NEXT BEST MOVES (3-4 Concrete Actions) */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#ac1ed6]" />
                    Your Next Best Moves
                  </h3>
                  <p className="text-xs text-[#9a93a5] mt-0.5">
                    Concrete, high-leverage steps to take right now before applying.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("pathway")}
                  className="text-xs font-bold text-[#ac1ed6] hover:underline flex items-center gap-1"
                >
                  View Full Pathway <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nextBestMoves.map((move, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-5 space-y-3 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-white font-mono font-bold text-xs">
                          {move.num}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-[#9a93a5]">
                          <Clock className="h-3 w-3 text-[#ac1ed6]" />
                          {move.duration}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{move.title}</h4>
                      <p className="text-xs text-[#9a93a5] leading-relaxed">{move.action}</p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#c26e73] font-bold">
                        {move.priority} Priority
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleAskWhy(
                            `Why is "${move.title}" recommended as one of my first moves?`,
                            move.title
                          )
                        }
                        className="text-[11px] font-semibold text-[#ac1ed6] hover:text-[#c26e73] flex items-center gap-1 transition-colors"
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Why this move?</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. EMBEDDED ASK M.A.C.O.S. QUICK COPILOT WIDGET */}
            <div className="rounded-3xl border border-[#ac1ed6]/30 bg-gradient-to-r from-[#ac1ed6]/10 via-[#121016] to-[#c26e73]/10 p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Ask M.A.C.O.S.</h3>
                  <p className="text-xs text-[#9a93a5]">
                    Ask anything about your career map. I will answer in simple English based on your verified analysis.
                  </p>
                </div>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  "Why is this my biggest gap?",
                  "What should I do first?",
                  "What can I skip for now?",
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
                  placeholder="Type a question about your career map (e.g. Can I close this gap without an MBA?)..."
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
        {/* TAB 2: TRAJECTORY INTELLIGENCE */}
        {/* ========================================================================= */}
        {activeTab === "trajectories" && trajectory_analysis && (
          <TrajectoryVisualizer
            trajectory={trajectory_analysis}
            onAskWhy={handleAskWhy}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: GAP MAP */}
        {/* ========================================================================= */}
        {activeTab === "gaps" && gap_analysis && (
          <div className="space-y-8">
            {/* WHAT THIS MEANS FOR YOU - Gaps Callout */}
            <div className="rounded-3xl border border-[#c26e73]/30 bg-[#c26e73]/5 p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#c26e73]/20 text-[#c26e73] shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#c26e73]">
                    What This Means For You
                  </h4>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    Your biggest issue isn&apos;t a lack of intelligence or basic capability. It is a lack of visible domain-specific proof-of-work. Focus on closing evidence gaps before submitting applications.
                  </p>
                </div>
              </div>
            </div>

            {/* Gap List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    Triangulated Gap Map
                  </h2>
                  <p className="text-xs text-[#9a93a5]">
                    Where your candidate proof diverges from market demands and trajectory benchmarks.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#757080]">
                  {allGaps.length} Gaps Identified
                </span>
              </div>

              <div className="space-y-4">
                {allGaps.map((gap, idx) => (
                  <GapCard key={idx} gap={gap} onAskWhy={handleAskWhy} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACTION PATHWAY */}
        {/* ========================================================================= */}
        {activeTab === "pathway" && pathway && (
          <PathwayTimeline pathway={pathway} onAskWhy={handleAskWhy} />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MARKET DEMAND */}
        {/* ========================================================================= */}
        {activeTab === "market" && market_analysis && (
          <div className="space-y-8">
            {/* WHAT THIS MEANS FOR YOU - Market Callout */}
            <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    What This Means For You
                  </h4>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    Your technical foundation gives you a solid start, but domain-specific tooling and measurable outcomes matter far more for your next interview than generic course certificates.
                  </p>
                </div>
              </div>
            </div>

            {/* Overview & Core Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#ac1ed6]" />
                  Market Expectations
                </h3>
                <p className="text-xs sm:text-sm text-[#9a93a5] leading-relaxed">
                  {market_analysis.marketOverview}
                </p>

                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <h4 className="text-xs font-bold text-white">Recurring In-Demand Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {market_analysis.recurringSkills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-xs text-[#d5d0dd]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tools & Responsibilities */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#c26e73]" />
                  Tooling & Technical Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {market_analysis.tools?.map((tool, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-xs font-mono text-[#d5d0dd]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <h4 className="text-xs font-bold text-white">Key Responsibilities</h4>
                  <ul className="space-y-1.5 text-xs text-[#9a93a5]">
                    {market_analysis.responsibilities?.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#ac1ed6] shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CURRENT CANDIDATE PROFILE EVIDENCE */}
        {/* ========================================================================= */}
        {activeTab === "profile" && candidate_profile && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Current Demonstrated Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                Verified proof-of-work extracted from your resume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Demonstrated Skills */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Demonstrated Capabilities ({skills_analysis?.demonstratedSkills?.length || 0})
                </h3>
                <div className="space-y-2.5">
                  {skills_analysis?.demonstratedSkills?.map((skill, idx) => (
                    <div key={idx} className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{skill.skill}</span>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">{skill.confidence} confidence</span>
                      </div>
                      <p className="text-[11px] text-[#9a93a5]">Evidence: {skill.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects & Work History */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#ac1ed6]" />
                  Verified Projects & Experience
                </h3>
                <div className="space-y-3">
                  {candidate_profile.projects?.map((proj, idx) => (
                    <div key={idx} className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3 space-y-1">
                      <span className="font-bold text-xs text-white">{proj.title}</span>
                      <p className="text-[11px] text-[#9a93a5]">{proj.description}</p>
                      {proj.technologies && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.technologies.map((t, i) => (
                            <span key={i} className="text-[10px] text-[#757080] font-mono">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: RESEARCH SOURCES & PROVENANCE */}
        {/* ========================================================================= */}
        {activeTab === "sources" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Research Provenance & Methodology
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                Transparent citations and evidence backing your career map.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
              <h3 className="font-bold text-sm text-white">Sources Consulted ({sources.length})</h3>
              {sources.length > 0 ? (
                <div className="space-y-2">
                  {sources.map((src, idx) => (
                    <div key={idx} className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3.5 text-xs flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">{src.title}</span>
                        <p className="text-[11px] text-[#9a93a5] line-clamp-1">{src.snippet || src.url}</p>
                      </div>
                      <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 text-[10px] font-mono text-[#757080] shrink-0">
                        {src.isControlledFallback ? "Controlled Data" : "Public Trajectory"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9a93a5]">
                  Analysis synthesized using Google Gemini AI and M.A.C.O.S. controlled career trajectory benchmarks.
                </p>
              )}
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
        targetRole={target_role}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        activeSection={activeTab}
        focusedItem={selectedFocusItem}
        initialQuestion={chatInitialQuestion}
      />
    </div>
  );
}

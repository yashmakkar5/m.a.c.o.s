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
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  BookOpen,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisRecord } from "@/types";
import { TrajectoryVisualizer } from "@/components/career/TrajectoryVisualizer";
import { GapCard } from "@/components/career/GapCard";
import { PathwayTimeline } from "@/components/career/PathwayTimeline";
import { AskMacOsDrawer } from "@/components/chat/AskMacOsDrawer";

type TabKey = "overview" | "trajectories" | "gaps" | "pathway" | "market" | "profile" | "sources";

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
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

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
      <div className="flex flex-1 flex-col items-center justify-center p-16 space-y-4">
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

  const readinessScore = gap_analysis?.readinessScore ?? 68;

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "overview", label: "Overview", icon: Compass },
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
      <div className="border-b border-white/[0.08] bg-[#090607]/80 sticky top-16 z-30 backdrop-blur-xl">
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
                <span className="text-xs font-mono text-[#ac1ed6]">CAREER MAP</span>
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
                    Role Readiness
                  </p>
                  <p className="text-xs font-bold text-emerald-400">
                    {readinessScore >= 70 ? "Competitive" : "Progression Needed"}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setIsChatOpen(true)}
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
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/20"
                      : "bg-white/[0.04] text-[#9a93a5] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT PANELS */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / COMPLETE CAREER MAP */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Insight Card: Competitive Advantage */}
            <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#ac1ed6]/15 via-[#121016] to-[#c26e73]/10 p-6 sm:p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md shrink-0">
                  <Award className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#ac1ed6]">
                    Competitive Advantage Synthesis
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {candidate_profile?.fullName || "Candidate"} &apos;s Unique Strategic Edge
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9a93a5] leading-relaxed pt-1">
                    {gap_analysis?.keyCompetitiveAdvantage ||
                      "Strong foundational software engineering execution with demonstrated project delivery. High leverage potential for technical product scope."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 3-Pillar Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar A: Trajectory Signal */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <TrendingUp className="h-4 w-4 text-[#ac1ed6]" />
                    Trajectory Precedent
                  </div>
                  <button
                    onClick={() => setActiveTab("trajectories")}
                    className="text-[11px] font-bold text-[#ac1ed6] hover:underline flex items-center gap-0.5"
                  >
                    Details <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-xs text-[#9a93a5] leading-relaxed">
                  {trajectory_analysis?.evidencePatterns?.[0] ||
                    "Transitioning candidates succeed by delivering verifiable proof-of-work rather than relying on pedigree."}
                </p>
                <div className="rounded-2xl bg-[#090607]/80 p-3 border border-white/[0.06] text-[11px] text-[#d5d0dd]">
                  <span className="font-bold text-[#c26e73]">Key Catalyst: </span>
                  {trajectory_analysis?.commonTransitions?.[0]?.transitionCatalyst ||
                    "Demonstrated ownership of product telemetry and technical specifications."}
                </div>
              </div>

              {/* Pillar B: Primary Critical Gap */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Target className="h-4 w-4 text-[#c26e73]" />
                    Top Critical Gap
                  </div>
                  <button
                    onClick={() => setActiveTab("gaps")}
                    className="text-[11px] font-bold text-[#c26e73] hover:underline flex items-center gap-0.5"
                  >
                    View All <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-xs font-bold text-white">
                  {gap_analysis?.skillGaps?.[0]?.gap || "Product Strategy & Metric Instrumentation"}
                </p>
                <p className="text-xs text-[#9a93a5] leading-relaxed">
                  {gap_analysis?.skillGaps?.[0]?.impactOnReadiness ||
                    "Required for hiring managers to evaluate cross-functional ownership."}
                </p>
                <div className="rounded-2xl bg-[#090607]/80 p-3 border border-white/[0.06] text-[11px] text-[#d5d0dd]">
                  <span className="font-bold text-[#ac1ed6]">Market Expectation: </span>
                  {gap_analysis?.skillGaps?.[0]?.marketRequirement || "Proven product discovery telemetry."}
                </div>
              </div>

              {/* Pillar C: Immediate Action */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <BookOpen className="h-4 w-4 text-emerald-400" />
                    Immediate Next Action
                  </div>
                  <button
                    onClick={() => setActiveTab("pathway")}
                    className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    Pathway <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-xs font-bold text-white">
                  {pathway?.milestones?.[0]?.title || "Stage 1: Core Competency Sprint"}
                </p>
                <p className="text-xs text-[#9a93a5] leading-relaxed">
                  {pathway?.milestones?.[0]?.action ||
                    "Review product metrics and build proof-of-work case studies."}
                </p>
                <div className="rounded-2xl bg-[#090607]/80 p-3 border border-white/[0.06] text-[11px] text-emerald-400">
                  <span className="font-bold text-white">Proof-of-Work: </span>
                  {pathway?.milestones?.[0]?.expectedEvidence || "Deployable technical demo."}
                </div>
              </div>
            </div>

            {/* Visual Trajectory Preview Section */}
            {trajectory_analysis && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#ac1ed6]" />
                    Macro Trajectory Stepping Stones
                  </h3>
                  <button
                    onClick={() => setActiveTab("trajectories")}
                    className="text-xs font-bold text-[#ac1ed6] hover:underline"
                  >
                    Expand Trajectory View →
                  </button>
                </div>
                <TrajectoryVisualizer trajectory={trajectory_analysis} />
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CAREER TRAJECTORY INTELLIGENCE */}
        {/* ========================================================================= */}
        {activeTab === "trajectories" && trajectory_analysis && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Career Trajectory Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                How successful professionals navigated from technical backgrounds to {target_role}.
              </p>
            </div>
            <TrajectoryVisualizer trajectory={trajectory_analysis} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: TRIANGULATED GAP MAP */}
        {/* ========================================================================= */}
        {activeTab === "gaps" && gap_analysis && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Triangulated Gap Analysis
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                Each gap is justified by triple triangulation: Candidate Evidence + Market Demand + Trajectory Precedent.
              </p>
            </div>

            {/* Skill Gaps */}
            {gap_analysis.skillGaps?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#ac1ed6] flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Skill & Competency Gaps ({gap_analysis.skillGaps.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gap_analysis.skillGaps.map((gap, idx) => (
                    <GapCard key={idx} gap={gap} />
                  ))}
                </div>
              </div>
            )}

            {/* Experience Gaps */}
            {gap_analysis.experienceGaps?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#c26e73] flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Experience & Scope Gaps ({gap_analysis.experienceGaps.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gap_analysis.experienceGaps.map((gap, idx) => (
                    <GapCard key={idx} gap={gap} />
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Gaps */}
            {gap_analysis.evidenceGaps?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Proof-of-Work & Evidence Gaps ({gap_analysis.evidenceGaps.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gap_analysis.evidenceGaps.map((gap, idx) => (
                    <GapCard key={idx} gap={gap} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PERSONALISED 4-STAGE PATHWAY */}
        {/* ========================================================================= */}
        {activeTab === "pathway" && pathway && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Personalised 4-Stage Action Pathway
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                Organized into LEARN → BUILD → DEMONSTRATE → REASSESS milestones with explicit proof-of-work criteria.
              </p>
            </div>
            <PathwayTimeline pathway={pathway} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MARKET INTELLIGENCE & REQUIREMENTS */}
        {/* ========================================================================= */}
        {activeTab === "market" && market_analysis && (
          <div className="space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Market Intelligence: {target_role}
              </h2>
              <p className="text-xs sm:text-sm text-[#9a93a5]">
                Current industry competencies, tooling, and hiring expectations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* High Priority Competencies */}
              <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-lg">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#ac1ed6]" />
                  Core Required Competencies
                </h3>
                <div className="space-y-2.5">
                  {market_analysis.recurringSkills?.map((skill, idx) => (
                    <div key={idx} className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3 flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{skill}</span>
                      <span className="text-[10px] font-mono text-[#c26e73] uppercase">High Demand</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Demand Tools & Technologies */}
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
          onClick={() => setIsChatOpen(true)}
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
      />
    </div>
  );
}

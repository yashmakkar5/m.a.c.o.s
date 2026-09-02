"use client";

import React, { useState } from "react";
import { GapItem } from "@/types";
import {
  AlertCircle,
  BarChart2,
  CheckCircle2,
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GapCardProps {
  gap: GapItem;
  onAskWhy?: (question: string, contextItem: string) => void;
}

export function GapCard({ gap, onAskWhy }: GapCardProps) {
  const [showEvidence, setShowEvidence] = useState(false);

  const priorityBadges = {
    critical: "bg-red-500/10 text-red-400 border-red-500/30",
    high: "bg-[#c26e73]/15 text-[#c26e73] border-[#c26e73]/30",
    medium: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  };

  // Plain English Category Translations (Layer 1)
  const categoryPlainEnglish = {
    evidence: "Proof-of-Work Needed — You may have the ability, but your profile doesn't yet show public proof of it.",
    experience: "Experience Gap — Employers expect hands-on exposure in this area, which isn't clear from your resume.",
    skill: "Skill Gap — You need more practical knowledge in this specific tool or technique.",
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-5 sm:p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#16131c] shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shrink-0 ${
                priorityBadges[gap.priority] || priorityBadges.medium
              }`}
            >
              {gap.priority} Priority
            </span>
            <span className="text-[11px] font-mono text-[#757080] uppercase">
              {gap.category}
            </span>
          </div>
          <h4 className="font-bold text-base text-white flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-[#c26e73] shrink-0" />
            {gap.gap}
          </h4>
        </div>

        {/* Interactive "Why is this a gap?" Button */}
        {onAskWhy && (
          <button
            type="button"
            onClick={() => onAskWhy(`Why is "${gap.gap}" considered a gap for me?`, gap.gap)}
            className="rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-[#ac1ed6]/50 hover:bg-white/[0.08] text-[#d5d0dd] hover:text-white px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#ac1ed6]" />
            <span>Why this?</span>
          </button>
        )}
      </div>

      {/* LAYER 1: Simple Human Explanation */}
      <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-4 space-y-2">
        <p className="text-xs font-medium text-white leading-relaxed">
          {categoryPlainEnglish[gap.category] || "A required competency for your target destination."}
        </p>
        <p className="text-xs text-[#9a93a5] leading-relaxed">
          <strong className="text-[#d5d0dd]">What this means:</strong> {gap.impactOnReadiness}
        </p>
      </div>

      {/* LAYER 2 Toggle Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowEvidence((prev) => !prev)}
          className="text-xs font-semibold text-[#ac1ed6] hover:text-[#c26e73] flex items-center gap-1.5 transition-colors"
        >
          {showEvidence ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              <span>Hide detailed evidence</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              <span>View detailed evidence (Profile vs Market vs Trajectory)</span>
            </>
          )}
        </button>
      </div>

      {/* LAYER 2: Detailed Evidence (Expandable) */}
      {showEvidence && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-white/[0.06] animate-in fade-in duration-200">
          {/* 1. Candidate Evidence */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              Your Current State
            </div>
            <p className="text-[#9a93a5] text-[11px] leading-relaxed">
              {gap.candidateEvidence}
            </p>
          </div>

          {/* 2. Market Requirement */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
              <BarChart2 className="h-3.5 w-3.5 text-[#c26e73] shrink-0" />
              Market Demand
            </div>
            <p className="text-[#9a93a5] text-[11px] leading-relaxed">
              {gap.marketRequirement}
            </p>
          </div>

          {/* 3. Trajectory Precedent */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
              <Compass className="h-3.5 w-3.5 text-[#ac1ed6] shrink-0" />
              Trajectory Precedent
            </div>
            <p className="text-[#9a93a5] text-[11px] leading-relaxed">
              {gap.trajectorySignal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

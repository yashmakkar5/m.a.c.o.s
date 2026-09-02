import React from "react";
import { GapItem } from "@/types";
import { AlertCircle, ArrowUpRight, BarChart2, CheckCircle2, Compass } from "lucide-react";

interface GapCardProps {
  gap: GapItem;
}

export function GapCard({ gap }: GapCardProps) {
  const priorityBadges = {
    critical: "bg-red-500/10 text-red-400 border-red-500/30 shadow-xs",
    high: "bg-[#c26e73]/15 text-[#c26e73] border-[#c26e73]/30 shadow-xs",
    medium: "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-xs",
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-5 sm:p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#16131c] shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-[#c26e73] shrink-0" />
          {gap.gap}
        </h4>
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
            priorityBadges[gap.priority] || priorityBadges.medium
          }`}
        >
          {gap.priority}
        </span>
      </div>

      {/* Triple Triangulation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
        {/* 1. Candidate Evidence */}
        <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
            Candidate Evidence
          </div>
          <p className="text-[#9a93a5] text-[11px] leading-relaxed">
            {gap.candidateEvidence}
          </p>
        </div>

        {/* 2. Market Requirement */}
        <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
            <BarChart2 className="h-3.5 w-3.5 text-[#c26e73]" />
            Market Expectation
          </div>
          <p className="text-[#9a93a5] text-[11px] leading-relaxed">
            {gap.marketRequirement}
          </p>
        </div>

        {/* 3. Trajectory Precedent */}
        <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
            <Compass className="h-3.5 w-3.5 text-[#ac1ed6]" />
            Trajectory Precedent
          </div>
          <p className="text-[#9a93a5] text-[11px] leading-relaxed">
            {gap.trajectorySignal}
          </p>
        </div>
      </div>

      {/* Impact on Readiness Footer */}
      <div className="flex items-center gap-2 text-[11px] text-[#9a93a5] pt-2 border-t border-white/[0.06]">
        <ArrowUpRight className="h-3.5 w-3.5 text-[#ac1ed6] shrink-0" />
        <span>
          <strong className="text-white">Why it matters for readiness:</strong> {gap.impactOnReadiness}
        </span>
      </div>
    </div>
  );
}

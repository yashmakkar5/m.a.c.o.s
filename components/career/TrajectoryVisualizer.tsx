"use client";

import React from "react";
import { CareerTrajectoryOutput } from "@/types";
import {
  ArrowRight,
  GitFork,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  HelpCircle,
} from "lucide-react";

interface TrajectoryVisualizerProps {
  trajectory: CareerTrajectoryOutput;
  onAskWhy?: (question: string, contextItem: string) => void;
}

export function TrajectoryVisualizer({ trajectory, onAskWhy }: TrajectoryVisualizerProps) {
  return (
    <div className="space-y-8">
      {/* WHAT THIS MEANS FOR YOU - Takeaway Callout */}
      <div className="rounded-3xl border border-[#ac1ed6]/30 bg-[#ac1ed6]/5 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#ac1ed6]/20 text-[#ac1ed6] shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#ac1ed6]">
                What This Means For You
              </h4>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                People reach this role through several routes, but strong foundational execution + practical domain exposure + increasing ownership appear repeatedly. You do not need to copy one person&apos;s exact career.
              </p>
            </div>
          </div>

          {onAskWhy && (
            <button
              type="button"
              onClick={() =>
                onAskWhy(
                  "Why is this trajectory considered a realistic route for someone with my background?",
                  "Career Trajectory"
                )
              }
              className="rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-[#ac1ed6]/50 hover:bg-white/[0.08] text-[#d5d0dd] hover:text-white px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-center shrink-0"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#ac1ed6]" />
              <span>Why this route?</span>
            </button>
          )}
        </div>
      </div>

      {/* Trajectory Stages Horizontal Stepper */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#d5d0dd] flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#ac1ed6]" />
            Recurring Progression Stages
          </h4>
          <span className="text-[11px] font-mono text-[#757080]">
            {trajectory.recurringTrajectoryStages.length} Milestones Identified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trajectory.recurringTrajectoryStages.map((stage, idx) => (
            <div
              key={stage.stageNumber || idx}
              className="group relative rounded-3xl border border-white/[0.08] bg-[#121016] p-5 flex flex-col justify-between space-y-4 hover:border-[#ac1ed6]/40 hover:bg-[#16131c] transition-all duration-300 shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-xs font-extrabold text-white shadow-sm">
                    {stage.stageNumber}
                  </span>
                  <span className="text-[10px] font-mono text-[#757080]">
                    Stage {stage.stageNumber} of {trajectory.recurringTrajectoryStages.length}
                  </span>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white group-hover:text-[#c26e73] transition-colors">
                    {stage.stageName}
                  </h5>
                  <p className="text-[11px] font-mono text-[#9a93a5] mt-0.5">
                    {stage.typicalRole}
                  </p>
                </div>
                <p className="text-xs text-[#9a93a5] leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.06] text-[11px] text-[#757080]">
                <strong className="text-white">Core Focus:</strong> {stage.keyFocus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Career Transitions / Catalysts */}
      {trajectory.commonTransitions && trajectory.commonTransitions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#d5d0dd] flex items-center gap-2">
            <GitFork className="h-4 w-4 text-[#c26e73]" />
            Transition Catalysts & Break-In Precedents
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trajectory.commonTransitions.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/[0.08] bg-[#121016] p-5 space-y-3 hover:border-white/20 transition-all shadow-md"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[#d5d0dd] border border-white/[0.06]">
                    {t.from}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#ac1ed6] shrink-0" />
                  <span className="rounded-full bg-gradient-to-r from-[#ac1ed6]/20 to-[#c26e73]/20 px-3 py-1 text-white border border-[#ac1ed6]/30">
                    {t.to}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3.5 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#ac1ed6] font-bold">
                      Transition Catalyst:
                    </span>
                    <p className="text-white font-medium text-xs mt-0.5">
                      {t.transitionCatalyst}
                    </p>
                  </div>
                  <div className="border-t border-white/[0.04] pt-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Key Evidence Required:
                    </span>
                    <p className="text-[#9a93a5] text-[11px] mt-0.5">
                      {t.keyEvidenceRequired}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

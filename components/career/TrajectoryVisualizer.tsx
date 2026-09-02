import React from "react";
import { CareerTrajectoryOutput } from "@/types";
import { ArrowRight, CheckCircle2, GitFork, ShieldCheck, Sparkles, TrendingUp, Compass } from "lucide-react";

interface TrajectoryVisualizerProps {
  trajectory: CareerTrajectoryOutput;
}

export function TrajectoryVisualizer({ trajectory }: TrajectoryVisualizerProps) {
  return (
    <div className="space-y-8">
      {/* Narrative Banner */}
      <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#ac1ed6]/15 via-[#121016] to-[#c26e73]/10 p-6 sm:p-7 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/20 shrink-0 mt-0.5">
            <Compass className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Career Trajectory Intelligence
              </span>
              <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-[#d5d0dd]">
                Macro Signals
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#9a93a5] leading-relaxed">
              Across verified public professional trajectories, these recurring transition milestones repeatedly unlock hiring confidence. We focus on structural patterns and proof-of-work rather than asking you to copy individual celebrities.
            </p>
          </div>
        </div>
      </div>

      {/* Trajectory Stages Horizontal Stepper */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#d5d0dd] flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#ac1ed6]" />
            Recurring Macro Progression Stages
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
                  <h5 className="font-bold text-sm text-white group-hover:text-[#f4f2f5] transition-colors">
                    {stage.stageName}
                  </h5>
                  <div className="mt-1.5 inline-block rounded-full bg-white/[0.05] border border-white/[0.06] px-2.5 py-0.5 text-[10px] text-[#c26e73] font-mono font-medium">
                    {stage.typicalRole}
                  </div>
                </div>

                <p className="text-xs text-[#9a93a5] leading-relaxed line-clamp-3">
                  {stage.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] text-[#9a93a5]">
                <span className="font-bold text-white">Focus:</span> {stage.keyFocus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Transitions & Catalysts */}
      {trajectory.commonTransitions.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#d5d0dd] flex items-center gap-2">
            <GitFork className="h-4 w-4 text-[#c26e73]" />
            Decisive Transition Catalysts
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trajectory.commonTransitions.map((trans, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/[0.08] bg-[#121016] p-5 sm:p-6 space-y-4 shadow-md hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white flex-wrap">
                  <span className="rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1">
                    {trans.from}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#ac1ed6] shrink-0" />
                  <span className="rounded-full bg-[#ac1ed6]/20 border border-[#ac1ed6]/40 px-3 py-1 text-[#d5d0dd]">
                    {trans.to}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#c26e73]">
                    The Transition Catalyst
                  </p>
                  <p className="text-[#9a93a5] leading-relaxed">
                    {trans.transitionCatalyst}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-3 text-[11px] text-[#9a93a5] flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Required Proof-of-Work: </span>
                    {trans.keyEvidenceRequired}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Patterns */}
      {trajectory.evidencePatterns.length > 0 && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d5d0dd]">
            <Sparkles className="h-4 w-4 text-[#ac1ed6]" />
            Recurring Proof-of-Work Patterns Across Transitions
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#9a93a5]">
            {trajectory.evidencePatterns.map((pat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

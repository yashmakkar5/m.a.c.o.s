import React from "react";
import { CareerTrajectoryOutput } from "@/types";
import { ArrowRight, CheckCircle2, GitFork, ShieldCheck, Sparkles } from "lucide-react";

interface TrajectoryVisualizerProps {
  trajectory: CareerTrajectoryOutput;
}

export function TrajectoryVisualizer({ trajectory }: TrajectoryVisualizerProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">
              Career Trajectory Intelligence
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
              Across relevant professional trajectories, these patterns repeatedly appear. M.A.C.O.S. extracts macro progression patterns rather than recommending copying individuals.
            </p>
          </div>
        </div>
      </div>

      {/* Trajectory Stages Timeline */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recurring Macro Progression Stages
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trajectory.recurringTrajectoryStages.map((stage, idx) => (
            <div
              key={stage.stageNumber || idx}
              className="relative rounded-xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {stage.stageNumber}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Step {stage.stageNumber} of {trajectory.recurringTrajectoryStages.length}
                </span>
              </div>
              <h5 className="font-semibold text-sm text-foreground">
                {stage.stageName}
              </h5>
              <div className="mt-1 inline-block rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground font-mono">
                {stage.typicalRole}
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                {stage.description}
              </p>
              <div className="mt-3 pt-3 border-t text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">Focus:</span> {stage.keyFocus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Transitions & Catalysts */}
      {trajectory.commonTransitions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Decisive Transition Catalysts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trajectory.commonTransitions.map((trans, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <GitFork className="h-4 w-4" />
                  <span>{trans.from}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{trans.to}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Catalyst:</p>
                  <p>{trans.transitionCatalyst}</p>
                </div>
                <div className="rounded-lg bg-muted/60 p-2 text-[11px] text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-foreground">Required Evidence:</strong> {trans.keyEvidenceRequired}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Patterns */}
      {trajectory.evidencePatterns.length > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recurring Proof-of-Work Patterns Across Successful Transitions
          </h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {trajectory.evidencePatterns.map((pat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{pat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

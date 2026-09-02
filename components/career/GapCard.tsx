import React from "react";
import { GapItem } from "@/types";
import { AlertCircle, ArrowUpRight, BarChart2, CheckCircle2, Compass } from "lucide-react";

interface GapCardProps {
  gap: GapItem;
}

export function GapCard({ gap }: GapCardProps) {
  const priorityColors = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 transition-all hover:border-foreground/20 hover:shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
          {gap.gap}
        </h4>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
            priorityColors[gap.priority] || priorityColors.medium
          }`}
        >
          {gap.priority}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
        {/* Triangulation 1: Candidate Evidence */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-foreground text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Current State
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {gap.candidateEvidence}
          </p>
        </div>

        {/* Triangulation 2: Market Requirement */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-foreground text-[11px]">
            <BarChart2 className="h-3.5 w-3.5 text-amber-500" />
            Market Demand
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {gap.marketRequirement}
          </p>
        </div>

        {/* Triangulation 3: Trajectory Signal */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-foreground text-[11px]">
            <Compass className="h-3.5 w-3.5 text-blue-500" />
            Trajectory Precedent
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {gap.trajectorySignal}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1 border-t">
        <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
        <span>
          <strong className="text-foreground">Impact on Readiness:</strong> {gap.impactOnReadiness}
        </span>
      </div>
    </div>
  );
}

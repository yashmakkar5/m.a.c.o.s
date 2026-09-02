import React, { useState } from "react";
import { PathwayAction, PathwayOutput, PathwayStage } from "@/types";
import {
  BookOpen,
  Hammer,
  Megaphone,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface PathwayTimelineProps {
  pathway: PathwayOutput;
}

export function PathwayTimeline({ pathway }: PathwayTimelineProps) {
  const [activeStage, setActiveStage] = useState<PathwayStage | "ALL">("ALL");

  const stageConfig: Record<
    PathwayStage,
    { label: string; icon: React.ComponentType<{ className?: string }>; color: string; desc: string }
  > = {
    LEARN: {
      label: "LEARN",
      icon: BookOpen,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      desc: "Acquire core conceptual & domain competencies targeted at critical gaps",
    },
    BUILD: {
      label: "BUILD",
      icon: Hammer,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      desc: "Build tangible, working proof-of-work systems & case studies",
    },
    DEMONSTRATE: {
      label: "DEMONSTRATE",
      icon: Megaphone,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      desc: "Publish, deploy, and verify artifacts publicly with measurable telemetry",
    },
    REASSESS: {
      label: "REASSESS",
      icon: RotateCcw,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      desc: "Test readiness, evaluate milestones, and re-run M.A.C.O.S. orchestration",
    },
  };

  const stages: PathwayStage[] = ["LEARN", "BUILD", "DEMONSTRATE", "REASSESS"];

  return (
    <div className="space-y-6">
      {/* Stage Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-4">
        <button
          onClick={() => setActiveStage("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeStage === "ALL"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All Stages ({pathway.milestones.length})
        </button>
        {stages.map((st) => {
          const cfg = stageConfig[st];
          const count = pathway.stages[st]?.length || 0;
          const Icon = cfg.icon;
          return (
            <button
              key={st}
              onClick={() => setActiveStage(st)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeStage === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Pathway Actions List */}
      <div className="space-y-6">
        {stages
          .filter((st) => activeStage === "ALL" || activeStage === st)
          .map((st) => {
            const actions = pathway.stages[st] || [];
            const cfg = stageConfig[st];
            const Icon = cfg.icon;

            if (actions.length === 0) return null;

            return (
              <div key={st} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${cfg.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base tracking-tight text-foreground">
                        {cfg.label} Phase
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        • {actions.length} {actions.length === 1 ? "Action" : "Actions"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                  </div>
                </div>

                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-border/60 ml-4">
                  {actions.map((action, idx) => (
                    <PathwayActionItem key={action.id || idx} action={action} />
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function PathwayActionItem({ action }: { action: PathwayAction }) {
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 transition-all hover:border-foreground/20 hover:shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Stage: {action.stage} • Priority: {action.priority.toUpperCase()}
          </span>
          <h5 className="font-bold text-sm sm:text-base text-foreground mt-0.5">
            {action.title}
          </h5>
        </div>
        {action.estimatedDuration && (
          <span className="inline-block self-start rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            ⏱ {action.estimatedDuration}
          </span>
        )}
      </div>

      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
        {action.action}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
          <span className="font-medium text-foreground text-[11px] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Why This Matters
          </span>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {action.whyItMatters}
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-1">
            <strong>Targeted Gap:</strong> {action.relatedGap}
          </p>
        </div>

        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
          <span className="font-medium text-foreground text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Expected Evidence Artifact
          </span>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {action.expectedEvidence}
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-1">
            <strong>Completion Criteria:</strong> {action.completionCriteria}
          </p>
        </div>
      </div>

      {action.resources && action.resources.length > 0 && (
        <div className="pt-2 border-t flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-medium text-muted-foreground">Recommended Resources:</span>
          {action.resources.map((res, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              <BookOpen className="h-3 w-3" />
              {res}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

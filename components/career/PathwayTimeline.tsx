"use client";

import React, { useState } from "react";
import { PathwayAction, PathwayOutput, PathwayStage } from "@/types";
import {
  BookOpen,
  Hammer,
  Megaphone,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PathwayTimelineProps {
  pathway: PathwayOutput;
  onAskWhy?: (question: string, contextItem: string) => void;
}

export function PathwayTimeline({ pathway, onAskWhy }: PathwayTimelineProps) {
  const [activeStage, setActiveStage] = useState<PathwayStage | "ALL">("ALL");

  const stageConfig: Record<
    PathwayStage,
    { label: string; icon: React.ComponentType<{ className?: string }>; badgeColor: string; iconBg: string; desc: string }
  > = {
    LEARN: {
      label: "LEARN",
      icon: BookOpen,
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      iconBg: "bg-blue-500/20 text-blue-400",
      desc: "Acquire core conceptual competencies targeted specifically at your critical gaps",
    },
    BUILD: {
      label: "BUILD",
      icon: Hammer,
      badgeColor: "bg-[#c26e73]/15 text-[#c26e73] border-[#c26e73]/30",
      iconBg: "bg-[#c26e73]/20 text-[#c26e73]",
      desc: "Build tangible, working proof-of-work systems and architecture case studies",
    },
    DEMONSTRATE: {
      label: "DEMONSTRATE",
      icon: Megaphone,
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconBg: "bg-emerald-500/20 text-emerald-400",
      desc: "Publish and deploy verifiable artifacts with measurable user or business metrics",
    },
    REASSESS: {
      label: "REASSESS",
      icon: RotateCcw,
      badgeColor: "bg-[#ac1ed6]/15 text-[#ac1ed6] border-[#ac1ed6]/30",
      iconBg: "bg-[#ac1ed6]/20 text-[#ac1ed6]",
      desc: "Evaluate completed milestones, test readiness, and re-run M.A.C.O.S. calibration",
    },
  };

  const stages: PathwayStage[] = ["LEARN", "BUILD", "DEMONSTRATE", "REASSESS"];

  return (
    <div className="space-y-8">
      {/* WHAT THIS MEANS FOR YOU - Top Takeaway Callout */}
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              What This Means For You
            </h4>
            <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
              Your fastest next step is turning your existing technical strength into visible practical proof. Build real artifacts before collecting more certificates.
            </p>
          </div>
        </div>
      </div>

      {/* Stage Filter Buttons (Pill design) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-5">
        <button
          onClick={() => setActiveStage("ALL")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeStage === "ALL"
              ? "bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/25"
              : "bg-white/[0.04] text-[#9a93a5] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeStage === st
                  ? "bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white shadow-md shadow-[#ac1ed6]/25"
                  : "bg-white/[0.04] text-[#9a93a5] hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Pathway Actions List */}
      <div className="space-y-8">
        {stages
          .filter((st) => activeStage === "ALL" || activeStage === st)
          .map((st) => {
            const actions = pathway.stages[st] || [];
            const cfg = stageConfig[st];
            const Icon = cfg.icon;

            if (actions.length === 0) return null;

            return (
              <div key={st} className="space-y-5">
                {/* Phase Section Header */}
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-2xl ${cfg.iconBg} shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-lg text-white tracking-tight">
                        {cfg.label} Phase
                      </h4>
                      <span className="text-xs text-[#757080]">
                        • {actions.length} {actions.length === 1 ? "Action" : "Actions"}
                      </span>
                    </div>
                    <p className="text-xs text-[#9a93a5]">{cfg.desc}</p>
                  </div>
                </div>

                {/* Action Items Column */}
                <div className="space-y-4 pl-2 sm:pl-6 border-l-2 border-white/[0.08] ml-5">
                  {actions.map((action, idx) => (
                    <PathwayActionItem
                      key={action.id || idx}
                      action={action}
                      onAskWhy={onAskWhy}
                    />
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function PathwayActionItem({
  action,
  onAskWhy,
}: {
  action: PathwayAction;
  onAskWhy?: (question: string, contextItem: string) => void;
}) {
  const [showCriteria, setShowCriteria] = useState(false);

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-5 sm:p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#16131c] shadow-lg space-y-4">
      {/* Action Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ac1ed6]">
              {action.stage}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c26e73]">
              {action.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          <h5 className="font-bold text-base text-white">
            {action.title}
          </h5>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action.estimatedDuration && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1 text-xs font-mono text-[#d5d0dd]">
              <Clock className="h-3 w-3 text-[#ac1ed6]" />
              {action.estimatedDuration}
            </span>
          )}

          {/* "Why this step?" button */}
          {onAskWhy && (
            <button
              type="button"
              onClick={() => onAskWhy(`Why is the action step "${action.title}" recommended for me?`, action.title)}
              className="rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-[#ac1ed6]/50 hover:bg-white/[0.08] text-[#d5d0dd] hover:text-white px-3 py-1 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#ac1ed6]" />
              <span>Why this?</span>
            </button>
          )}
        </div>
      </div>

      {/* LAYER 1: Simple Plain English Action Description */}
      <div className="rounded-2xl bg-[#090607]/80 border border-white/[0.06] p-4 space-y-2">
        <p className="text-xs font-medium text-white leading-relaxed">
          {action.action}
        </p>
        <div className="text-xs text-[#9a93a5] leading-relaxed pt-1 border-t border-white/[0.04]">
          <span className="text-[#c26e73] font-bold">Why it matters: </span>
          {action.whyItMatters}
        </div>
      </div>

      {/* LAYER 2 Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowCriteria((prev) => !prev)}
          className="text-xs font-semibold text-[#ac1ed6] hover:text-[#c26e73] flex items-center gap-1.5 transition-colors"
        >
          {showCriteria ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              <span>Hide completion proof criteria</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              <span>View expected proof-of-work artifact & completion criteria</span>
            </>
          )}
        </button>
      </div>

      {/* LAYER 2: Expandable Criteria */}
      {showCriteria && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 space-y-2 text-xs border-t border-white/[0.06] animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-white text-[11px]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Expected Deliverable Artifact
          </div>
          <p className="text-[#9a93a5] text-[11px] leading-relaxed">
            {action.expectedEvidence}
          </p>
          <div className="text-[11px] text-[#757080] pt-2 border-t border-white/[0.04]">
            <strong className="text-white">Completion Criteria: </strong>
            {action.completionCriteria}
          </div>
        </div>
      )}

      {/* Recommended Resources */}
      {action.resources && action.resources.length > 0 && (
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-white">Suggested Resources:</span>
          {action.resources.map((res, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-0.5 text-[11px] text-[#9a93a5]"
            >
              <BookOpen className="h-3 w-3 text-[#ac1ed6]" />
              {res}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

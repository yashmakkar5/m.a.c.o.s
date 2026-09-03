"use client";

import React from "react";
import {
  Sliders,
  Sparkles,
  Check,
  Globe,
  Clock,
  GraduationCap,
  Layers,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export type ConstraintFilterId =
  | "all"
  | "free_only"
  | "accessible"
  | "remote"
  | "self_paced"
  | "student_switcher";

interface PersonalizePathBarProps {
  activeConstraint: ConstraintFilterId;
  onSelectConstraint: (id: ConstraintFilterId) => void;
}

export const CONSTRAINT_OPTIONS: Array<{
  id: ConstraintFilterId;
  label: string;
  icon: string;
  shortDesc: string;
  strategyNote: string;
}> = [
  {
    id: "all",
    label: "All Pathways",
    icon: "✦",
    shortDesc: "Complete Canonical Roadmap",
    strategyNote: "Displaying the complete evidence-backed progression pathway without constraint modifications.",
  },
  {
    id: "free_only",
    label: "Free / Open-Source",
    icon: "🆓",
    shortDesc: "Zero-Cost Learning & Artifacts",
    strategyNote:
      "Free & Open-Source Route Active: Expensive course certifications and paid tool dependencies are bypassed. Recommendations prioritize free Notion PRD templates, MIT/Stanford open curriculum, and open-source GitHub proof-of-work.",
  },
  {
    id: "accessible",
    label: "Accessible Learning",
    icon: "♿",
    shortDesc: "Screen-Reader & Flexible Formats",
    strategyNote:
      "Accessible Learning Route Active: Resources emphasize screen-reader compliant markdown docs, accessible transcripts, keyboard-navigable demos, and clear visual contrast specifications.",
  },
  {
    id: "remote",
    label: "Remote-Friendly",
    icon: "🌐",
    shortDesc: "Async Proof & Distributed Work",
    strategyNote:
      "Remote-First Route Active: Focuses on asynchronous written communication, Loom video walkthroughs, and public pull-request contributions that demonstrate distributed team readiness.",
  },
  {
    id: "self_paced",
    label: "Flexible / Self-Paced",
    icon: "⏱",
    shortDesc: "3–5 Hours / Week Micro-Steps",
    strategyNote:
      "Flexible Pacing Active: Milestones are restructured into manageable 3–5 hours/week sprints designed to fit alongside full-time employment or family caretaking commitments.",
  },
  {
    id: "student_switcher",
    label: "Student / Switcher",
    icon: "🎓",
    shortDesc: "Non-Traditional Bridge",
    strategyNote:
      "Career Switcher & Student Route Active: Capitalizes on prior domain exposure and academic projects to skip redundant foundational coursework and jump directly to proof-of-work creation.",
  },
];

export function PersonalizePathBar({
  activeConstraint,
  onSelectConstraint,
}: PersonalizePathBarProps) {
  const currentOption = CONSTRAINT_OPTIONS.find((c) => c.id === activeConstraint) || CONSTRAINT_OPTIONS[0];

  return (
    <div className="rounded-3xl border border-white/[0.12] bg-[#121016] p-5 sm:p-6 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white">
            <Sliders className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Personalize My Path — Inclusive Constraints
          </span>
          <span className="rounded-full bg-[#ac1ed6]/15 text-[#d5d0dd] px-2.5 py-0.5 text-[10px] font-mono border border-[#ac1ed6]/25">
            Adaptive Layer
          </span>
        </div>
        <span className="text-[11px] text-[#9a93a5] italic">
          “Same destination. More accessible paths.”
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {CONSTRAINT_OPTIONS.map((opt) => {
          const isSelected = activeConstraint === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectConstraint(opt.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all flex items-center gap-2 border ${
                isSelected
                  ? "bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white border-transparent shadow-md shadow-[#ac1ed6]/20 font-bold scale-[1.02]"
                  : "bg-white/[0.03] border-white/10 text-[#d5d0dd] hover:border-white/25 hover:bg-white/[0.06]"
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
              {isSelected && <Check className="h-3.5 w-3.5 ml-0.5 text-white" />}
            </button>
          );
        })}
      </div>

      {/* Strategy Callout Banner when a constraint is active */}
      {activeConstraint !== "all" && (
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4 space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{currentOption.label} Strategy Applied</span>
            <span className="text-emerald-500/40">•</span>
            <span className="text-[11px] text-emerald-300/80 font-normal">{currentOption.shortDesc}</span>
          </div>
          <p className="text-xs text-[#d5d0dd] leading-relaxed pl-6">
            {currentOption.strategyNote}
          </p>
        </div>
      )}
    </div>
  );
}

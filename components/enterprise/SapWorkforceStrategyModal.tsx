"use client";

import React from "react";
import {
  X,
  User,
  Compass,
  Briefcase,
  Building,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SapWorkforceStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  targetRole?: string;
}

export function SapWorkforceStrategyModal({
  isOpen,
  onClose,
  candidateName = "Candidate",
  targetRole = "Technical Product Manager",
}: SapWorkforceStrategyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0e0c12] p-6 sm:p-8 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 px-3 py-0.5 text-[11px] font-mono font-bold tracking-wider uppercase">
                Enterprise Evolution • Future Integration
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-[#9a93a5]">SAP Workforce Ecosystem Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Connecting Individual Career Navigation to Enterprise Workforce Strategy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#9a93a5] hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pitch Headline */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-blue-950/30 via-[#14111a] to-[#ac1ed6]/15 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-[#d5d0dd] leading-relaxed">
            <strong className="text-white">“M.A.C.O.S. is the navigation layer between a person's current capabilities and their future role.</strong>{" "}
            We research what the market needs, learn from real career trajectories, identify missing capabilities and evidence, and turn that into an actionable development path. With SAP's workforce and skills ecosystem, this individual navigation layer evolves into workforce-scale mobility and development.”
          </p>
        </div>

        {/* Visual 3-Pillar Story (Left: Person, Center: MACOS, Right: SAP Enterprise) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
          {/* LEFT: PERSON */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#14121a] p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-xs font-mono font-bold uppercase text-[#9a93a5] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#ac1ed6]" />
                  01. The Individual
                </span>
                <span className="text-[10px] text-white/40 font-mono">WHERE YOU ARE</span>
              </div>
              <h3 className="font-bold text-base text-white">Current Capabilities</h3>
              <ul className="space-y-2 text-xs text-[#d5d0dd]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Demonstrated Skills:</strong> Verifiable programming, data pipelines, project code</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Prior Experience:</strong> Hands-on technical or operational execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-[#c26e73] shrink-0 mt-0.5" />
                  <span><strong>Target Destination:</strong> {targetRole}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-[#090607]/80 border border-white/[0.06] p-3 text-[11px] text-[#9a93a5]">
              <span className="font-bold text-white block mb-0.5">The Individual Question:</span>
              “Where am I, where do I want to go, and what proof do I need to build?”
            </div>
          </div>

          {/* CENTER: M.A.C.O.S. NAVIGATION LAYER */}
          <div className="rounded-2xl border border-[#ac1ed6]/30 bg-gradient-to-b from-[#ac1ed6]/10 to-[#121016] p-5 space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#ac1ed6]/20 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-[#ac1ed6] flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-[#ac1ed6]" />
                  02. M.A.C.O.S. Layer
                </span>
                <span className="text-[10px] text-[#ac1ed6] font-mono">THE BRIDGE</span>
              </div>
              <h3 className="font-bold text-base text-white">Research & Navigation</h3>
              <ul className="space-y-2 text-xs text-[#d5d0dd]">
                <li className="flex items-start gap-2">
                  <span className="text-[#ac1ed6] font-bold">1.</span>
                  <span><strong>Market Intelligence:</strong> Core requirements + evidence expectations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ac1ed6] font-bold">2.</span>
                  <span><strong>Trajectory Mining:</strong> Real professional precedents + pattern frequency</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ac1ed6] font-bold">3.</span>
                  <span><strong>Gap Triangulation:</strong> Skill vs Experience vs Evidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ac1ed6] font-bold">4.</span>
                  <span><strong>Personalized Constraints:</strong> Free, accessible, and self-paced paths</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-[#ac1ed6]/15 border border-[#ac1ed6]/30 p-3 text-[11px] text-white">
              <span className="font-bold text-[#ac1ed6] block mb-0.5">Core M.A.C.O.S. Role:</span>
              Prepares the individual by turning unstructured ambition into verified evidence.
            </div>
          </div>

          {/* RIGHT: SAP ENTERPRISE ECOSYSTEM */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-[#121016] p-5 space-y-4 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-blue-400 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-blue-400" />
                  03. SAP Enterprise
                </span>
                <span className="text-[10px] text-blue-400 font-mono">WORKFORCE SCALE</span>
              </div>
              <h3 className="font-bold text-base text-white">Enterprise Deployment</h3>
              <ul className="space-y-2 text-xs text-[#d5d0dd]">
                <li className="flex items-start gap-2">
                  <Layers className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Talent Intelligence Hub:</strong> Ingests verified capability evidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Internal Mobility:</strong> Matches prepared talent to strategic openings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Workforce Reskilling:</strong> Deploys structured pathways across teams</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-[11px] text-blue-200">
              <span className="font-bold text-blue-300 block mb-0.5">The Enterprise Outcome:</span>
              “M.A.C.O.S. prepares the person. SAP's enterprise ecosystem deploys those capabilities at scale.”
            </div>
          </div>
        </div>

        {/* The Skills Mismatch: Individual Resolution */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#14121a] p-5 space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Solving the Skills Mismatch at the Individual Level
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-[#090607]/80 p-3 border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#c26e73] uppercase">The Market Needs</span>
              <p className="text-[#d5d0dd]">Product discovery, telemetry metrics, customer interviewing, and sprint prioritization.</p>
            </div>
            <div className="rounded-xl bg-[#090607]/80 p-3 border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">The Candidate Has</span>
              <p className="text-[#d5d0dd]">Software development, API architecture, SQL queries, and project code execution.</p>
            </div>
            <div className="rounded-xl bg-[#090607]/80 p-3 border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">M.A.C.O.S. Builds The Bridge</span>
              <p className="text-[#d5d0dd]">PRD case study, event telemetry plan, and public demo video—closing the proof gap.</p>
            </div>
          </div>
        </div>

        {/* Honesty & Transparency Notice */}
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-[11px] text-[#9a93a5] space-y-1">
          <span className="font-bold text-[#d5d0dd] block">Transparency & Implementation Disclosure:</span>
          <p>
            M.A.C.O.S. operates as an independent, working career intelligence prototype. The SAP enterprise connection is designated as <strong>“Enterprise Evolution / Future Integration”</strong> and outlines how M.A.C.O.S.'s individual capability and evidence engine naturally integrates with SAP Talent Intelligence Hub and SAP SuccessFactors in enterprise production environments.
          </p>
        </div>

        {/* Bottom Taglines & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-xs font-bold text-white">
              From “What job can I get?” to “What capability should I build next?”
            </div>
            <div className="text-[11px] text-[#ac1ed6] font-mono">
              Same destination. More accessible paths.
            </div>
          </div>
          <Button
            onClick={onClose}
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white font-bold text-xs px-6"
          >
            Close Strategic Overview
          </Button>
        </div>
      </div>
    </div>
  );
}

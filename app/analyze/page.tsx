"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Building,
  Target,
  FileCheck,
  Compass,
  X,
  Loader2,
  TrendingUp,
  Layers,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SYNTHETIC_RESUME_TEXT } from "@/lib/fixtures/syntheticResume";

const STAGES = [
  {
    num: "01",
    title: "Understanding your profile",
    desc: "Extracting demonstrated skills and verified evidence from your resume...",
    icon: FileText,
  },
  {
    num: "02",
    title: "Researching market requirements",
    desc: "Synthesizing current market competencies and tooling for your target destination...",
    icon: Layers,
  },
  {
    num: "03",
    title: "Analysing career trajectories",
    desc: "Mining macro progression stages and recurring transition catalysts...",
    icon: TrendingUp,
  },
  {
    num: "04",
    title: "Identifying your gaps",
    desc: "Triangulating candidate evidence against market demands and trajectory patterns...",
    icon: Target,
  },
  {
    num: "05",
    title: "Building your pathway",
    desc: "Architecting tactical LEARN → BUILD → DEMONSTRATE → REASSESS milestones...",
    icon: Compass,
  },
];

const SUGGESTED_ROLES = [
  "Technical Product Manager",
  "AI Engineer",
  "Solutions Architect",
  "Founding Engineer",
  "Engineering Manager",
  "Data Platform Lead",
];

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Technical Product Manager");
  const [targetIndustry, setTargetIndustry] = useState("B2B SaaS / Developer Tools");
  const [targetCompany, setTargetCompany] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isUsingSynthetic, setIsUsingSynthetic] = useState(false);

  // Analysis Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setIsUsingSynthetic(false);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setIsUsingSynthetic(false);
      setErrorMessage(null);
    }
  };

  const handleUseSyntheticData = () => {
    const blob = new Blob([SYNTHETIC_RESUME_TEXT], { type: "text/plain" });
    const syntheticFile = new File([blob], "Alex_Rivera_Synthetic_Resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    setFile(syntheticFile);
    setTargetRole("Technical Product Manager");
    setTargetIndustry("B2B SaaS & Developer Platforms");
    setTargetCompany("Stripe or Datadog");
    setAdditionalContext(
      "Aspiring to transition from Frontend Engineering into Technical Product Management within developer platforms."
    );
    setIsUsingSynthetic(true);
    setErrorMessage(null);
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setIsUsingSynthetic(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!targetRole.trim()) {
      setErrorMessage("Please specify your desired target role.");
      return;
    }

    if (!file) {
      setErrorMessage("Please upload your resume (.pdf or .docx) or use the sample profile.");
      return;
    }

    setIsProcessing(true);
    setCurrentStageIndex(0);

    // Subtle stage timer progression while waiting for real multi-agent orchestration
    const timer = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 4500);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("targetRole", targetRole.trim());
      formData.append("targetIndustry", targetIndustry.trim());
      formData.append("targetCompany", targetCompany.trim());
      formData.append("additionalContext", additionalContext.trim());

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(timer);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete career analysis.");
      }

      setCurrentStageIndex(STAGES.length - 1);

      // Smooth transition to the resulting Career Map
      setTimeout(() => {
        router.push(`/results/${data.analysisId}`);
      }, 900);
    } catch (err: unknown) {
      clearInterval(timer);
      setIsProcessing(false);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while analyzing your career profile."
      );
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* HEADER */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-[#d5d0dd]">
          <Sparkles className="h-3.5 w-3.5 text-[#ac1ed6]" />
          <span>Step 1 of 2: Intake & Career Destination</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Configure Your Career Map
        </h1>
        <p className="text-sm sm:text-base text-[#9a93a5] max-w-2xl">
          Provide your current resume and target role. M.A.C.O.S. will extract your verified proof-of-work and mine real trajectories to construct your pathway.
        </p>
      </div>

      {/* SAMPLE DATA QUICK TEST HELPER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-white/[0.08] bg-[#121016] p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ac1ed6]/15 text-[#ac1ed6] shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white">
              Instant Hackathon / Demo Evaluation
            </p>
            <p className="text-[#9a93a5] mt-0.5">
              Want to test the full pipeline in 1 click without uploading a local file?
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseSyntheticData}
          className="shrink-0 text-xs font-semibold rounded-full border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white hover:border-[#ac1ed6]/50 gap-1.5 h-9 px-4 transition-all"
        >
          <FileCheck className="h-3.5 w-3.5 text-[#ac1ed6]" />
          Fill Sample Synthetic Profile
        </Button>
      </div>

      {/* INTAKE FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: TARGET DESTINATION */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h2 className="font-bold text-lg text-white flex items-center gap-2.5">
              <Target className="h-5 w-5 text-[#ac1ed6]" />
              1. Desired Career Destination
            </h2>
            <span className="text-[11px] font-mono text-[#757080]">WHERE YOU WANT TO GO</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d5d0dd]">
                Target Role <span className="text-[#c26e73]">*</span>
              </label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Technical Product Manager, AI Engineer, Solutions Architect"
                className="w-full rounded-2xl border border-white/10 bg-[#090607]/80 px-4 py-3 text-sm text-white placeholder:text-[#757080] focus:border-[#ac1ed6] focus:outline-none focus:ring-1 focus:ring-[#ac1ed6] transition-all"
              />

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-[#757080] mr-1">Suggestions:</span>
                {SUGGESTED_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setTargetRole(role)}
                    className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-[#9a93a5] hover:text-white hover:border-white/20 transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d5d0dd]">
                  Target Industry
                </label>
                <input
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  placeholder="e.g. B2B SaaS, FinTech, HealthTech"
                  className="w-full rounded-2xl border border-white/10 bg-[#090607]/80 px-4 py-3 text-sm text-white placeholder:text-[#757080] focus:border-[#ac1ed6] focus:outline-none focus:ring-1 focus:ring-[#ac1ed6] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d5d0dd] flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-[#757080]" />
                  Target Company <span className="text-[#757080] font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Stripe, Datadog, or general market"
                  className="w-full rounded-2xl border border-white/10 bg-[#090607]/80 px-4 py-3 text-sm text-white placeholder:text-[#757080] focus:border-[#ac1ed6] focus:outline-none focus:ring-1 focus:ring-[#ac1ed6] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d5d0dd]">
                Additional Ambitions / Specific Interests{" "}
                <span className="text-[#757080] font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={2}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Mention specific areas you wish to focus on (e.g., 'shifting from frontend to API developer tooling', 'seeking roles with heavy ML exposure')"
                className="w-full rounded-2xl border border-white/10 bg-[#090607]/80 px-4 py-3 text-sm text-white placeholder:text-[#757080] focus:border-[#ac1ed6] focus:outline-none focus:ring-1 focus:ring-[#ac1ed6] transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: RESUME UPLOAD */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h2 className="font-bold text-lg text-white flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-[#c26e73]" />
              2. Current Career State (Resume)
            </h2>
            <span className="text-[11px] font-mono text-[#757080]">WHERE YOU ARE</span>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-300 ${
              file
                ? "border-[#ac1ed6] bg-[#ac1ed6]/5 shadow-inner"
                : "border-white/10 hover:border-[#ac1ed6]/50 hover:bg-white/[0.02]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-lg shadow-[#ac1ed6]/20">
                  <FileCheck className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <p className="font-bold text-base text-white">{file.name}</p>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="text-[#9a93a5] hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#9a93a5] mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                    {isUsingSynthetic ? "Synthetic Demonstration File" : "Uploaded Local File"}
                  </p>
                </div>
                <span className="inline-block text-xs font-semibold text-[#ac1ed6] hover:underline">
                  Click to replace file
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-[#9a93a5]">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <div>
                  <p className="font-bold text-base text-white">
                    Drop your resume here or browse files
                  </p>
                  <p className="text-xs text-[#9a93a5] mt-1">
                    Accepts PDF (.pdf) and Microsoft Word (.docx) • Max 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {errorMessage && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
            <div className="space-y-1">
              <p className="font-bold text-red-200">Analysis Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto h-13 px-9 text-base font-bold rounded-full bg-gradient-to-r from-[#ac1ed6] via-[#b32dd4] to-[#c26e73] hover:opacity-95 text-white border-0 shadow-lg shadow-[#ac1ed6]/25 hover:shadow-xl hover:shadow-[#ac1ed6]/35 active:scale-95 transition-all gap-2"
          >
            <Compass className="h-5 w-5" />
            Analyze My Career
            <ArrowUpRight className="h-5 w-5 opacity-80" />
          </Button>
        </div>
      </form>

      {/* ANALYSIS PROCESSING SCREEN OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090607]/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#121016] p-8 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="ambient-glow -top-20 -left-20 h-64 w-64 bg-[#ac1ed6]/20" />
            <div className="ambient-glow -bottom-20 -right-20 h-64 w-64 bg-[#c26e73]/20" />

            {/* Modal Header */}
            <div className="text-center space-y-3 relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-xl shadow-[#ac1ed6]/30 animate-pulse">
                <Compass className="h-8 w-8 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  Constructing Your Career Map
                </h3>
                <p className="text-xs sm:text-sm text-[#9a93a5] mt-1">
                  Destination: <span className="text-white font-semibold">{targetRole}</span>
                </p>
              </div>
            </div>

            {/* 5-Stage Step Indicators */}
            <div className="space-y-3 relative">
              {STAGES.map((stage, idx) => {
                const isCurrent = idx === currentStageIndex;
                const isDone = idx < currentStageIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 rounded-2xl p-3.5 transition-all duration-300 ${
                      isCurrent
                        ? "border border-[#ac1ed6]/40 bg-[#ac1ed6]/10 shadow-md"
                        : isDone
                        ? "border border-white/[0.06] bg-white/[0.02] opacity-80"
                        : "border border-transparent opacity-40"
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isDone ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : isCurrent ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ac1ed6] text-white">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[#757080] font-mono text-[10px]">
                          {stage.num}
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold ${isCurrent ? "text-white" : "text-[#d5d0dd]"}`}>
                          {stage.title}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-[#ac1ed6] uppercase animate-pulse">
                            Processing
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#9a93a5]">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-[#757080]">
              Running multi-agent pipeline: Profile Agent → Market Agent → Trajectory Miner → Gap Triangulation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

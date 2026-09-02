"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Building,
  Target,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SYNTHETIC_RESUME_TEXT } from "@/lib/fixtures/syntheticResume";

const ANALYSIS_STAGES = [
  { id: "uploading", label: "Validating & uploading resume file..." },
  { id: "extracting", label: "Extracting text and validating document structure..." },
  { id: "profile", label: "Synthesizing candidate profile & demonstrated capabilities..." },
  { id: "skills", label: "Discovering verified skills vs unsupported claims..." },
  { id: "market_trajectory", label: "Researching market requirements & mining trajectory patterns..." },
  { id: "gaps", label: "Triangulating skill, experience, and evidence gaps..." },
  { id: "pathway", label: "Architecting LEARN → BUILD → DEMONSTRATE → REASSESS pathway..." },
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

  // Status & Progress state
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    // Create a mock synthetic file object from our verified fixture
    const blob = new Blob([SYNTHETIC_RESUME_TEXT], { type: "text/plain" });
    const syntheticFile = new File([blob], "Alex_Rivera_Synthetic_Resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    setFile(syntheticFile);
    setTargetRole("Technical Product Manager");
    setTargetIndustry("B2B SaaS & Developer Platforms");
    setTargetCompany("Stripe or Datadog");
    setAdditionalContext(
      "Aspiring to transition from Frontend Engineering (React/Next.js) into technical product management within developer-focused platforms."
    );
    setIsUsingSynthetic(true);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!targetRole.trim()) {
      setErrorMessage("Please specify a target role (e.g., 'Product Manager', 'AI Engineer').");
      return;
    }

    if (!file) {
      setErrorMessage("Please upload a resume (.pdf or .docx) or click 'Use Sample Synthetic Profile'.");
      return;
    }

    setIsSubmitting(true);
    setCurrentStageIndex(0);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("targetRole", targetRole.trim());
      formData.append("targetIndustry", targetIndustry.trim());
      formData.append("targetCompany", targetCompany.trim());
      formData.append("additionalContext", additionalContext.trim());

      // Visual progress progression while server executes orchestrated pipeline
      const progressInterval = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev < ANALYSIS_STAGES.length - 2) {
            return prev + 1;
          }
          return prev;
        });
      }, 3500);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "An error occurred during career orchestration analysis."
        );
      }

      setCurrentStageIndex(ANALYSIS_STAGES.length - 1);

      // Navigate to career map results
      setTimeout(() => {
        router.push(`/results/${result.analysisId}`);
      }, 800);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : "Failed to analyze career profile.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Step 1 of 2: Candidate & Destination Setup
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Build Your Career Map
        </h1>
        <p className="text-sm text-muted-foreground">
          Provide your current resume and target role. M.A.C.O.S. will orchestrate market research, trajectory mining, and gap triangulation.
        </p>
      </div>

      {/* Quick Test Alert Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">
              Hackathon Fast-Track Evaluation
            </p>
            <p className="text-muted-foreground mt-0.5">
              Want to test the full pipeline immediately without uploading your own document?
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseSyntheticData}
          className="shrink-0 text-xs font-semibold gap-1.5 bg-background shadow-xs hover:border-primary"
        >
          <FileCheck className="h-3.5 w-3.5 text-primary" />
          Fill Sample Synthetic Profile
        </Button>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section A: Resume Upload */}
        <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              1. Current Career State (Resume)
            </h2>
            <span className="text-[11px] text-muted-foreground font-mono">
              Accepted: .pdf, .docx (Max 5MB)
            </span>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              file
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
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
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {file.name} {isUsingSynthetic && "(Synthetic Profile)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                  </p>
                </div>
                <p className="text-[11px] text-primary font-medium hover:underline">
                  Click to replace file
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    Drop your resume here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Supports text-based PDF and Microsoft Word DOCX
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground">
            🔒 <strong>Privacy Note:</strong> Your resume is processed solely for your career analysis and is never shared publicly or used to train public foundation models.
          </p>
        </div>

        {/* Section B: Career Destination */}
        <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            2. Desired Career Destination
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Target Role <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Technical Product Manager, AI Engineer"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Target Industry
              </label>
              <input
                type="text"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
                placeholder="e.g. B2B SaaS, FinTech, HealthTech"
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-muted-foreground" />
              Target Company <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g. Stripe, Google, or leave empty for general market"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Additional Context / Ambitions / Links{" "}
              <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Mention specific areas you wish to focus on (e.g., 'transitioning from frontend to product', 'seeking roles with heavy ML exposure', 'portfolio link: github.com/...')"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Analysis Failed to Start</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit CTA */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 px-8 text-sm font-semibold gap-2 shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Orchestrating Analysis...
              </>
            ) : (
              <>
                Analyze My Career
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Real-time Progress Modal Overlay during Analysis */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Orchestrating Career Intelligence
              </h3>
              <p className="text-xs text-muted-foreground">
                M.A.C.O.S. is executing multi-agent analysis for <strong>{targetRole}</strong>.
              </p>
            </div>

            {/* Stages List */}
            <div className="space-y-3">
              {ANALYSIS_STAGES.map((st, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={st.id}
                    className={`flex items-center gap-3 rounded-lg p-2.5 text-xs transition-colors ${
                      isCurrent
                        ? "bg-primary/10 font-semibold text-primary border border-primary/20"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-muted-foreground/30 shrink-0" />
                    )}
                    <span>{st.label}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-[11px] text-muted-foreground">
              Please wait a few seconds while Gemini and the research engine complete the orchestration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building,
  Target,
  FileCheck,
  RefreshCw,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SYNTHETIC_RESUME_TEXT } from "@/lib/fixtures/syntheticResume";

export default function AnalyzePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Technical Product Manager");
  const [targetIndustry, setTargetIndustry] = useState("B2B SaaS / Developer Tools");
  const [targetCompany, setTargetCompany] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isUsingSynthetic, setIsUsingSynthetic] = useState(false);

  // Status & Progress state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setIsUsingSynthetic(false);
      setErrorMessage(null);
      setIsSubmitted(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      setIsUsingSynthetic(false);
      setErrorMessage(null);
      setIsSubmitted(false);
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
      "Aspiring to transition from Frontend Engineering (React/Next.js) into technical product management within developer-focused platforms."
    );
    setIsUsingSynthetic(true);
    setErrorMessage(null);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!targetRole.trim()) {
      setErrorMessage("Please specify a target role (e.g., 'Product Manager', 'AI Engineer').");
      return;
    }

    if (!file) {
      setErrorMessage("Please upload a resume (.pdf or .docx) or click 'Fill Sample Synthetic Profile'.");
      return;
    }

    // Explicit development confirmation state without claiming fake analysis
    setIsSubmitted(true);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Step 1: Intake & Career Destination
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Build Your Career Map
        </h1>
        <p className="text-sm text-muted-foreground">
          Provide your current resume and target role. The intake form captures your background for subsequent orchestration.
        </p>
      </div>

      {/* Development State Confirmation Banner when submitted */}
      {isSubmitted && file && (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 space-y-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-base text-foreground">
                  Intake Validated (Development State)
                </h3>
                <span className="self-start rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary uppercase">
                  Foundation Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your input parameters have been validated. In this stability phase, AI orchestration is paused to ensure solid routing and error-free execution.
              </p>

              {/* Summary of validated parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="rounded-lg bg-background p-3 border space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Document Received
                  </span>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "Document"}
                  </p>
                </div>

                <div className="rounded-lg bg-background p-3 border space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Target Destination
                  </span>
                  <p className="font-semibold text-foreground">{targetRole}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {targetIndustry || "General Industry"} {targetCompany ? `• ${targetCompany}` : ""}
                  </p>
                </div>
              </div>

              {/* Navigation CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link href="/results">
                  <Button size="sm" className="gap-1.5 text-xs font-semibold">
                    <Compass className="h-3.5 w-3.5" /> Preview Results Page (/results)
                  </Button>
                </Link>
                <Link href="/debug">
                  <Button variant="outline" size="sm" className="text-xs">
                    View System Diagnostics (/debug)
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Edit Parameters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Alert Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-foreground">
              Development Test Helper
            </p>
            <p className="text-muted-foreground mt-0.5">
              Want to populate test fields immediately without picking a local file?
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
                    {file.name} {isUsingSynthetic && "(Synthetic Sample)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Selected
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
                    Supports PDF (.pdf) and Microsoft Word (.docx)
                  </p>
                </div>
              </div>
            )}
          </div>
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
                onChange={(e) => {
                  setTargetRole(e.target.value);
                  setIsSubmitted(false);
                }}
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
                onChange={(e) => {
                  setTargetIndustry(e.target.value);
                  setIsSubmitted(false);
                }}
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
              onChange={(e) => {
                setTargetCompany(e.target.value);
                setIsSubmitted(false);
              }}
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
              onChange={(e) => {
                setAdditionalContext(e.target.value);
                setIsSubmitted(false);
              }}
              placeholder="Mention specific areas you wish to focus on (e.g., 'transitioning from frontend to product', 'seeking roles with heavy ML exposure')"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Validation Issue</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit CTA */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 text-sm font-semibold gap-2 shadow-md"
          >
            Analyze My Career
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

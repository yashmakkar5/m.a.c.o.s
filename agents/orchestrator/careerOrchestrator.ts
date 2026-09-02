import { extractCandidateProfile } from "../profile/profileAgent";
import { runSkillsDiscoveryAgent } from "../skills/skillsAgent";
import { runMarketIntelligenceAgent } from "../market/marketAgent";
import { runCareerTrajectoryAgent } from "../trajectory/trajectoryAgent";
import { runGapAnalysisAgent } from "../gap/gapAgent";
import { runPathwayAgent } from "../pathway/pathwayAgent";
import {
  createAnalysisRecord,
  updateAnalysisRecord,
} from "@/lib/supabase/analysisRepository";
import { AnalysisRecord, AnalysisStatus } from "@/types";
import { buildCanonicalAnalysis } from "@/lib/analysis/canonicalNormalizer";

export interface OrchestrationInput {
  analysisId?: string;
  resumeFileName: string;
  resumeText: string;
  targetRole: string;
  targetIndustry?: string;
  targetCompany?: string;
  additionalContext?: string;
  onProgress?: (status: AnalysisStatus, message: string) => Promise<void> | void;
}

/**
 * Career Orchestrator:
 * Executes the explicit pipeline through the specialized agents, maintaining structured state.
 */
export async function orchestrateCareerAnalysis({
  analysisId,
  resumeFileName,
  resumeText,
  targetRole,
  targetIndustry = "Technology",
  targetCompany = "",
  additionalContext = "",
  onProgress,
}: OrchestrationInput): Promise<AnalysisRecord> {
  const notify = async (status: AnalysisStatus, msg: string) => {
    if (onProgress) {
      try {
        await onProgress(status, msg);
      } catch (err) {
        console.warn("[Orchestrator Progress Error]", err);
      }
    }
  };

  // 1. Initial State Persistence
  await notify("building_profile", "Extracting structured profile and evidence from resume...");
  const initialRecord = await createAnalysisRecord({
    id: analysisId,
    resume_file_name: resumeFileName,
    resume_text: resumeText,
    target_role: targetRole,
    target_industry: targetIndustry,
    target_company: targetCompany,
    analysis_status: "building_profile",
  });

  const recordId = initialRecord.id;

  try {
    // 2. Candidate Profile Extraction
    const candidateProfile = await extractCandidateProfile({
      resumeText,
      targetRole,
      targetIndustry,
      targetCompany,
      additionalContext,
    });
    await updateAnalysisRecord(recordId, {
      candidate_profile: candidateProfile,
      analysis_status: "discovering_skills",
    });

    // 3. Skills Discovery Agent
    await notify(
      "discovering_skills",
      "Evaluating demonstrated capabilities against stated claims..."
    );
    const skillsAnalysis = await runSkillsDiscoveryAgent(candidateProfile);
    await updateAnalysisRecord(recordId, {
      skills_analysis: skillsAnalysis,
      analysis_status: "researching_market",
    });

    // 4. Parallel Execution: Market Intelligence & Career Trajectory Mining
    await notify(
      "researching_market",
      "Researching market expectations and mining professional trajectory patterns..."
    );
    const [marketAnalysis, trajectoryAnalysis] = await Promise.all([
      runMarketIntelligenceAgent({
        targetRole,
        targetIndustry,
        targetCompany,
      }),
      runCareerTrajectoryAgent({
        targetRole,
        targetIndustry,
      }),
    ]);

    await updateAnalysisRecord(recordId, {
      market_analysis: marketAnalysis,
      trajectory_analysis: trajectoryAnalysis,
      analysis_status: "analyzing_gaps",
    });

    // 5. Gap Analysis Agent (Triangulation)
    await notify(
      "analyzing_gaps",
      "Triangulating candidate evidence against market requirements and trajectory patterns..."
    );
    const gapAnalysis = await runGapAnalysisAgent({
      candidateProfile,
      skillsAnalysis,
      marketAnalysis,
      trajectoryAnalysis,
    });
    await updateAnalysisRecord(recordId, {
      gap_analysis: gapAnalysis,
      analysis_status: "generating_pathway",
    });

    // 6. Pathway Architect Agent
    await notify(
      "generating_pathway",
      "Architecting personalised LEARN → BUILD → DEMONSTRATE → REASSESS pathway..."
    );
    const pathway = await runPathwayAgent({
      candidateProfile,
      gapAnalysis,
    });

    // 7. Synthesize Canonical Career Intelligence Analysis
    const canonicalAnalysis = buildCanonicalAnalysis({
      candidateProfile,
      skillsAnalysis,
      marketAnalysis,
      trajectoryAnalysis,
      gapAnalysis,
      pathway,
      targetRole,
      targetIndustry,
      targetCompany,
    });

    // 8. Complete & Finalize
    const completedRecord = await updateAnalysisRecord(recordId, {
      pathway,
      canonical_analysis: canonicalAnalysis,
      analysis_status: "completed",
    });

    await notify("completed", "Career Map orchestration successfully completed.");

    if (!completedRecord) {
      throw new Error("Failed to finalize analysis record.");
    }

    return completedRecord;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[M.A.C.O.S. Orchestrator] Pipeline execution failed:`, error);
    await updateAnalysisRecord(recordId, {
      analysis_status: "failed",
      error_message: errorMsg,
    });
    await notify("failed", `Analysis failed: ${errorMsg}`);
    throw error;
  }
}

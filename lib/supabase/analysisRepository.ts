import { getSupabaseClient } from "./client";
import {
  AnalysisRecord,
  AnalysisStatus,
  CandidateProfile,
  CareerTrajectoryOutput,
  GapAnalysisOutput,
  MarketIntelligenceOutput,
  PathwayOutput,
  SkillsDiscoveryOutput,
} from "@/types";
import crypto from "crypto";

// Server-side in-memory cache for graceful fallback when Supabase is unconfigured or unreachable
const memoryStore = new Map<string, AnalysisRecord>();

export interface CreateAnalysisInput {
  id?: string;
  resume_file_name: string;
  resume_text: string;
  target_role: string;
  target_industry?: string;
  target_company?: string;
  analysis_status: AnalysisStatus;
  candidate_profile?: CandidateProfile;
  skills_analysis?: SkillsDiscoveryOutput;
  market_analysis?: MarketIntelligenceOutput;
  trajectory_analysis?: CareerTrajectoryOutput;
  gap_analysis?: GapAnalysisOutput;
  pathway?: PathwayOutput;
  error_message?: string;
}

/**
 * Creates or inserts a new analysis record.
 */
export async function createAnalysisRecord(
  initial: CreateAnalysisInput
): Promise<AnalysisRecord> {
  const id = initial.id || crypto.randomUUID();
  const created_at = new Date().toISOString();

  const record: AnalysisRecord = {
    id,
    created_at,
    resume_file_name: initial.resume_file_name,
    resume_text: initial.resume_text,
    target_role: initial.target_role,
    target_industry: initial.target_industry || "",
    target_company: initial.target_company || "",
    candidate_profile: initial.candidate_profile || ({} as CandidateProfile),
    skills_analysis: initial.skills_analysis || ({} as SkillsDiscoveryOutput),
    market_analysis: initial.market_analysis || ({} as MarketIntelligenceOutput),
    trajectory_analysis: initial.trajectory_analysis || ({} as CareerTrajectoryOutput),
    gap_analysis: initial.gap_analysis || ({} as GapAnalysisOutput),
    pathway: initial.pathway || ({} as PathwayOutput),
    analysis_status: initial.analysis_status,
    error_message: initial.error_message,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("analyses").insert({
        id: record.id,
        created_at: record.created_at,
        resume_file_name: record.resume_file_name,
        resume_text: record.resume_text,
        target_role: record.target_role,
        target_industry: record.target_industry || "",
        target_company: record.target_company || "",
        candidate_profile: record.candidate_profile,
        skills_analysis: record.skills_analysis,
        market_analysis: record.market_analysis,
        trajectory_analysis: record.trajectory_analysis,
        gap_analysis: record.gap_analysis,
        pathway: record.pathway,
        analysis_status: record.analysis_status,
        error_message: record.error_message || null,
      });

      if (error) {
        console.warn(
          `[M.A.C.O.S. Database] Supabase insert warning: ${error.message}. Falling back to in-memory store.`
        );
      }
    } catch (err) {
      console.warn(
        `[M.A.C.O.S. Database] Supabase connection failed: ${
          err instanceof Error ? err.message : String(err)
        }. Falling back to in-memory store.`
      );
    }
  }

  // Always store in memory cache for immediate fast retrieval & resilience
  memoryStore.set(record.id, record);
  return record;
}

/**
 * Updates status or partial fields of an analysis record.
 */
export async function updateAnalysisRecord(
  id: string,
  updates: Partial<AnalysisRecord>
): Promise<AnalysisRecord | null> {
  const existing = memoryStore.get(id);
  const updated: AnalysisRecord = existing
    ? { ...existing, ...updates }
    : (updates as AnalysisRecord);

  memoryStore.set(id, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, unknown> = {};
      if (updates.analysis_status !== undefined) payload.analysis_status = updates.analysis_status;
      if (updates.candidate_profile !== undefined) payload.candidate_profile = updates.candidate_profile;
      if (updates.skills_analysis !== undefined) payload.skills_analysis = updates.skills_analysis;
      if (updates.market_analysis !== undefined) payload.market_analysis = updates.market_analysis;
      if (updates.trajectory_analysis !== undefined) payload.trajectory_analysis = updates.trajectory_analysis;
      if (updates.gap_analysis !== undefined) payload.gap_analysis = updates.gap_analysis;
      if (updates.pathway !== undefined) payload.pathway = updates.pathway;
      if (updates.error_message !== undefined) payload.error_message = updates.error_message;

      await supabase.from("analyses").update(payload).eq("id", id);
    } catch (err) {
      console.warn(
        `[M.A.C.O.S. Database] Supabase update warning: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  return updated;
}

/**
 * Retrieves an analysis record by ID.
 */
export async function getAnalysisRecordById(id: string): Promise<AnalysisRecord | null> {
  // Check memory store first
  if (memoryStore.has(id)) {
    return memoryStore.get(id) || null;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const record = data as AnalysisRecord;
        memoryStore.set(id, record);
        return record;
      }
    } catch (err) {
      console.warn(
        `[M.A.C.O.S. Database] Supabase query failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  return null;
}

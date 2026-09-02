import { getServerSupabaseClient as getSupabaseClient } from "./server";
import {
  AnalysisRecord,
  AnalysisStatus,
  CandidateProfile,
  CareerTrajectoryOutput,
  GapAnalysisOutput,
  MarketIntelligenceOutput,
  PathwayOutput,
  SkillsDiscoveryOutput,
  CanonicalAnalysis,
} from "@/types";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Server-side in-memory cache for fast access
const memoryStore = new Map<string, AnalysisRecord>();

// Ensure local persistence directory exists
const DATA_DIR = path.join(process.cwd(), ".data", "analyses");
function saveToDisk(record: AnalysisRecord) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const filePath = path.join(DATA_DIR, `${record.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf-8");
  } catch (err) {
    console.warn("[M.A.C.O.S. Local Storage] Disk write warning:", err);
  }
}

function readFromDisk(id: string): AnalysisRecord | null {
  try {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as AnalysisRecord;
    }
  } catch (err) {
    console.warn("[M.A.C.O.S. Local Storage] Disk read warning:", err);
  }
  return null;
}

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
  canonical_analysis?: CanonicalAnalysis;
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
    canonical_analysis: initial.canonical_analysis,
    error_message: initial.error_message,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("analyses").insert({
        id: record.id,
        created_at: record.created_at,
        status: record.analysis_status,
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
        error_message: record.error_message || null,
      });

      if (error) {
        console.warn(
          `[M.A.C.O.S. Database] Supabase insert warning: ${error.message}. Local persistence active.`
        );
      }
    } catch (err) {
      console.warn(
        `[M.A.C.O.S. Database] Supabase connection error: ${
          err instanceof Error ? err.message : String(err)
        }. Local persistence active.`
      );
    }
  }

  // Store in memory cache & write to local disk
  memoryStore.set(record.id, record);
  saveToDisk(record);
  return record;
}

/**
 * Updates status or partial fields of an analysis record.
 */
export async function updateAnalysisRecord(
  id: string,
  updates: Partial<AnalysisRecord>
): Promise<AnalysisRecord | null> {
  const existing = memoryStore.get(id) || readFromDisk(id);
  const updated: AnalysisRecord = existing
    ? { ...existing, ...updates }
    : (updates as AnalysisRecord);

  memoryStore.set(id, updated);
  saveToDisk(updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const payload: Record<string, unknown> = {};
      if (updates.analysis_status !== undefined) payload.status = updates.analysis_status;
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
  // 1. Check memory store first
  if (memoryStore.has(id)) {
    return memoryStore.get(id) || null;
  }

  // 2. Check local disk persistence
  const diskRecord = readFromDisk(id);
  if (diskRecord) {
    memoryStore.set(id, diskRecord);
    return diskRecord;
  }

  // 3. Check Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const record: AnalysisRecord = {
          ...data,
          analysis_status: data.status || data.analysis_status || "completed",
        };
        memoryStore.set(id, record);
        saveToDisk(record);
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

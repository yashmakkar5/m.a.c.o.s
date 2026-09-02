-- Migration: Create analyses table for M.A.C.O.S.
-- Purpose: Persist candidate profiles, market intelligence, trajectory patterns, gap analysis, and pathways.

CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resume_file_name TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    target_role TEXT NOT NULL,
    target_industry TEXT DEFAULT '',
    target_company TEXT DEFAULT '',
    candidate_profile JSONB,
    skills_analysis JSONB,
    market_analysis JSONB,
    trajectory_analysis JSONB,
    gap_analysis JSONB,
    pathway JSONB,
    analysis_status TEXT NOT NULL DEFAULT 'pending',
    error_message TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read, insert, and update for MVP hackathon usage
DROP POLICY IF EXISTS "Allow anonymous read access" ON public.analyses;
CREATE POLICY "Allow anonymous read access" ON public.analyses
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert access" ON public.analyses;
CREATE POLICY "Allow anonymous insert access" ON public.analyses
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update access" ON public.analyses;
CREATE POLICY "Allow anonymous update access" ON public.analyses
    FOR UPDATE USING (true);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_target_role ON public.analyses (target_role);

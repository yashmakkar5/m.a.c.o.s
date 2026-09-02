-- Migration: Create analyses table and private storage for M.A.C.O.S.
-- Purpose: Persist candidate profiles, market intelligence, trajectory patterns, gap analysis, and pathways.

CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending',
    resume_file_name TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    candidate_profile JSONB DEFAULT '{}'::jsonb,
    target_role TEXT NOT NULL,
    target_industry TEXT DEFAULT '',
    target_company TEXT DEFAULT '',
    skills_analysis JSONB DEFAULT '{}'::jsonb,
    market_analysis JSONB DEFAULT '{}'::jsonb,
    trajectory_analysis JSONB DEFAULT '{}'::jsonb,
    gap_analysis JSONB DEFAULT '{}'::jsonb,
    pathway JSONB DEFAULT '{}'::jsonb,
    sources JSONB DEFAULT '[]'::jsonb,
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

-- ========================================================
-- Storage Bucket Setup: Private "resumes" Bucket
-- ========================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Ensure objects in the resumes bucket are private
DROP POLICY IF EXISTS "Allow service and authenticated resume uploads" ON storage.objects;
CREATE POLICY "Allow service and authenticated resume uploads" ON storage.objects
    FOR ALL
    USING (bucket_id = 'resumes');

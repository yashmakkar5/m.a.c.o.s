# Supabase Setup Guide for M.A.C.O.S.

This step-by-step guide walks you through setting up Supabase PostgreSQL and private storage for M.A.C.O.S.

---

### Step 1: Create or Open a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New project** (or select your existing project).
3. Choose a project name (e.g. `macos-career`), set a secure database password, and select your nearest region.
4. Wait 1–2 minutes for the database to provision.

---

### Step 2: Run the Database Migration SQL

1. In your Supabase project dashboard, click on the **SQL Editor** icon in the left sidebar (looks like `>_` or a terminal icon).
2. Click **New Query** (or the `+` button).
3. Open the migration file in this repository:
   [`supabase/migrations/20260902_create_analyses.sql`](./supabase/migrations/20260902_create_analyses.sql)
4. Copy the entire SQL contents and paste them into the Supabase SQL Editor.
5. Click **Run** (or press `Ctrl + Enter` / `Cmd + Enter`).
6. You should see `Success. No rows returned`.
   - This creates the `public.analyses` table with all structured fields.
   - Sets up Row Level Security (RLS) policies.
   - Creates the private `resumes` storage bucket with secure access policies.

---

### Step 3: Verify the Private Storage Bucket

1. In the left sidebar, click on **Storage**.
2. Under **Buckets**, verify that `resumes` is listed.
3. Confirm that the `resumes` bucket has **Public: Off** (Private).
   - This ensures uploaded candidate resumes are protected and cannot be downloaded by unauthorized public visitors.

---

### Step 4: Copy Your Supabase API Keys to `.env.local`

1. In the left sidebar, click on **Project Settings** (gear icon at the bottom).
2. Click on **API** in the settings menu.
3. Find the following values:
   - **Project URL**: Copy this URL.
   - **Project API Keys**:
     - `anon` `public`: Copy this key.
     - `service_role` `secret`: Click "Reveal" and copy this key.
4. Open the [`.env.local`](./.env.local) file in your `m.a.c.o.s` project root and paste your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsIn...
```

> 🔒 **Security Notice:** The `SUPABASE_SERVICE_ROLE_KEY` has full administrative permissions. It is only read by server-side routes in Next.js and is **never** sent to the user's browser. `.env.local` is git-ignored and will never be committed to GitHub.

---

### Step 5: Verify the Database Health Endpoint

1. Start your local development server:
   ```bash
   npm run dev
   ```
2. Open the database health check endpoint in your browser:
   👉 **[http://localhost:3000/api/health/db](http://localhost:3000/api/health/db)**
3. You should see a successful response confirming live connectivity:
   ```json
   {
     "configured": true,
     "provider": "Supabase",
     "status": "ok",
     "latencyMs": 142,
     "tableFound": true
   }
   ```
4. You can also view the combined health status on the diagnostics page:
   👉 **[http://localhost:3000/debug](http://localhost:3000/debug)**

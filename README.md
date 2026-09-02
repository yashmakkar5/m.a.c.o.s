# M.A.C.O.S. (My Adaptive Career Orchestration System)

> **"Don't just match to a job. Navigate to a career."**

M.A.C.O.S. is an AI-powered Career Navigation platform that connects where a professional is, where they want to go, and the evidence-first path between them.

---

## 🧭 Product Vision & Philosophy

Career information today is fragmented. Professionals with private mentors, alumni networks, and institutional pedigree frequently access hidden knowledge about how transitions happen. For candidates from Tier-2/Tier-3 institutions, career switchers, and non-traditional backgrounds, this lack of transparency creates an artificial barrier.

M.A.C.O.S. replaces guesswork and pedigree bias with **demonstrated proof-of-work** and **Career Trajectory Intelligence**.

### Core Differentiator: Career Trajectory Intelligence
Rather than telling candidates to mimic a famous celebrity, M.A.C.O.S. mines macro transition patterns across relevant public professional career trajectories:
- **Recurring Trajectory Stages**: Understanding the intermediate milestones professionals navigated.
- **Transition Catalysts**: Discovering the exact proof-of-work that enabled transitions from one scope to another.
- **Evidence Patterns**: Identifying the specific portfolio artifacts, code, and case studies that unlock hiring confidence.

---

## 🏛️ Multi-Agent Orchestration Architecture

```
                                  +-----------------------+
                                  | User Resume + Target  |
                                  +-----------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |  Profile Extraction   |
                                  |  (Gemini + Zod Schema)|
                                  +-----------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |   Skills Discovery    |
                                  | (Demonstrated vs Claim)|
                                  +-----------------------+
                                              |
                       +----------------------+----------------------+
                       |                                             |
                       v                                             v
        +----------------------------+                +----------------------------+
        |    Market Intelligence     |                |    Career Trajectory       |
        | (Current Industry Demands) |                | (Macro Progression Mining) |
        +----------------------------+                +----------------------------+
                       |                                             |
                       +----------------------+----------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |     Gap Analysis      |
                                  | (Triple Triangulation)|
                                  +-----------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |    Pathway Architect  |
                                  | (LEARN/BUILD/DEMO/RE) |
                                  +-----------------------+
                                              |
                                              v
                                  +-----------------------+
                                  |   Career Map & Chat   |
                                  |  ("Ask M.A.C.O.S.")   |
                                  +-----------------------+
```

### The 4-Stage Action Methodology:
$$\text{LEARN} \longrightarrow \text{BUILD} \longrightarrow \text{DEMONSTRATE} \longrightarrow \text{REASSESS}$$
1. **LEARN**: Tactical conceptual study targeting critical foundational gaps.
2. **BUILD**: Hands-on proof-of-work projects, architectures, and case studies.
3. **DEMONSTRATE**: Public deployments, open-source PRs, and verifiable metrics.
4. **REASSESS**: Periodic readiness re-evaluations and milestone reviews.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, shadcn/ui (`@base-ui` primitives, `lucide-react`).
- **AI & Orchestration**: Google Gemini API (`@google/genai`), Zod schema validation, explicit modular agent pipeline.
- **Document Parsing**: `unpdf` (zero-dependency modern PDF extraction), `mammoth` (DOCX extraction).
- **Database & Persistence**: Supabase PostgreSQL with resilient in-memory fallback for local development.
- **Deployment**: Vercel-ready serverless architecture.

---

## 📁 Repository Structure

```
d:/mac os/
├── app/
│   ├── layout.tsx             # Root layout with navigation & fonts
│   ├── page.tsx               # Landing page with hero & methodology
│   ├── analyze/page.tsx       # Resume upload, destination inputs & live progress
│   ├── results/[id]/page.tsx  # Interactive Career Map results
│   └── api/
│       ├── analyze/route.ts   # POST: Resume upload, parsing & orchestrator
│       ├── analyze/[id]/route.ts # GET: Fetch analysis record by ID
│       └── chat/route.ts      # POST: Context-grounded "Ask M.A.C.O.S." chat
├── agents/
│   ├── profile/profileAgent.ts      # Structured candidate profile extraction
│   ├── skills/skillsAgent.ts        # Verified capabilities vs unproven claims
│   ├── market/marketAgent.ts        # Industry requirements synthesis
│   ├── trajectory/trajectoryAgent.ts# Macro career trajectory pattern miner
│   ├── gap/gapAgent.ts              # Triple triangulation gap detection
│   ├── pathway/pathwayAgent.ts      # 4-stage milestone generator
│   └── orchestrator/careerOrchestrator.ts # Multi-agent workflow coordination
├── components/
│   ├── navigation/Navbar.tsx        # Responsive branded navigation bar
│   ├── career/
│   │   ├── TrajectoryVisualizer.tsx # Macro trajectory stages & transition catalysts
│   │   ├── GapCard.tsx              # Triple-triangulation gap visualizer
│   │   └── PathwayTimeline.tsx      # Interactive LEARN/BUILD/DEMO/REASSESS timeline
│   └── chat/AskMacOsDrawer.tsx      # Grounded conversational assistant drawer
├── lib/
│   ├── ai/geminiClient.ts           # Gemini SDK client with retry & JSON validation
│   ├── parsing/resumeParser.ts      # PDF and DOCX validator and text extractor
│   ├── research/researchProvider.ts # Isolated research provider abstraction
│   ├── supabase/
│   │   ├── client.ts                # Supabase client initializer
│   │   └── analysisRepository.ts    # Database persistence with in-memory fallback
│   └── fixtures/syntheticResume.ts  # Fictional candidate profile for testing
├── supabase/
│   └── migrations/20260902_create_analyses.sql # Database migration
├── types/index.ts             # Strict TypeScript domain types & Zod schemas
├── BUILD_STATUS.md            # Milestone execution status & verification log
└── .env.example               # Environment variables template
```

---

## ⚙️ Environment Variables

Create your local `.env.local` file from [.env.example](file:///.env.example):

```bash
cp .env.example .env.local
```

Configure the following variables:

```env
# Required for real AI agent orchestration & grounded chat:
GEMINI_API_KEY=your_gemini_api_key

# Optional model override (defaults to gemini-2.5-flash):
GEMINI_MODEL=gemini-2.5-flash

# Required for Supabase PostgreSQL persistence (app falls back to memory if unset):
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Security Note**: Never commit `.env.local` or paste credentials into source files. All AI calls and database mutations happen server-side.

---

## 🗄️ Supabase PostgreSQL Setup

1. Open your Supabase Dashboard and navigate to the **SQL Editor**.
2. Run the migration script located in [supabase/migrations/20260902_create_analyses.sql](file:///supabase/migrations/20260902_create_analyses.sql).
3. The migration sets up:
   - The `analyses` table with typed JSONB columns for candidate profile, market intelligence, trajectories, gaps, and pathways.
   - Row Level Security (RLS) policies allowing read/write operations for prototype usage.
   - Performance indexes on `created_at` and `target_role`.

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Verification & Build Quality Checks
```bash
# Validate TypeScript typings (strict mode)
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build production bundle with Turbopack
npm run build
```

---

## 🧪 Testing the Complete Flow

1. Open **[http://localhost:3000/analyze](http://localhost:3000/analyze)**.
2. To test in 1 click without uploading your own file:
   - Click **"Fill Sample Synthetic Profile"**.
   - This loads verified synthetic data for *Alex Rivera*, a Frontend Engineer transitioning to *Technical Product Manager*.
3. Alternatively, drag and drop any `.pdf` or `.docx` resume and enter your target role.
4. Click **"Analyze My Career"**.
5. Watch the real multi-agent pipeline execute across the stages:
   - *Extracting Resume* → *Discovering Skills* → *Researching Market & Mining Trajectories* → *Triangulating Gaps* → *Architecting Pathway*.
6. View the **Career Map**:
   - Inspect the **Macro Career Trajectory Patterns** and transition catalysts.
   - Review the **Triangulated Gap Map** (Candidate Evidence vs Market Demand vs Trajectory Signals).
   - Explore the **4-Stage Action Pathway** (`LEARN` → `BUILD` → `DEMONSTRATE` → `REASSESS`).
7. Open **"Ask M.A.C.O.S."** to ask context-grounded follow-up questions:
   - *"Why is this my biggest gap?"*
   - *"Why did you recommend this project?"*
   - *"How can I improve my readiness score?"*

---

## 🚢 Vercel Deployment Instructions

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com).
3. Under **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. The project is pre-configured with Vercel serverless functions (`maxDuration = 60s`).

---

## 🔍 Provenance & Prototype Fallback

If no external live search API (e.g. Tavily/Search Grounding) is configured in the environment, M.A.C.O.S. uses an isolated `researchProvider` abstraction that serves structured, verified benchmark data. The UI transparently indicates **"Controlled Research Data"** to ensure complete honesty without fabricating live web sources.

---

## 🔮 Future SAP Ecosystem Integration

M.A.C.O.S. is architected with clear boundaries to enable future integration with the SAP workforce and AI ecosystem:
- **SAP SuccessFactors**: Syncing skills discovery and personalized pathway milestones with internal career mobility and talent development profiles.
- **SAP HANA Cloud**: Vector-based semantic similarity search across millions of verified internal enterprise career trajectories and job architectures.
- **SAP AI Launchpad**: Enterprise-governed multi-agent orchestration and compliance monitoring.
- **SAP Build Work Zone**: Embedding the interactive Career Map and "Ask M.A.C.O.S." drawer as a native workforce widget.

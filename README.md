# mac OS (m.a.c.o.s)

> **mac OS** is an AI-powered Career Navigation platform that guides professionals from their current skills and experience to their target dream role through evidence-based, personalized pathways.

---

## 🧭 About mac OS

Navigating a career transition or acceleration is traditionally fraught with generic advice and guesswork. **mac OS** bridges this gap by:

1. **Ingesting Profile & Goals**: Accepting a user's resume, credentials, projects, and target role.
2. **Current State Analysis**: Deeply understanding existing skills, education, experience, and verifiable evidence.
3. **Market Requirements Research**: Researching current market requirements for the target role.
4. **Trajectory Mining**: Analyzing public professional career trajectories to identify recurring patterns in how people reached similar roles.
5. **Gap Detection**: Pinpointing actionable skill, experience, and evidence gaps.
6. **Pathway Generation**: Delivering a structured 4-stage action plan:
   $$\text{LEARN} \longrightarrow \text{BUILD} \longrightarrow \text{DEMONSTRATE} \longrightarrow \text{REASSESS}$$
7. **Visual Career Map & "Ask mac OS"**: Presenting milestones in an interactive visual map with a context-aware conversational assistant.

---

## 🏛️ Planned Architecture

```
m.a.c.o.s/
├── app/                    # Next.js App Router (pages, layouts, API routes)
├── components/             # Reusable UI components
│   └── ui/                 # shadcn/ui component library
├── agents/                 # AI agent orchestration & modular workflows
│   ├── resume_analyzer/    # Profile & resume parsing
│   ├── trajectory_miner/   # Market research & career trajectory mining
│   ├── gap_engine/         # Comparative gap detection
│   └── pathway_planner/    # 4-stage roadmap generation
├── lib/                    # Shared utilities, client configs (Supabase, Gemini)
├── types/                  # TypeScript interfaces and domain data models
└── public/                 # Static assets
```

---

## 🚀 Current Setup Status

- [x] **Framework**: Next.js (App Router, React 19)
- [x] **Language**: TypeScript (strict mode enabled)
- [x] **Styling**: Tailwind CSS v4
- [x] **Component Library**: shadcn/ui configured with Base UI & Lucide icons
- [x] **Configuration**:
  - Modular project architecture scaffolded (`app/`, `components/`, `agents/`, `lib/`, `types/`, `public/`)
  - Environment variables template (`.env.example`) created
  - Comprehensive `.gitignore` protecting secrets and local environments
- [ ] **Next Phases (Planned)**:
  - Resume & profile ingestion pipeline
  - Gemini AI integration & agent orchestration
  - Supabase integration (database, storage, auth)
  - Career map visualization & conversational assistant

---

## 💻 How to Run Locally

### Prerequisites

- **Node.js**: v20+ (v24 LTS recommended)
- **npm**: v10+

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/yashmakkar5/m.a.c.o.s.git
cd m.a.c.o.s
npm install
```

### 2. Configure Environment Variables

Create your local `.env.local` file from the provided template:

```bash
cp .env.example .env.local
```

Populate the required credentials:
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Code Quality & Build Checks

```bash
# Run TypeScript validation
npx tsc --noEmit

# Run ESLint
npm run lint

# Build for production
npm run build
```

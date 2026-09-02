import Link from "next/link";
import {
  Compass,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Search,
  BookOpen,
  Hammer,
  Megaphone,
  RotateCcw,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const journeySteps = [
    {
      num: "01",
      tag: "CURRENT STATE",
      title: "Where You Are",
      desc: "Extracts demonstrated capabilities, tangible projects, and verified experience from your resume — separating proof-of-work from unproven keyword claims.",
      accent: "from-blue-500/20 to-indigo-500/10",
      borderAccent: "group-hover:border-blue-500/40",
      iconColor: "text-blue-400",
    },
    {
      num: "02",
      tag: "DESTINATION",
      title: "Where You Want To Go",
      desc: "Analyzes actual hiring requirements, industry shifts, and modern expectations for your target role and enterprise scope.",
      accent: "from-purple-500/20 to-pink-500/10",
      borderAccent: "group-hover:border-purple-500/40",
      iconColor: "text-purple-400",
    },
    {
      num: "03",
      tag: "DIFFERENTIATOR",
      title: "How People Get There",
      desc: "Mines public career trajectories to extract recurring macro progression stages and the transition catalysts that unlocked career jumps.",
      accent: "from-[#ac1ed6]/20 to-[#c26e73]/10",
      borderAccent: "group-hover:border-[#ac1ed6]/40",
      iconColor: "text-[#ac1ed6]",
    },
    {
      num: "04",
      tag: "TRIANGULATION",
      title: "What You Are Missing",
      desc: "Triangulates your profile against market expectations and trajectory signals into prioritized Skill, Experience, and Evidence gaps.",
      accent: "from-amber-500/20 to-orange-500/10",
      borderAccent: "group-hover:border-amber-500/40",
      iconColor: "text-amber-400",
    },
    {
      num: "05",
      tag: "ACTIONABLE ROUTE",
      title: "What You Should Do Next",
      desc: "Generates an execution blueprint organized into LEARN → BUILD → DEMONSTRATE → REASSESS with explicit completion criteria.",
      accent: "from-emerald-500/20 to-teal-500/10",
      borderAccent: "group-hover:border-emerald-500/40",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <main className="flex-1 overflow-hidden">
      {/* Ambient Lighting Background Accents */}
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-14rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ac1ed6] via-[#c26e73] to-[#8b5cf6] opacity-25 sm:left-[calc(50%-22rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* HERO SECTION */}
        <section className="relative pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-[#d5d0dd] backdrop-blur-md shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-[#ac1ed6]" />
              <span>Next-Generation Career Navigation</span>
              <span className="h-1 w-1 rounded-full bg-[#ac1ed6]" />
              <span className="text-[#9a93a5]">Trajectory Intelligence</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                Don&apos;t just match to a job. <br />
                <span className="bg-gradient-to-r from-white via-[#f4f2f5] to-[#c26e73] bg-clip-text text-transparent">
                  Navigate to a career.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-[#9a93a5] max-w-2xl mx-auto leading-relaxed font-normal pt-2">
                M.A.C.O.S. is an adaptive orchestration system that connects where you are, decodes real professional career trajectories, identifies evidence gaps, and builds your personalised route.
              </p>
            </div>

            {/* Search Pill / Target Path Preview (Inspired by Reference) */}
            <div className="pt-2 max-w-xl mx-auto">
              <Link href="/analyze" className="block group">
                <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#121016]/90 p-2 pr-4 pl-4 shadow-xl hover:border-[#ac1ed6]/50 hover:bg-[#16131c] transition-all duration-300">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#9a93a5] truncate">
                    <Search className="h-4 w-4 text-[#ac1ed6] shrink-0" />
                    <span>e.g. Frontend Engineer → Technical Product Manager</span>
                  </div>
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#ac1ed6]/20 text-[#ac1ed6] group-hover:bg-[#ac1ed6] group-hover:text-white transition-all shrink-0">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/analyze" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-13 px-8 text-base font-bold rounded-full bg-gradient-to-r from-[#ac1ed6] via-[#b32dd4] to-[#c26e73] hover:opacity-95 text-white border-0 shadow-lg shadow-[#ac1ed6]/25 hover:shadow-xl hover:shadow-[#ac1ed6]/35 active:scale-95 transition-all gap-2"
                >
                  <Compass className="h-5 w-5 stroke-[2.2]" />
                  Build My Career Map
                  <ArrowUpRight className="h-5 w-5 opacity-80" />
                </Button>
              </Link>
              <Link href="/results" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-13 px-7 text-sm font-semibold rounded-full border-white/15 bg-white/[0.03] text-[#d5d0dd] hover:bg-white/[0.08] hover:text-white backdrop-blur-md"
                >
                  View Sample Career Map
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION: PRODUCT PHILOSOPHY & AMBITION IN ACTION */}
      <section className="relative py-14 border-t border-white/[0.06] bg-gradient-to-r from-transparent via-[#121016]/70 to-transparent">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-4">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d5d0dd]">
            <Sparkles className="h-3 w-3 text-[#ac1ed6]" />
            <span>The M.A.C.O.S. Philosophy</span>
          </div>

          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif italic text-white tracking-tight leading-snug max-w-2xl mx-auto">
            &ldquo;Ambition without action becomes anxiety.&rdquo;
          </blockquote>

          <div className="space-y-1.5 pt-1">
            <p className="text-xs sm:text-sm font-bold text-[#c26e73]">
              — John A. Shedd
            </p>
            <p className="text-xs sm:text-sm text-[#9a93a5] max-w-xl mx-auto leading-relaxed">
              Yash Makkar believes in turning ambition into action. M.A.C.O.S. is built around a simple belief: ambition becomes meaningful when it has a direction and a next step. <span className="text-white font-semibold">You have a destination. Let&apos;s build the route.</span>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE 5-STEP VISUAL COMPASS */}
      <section className="py-20 border-t border-white/[0.07] relative">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c26e73]">
              <Layers className="h-3.5 w-3.5" />
              The M.A.C.O.S. Journey
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              From Where You Are to Where You Want To Be
            </h2>
            <p className="text-sm sm:text-base text-[#9a93a5]">
              Traditional job boards only look for keyword matches. M.A.C.O.S. visualizes your entire career equation in 5 interconnected steps.
            </p>
          </div>

          {/* Stepper Cards Grid (Inspired by Reference's rounded dark cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl border border-white/[0.08] bg-[#121016]/80 p-6 flex flex-col justify-between space-y-6 hover:border-white/20 hover:bg-[#16131c] transition-all duration-300 shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#757080] tracking-wider">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[#d5d0dd]">
                      {step.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#f4f2f5] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#9a93a5] leading-relaxed pt-2">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/[0.06]">
                  <span className="text-[11px] font-medium text-[#757080] group-hover:text-[#9a93a5] transition-colors">
                    Step {idx + 1}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.04] text-[#9a93a5] group-hover:bg-[#ac1ed6]/20 group-hover:text-white transition-all">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE DIFFERENTIATOR — CAREER TRAJECTORY INTELLIGENCE */}
      <section className="py-20 border-t border-white/[0.07] bg-gradient-to-b from-transparent via-[#121016]/40 to-transparent">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ac1ed6]/15 border border-[#ac1ed6]/30 px-3.5 py-1 text-xs font-bold text-[#ac1ed6]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>The Core Differentiator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Career Trajectory Intelligence: <br />
                <span className="text-[#c26e73]">Learn how people actually got there.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#9a93a5] leading-relaxed">
                Mentorship and career transition secrets are often locked behind alumni networks and elite pedigree. M.A.C.O.S. extracts real transition patterns from thousands of public career trajectories.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#121016] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ac1ed6]/15 text-[#ac1ed6] shrink-0 mt-0.5">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Macro Transition Stages</h4>
                    <p className="text-xs text-[#9a93a5] mt-0.5 leading-relaxed">
                      We uncover the intermediate stepping stones professionals crossed between their start and their destination.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#121016] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c26e73]/15 text-[#c26e73] shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Transition Catalysts</h4>
                    <p className="text-xs text-[#9a93a5] mt-0.5 leading-relaxed">
                      The specific projects, cross-functional ownership, or public demonstrations that triggered hiring confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Trajectory Preview Box */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-white/[0.1] bg-[#121016] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#ac1ed6]">
                      Trajectory Pattern #08
                    </span>
                    <h4 className="text-sm font-bold text-white">Engineering to Product Pivot</h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold">
                    84% Pattern Match
                  </span>
                </div>

                {/* Trajectory Milestone Stages */}
                <div className="space-y-4 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#ac1ed6] before:via-[#c26e73] before:to-emerald-400">
                  <div className="flex items-start gap-4 relative pl-2">
                    <div className="h-5 w-5 rounded-full bg-[#ac1ed6] flex items-center justify-center text-[10px] font-bold text-white shadow-md z-10 shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex-1">
                      <p className="text-xs font-bold text-white">Core Technical Depth</p>
                      <p className="text-[11px] text-[#9a93a5]">React, Node.js, component system optimization</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 relative pl-2">
                    <div className="h-5 w-5 rounded-full bg-[#c26e73] flex items-center justify-center text-[10px] font-bold text-white shadow-md z-10 shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white">Transition Catalyst</p>
                        <span className="text-[10px] text-[#c26e73] font-mono">Proof-of-Work</span>
                      </div>
                      <p className="text-[11px] text-[#9a93a5]">Led customer feedback triage & public RFC for API spec</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 relative pl-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-[#090607] shadow-md z-10 shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex-1">
                      <p className="text-xs font-bold text-white">Destination Target Scope</p>
                      <p className="text-[11px] text-emerald-400 font-medium">Technical Product Manager (Developer Platforms)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 4-STAGE ACTION METHODOLOGY */}
      <section className="py-20 border-t border-white/[0.07]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ac1ed6]">
              Execution Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              The 4-Stage Action Pathway
            </h2>
            <p className="text-sm sm:text-base text-[#9a93a5]">
              Every gap is transformed into structured, verifiable deliverables with explicit completion criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">STAGE 01</span>
                <h3 className="text-lg font-bold text-white mt-1">LEARN</h3>
                <p className="text-xs text-[#9a93a5] leading-relaxed pt-2">
                  Targeted conceptual study for critical foundational knowledge. No endless tutorial loops.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 hover:border-[#c26e73]/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c26e73]/10 text-[#c26e73]">
                <Hammer className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c26e73]">STAGE 02</span>
                <h3 className="text-lg font-bold text-white mt-1">BUILD</h3>
                <p className="text-xs text-[#9a93a5] leading-relaxed pt-2">
                  Hands-on proof-of-work projects simulating real-world industry architectures and domain challenges.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">STAGE 03</span>
                <h3 className="text-lg font-bold text-white mt-1">DEMONSTRATE</h3>
                <p className="text-xs text-[#9a93a5] leading-relaxed pt-2">
                  Public proof-of-work: deployed apps, open-source PRs, and verifiable metrics that convince hiring managers.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#121016] p-6 space-y-4 hover:border-[#ac1ed6]/40 transition-all">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ac1ed6]/10 text-[#ac1ed6]">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ac1ed6]">STAGE 04</span>
                <h3 className="text-lg font-bold text-white mt-1">REASSESS</h3>
                <p className="text-xs text-[#9a93a5] leading-relaxed pt-2">
                  Periodic re-evaluation of readiness scores and iterative calibration as you complete milestones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION FOOTER BANNER */}
      <section className="py-20 border-t border-white/[0.07] relative">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#121016] to-[#18141f] p-8 sm:p-12 space-y-6 shadow-2xl">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-xl shadow-[#ac1ed6]/30">
              <Compass className="h-7 w-7 stroke-[2.2]" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to map your next career chapter?
              </h2>
              <p className="text-sm sm:text-base text-[#9a93a5] max-w-lg mx-auto">
                Upload your resume, set your career destination, and let M.A.C.O.S. build your personalised pathway.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/analyze">
                <Button
                  size="lg"
                  className="h-13 px-9 text-base font-bold rounded-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white hover:opacity-95 shadow-lg shadow-[#ac1ed6]/25 gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Build My Career Map
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

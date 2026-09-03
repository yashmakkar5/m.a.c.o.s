import Link from "next/link";
import { Compass, Sparkles, Activity, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090607]/80 backdrop-blur-xl transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ac1ed6] to-[#c26e73] text-white shadow-lg shadow-[#ac1ed6]/25 group-hover:scale-105 transition-transform duration-200">
            <Compass className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                M.A.C.O.S.
              </span>
              <span className="rounded-full bg-white/[0.08] border border-white/[0.1] px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#d5d0dd] uppercase">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[10px] text-[#9a93a5] hidden sm:block tracking-tight">
              My Adaptive Career Orchestration System
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/results"
            className="text-xs font-medium text-[#9a93a5] hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-all hidden sm:inline-flex items-center gap-1"
          >
            Career Map
          </Link>
          <Link
            href="/debug"
            className="text-xs font-medium text-[#9a93a5] hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
          >
            <Activity className="h-3.5 w-3.5 text-[#c26e73]" />
            <span className="hidden sm:inline">Diagnostics</span>
          </Link>
          <ThemeToggle />
          <Link href="/analyze">
            <Button
              size="sm"
              className="gap-1.5 rounded-full bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] hover:from-[#b924e4] hover:to-[#ce797e] text-white border-0 font-semibold text-xs h-9 px-4 shadow-md shadow-[#ac1ed6]/20 transition-all hover:shadow-lg hover:shadow-[#ac1ed6]/30 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Build Career Map</span>
              <ArrowUpRight className="h-3.5 w-3.5 ml-0.5 opacity-80" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

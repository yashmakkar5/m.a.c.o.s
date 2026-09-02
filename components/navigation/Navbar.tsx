import Link from "next/link";
import { Compass, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight">M.A.C.O.S.</span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              My Adaptive Career Orchestration System
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/results"
            className="text-xs font-medium text-muted-foreground hover:text-foreground hidden sm:block"
          >
            Results Preview
          </Link>
          <Link
            href="/debug"
            className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <Activity className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Diagnostics</span>
          </Link>
          <Link href="/analyze">
            <Button size="sm" className="gap-2 shadow-sm font-medium text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Build My Career Map
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}

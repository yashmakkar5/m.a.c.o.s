import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 rounded-xl border bg-card p-8 shadow-sm">
        <div className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Career Navigation
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          mac OS
        </h1>
        <p className="text-sm text-muted-foreground">
          An AI-powered platform that navigates your personalized pathway from your current experience to your dream career.
        </p>
        <div className="pt-2">
          <Button variant="outline" size="sm" className="cursor-default">
            Project Setup Verified
          </Button>
        </div>
      </div>
    </main>
  );
}

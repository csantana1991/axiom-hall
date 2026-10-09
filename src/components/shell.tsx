import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { creditsEarned } from "@/lib/curriculum";
import { useStudio } from "@/lib/progress";

export function AppShell({ children }: { children: ReactNode }) {
  const hydrate = useStudio((state) => state.hydrate);
  const done = useStudio((state) => state.done);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  const earned = creditsEarned(done);
  const width = Math.min(100, (earned / 36) * 100);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-brass focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex min-h-11 flex-col justify-center">
            <span className="font-mono text-xs tracking-widest text-brass">AXIOM HALL</span>
            <span className="font-serif text-sm">Computational finance studio</span>
          </Link>
          <div className="text-right">
            <div className="font-mono text-xs text-mist">CREDITS</div>
            <div className="font-mono text-sm">{earned.toFixed(1)} / 36</div>
          </div>
        </div>
        <div className="h-0.5 bg-line" aria-hidden="true">
          <div className="h-full bg-brass" style={{ width: `${width}%` }} />
        </div>
      </header>
      <main id="content" className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}

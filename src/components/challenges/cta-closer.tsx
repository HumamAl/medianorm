"use client";

import Link from "next/link";

export function CtaCloser() {
  return (
    <section
      className="rounded-sm border border-primary/20 p-5"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklch, var(--primary) 4%, transparent), transparent)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold">
            Ready to walk through the approach?
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            I&apos;ve thought through the hard parts of this reconciliation
            stack. Happy to demo any of it on a call.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/proposal"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ transitionDuration: "var(--dur-fast, 60ms)" }}
          >
            See the proposal &rarr;
          </Link>
          <span
            className="text-xs font-medium text-primary px-3 py-1.5 rounded-sm border border-primary/25"
            style={{
              background:
                "color-mix(in oklch, var(--primary) 6%, transparent)",
            }}
          >
            Reply on Upwork to start
          </span>
        </div>
      </div>
    </section>
  );
}

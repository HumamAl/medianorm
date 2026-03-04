// NO "use client" — pure JSX, no hooks

import type { ReactNode } from "react";
import { OutcomeStatement } from "./outcome-statement";

interface ChallengeCardProps {
  title: string;
  description: string;
  outcome?: string;
  index?: number;
  children?: ReactNode;
}

export function ChallengeCard({
  title,
  description,
  outcome,
  index = 0,
  children,
}: ChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className="bg-card border border-border/60 rounded-sm p-4 space-y-3 hover:border-primary/25 transition-colors"
      style={{ transitionDuration: "var(--dur-fast, 60ms)" }}
    >
      {/* Header row: step number + title */}
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-xs font-medium text-primary/60 w-5 shrink-0 tabular-nums">
          {stepNumber}
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-tight">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Visualization slot */}
      {children}

      {/* Outcome statement */}
      {outcome && <OutcomeStatement outcome={outcome} index={index} />}
    </div>
  );
}

// Server component — no "use client"

import type { ReactNode } from "react";
import { challenges, executiveSummary } from "@/data/challenges";
import { ExecutiveSummary } from "@/components/challenges/executive-summary";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { CtaCloser } from "@/components/challenges/cta-closer";
import { InvoiceFlowViz } from "@/components/challenges/invoice-flow-viz";
import { ReconciliationViz } from "@/components/challenges/reconciliation-viz";
import { ExcelParserViz } from "@/components/challenges/excel-parser-viz";

export const metadata = { title: "My Approach | MediaNorm" };

// Visualization map keyed by challenge.id.
// Each viz component carries its own "use client" directive.
const VISUALIZATIONS: Record<string, ReactNode> = {
  "challenge-1": <InvoiceFlowViz />,
  "challenge-2": <ReconciliationViz />,
  "challenge-3": <ExcelParserViz />,
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 space-y-6">

        {/* Page heading */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">My Approach</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            How I would tackle the key technical challenges in this reconciliation platform
          </p>
        </div>

        {/* Executive summary */}
        <ExecutiveSummary
          commonApproach={executiveSummary.commonApproach}
          differentApproach={executiveSummary.differentApproach}
          accentWord={executiveSummary.accentWord}
        />

        {/* Challenge cards */}
        <div className="flex flex-col gap-4">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              outcome={challenge.outcome}
              index={index}
            >
              {VISUALIZATIONS[challenge.id]}
            </ChallengeCard>
          ))}
        </div>

        {/* CTA closer */}
        <CtaCloser />

      </div>
    </div>
  );
}

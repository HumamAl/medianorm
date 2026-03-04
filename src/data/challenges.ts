import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers hand-code vendor-specific parsers and a single-pass exact-match reconciler. When a new station group sends invoices in a different layout, the whole pipeline breaks — someone reformats the file by hand and the process starts over.",
  differentApproach:
    "I'd build a Claude-powered normalization layer that handles format variance up front, a multi-pass matching engine with configurable tolerance bands per media type, and a SheetJS-based Excel parser with a format profile registry so each agency's quirks are remembered and reused.",
  accentWord: "multi-pass matching engine",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Invoice Format Normalization",
    description:
      "Every TV station, cable network, and radio group sends invoices differently — PDFs with merged cells, Excel files with vendor-specific column orders, summary rows mixed with data rows. A single parser fails at the first edge case.",
    visualizationType: "flow",
    outcome:
      "Could reduce manual invoice data entry by 70-80%, with confidence scoring catching low-quality parses before they silently corrupt reconciliation results.",
  },
  {
    id: "challenge-2",
    title: "Reconciliation Matching Engine",
    description:
      "Matching buy plan line items to invoice lines on composite keys — station, program, spot length, broadcast week — breaks down fast. Real data has fuzzy names: \"Good Morning America\" vs \"GMA\" vs \"Good Morning Amer.\", and rate variance tolerance needs to differ between TV broadcast and radio.",
    visualizationType: "before-after",
    outcome:
      "Could catch $15K–30K/month in overbilling discrepancies that currently slip through manual spreadsheet comparisons, ranked by dollar impact for efficient reviewer triage.",
  },
  {
    id: "challenge-3",
    title: "Excel Parser Robustness",
    description:
      "Annual buy files from different agencies use wildly different Excel structures — merged header cells, subtotal rows mixed into data, inconsistent column labels, multiple sheets per DMA. Supporting one format means failing on the next agency's file.",
    visualizationType: "architecture",
    outcome:
      "Could handle 90%+ of agency buy file formats without manual reformatting, vs the current single-format support — with a format profile registry that learns each agency's layout once and reuses it.",
  },
];

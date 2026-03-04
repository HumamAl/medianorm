import type { LucideIcon } from "lucide-react";

// ─── Sidebar Navigation ──────────────────────────────────────────────────────
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ─── Challenge visualization types ───────────────────────────────────────────
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// ─── Proposal types ───────────────────────────────────────────────────────────
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ─── Screen definition for frame-based demo formats ──────────────────────────
export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

// ─── Conversion element variant types ────────────────────────────────────────
export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// ─── Ad Tech / Media Buying Domain Types ─────────────────────────────────────

export type MediaType = "TV Broadcast" | "Cable" | "Radio" | "OOH";

export type Daypart =
  | "Early Morning"   // 6a-9a
  | "Daytime"         // 9a-3p
  | "Early Fringe"    // 3p-5p
  | "Early News"      // 5p-7p
  | "Prime Access"    // 7p-8p
  | "Prime"           // 8p-11p
  | "Late News"       // 11p-11:30p
  | "Late Fringe";    // 11:30p-2a

export type SpotLength = 15 | 30 | 60;

/** Status of a line item in the approved buy plan */
export type BuyPlanStatus =
  | "approved"
  | "pending_approval"
  | "makegood"         // replacement unit for missed/preempted spot
  | "cancelled"
  | "preempted";       // station bumped the spot for higher-paying advertiser

/** Processing status of an invoice received from a vendor/station */
export type InvoiceProcessingStatus =
  | "pending"          // uploaded, not yet parsed
  | "parsing"          // Claude/AI extraction in progress
  | "parsed"           // extracted, awaiting match
  | "matched"          // reconciled with buy plan
  | "flagged"          // discrepancies found
  | "rejected";        // unrecognizable / bad data quality

/** Reconciliation match outcome for a single spot-level line comparison */
export type MatchStatus =
  | "matched"          // rate and spots within tolerance
  | "tolerance"        // within configurable % tolerance (e.g. ±3%)
  | "discrepancy"      // rate or spots outside tolerance — needs review
  | "unmatched";       // invoice line has no matching buy plan entry

/** File upload + parsing status */
export type FileProcessingStatus =
  | "uploading"
  | "processing"
  | "parsed"
  | "error";

export type FileType =
  | "buy-plan-excel"
  | "invoice-pdf"
  | "invoice-excel"
  | "invoice-xml";

// ─── Buy Plan Line Item ───────────────────────────────────────────────────────
export interface BuyPlanLineItem {
  id: string;                   // "BP-8821"
  buyPlanId: string;            // references UploadedFile.id (buy plan file)
  brand: string;                // advertiser brand name
  mediaType: MediaType;
  dma: string;                  // Designated Market Area, e.g. "New York"
  station: string;              // e.g. "WABC-TV"
  program: string;              // e.g. "Good Morning America"
  daypart: Daypart;
  spotLength: SpotLength;
  /** Broadcast week start date (Monday), ISO string */
  broadcastWeek: string;
  plannedRate: number;          // gross CPP or unit rate in USD
  plannedSpots: number;         // number of units purchased
  plannedImpressions: number;   // thousands (000s)
  /** Agency commission, typically 0.15 */
  commissionRate: number;
  status: BuyPlanStatus;
  makegoodRef?: string | null;  // present when status === "makegood", references original BP id
}

// ─── Invoice Line Item ────────────────────────────────────────────────────────
export interface InvoiceLineItem {
  id: string;                      // "INV-4410"
  vendorName: string;              // station group / rep firm name
  invoiceNumber: string;           // vendor-assigned invoice number
  invoiceDate: string;             // ISO date string
  mediaType: MediaType;
  dma: string;
  station: string;
  program: string;
  daypart: Daypart;
  spotLength: SpotLength;
  broadcastWeek: string;
  invoicedRate: number;            // rate billed by station
  invoicedSpots: number;
  invoicedImpressions: number;
  totalAmount: number;             // invoicedRate * invoicedSpots (gross)
  processingStatus: InvoiceProcessingStatus;
  /** AI model that parsed this invoice, null if manual entry */
  parsedBy: "claude-haiku-4-5" | "claude-sonnet-4-6" | "manual" | null;
  parsedAt: string | null;
  /** Confidence score from AI parser (0-1), null if manual */
  parseConfidence?: number | null;
}

// ─── Reconciliation Result ────────────────────────────────────────────────────
export interface ReconciliationResult {
  id: string;                      // "REC-2294"
  buyPlanLineItemId: string;       // references BuyPlanLineItem.id
  invoiceLineItemId: string | null;// null when matchStatus === "unmatched"
  station: string;
  program: string;
  broadcastWeek: string;
  spotLength: SpotLength;
  plannedRate: number;
  invoicedRate: number;
  rateVariance: number;            // invoicedRate - plannedRate (can be negative)
  rateVariancePercent: number;     // (rateVariance / plannedRate) * 100
  plannedSpots: number;
  invoicedSpots: number;
  spotDifference: number;          // invoicedSpots - plannedSpots
  plannedImpressions: number;
  invoicedImpressions: number;
  impressionVariance: number;      // invoicedImpressions - plannedImpressions
  matchStatus: MatchStatus;
  /** Tolerance threshold used for this comparison (e.g. 0.03 = 3%) */
  toleranceThreshold: number;
  notes: string | null;
  reconciledAt: string;
}

// ─── Uploaded File ────────────────────────────────────────────────────────────
export interface UploadedFile {
  id: string;                      // "FILE-7732"
  fileName: string;
  fileType: FileType;
  brand: string;
  mediaType: MediaType | "Mixed";
  uploadedAt: string;
  processingStatus: FileProcessingStatus;
  /** File size in bytes */
  fileSize: number;
  /** Total line items extracted from this file */
  lineItemCount: number | null;
  parsedBy: "claude-haiku-4-5" | "claude-sonnet-4-6" | "manual" | null;
  dma: string | "Multiple";
  /** Parsing error message when processingStatus === "error" */
  errorMessage?: string | null;
}

// ─── Spend Summary (per DMA/station/month) ───────────────────────────────────
export interface SpendSummary {
  dma: string;
  station: string;
  month: string;                   // "2026-02" — YYYY-MM
  mediaType: MediaType;
  plannedSpend: number;
  actualSpend: number;
  variance: number;                // actualSpend - plannedSpend
  variancePercent: number;         // (variance / plannedSpend) * 100
  reconciledPercent: number;       // % of line items reconciled (0-100)
}

// ─── Chart Data Types ─────────────────────────────────────────────────────────
export interface MonthlySpendDataPoint {
  month: string;                   // "Mar", "Apr", etc.
  plannedSpend: number;
  actualSpend: number;
  variance: number;
}

export interface DiscrepancyBreakdown {
  category: string;                // "Rate Variance", "Spot Count", "Unmatched", "Tolerance"
  count: number;
  totalAmount: number;
}

export interface SpendByMediaType {
  mediaType: MediaType;
  plannedSpend: number;
  actualSpend: number;
  variancePercent: number;
}

export interface ReconciliationStatusBreakdown {
  status: MatchStatus;
  count: number;
  percentage: number;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export interface DashboardStats {
  /** Total gross media spend in current buy cycle */
  totalBuyValue: number;
  totalBuyValueChange: number;        // % vs prior period
  /** Reconciled amount as percentage of invoiced */
  reconciliationRate: number;
  reconciliationRateChange: number;
  /** Number of invoice lines with discrepancies requiring review */
  openDiscrepancies: number;
  openDiscrepanciesChange: number;
  /** Total dollar variance (overbilled minus underbilled) */
  netVariance: number;
  netVarianceChange: number;
  /** Invoices pending parse/matching */
  pendingInvoices: number;
  pendingInvoicesChange: number;
  /** Percentage of invoices parsed by AI vs manual */
  aiParseRate: number;
  aiParseRateChange: number;
}

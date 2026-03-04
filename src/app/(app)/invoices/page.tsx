"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invoiceLineItems } from "@/data/mock-data";
import type { InvoiceLineItem, InvoiceProcessingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronUp,
  ChevronDown,
  Clock,
  Loader,
  CheckCircle2,
  GitMerge,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────

type StatusConfig = { label: string; colorClass: string };

const STATUS_CONFIG: Record<InvoiceProcessingStatus, StatusConfig> = {
  pending:  { label: "Pending",  colorClass: "text-muted-foreground bg-muted" },
  parsing:  { label: "Parsing",  colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10" },
  parsed:   { label: "Parsed",   colorClass: "text-primary bg-primary/10" },
  matched:  { label: "Matched",  colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10" },
  flagged:  { label: "Flagged",  colorClass: "text-destructive bg-destructive/10" },
  rejected: { label: "Rejected", colorClass: "text-muted-foreground bg-muted" },
};

function InvoiceStatusBadge({ status }: { status: InvoiceProcessingStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium border-0 rounded-sm px-1.5 py-0 whitespace-nowrap", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── Pipeline Step ────────────────────────────────────────────────────────────

type PipelineStep = {
  status: InvoiceProcessingStatus;
  label: string;
  icon: React.ReactNode;
};

const PIPELINE_STEPS: PipelineStep[] = [
  { status: "pending",  label: "Pending",  icon: <Clock className="w-3.5 h-3.5" /> },
  { status: "parsing",  label: "Parsing",  icon: <Loader className="w-3.5 h-3.5" /> },
  { status: "parsed",   label: "Parsed",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { status: "matched",  label: "Matched",  icon: <GitMerge className="w-3.5 h-3.5" /> },
  { status: "flagged",  label: "Flagged",  icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { status: "rejected", label: "Rejected", icon: <XCircle className="w-3.5 h-3.5" /> },
];

// ─── Sort key ────────────────────────────────────────────────────────────────

type SortKey = keyof Pick<
  InvoiceLineItem,
  "id" | "vendorName" | "station" | "invoicedRate" | "invoicedSpots" | "totalAmount" | "invoiceDate"
>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceProcessingStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("invoiceDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const displayed = useMemo(() => {
    return invoiceLineItems
      .filter((item) => {
        const matchesStatus = statusFilter === "all" || item.processingStatus === statusFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          item.id.toLowerCase().includes(q) ||
          item.invoiceNumber.toLowerCase().includes(q) ||
          item.vendorName.toLowerCase().includes(q) ||
          item.station.toLowerCase().includes(q) ||
          item.program.toLowerCase().includes(q) ||
          item.dma.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, sortKey, sortDir]);

  // Pipeline counts
  const pipelineCounts = useMemo(() => {
    const counts: Partial<Record<InvoiceProcessingStatus, number>> = {};
    for (const item of invoiceLineItems) {
      counts[item.processingStatus] = (counts[item.processingStatus] ?? 0) + 1;
    }
    return counts;
  }, []);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  }

  function formatConfidence(v: number | null | undefined) {
    if (v == null) return <span className="text-muted-foreground/50">—</span>;
    const pct = Math.round(v * 100);
    const color =
      pct >= 95 ? "text-[color:var(--success)]"
      : pct >= 85 ? "text-[color:var(--warning)]"
      : "text-destructive";
    return <span className={cn("font-mono text-xs", color)}>{pct}%</span>;
  }

  return (
    <div className="flex flex-col gap-[var(--section-gap,1rem)] p-[var(--content-padding,1rem)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Invoice line items — AI extraction pipeline and reconciliation status
          </p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
          Upload Invoice
        </Button>
      </div>

      {/* Processing Pipeline */}
      <div className="aesthetic-card p-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Processing Pipeline
        </p>
        <div className="flex items-stretch gap-0 flex-wrap">
          {PIPELINE_STEPS.map((step, i) => {
            const count = pipelineCounts[step.status] ?? 0;
            const isActive = statusFilter === step.status;
            const statusColorClass =
              step.status === "matched"  ? "text-[color:var(--success)]"
              : step.status === "flagged"  ? "text-destructive"
              : step.status === "parsing"  ? "text-[color:var(--warning)]"
              : step.status === "parsed"   ? "text-primary"
              : "text-muted-foreground";
            return (
              <button
                key={step.status}
                onClick={() => setStatusFilter(isActive ? "all" : step.status)}
                className={cn(
                  "flex-1 min-w-[80px] flex flex-col items-center gap-1 px-3 py-2.5 border-r border-border/60 last:border-r-0 transition-colors duration-75",
                  isActive
                    ? "bg-primary/5"
                    : "hover:bg-[color:var(--surface-hover)]"
                )}
              >
                <div className={cn("flex items-center gap-1.5", statusColorClass)}>
                  {step.icon}
                  <span className="text-[10px] font-medium uppercase tracking-wide">{step.label}</span>
                </div>
                <span className={cn("font-mono text-lg font-bold leading-none", statusColorClass)}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search invoice #, vendor, station, program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as InvoiceProcessingStatus | "all")}
        >
          <SelectTrigger className="w-36 h-8 text-xs rounded-sm">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {PIPELINE_STEPS.map((s) => (
              <SelectItem key={s.status} value={s.status}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground font-mono shrink-0">
          {displayed.length} of {invoiceLineItems.length} line items
        </span>
      </div>

      {/* Table */}
      <div className="aesthetic-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60">
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-1">Invoice ID <SortIcon col="id" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Invoice #</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("vendorName")}>
                  <div className="flex items-center gap-1">Vendor <SortIcon col="vendorName" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("station")}>
                  <div className="flex items-center gap-1">Station <SortIcon col="station" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Program</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors text-right" onClick={() => handleSort("invoicedRate")}>
                  <div className="flex items-center justify-end gap-1">Rate <SortIcon col="invoicedRate" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors text-right" onClick={() => handleSort("invoicedSpots")}>
                  <div className="flex items-center justify-end gap-1">Spots <SortIcon col="invoicedSpots" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors text-right" onClick={() => handleSort("totalAmount")}>
                  <div className="flex items-center justify-end gap-1">Total <SortIcon col="totalAmount" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Status</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Parsed By</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 text-center">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-28 text-center text-xs text-muted-foreground">
                    No invoice line items match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-[color:var(--surface-hover)] transition-colors duration-75"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap py-2">{item.id}</TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap py-2 text-muted-foreground">{item.invoiceNumber}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap py-2 max-w-[140px]">
                      <span className="truncate block">{item.vendorName}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono whitespace-nowrap py-2">{item.station}</TableCell>
                    <TableCell className="text-xs py-2 max-w-[140px]">
                      <span className="truncate block">{item.program}</span>
                    </TableCell>
                    <TableCell className="text-xs font-mono py-2 text-right whitespace-nowrap">
                      ${item.invoicedRate.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-mono py-2 text-right">{item.invoicedSpots}</TableCell>
                    <TableCell className="text-xs font-mono py-2 text-right whitespace-nowrap font-medium">
                      ${item.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2 whitespace-nowrap">
                      <InvoiceStatusBadge status={item.processingStatus} />
                    </TableCell>
                    <TableCell className="py-2 whitespace-nowrap">
                      {item.parsedBy == null ? (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      ) : (
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {item.parsedBy === "manual" ? "Manual" : item.parsedBy}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-2 text-center">
                      {formatConfidence(item.parseConfidence)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

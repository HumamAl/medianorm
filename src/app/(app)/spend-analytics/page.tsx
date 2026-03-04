"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { spendSummary, spendByMediaType, monthlySpendTrend } from "@/data/mock-data";
import type { SpendSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Chart components (SSR-safe) ──────────────────────────────────────────────

const SpendByMediaTypeChart = dynamic(
  () => import("@/components/spend-analytics/spend-by-media-type-chart"),
  { ssr: false, loading: () => <ChartSkeleton height={200} /> }
);

const MonthlyTrendChart = dynamic(
  () => import("@/components/spend-analytics/monthly-trend-chart"),
  { ssr: false, loading: () => <ChartSkeleton height={200} /> }
);

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full flex items-center justify-center border border-dashed border-border/60 rounded-sm text-xs text-muted-foreground/50"
      style={{ height }}
    >
      Loading chart...
    </div>
  );
}

// ─── View Toggle ──────────────────────────────────────────────────────────────

type ViewMode = "by-dma" | "by-media-type";

// ─── Summary Stats ────────────────────────────────────────────────────────────

function formatDollar(v: number) {
  if (Math.abs(v) >= 1_000_000)
    return `$${(v / 1_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000)
    return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function VariancePill({ variance, pct }: { variance: number; pct: number }) {
  const isNeg = variance < 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-mono font-medium",
        isNeg ? "text-[color:var(--success)]" : "text-destructive"
      )}
    >
      {isNeg ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
      {isNeg ? "" : "+"}
      {pct.toFixed(1)}%
    </span>
  );
}

// ─── DMA Summary Table ────────────────────────────────────────────────────────

type DmaSortKey = keyof Pick<SpendSummary, "dma" | "plannedSpend" | "actualSpend" | "variance" | "reconciledPercent">;

function DmaSummaryTable({ data }: { data: SpendSummary[] }) {
  const [sortKey, setSortKey] = useState<DmaSortKey>("plannedSpend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: DmaSortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(
    () =>
      [...data].sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      }),
    [data, sortKey, sortDir]
  );

  function SortIcon({ col }: { col: DmaSortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  }

  const cols: { key: DmaSortKey; label: string; align?: "right" }[] = [
    { key: "dma", label: "DMA" },
    { key: "plannedSpend", label: "Planned", align: "right" },
    { key: "actualSpend", label: "Actual", align: "right" },
    { key: "variance", label: "Variance", align: "right" },
    { key: "reconciledPercent", label: "Recon %", align: "right" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            {cols.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 px-3 cursor-pointer select-none hover:text-foreground transition-colors whitespace-nowrap border-b border-border/60",
                  col.align === "right" ? "text-right" : "text-left"
                )}
                onClick={() => handleSort(col.key)}
              >
                <div className={cn("flex items-center gap-1", col.align === "right" && "justify-end")}>
                  {col.label}
                  <SortIcon col={col.key} />
                </div>
              </th>
            ))}
            <th className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 px-3 text-left border-b border-border/60 whitespace-nowrap">
              Media Type
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const reconColor =
              row.reconciledPercent >= 90
                ? "text-[color:var(--success)]"
                : row.reconciledPercent >= 60
                ? "text-[color:var(--warning)]"
                : "text-destructive";
            const varColor = row.variance > 500 ? "text-destructive" : row.variance < -500 ? "text-[color:var(--success)]" : "text-muted-foreground";
            return (
              <tr
                key={i}
                className="border-b border-border/40 hover:bg-[color:var(--surface-hover)] transition-colors duration-75"
              >
                <td className="px-3 py-2 font-medium whitespace-nowrap">{row.dma}</td>
                <td className="px-3 py-2 font-mono text-right whitespace-nowrap">
                  {formatDollar(row.plannedSpend)}
                </td>
                <td className="px-3 py-2 font-mono text-right whitespace-nowrap font-medium">
                  {formatDollar(row.actualSpend)}
                </td>
                <td className={cn("px-3 py-2 font-mono text-right whitespace-nowrap", varColor)}>
                  {row.variance >= 0 ? "+" : ""}
                  {formatDollar(row.variance)}
                </td>
                <td className={cn("px-3 py-2 font-mono text-right font-medium", reconColor)}>
                  {row.reconciledPercent}%
                </td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{row.mediaType}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Media Type Summary Table ─────────────────────────────────────────────────

function MediaTypeSummaryTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 px-3 text-left border-b border-border/60">Media Type</th>
            <th className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 px-3 text-right border-b border-border/60">Planned</th>
            <th className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 px-3 text-right border-b border-border/60">Actual</th>
            <th className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 px-3 text-right border-b border-border/60">Variance %</th>
          </tr>
        </thead>
        <tbody>
          {spendByMediaType.map((row) => (
            <tr key={row.mediaType} className="border-b border-border/40 hover:bg-[color:var(--surface-hover)] transition-colors duration-75">
              <td className="px-3 py-2 font-medium">{row.mediaType}</td>
              <td className="px-3 py-2 font-mono text-right whitespace-nowrap">{formatDollar(row.plannedSpend)}</td>
              <td className="px-3 py-2 font-mono text-right whitespace-nowrap font-medium">{formatDollar(row.actualSpend)}</td>
              <td className={cn(
                "px-3 py-2 font-mono text-right font-medium",
                row.variancePercent < 0 ? "text-[color:var(--success)]" : row.variancePercent > 5 ? "text-destructive" : "text-[color:var(--warning)]"
              )}>
                {row.variancePercent >= 0 ? "+" : ""}{row.variancePercent.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpendAnalyticsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("by-dma");

  // Summary stats
  const totalPlanned = useMemo(
    () => spendSummary.reduce((s, r) => s + r.plannedSpend, 0),
    []
  );
  const totalActual = useMemo(
    () => spendSummary.reduce((s, r) => s + r.actualSpend, 0),
    []
  );
  const totalVariance = totalActual - totalPlanned;
  const totalVariancePct = totalPlanned > 0 ? (totalVariance / totalPlanned) * 100 : 0;
  const avgReconciled = useMemo(
    () => Math.round(spendSummary.reduce((s, r) => s + r.reconciledPercent, 0) / spendSummary.length),
    []
  );

  const summaryStats = [
    { label: "Planned Spend", value: formatDollar(totalPlanned) },
    { label: "Actual Spend", value: formatDollar(totalActual) },
    {
      label: "Net Variance",
      value: (
        <VariancePill variance={totalVariance} pct={Math.abs(totalVariancePct)} />
      ),
    },
    {
      label: "Avg Reconciled",
      value: (
        <span
          className={cn(
            "font-mono text-base font-bold",
            avgReconciled >= 80
              ? "text-[color:var(--success)]"
              : avgReconciled >= 60
              ? "text-[color:var(--warning)]"
              : "text-destructive"
          )}
        >
          {avgReconciled}%
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-[var(--section-gap,1rem)] p-[var(--content-padding,1rem)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Spend Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Planned vs. actual spend by DMA, media type, and broadcast month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === "by-dma" ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => setViewMode("by-dma")}
          >
            By DMA
          </Button>
          <Button
            size="sm"
            variant={viewMode === "by-media-type" ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => setViewMode("by-media-type")}
          >
            By Media Type
          </Button>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--grid-gap,0.75rem)]">
        {summaryStats.map((s, i) => (
          <div key={i} className="aesthetic-card p-3 flex flex-col gap-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
            {typeof s.value === "string" ? (
              <p className="font-mono text-base font-bold">{s.value}</p>
            ) : (
              <div className="mt-0.5">{s.value}</div>
            )}
          </div>
        ))}
      </div>

      {/* Spend by Media Type chart */}
      <div className="aesthetic-card p-3">
        <p className="text-xs font-semibold mb-1">Spend by Media Type — Planned vs. Actual</p>
        <p className="text-[10px] text-muted-foreground mb-3">
          Current buy cycle. OOH variance driven by invoice receipt timing.
        </p>
        <SpendByMediaTypeChart data={spendByMediaType} />
      </div>

      {/* Monthly trend */}
      <div className="aesthetic-card p-3">
        <p className="text-xs font-semibold mb-1">Monthly Spend Trend — 12-Month View</p>
        <p className="text-[10px] text-muted-foreground mb-3">
          Q4 surge typical for this agency&apos;s client mix. Feb not yet invoiced.
        </p>
        <MonthlyTrendChart data={monthlySpendTrend} />
      </div>

      {/* Summary table — toggleable view */}
      <div className="aesthetic-card p-0 overflow-hidden">
        <div className="p-3 border-b border-border/60">
          <p className="text-xs font-semibold">
            {viewMode === "by-dma" ? "DMA Spend Summary" : "Media Type Spend Summary"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {viewMode === "by-dma"
              ? "Planned vs. actual by designated market area. Click column headers to sort."
              : "Cross-media-type comparison. Click view toggle above to switch."}
          </p>
        </div>
        {viewMode === "by-dma" ? (
          <DmaSummaryTable data={spendSummary} />
        ) : (
          <MediaTypeSummaryTable />
        )}
      </div>
    </div>
  );
}

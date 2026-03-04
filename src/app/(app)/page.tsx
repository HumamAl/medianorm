"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { APP_CONFIG } from "@/lib/config";
import {
  dashboardStats,
  monthlySpendTrend,
  reconciliationStatusBreakdown,
  reconciliationResults,
} from "@/data/mock-data";
import type { ReconciliationResult } from "@/lib/types";

// ── SSR-safe chart imports ────────────────────────────────────────────────────
const SpendTrendChart = dynamic(
  () => import("@/components/dashboard/spend-trend-chart").then((m) => m.SpendTrendChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 rounded animate-pulse" />
    ),
  }
);

const StatusDonutChart = dynamic(
  () => import("@/components/dashboard/status-donut-chart").then((m) => m.StatusDonutChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 rounded animate-pulse" />
    ),
  }
);

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (elRef.current) observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, elRef };
}

// ── Formatting helpers ────────────────────────────────────────────────────────
function fmtDollars(v: number, abs = false): string {
  const n = abs ? Math.abs(v) : v;
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}

function fmtPct(v: number): string {
  return `${v.toFixed(1)}%`;
}

function deltaLabel(v: number, inverse = false): string {
  const improved = inverse ? v < 0 : v > 0;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

function deltaColor(v: number, inverse = false): string {
  const improved = inverse ? v < 0 : v > 0;
  return improved
    ? "text-success"
    : v === 0
    ? "text-muted-foreground"
    : "text-destructive";
}

// ── Stat card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  rawValue: number;
  change: number;
  format: "dollars" | "pct" | "integer";
  description: string;
  index: number;
  inverseChange?: boolean;
}

function StatCard({
  label,
  rawValue,
  change,
  format,
  description,
  index,
  inverseChange = false,
}: StatCardProps) {
  const absTarget = Math.abs(rawValue);
  const { count, elRef } = useCountUp(absTarget);

  let displayValue: string;
  if (format === "dollars") {
    displayValue = fmtDollars(count * Math.sign(rawValue));
  } else if (format === "pct") {
    displayValue = fmtPct(count / (absTarget / rawValue));
  } else {
    displayValue = count.toString();
  }

  // For percentage format we animate differently — animate the final numeric
  const displayPct = format === "pct" ? fmtPct((count / absTarget) * rawValue) : null;

  return (
    <div
      ref={elRef}
      className="linear-card animate-fade-up-in"
      style={{
        padding: "var(--card-padding)",
        animationDelay: `${index * 60}ms`,
        animationDuration: "180ms",
        animationFillMode: "both",
      }}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide leading-none">
        {label}
      </p>
      <p className="text-2xl font-bold font-mono tabular-nums mt-1.5 text-foreground leading-none">
        {format === "pct" ? fmtPct(rawValue) : format === "dollars" ? fmtDollars(count * Math.sign(rawValue)) : count}
      </p>
      <p className="text-xs text-muted-foreground mt-1.5 leading-tight">
        <span className={`font-mono font-medium ${deltaColor(change, inverseChange)}`}>
          {deltaLabel(change)}
        </span>
        {" · "}
        {description}
      </p>
    </div>
  );
}

// ── Match status badge ────────────────────────────────────────────────────────
function MatchBadge({ status }: { status: ReconciliationResult["matchStatus"] }) {
  const cfg = {
    matched: { label: "Matched", cls: "bg-success/10 text-success border-success/20" },
    tolerance: { label: "Tolerance", cls: "bg-warning/10 text-warning border-warning/20" },
    discrepancy: { label: "Discrepancy", cls: "bg-destructive/10 text-destructive border-destructive/20" },
    unmatched: { label: "Unmatched", cls: "bg-muted text-muted-foreground border-border" },
  }[status];
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const BRANDS = ["All Brands", "Apex Motors", "Zenith Health", "Crestline Financial", "BluePeak Energy"];
const PERIODS = ["30d", "60d", "90d"] as const;
type Period = (typeof PERIODS)[number];

export default function ReconciliationOverviewPage() {
  const [brand, setBrand] = useState("All Brands");
  const [period, setPeriod] = useState<Period>("30d");

  // Filter chart data by period
  const chartData = useMemo(() => {
    const sliceMap: Record<Period, number> = { "30d": 4, "60d": 8, "90d": 12 };
    return monthlySpendTrend.slice(-sliceMap[period]);
  }, [period]);

  // Filter discrepancy table
  const discrepancyRows = useMemo<ReconciliationResult[]>(() => {
    const discrepancies = reconciliationResults.filter(
      (r) => r.matchStatus === "discrepancy" || r.matchStatus === "unmatched"
    );
    return discrepancies.slice(0, 8);
  }, []);

  const stats = dashboardStats;

  return (
    <div
      className="space-y-4"
      style={{ padding: "var(--content-padding)" }}
    >
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-lg font-semibold tracking-tight"
            style={{ letterSpacing: "var(--heading-tracking)" }}
          >
            Reconciliation Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Q1 2026 · Multi-brand media buy · As of Mar 3, 2026
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Brand selector */}
          <div className="flex items-center gap-1 border border-border rounded px-2 py-1 bg-card">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-mono mr-1">
              Brand
            </span>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="text-xs font-mono bg-transparent text-foreground outline-none cursor-pointer"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Period tabs */}
          <div className="flex items-center border border-border rounded overflow-hidden">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-[10px] font-mono transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-surface-hover"
                }`}
                style={{ transitionDuration: "var(--dur-fast)" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Stat Cards (6) ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[var(--grid-gap)]">
        <StatCard
          label="Total Buy Value"
          rawValue={stats.totalBuyValue}
          change={stats.totalBuyValueChange}
          format="dollars"
          description="gross vs prior cycle"
          index={0}
        />
        <StatCard
          label="Reconciliation Rate"
          rawValue={stats.reconciliationRate}
          change={stats.reconciliationRateChange}
          format="pct"
          description="invoiced lines matched"
          index={1}
        />
        <StatCard
          label="Open Discrepancies"
          rawValue={stats.openDiscrepancies}
          change={stats.openDiscrepanciesChange}
          format="integer"
          description="lines requiring review"
          index={2}
          inverseChange
        />
        <StatCard
          label="Net Variance"
          rawValue={stats.netVariance}
          change={stats.netVarianceChange}
          format="dollars"
          description="overbilled vs plan"
          index={3}
          inverseChange
        />
        <StatCard
          label="Pending Invoices"
          rawValue={stats.pendingInvoices}
          change={stats.pendingInvoicesChange}
          format="integer"
          description="awaiting parse/match"
          index={4}
          inverseChange
        />
        <StatCard
          label="AI Parse Rate"
          rawValue={stats.aiParseRate}
          change={stats.aiParseRateChange}
          format="pct"
          description="Claude-parsed vs manual"
          index={5}
        />
      </div>

      {/* ── Charts Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-[var(--grid-gap)]">
        {/* Spend Trend */}
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-foreground">Monthly Spend Trend</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                Planned vs. invoiced gross spend
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
              {period === "30d" ? "Last 4 mo" : period === "60d" ? "Last 8 mo" : "Last 12 mo"}
            </span>
          </div>
          <SpendTrendChart data={chartData} />
        </div>

        {/* Reconciliation Status Donut */}
        <div className="linear-card" style={{ padding: "var(--card-padding)" }}>
          <div className="mb-3">
            <p className="text-xs font-semibold text-foreground">Reconciliation Status</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Line item match breakdown — {reconciliationResults.length} total
            </p>
          </div>
          <StatusDonutChart data={reconciliationStatusBreakdown} />
        </div>
      </div>

      {/* ── Open Discrepancies Table ──────────────────────────────── */}
      <div className="linear-card overflow-hidden">
        <div
          className="flex items-center justify-between border-b border-border"
          style={{ padding: "var(--card-padding-sm, 0.75rem) var(--card-padding)" }}
        >
          <div>
            <p className="text-xs font-semibold text-foreground">Open Discrepancies</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
              Lines outside tolerance · requires reconciliation action
            </p>
          </div>
          <a
            href="/reconciliation"
            className="text-[10px] font-mono text-primary hover:text-primary/80 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            View all {stats.openDiscrepancies} →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[
                  "Station",
                  "Program",
                  "Broadcast Week",
                  "Planned Rate",
                  "Invoiced Rate",
                  "Variance%",
                  "Status",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-3 py-1.5 text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {discrepancyRows.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-border/50 last:border-0 hover:bg-surface-hover aesthetic-transition"
                >
                  <td className="px-3 py-2 font-mono text-foreground whitespace-nowrap">
                    {row.station}
                  </td>
                  <td
                    className="px-3 py-2 text-muted-foreground max-w-[160px] truncate"
                    title={row.program}
                  >
                    {row.program}
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground whitespace-nowrap">
                    {row.broadcastWeek}
                  </td>
                  <td className="px-3 py-2 font-mono text-foreground text-right whitespace-nowrap">
                    ${row.plannedRate.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 font-mono text-foreground text-right whitespace-nowrap">
                    ${row.invoicedRate.toLocaleString()}
                  </td>
                  <td
                    className={`px-3 py-2 font-mono font-medium text-right whitespace-nowrap ${
                      row.rateVariancePercent > 0
                        ? "text-destructive"
                        : row.rateVariancePercent < 0
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  >
                    {row.rateVariancePercent > 0 ? "+" : ""}
                    {row.rateVariancePercent.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <MatchBadge status={row.matchStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Proposal Banner ───────────────────────────────────────── */}
      <div
        className="rounded border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{
          padding: "var(--card-padding)",
          background: "var(--section-dark)",
        }}
      >
        <div>
          <p className="text-xs font-medium text-white/90">
            Live demo built for{" "}
            <span className="text-white font-semibold">
              {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
            </span>
          </p>
          <p className="text-[10px] font-mono text-white/50 mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-[10px] font-mono text-white/60 hover:text-white/90 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            My Approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center text-[10px] font-mono font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            Work With Me →
          </a>
        </div>
      </div>
    </div>
  );
}

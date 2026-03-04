"use client";

import { useState } from "react";
import { X, Check, AlertTriangle } from "lucide-react";

type View = "before" | "after";

const BEFORE_ITEMS = [
  "Exact string match only — \"GMA\" vs \"Good Morning America\" = no match",
  "Fixed ±0% tolerance — any rate variance triggers manual review",
  "Same tolerance threshold for TV broadcast and radio buy lines",
  "Discrepancies surfaced in row order — reviewer hunts for high-value items",
  "~8 hrs/week of analyst time on spreadsheet VLOOKUP reconciliation",
];

const AFTER_ITEMS = [
  "Multi-pass: exact composite key first, then fuzzy program name matching",
  "Configurable tolerance bands per media type (TV: ±3%, Radio: ±5%)",
  "Tolerance thresholds saved per station group and editable per campaign",
  "Discrepancy queue ranked by dollar impact — highest exposure reviewed first",
  "Automated flagging catches $15K–30K/month in overbilling patterns",
];

interface MatchRow {
  buyLine: string;
  invoiceLine: string;
  variance: string;
  status: "matched" | "tolerance" | "discrepancy" | "unmatched";
}

const MATCH_ROWS: MatchRow[] = [
  {
    buyLine: "WABC-TV / Good Morning America / :30",
    invoiceLine: "WABC / GMA / 30s",
    variance: "+$0",
    status: "matched",
  },
  {
    buyLine: "WCBS-TV / CBS Mornings / :30",
    invoiceLine: "WCBS / CBS Mornings / 30 sec",
    variance: "+$42",
    status: "tolerance",
  },
  {
    buyLine: "WNBC-TV / Today Show / :15",
    invoiceLine: "WNBC / Today Program / :15",
    variance: "+$310",
    status: "discrepancy",
  },
  {
    buyLine: "WABC-TV / Eyewitness News / :30",
    invoiceLine: "— no match —",
    variance: "—",
    status: "unmatched",
  },
];

const STATUS_CONFIG = {
  matched: {
    label: "Matched",
    color: "var(--color-success)",
    bg: "color-mix(in oklch, var(--success) 6%, transparent)",
    border: "color-mix(in oklch, var(--success) 18%, transparent)",
    icon: Check,
  },
  tolerance: {
    label: "Tolerance",
    color: "var(--color-warning)",
    bg: "color-mix(in oklch, var(--warning) 8%, transparent)",
    border: "color-mix(in oklch, var(--warning) 22%, transparent)",
    icon: AlertTriangle,
  },
  discrepancy: {
    label: "Discrepancy",
    color: "var(--color-destructive)",
    bg: "color-mix(in oklch, var(--destructive) 6%, transparent)",
    border: "color-mix(in oklch, var(--destructive) 18%, transparent)",
    icon: AlertTriangle,
  },
  unmatched: {
    label: "Unmatched",
    color: "var(--color-muted-foreground)",
    bg: "var(--color-muted)",
    border: "color-mix(in oklch, var(--border), transparent 20%)",
    icon: X,
  },
};

export function ReconciliationViz() {
  const [view, setView] = useState<View>("before");

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div
        className="inline-flex rounded-sm border p-0.5 gap-0.5"
        style={{
          borderColor: "color-mix(in oklch, var(--border), transparent 20%)",
          background: "var(--color-muted, oklch(0.97 0 0))",
        }}
      >
        {(["before", "after"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="text-[11px] font-mono px-3 py-1 rounded-sm transition-colors"
            style={{
              transitionDuration: "var(--dur-fast, 60ms)",
              background:
                view === v
                  ? v === "after"
                    ? "color-mix(in oklch, var(--success) 10%, var(--color-card, white))"
                    : "var(--color-card, white)"
                  : "transparent",
              color:
                view === v
                  ? v === "after"
                    ? "var(--color-success)"
                    : "var(--color-foreground)"
                  : "var(--color-muted-foreground)",
              boxShadow: view === v ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
          >
            {v === "before" ? "Current: Spreadsheet" : "With MediaNorm"}
          </button>
        ))}
      </div>

      {view === "before" ? (
        <div
          className="rounded-sm border p-3 space-y-1.5"
          style={{
            background:
              "color-mix(in oklch, var(--destructive) 4%, transparent)",
            borderColor:
              "color-mix(in oklch, var(--destructive) 18%, transparent)",
          }}
        >
          <p
            className="text-[11px] font-mono font-medium mb-2"
            style={{ color: "var(--color-destructive)" }}
          >
            Manual spreadsheet VLOOKUP reconciliation
          </p>
          {BEFORE_ITEMS.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <X
                className="w-3 h-3 mt-0.5 shrink-0"
                style={{ color: "var(--color-destructive)" }}
              />
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "var(--color-destructive)" }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Capabilities */}
          <div
            className="rounded-sm border p-3 space-y-1.5"
            style={{
              background:
                "color-mix(in oklch, var(--success) 4%, transparent)",
              borderColor:
                "color-mix(in oklch, var(--success) 18%, transparent)",
            }}
          >
            <p
              className="text-[11px] font-mono font-medium mb-2"
              style={{ color: "var(--color-success)" }}
            >
              Multi-pass matching engine
            </p>
            {AFTER_ITEMS.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <Check
                  className="w-3 h-3 mt-0.5 shrink-0"
                  style={{ color: "var(--color-success)" }}
                />
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--color-success)" }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Sample match results table */}
          <div
            className="rounded-sm border overflow-hidden"
            style={{
              borderColor: "color-mix(in oklch, var(--border), transparent 20%)",
            }}
          >
            <div
              className="grid grid-cols-[1fr_1fr_auto_auto] gap-x-2 px-3 py-1.5 text-[10px] font-mono font-medium text-muted-foreground border-b"
              style={{
                borderColor: "color-mix(in oklch, var(--border), transparent 20%)",
                background: "var(--color-muted, oklch(0.97 0 0))",
              }}
            >
              <span>Buy Plan Line</span>
              <span>Invoice Line</span>
              <span>Variance</span>
              <span>Status</span>
            </div>
            {MATCH_ROWS.map((row) => {
              const cfg = STATUS_CONFIG[row.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={row.buyLine}
                  className="grid grid-cols-[1fr_1fr_auto_auto] gap-x-2 px-3 py-1.5 text-[10px] border-b last:border-0 items-center"
                  style={{
                    borderColor:
                      "color-mix(in oklch, var(--border), transparent 30%)",
                  }}
                >
                  <span className="font-mono text-foreground/80 truncate">
                    {row.buyLine}
                  </span>
                  <span className="font-mono text-muted-foreground truncate">
                    {row.invoiceLine}
                  </span>
                  <span
                    className="font-mono font-medium tabular-nums"
                    style={{ color: cfg.color }}
                  >
                    {row.variance}
                  </span>
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border text-[10px] font-mono"
                    style={{
                      background: cfg.bg,
                      borderColor: cfg.border,
                      color: cfg.color,
                    }}
                  >
                    <Icon className="w-2.5 h-2.5 shrink-0" />
                    {cfg.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import type { ElementType } from "react";
import { useState } from "react";
import {
  FileText,
  Cpu,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  icon: ElementType;
  highlight?: boolean;
  terminal?: "matched" | "review";
}

const nodes: FlowNode[] = [
  {
    id: "raw",
    label: "Raw Invoice",
    sublabel: "PDF / Excel / XML",
    icon: FileText,
  },
  {
    id: "parse",
    label: "AI Parse",
    sublabel: "Claude Haiku — layout-aware",
    icon: Cpu,
    highlight: true,
  },
  {
    id: "normalize",
    label: "Schema Normalize",
    sublabel: "station · program · week · rate",
    icon: ArrowRight,
  },
  {
    id: "confidence",
    label: "Confidence Check",
    sublabel: "threshold: ≥ 0.82",
    icon: AlertTriangle,
    highlight: true,
  },
];

const EXAMPLE_FORMATS = [
  { vendor: "Nexstar Media", format: "PDF", confidence: 0.94, status: "matched" as const },
  { vendor: "iHeart Radio", format: "Excel (merged cells)", confidence: 0.88, status: "matched" as const },
  { vendor: "Cumulus Broadcasting", format: "Excel (multi-sheet)", confidence: 0.71, status: "review" as const },
  { vendor: "Sinclair Broadcast", format: "XML", confidence: 0.97, status: "matched" as const },
];

export function InvoiceFlowViz() {
  const [activeFormat, setActiveFormat] = useState(0);

  const current = EXAMPLE_FORMATS[activeFormat];

  return (
    <div className="space-y-3">
      {/* Format selector */}
      <div className="flex flex-wrap gap-1.5">
        {EXAMPLE_FORMATS.map((f, i) => (
          <button
            key={f.vendor}
            onClick={() => setActiveFormat(i)}
            className="text-[11px] px-2 py-1 rounded-sm border transition-colors"
            style={{
              transitionDuration: "var(--dur-fast, 60ms)",
              background:
                i === activeFormat
                  ? "color-mix(in oklch, var(--primary) 10%, transparent)"
                  : "transparent",
              borderColor:
                i === activeFormat
                  ? "color-mix(in oklch, var(--primary) 35%, transparent)"
                  : "color-mix(in oklch, var(--border), transparent 30%)",
              color: i === activeFormat ? "var(--color-primary)" : "var(--color-muted-foreground)",
            }}
          >
            {f.vendor.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Pipeline flow */}
      <div className="flex flex-wrap items-center gap-1.5">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-1.5">
            <div
              className="flex items-start gap-1.5 rounded-sm border px-2.5 py-1.5"
              style={{
                background: node.highlight
                  ? "color-mix(in oklch, var(--primary) 6%, transparent)"
                  : "var(--color-card)",
                borderColor: node.highlight
                  ? "color-mix(in oklch, var(--primary) 25%, transparent)"
                  : "color-mix(in oklch, var(--border), transparent 20%)",
              }}
            >
              <node.icon
                className="w-3 h-3 mt-0.5 shrink-0"
                style={{
                  color: node.highlight
                    ? "var(--color-primary)"
                    : "var(--color-muted-foreground)",
                }}
              />
              <div>
                <p className="font-mono text-[11px] font-medium leading-none">
                  {node.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {node.sublabel}
                </p>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            )}
          </div>
        ))}

        {/* Terminal outcome */}
        <ChevronRight className="w-3 h-3 text-muted-foreground/50 shrink-0" />
        <div
          className="flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5"
          style={{
            background:
              current.status === "matched"
                ? "color-mix(in oklch, var(--success) 6%, transparent)"
                : "color-mix(in oklch, var(--warning) 8%, transparent)",
            borderColor:
              current.status === "matched"
                ? "color-mix(in oklch, var(--success) 22%, transparent)"
                : "color-mix(in oklch, var(--warning) 25%, transparent)",
          }}
        >
          {current.status === "matched" ? (
            <CheckCircle
              className="w-3 h-3 shrink-0"
              style={{ color: "var(--color-success)" }}
            />
          ) : (
            <AlertTriangle
              className="w-3 h-3 shrink-0"
              style={{ color: "var(--color-warning)" }}
            />
          )}
          <p
            className="font-mono text-[11px] font-medium"
            style={{
              color:
                current.status === "matched"
                  ? "var(--color-success)"
                  : "var(--color-warning)",
            }}
          >
            {current.status === "matched" ? "Matched" : "Manual Review"}
          </p>
        </div>
      </div>

      {/* Confidence readout for selected format */}
      <div
        className="flex items-center justify-between rounded-sm px-3 py-2 border text-[11px]"
        style={{
          background: "var(--color-muted, oklch(0.97 0 0))",
          borderColor: "color-mix(in oklch, var(--border), transparent 30%)",
        }}
      >
        <span className="text-muted-foreground font-mono">
          {current.vendor} &mdash; {current.format}
        </span>
        <span
          className="font-mono font-semibold"
          style={{
            color:
              current.confidence >= 0.82
                ? "var(--color-success)"
                : "var(--color-warning)",
          }}
        >
          confidence {(current.confidence * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

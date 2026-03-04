"use client";

import type { ElementType } from "react";
import { useState } from "react";
import {
  FileSpreadsheet,
  ScanText,
  Filter,
  ShieldCheck,
  Database,
  ChevronRight,
} from "lucide-react";

interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  icon: ElementType;
  type: "input" | "engine" | "store" | "output";
  detail: string;
}

const NODES: ArchNode[] = [
  {
    id: "input",
    label: "Excel Input",
    sublabel: "Multi-sheet, merged cells",
    icon: FileSpreadsheet,
    type: "input",
    detail:
      "SheetJS ingests .xlsx / .xls. Detects sheet count, merged cell regions, and named ranges before parsing begins.",
  },
  {
    id: "header",
    label: "Header Detection",
    sublabel: "Dynamic column mapping",
    icon: ScanText,
    type: "engine",
    detail:
      "Heuristic scanner finds the header row by looking for known column name variants (\"Station\", \"STATION\", \"Stn\") across the first 10 rows. Handles transposed layouts.",
  },
  {
    id: "rowclass",
    label: "Row Classification",
    sublabel: "Data vs. summary rows",
    icon: Filter,
    type: "engine",
    detail:
      "Pattern matching skips subtotal rows (cells containing \"Total\", \"Subtotal\", merged across columns) and blank separator rows. Only true data rows pass through.",
  },
  {
    id: "validate",
    label: "Cell Validation",
    sublabel: "Type check + graceful degrade",
    icon: ShieldCheck,
    type: "engine",
    detail:
      "Each cell is validated against its expected type (date, currency, integer). Invalid cells are flagged per-row; the row is partially extracted rather than dropped, with a field-level error map.",
  },
  {
    id: "profile",
    label: "Format Profile DB",
    sublabel: "Agency layout registry",
    icon: Database,
    type: "store",
    detail:
      "After a successful parse, the column mapping is saved as an agency profile keyed by vendor name. Future uploads from the same agency skip header detection entirely.",
  },
];

const TYPE_STYLES: Record<ArchNode["type"], { bg: string; border: string; color: string }> = {
  input: {
    bg: "color-mix(in oklch, var(--primary) 6%, transparent)",
    border: "color-mix(in oklch, var(--primary) 22%, transparent)",
    color: "var(--color-primary)",
  },
  engine: {
    bg: "var(--color-muted, oklch(0.97 0 0))",
    border: "color-mix(in oklch, var(--border), transparent 20%)",
    color: "var(--color-foreground)",
  },
  store: {
    bg: "color-mix(in oklch, var(--success) 5%, transparent)",
    border: "color-mix(in oklch, var(--success) 18%, transparent)",
    color: "var(--color-success)",
  },
  output: {
    bg: "color-mix(in oklch, var(--primary) 6%, transparent)",
    border: "color-mix(in oklch, var(--primary) 22%, transparent)",
    color: "var(--color-primary)",
  },
};

export function ExcelParserViz() {
  const [activeNode, setActiveNode] = useState<string>("header");

  const selected = NODES.find((n) => n.id === activeNode)!;

  return (
    <div className="space-y-3">
      {/* Pipeline row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {NODES.map((node, i) => {
          const style = TYPE_STYLES[node.type];
          const isActive = node.id === activeNode;
          return (
            <div key={node.id} className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveNode(node.id)}
                className="flex items-start gap-1.5 rounded-sm border px-2.5 py-1.5 text-left transition-colors"
                style={{
                  transitionDuration: "var(--dur-fast, 60ms)",
                  background: isActive
                    ? style.bg
                    : "var(--color-card, white)",
                  borderColor: isActive
                    ? style.border
                    : "color-mix(in oklch, var(--border), transparent 20%)",
                }}
              >
                <node.icon
                  className="w-3 h-3 mt-0.5 shrink-0"
                  style={{ color: isActive ? style.color : "var(--color-muted-foreground)" }}
                />
                <div>
                  <p
                    className="font-mono text-[11px] font-medium leading-none"
                    style={{ color: isActive ? style.color : "var(--color-foreground)" }}
                  >
                    {node.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {node.sublabel}
                  </p>
                </div>
              </button>
              {i < NODES.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Detail panel for selected node */}
      <div
        className="rounded-sm border px-3 py-2.5"
        style={{
          background: TYPE_STYLES[selected.type].bg,
          borderColor: TYPE_STYLES[selected.type].border,
        }}
      >
        <p
          className="font-mono text-[11px] font-semibold mb-1"
          style={{ color: TYPE_STYLES[selected.type].color }}
        >
          {selected.label}
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {selected.detail}
        </p>
      </div>

      {/* Format coverage stat */}
      <div
        className="flex items-center justify-between rounded-sm px-3 py-2 border text-[11px]"
        style={{
          background: "var(--color-muted, oklch(0.97 0 0))",
          borderColor: "color-mix(in oklch, var(--border), transparent 30%)",
        }}
      >
        <span className="font-mono text-muted-foreground">
          Format profiles registered
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-muted-foreground line-through">
            1 format (current)
          </span>
          <span
            className="font-mono font-semibold"
            style={{ color: "var(--color-success)" }}
          >
            90%+ coverage (target)
          </span>
        </div>
      </div>
    </div>
  );
}

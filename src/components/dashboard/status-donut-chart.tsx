"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { ReconciliationStatusBreakdown } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  matched: "var(--success)",
  tolerance: "var(--warning)",
  discrepancy: "var(--destructive)",
  unmatched: "var(--muted-foreground)",
};

const STATUS_LABELS: Record<string, string> = {
  matched: "Matched",
  tolerance: "In Tolerance",
  discrepancy: "Discrepancy",
  unmatched: "Unmatched",
};

interface TooltipEntry {
  name?: string;
  value?: number;
  payload?: { percentage: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded border border-border bg-card p-2.5 text-xs shadow-sm">
      <p className="font-medium text-foreground">{STATUS_LABELS[d.name as string] ?? d.name}</p>
      <p className="text-muted-foreground font-mono mt-0.5">
        {d.value} lines &middot; {d.payload?.percentage ?? 0}%
      </p>
    </div>
  );
};

export function StatusDonutChart({ data }: { data: ReconciliationStatusBreakdown[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_COLORS[entry.status] ?? "var(--muted-foreground)"}
              opacity={0.9}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
          formatter={(value) => (
            <span style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
              {STATUS_LABELS[value] ?? value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

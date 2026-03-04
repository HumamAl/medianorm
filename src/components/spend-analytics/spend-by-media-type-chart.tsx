"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { SpendByMediaType } from "@/lib/types";

function formatDollar(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-border bg-card p-2.5 text-xs shadow-sm">
      <p className="font-medium text-foreground mb-1.5 font-mono">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center justify-between gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-sm shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="font-mono font-medium text-foreground">
            {formatDollar(entry.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function SpendByMediaTypeChart({ data }: { data: SpendByMediaType[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis
          dataKey="mediaType"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatDollar(v)}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "10px", paddingTop: "8px" }}
          formatter={(value) => (
            <span style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
              {value}
            </span>
          )}
        />
        <Bar dataKey="plannedSpend" name="Planned" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="actualSpend" name="Invoiced" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

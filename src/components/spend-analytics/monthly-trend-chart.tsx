"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MonthlySpendDataPoint } from "@/lib/types";

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
    <div className="rounded border border-border bg-card p-2.5 text-xs shadow-sm min-w-[160px]">
      <p className="font-medium text-foreground mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center justify-between gap-3 text-muted-foreground">
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

export default function MonthlyTrendChart({ data }: { data: MonthlySpendDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
        <defs>
          <linearGradient id="fillPlannedSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.20} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillActualSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.20} />
            <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis
          dataKey="month"
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
        <Area
          type="monotone"
          dataKey="plannedSpend"
          name="Planned"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          fill="url(#fillPlannedSpend)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="actualSpend"
          name="Invoiced"
          stroke="var(--chart-3)"
          strokeWidth={1.5}
          fill="url(#fillActualSpend)"
          dot={false}
          strokeDasharray="4 2"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

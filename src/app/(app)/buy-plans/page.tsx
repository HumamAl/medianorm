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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buyPlanLineItems } from "@/data/mock-data";
import type { BuyPlanLineItem, BuyPlanStatus, MediaType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Search, ChevronUp, ChevronDown, Plus, FileSpreadsheet } from "lucide-react";

// ─── Status Badge ─────────────────────────────────────────────────────────────

function BuyPlanStatusBadge({ status }: { status: BuyPlanStatus }) {
  const config: Record<BuyPlanStatus, { label: string; colorClass: string }> = {
    approved: {
      label: "Approved",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    pending_approval: {
      label: "Pending Approval",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    makegood: {
      label: "Makegood",
      colorClass: "text-primary bg-primary/10",
    },
    preempted: {
      label: "Preempted",
      colorClass: "text-destructive bg-destructive/10",
    },
    cancelled: {
      label: "Cancelled",
      colorClass: "text-muted-foreground bg-muted",
    },
  };

  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium border-0 rounded-sm px-1.5 py-0 whitespace-nowrap", c.colorClass)}
    >
      {c.label}
    </Badge>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaFilter = "All" | MediaType;
const MEDIA_TABS: MediaFilter[] = ["All", "TV Broadcast", "Cable", "Radio", "OOH"];

type SortKey = keyof Pick<
  BuyPlanLineItem,
  "id" | "brand" | "dma" | "station" | "plannedRate" | "plannedSpots" | "plannedImpressions" | "broadcastWeek"
>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyPlansPage() {
  const [search, setSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("broadcastWeek");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const displayed = useMemo(() => {
    return buyPlanLineItems
      .filter((item) => {
        const matchesMedia = mediaFilter === "All" || item.mediaType === mediaFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          item.id.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.dma.toLowerCase().includes(q) ||
          item.station.toLowerCase().includes(q) ||
          item.program.toLowerCase().includes(q);
        return matchesMedia && matchesSearch;
      })
      .sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, mediaFilter, sortKey, sortDir]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: buyPlanLineItems.length };
    for (const item of buyPlanLineItems) {
      counts[item.mediaType] = (counts[item.mediaType] ?? 0) + 1;
    }
    return counts;
  }, []);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  const sortableCols: { key: SortKey; label: string }[] = [
    { key: "id", label: "Line ID" },
    { key: "brand", label: "Brand" },
    { key: "dma", label: "DMA" },
    { key: "station", label: "Station" },
    { key: "broadcastWeek", label: "Bcast Week" },
    { key: "plannedRate", label: "Rate" },
    { key: "plannedSpots", label: "Spots" },
    { key: "plannedImpressions", label: "Impr (000)" },
  ];

  return (
    <div className="flex flex-col gap-[var(--section-gap,1rem)] p-[var(--content-padding,1rem)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Buy Plans</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Approved line items across all active buy cycles
          </p>
        </div>
        <Button size="sm" className="gap-1.5 h-8 text-xs">
          <Plus className="w-3.5 h-3.5" />
          New Line Item
        </Button>
      </div>

      {/* Media Type Tabs */}
      <Tabs value={mediaFilter} onValueChange={(v) => setMediaFilter(v as MediaFilter)}>
        <TabsList className="h-8 rounded-sm gap-0.5 bg-muted/60">
          {MEDIA_TABS.map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="h-7 rounded-sm text-xs px-3 data-[state=active]:shadow-none"
            >
              {t}
              <span className="ml-1.5 font-mono text-[10px] opacity-60">
                {tabCounts[t] ?? 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search + count */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by ID, brand, station, DMA, program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-sm"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono shrink-0">
          {displayed.length} of {buyPlanLineItems.length} line items
        </span>
      </div>

      {/* Table */}
      <div className="aesthetic-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60">
                {sortableCols.slice(0, 4).map((col) => (
                  <TableHead
                    key={col.key}
                    className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </TableHead>
                ))}
                {/* Non-sortable cols */}
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Program</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Daypart</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 text-center">Len</TableHead>
                {sortableCols.slice(4).map((col) => (
                  <TableHead
                    key={col.key}
                    className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 whitespace-nowrap cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </TableHead>
                ))}
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="h-28 text-center text-xs text-muted-foreground">
                    No buy plan line items match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-[color:var(--surface-hover)] transition-colors duration-75"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap py-2">{item.id}</TableCell>
                    <TableCell className="text-xs font-medium whitespace-nowrap py-2">{item.brand}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap py-2">{item.dma}</TableCell>
                    <TableCell className="text-xs font-mono whitespace-nowrap py-2">{item.station}</TableCell>
                    <TableCell className="text-xs py-2 max-w-[160px]">
                      <span className="truncate block">{item.program}</span>
                    </TableCell>
                    <TableCell className="text-xs py-2 text-muted-foreground whitespace-nowrap">{item.daypart}</TableCell>
                    <TableCell className="text-xs font-mono py-2 text-center text-muted-foreground">:{item.spotLength}</TableCell>
                    <TableCell className="text-xs font-mono py-2 whitespace-nowrap text-muted-foreground">{item.broadcastWeek}</TableCell>
                    <TableCell className="text-xs font-mono py-2 text-right whitespace-nowrap">
                      ${item.plannedRate.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs font-mono py-2 text-right">{item.plannedSpots}</TableCell>
                    <TableCell className="text-xs font-mono py-2 text-right">
                      {item.plannedImpressions.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-2 whitespace-nowrap">
                      <BuyPlanStatusBadge status={item.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer note */}
      <div className="flex items-start gap-2 px-1">
        <FileSpreadsheet className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Makegood units reference the original preempted line item. Preempted spots bill at $0 — replacement units appear as separate makegood entries with the original BP ID in <span className="font-mono">makegoodRef</span>.
        </p>
      </div>
    </div>
  );
}

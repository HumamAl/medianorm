"use client";

import { useState, useMemo, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { uploadedFiles } from "@/data/mock-data";
import type { UploadedFile, FileType, FileProcessingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Search,
  Upload,
  FileSpreadsheet,
  FileText,
  File,
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

// ─── File Type Badge ──────────────────────────────────────────────────────────

const FILE_TYPE_CONFIG: Record<FileType, { label: string; colorClass: string; icon: React.ReactNode }> = {
  "buy-plan-excel": {
    label: "Buy Plan XLS",
    colorClass: "text-primary bg-primary/10",
    icon: <FileSpreadsheet className="w-3 h-3" />,
  },
  "invoice-pdf": {
    label: "Invoice PDF",
    colorClass: "text-destructive bg-destructive/10",
    icon: <FileText className="w-3 h-3" />,
  },
  "invoice-excel": {
    label: "Invoice XLS",
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    icon: <FileSpreadsheet className="w-3 h-3" />,
  },
  "invoice-xml": {
    label: "Invoice XML",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    icon: <File className="w-3 h-3" />,
  },
};

function FileTypeBadge({ fileType }: { fileType: FileType }) {
  const c = FILE_TYPE_CONFIG[fileType];
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium border-0 rounded-sm px-1.5 py-0 gap-1 whitespace-nowrap", c.colorClass)}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

// ─── Processing Status Badge ──────────────────────────────────────────────────

const STATUS_CONFIG: Record<FileProcessingStatus, { label: string; colorClass: string; icon: React.ReactNode }> = {
  parsed: {
    label: "Parsed",
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  processing: {
    label: "Processing",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  uploading: {
    label: "Uploading",
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  error: {
    label: "Error",
    colorClass: "text-destructive bg-destructive/10",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

function ProcessingStatusBadge({ status }: { status: FileProcessingStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium border-0 rounded-sm px-1.5 py-0 gap-1 whitespace-nowrap", c.colorClass)}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

// ─── File size formatter ──────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

// ─── Filter type ──────────────────────────────────────────────────────────────

type FileTypeFilter = "all" | FileType;
const FILE_TYPE_FILTERS: { value: FileTypeFilter; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "buy-plan-excel", label: "Buy Plans" },
  { value: "invoice-pdf", label: "Invoice PDFs" },
  { value: "invoice-excel", label: "Invoice Excel" },
  { value: "invoice-xml", label: "Invoice XML" },
];

// ─── Mock new file generator ──────────────────────────────────────────────────

let mockIdCounter = 7900;
function makeMockFile(name: string): UploadedFile {
  mockIdCounter += 1;
  return {
    id: `FILE-${mockIdCounter}`,
    fileName: name,
    fileType: "invoice-pdf",
    brand: "Apex Motors",
    mediaType: "TV Broadcast",
    uploadedAt: new Date().toISOString(),
    processingStatus: "processing",
    fileSize: Math.floor(Math.random() * 800_000) + 100_000,
    lineItemCount: null,
    parsedBy: null,
    dma: "New York",
  };
}

// ─── Sort key ────────────────────────────────────────────────────────────────

type SortKey = keyof Pick<UploadedFile, "id" | "fileName" | "brand" | "uploadedAt" | "fileSize">;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FileManagerPage() {
  const [files, setFiles] = useState<UploadedFile[]>(uploadedFiles);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FileTypeFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("uploadedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [dragOver, setDragOver] = useState(false);
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  // Simulate file upload
  function handleUpload(fileName: string) {
    const newFile = makeMockFile(fileName);
    setFiles((prev) => [newFile, ...prev]);
    // Simulate processing completing after 2.5s
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === newFile.id
            ? { ...f, processingStatus: "parsed", lineItemCount: Math.floor(Math.random() * 80) + 10 }
            : f
        )
      );
    }, 2500);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files;
    if (dropped.length > 0) {
      handleUpload(dropped[0].name);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      handleUpload(selected[0].name);
    }
    e.target.value = "";
  }

  const displayed = useMemo(() => {
    return files
      .filter((f) => {
        const matchesType = typeFilter === "all" || f.fileType === typeFilter;
        const q = search.toLowerCase();
        const matchesSearch =
          q === "" ||
          f.id.toLowerCase().includes(q) ||
          f.fileName.toLowerCase().includes(q) ||
          f.brand.toLowerCase().includes(q) ||
          f.dma.toLowerCase().includes(q);
        return matchesType && matchesSearch;
      })
      .sort((a, b) => {
        const av = a[sortKey] as string | number;
        const bv = b[sortKey] as string | number;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [files, search, typeFilter, sortKey, sortDir]);

  // Counts per file type for filter labels
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: files.length };
    for (const f of files) {
      counts[f.fileType] = (counts[f.fileType] ?? 0) + 1;
    }
    return counts;
  }, [files]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "2-digit",
    });
  }

  return (
    <div className="flex flex-col gap-[var(--section-gap,1rem)] p-[var(--content-padding,1rem)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">File Manager</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Buy plan and invoice files — upload, parse, and track processing status
          </p>
        </div>
        <Button
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.pdf,.xml"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-sm flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors duration-100",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
        )}
      >
        <Upload className={cn("w-6 h-6", dragOver ? "text-primary" : "text-muted-foreground")} />
        <div className="text-center">
          <p className="text-xs font-medium">
            {dragOver ? "Drop to upload" : "Drag & drop files here"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Supports .xlsx buy plans, invoice PDFs, and invoice Excel files
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by file name, brand, DMA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs rounded-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as FileTypeFilter)}>
          <SelectTrigger className="w-40 h-8 text-xs rounded-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILE_TYPE_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
                <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                  {typeCounts[f.value] ?? 0}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground font-mono shrink-0">
          {displayed.length} of {files.length} files
        </span>
      </div>

      {/* File Table */}
      <div className="aesthetic-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60">
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("fileName")}>
                  <div className="flex items-center gap-1">File Name <SortIcon col="fileName" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Type</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("brand")}>
                  <div className="flex items-center gap-1">Brand <SortIcon col="brand" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Media Type</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">DMA</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("uploadedAt")}>
                  <div className="flex items-center gap-1">Uploaded <SortIcon col="uploadedAt" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8">Status</TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 text-right cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort("fileSize")}>
                  <div className="flex items-center justify-end gap-1">Size <SortIcon col="fileSize" /></div>
                </TableHead>
                <TableHead className="bg-muted/40 text-[10px] font-medium text-muted-foreground uppercase tracking-wide h-8 text-right">Line Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-28 text-center text-xs text-muted-foreground">
                    No files match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((file) => (
                  <>
                    <TableRow
                      key={file.id}
                      className="hover:bg-[color:var(--surface-hover)] transition-colors duration-75"
                    >
                      <TableCell className="py-2 max-w-[220px]">
                        <p className="text-xs font-medium truncate">{file.fileName}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{file.id}</p>
                      </TableCell>
                      <TableCell className="py-2 whitespace-nowrap">
                        <FileTypeBadge fileType={file.fileType} />
                      </TableCell>
                      <TableCell className="text-xs py-2 whitespace-nowrap">{file.brand}</TableCell>
                      <TableCell className="text-xs py-2 whitespace-nowrap text-muted-foreground">{file.mediaType}</TableCell>
                      <TableCell className="text-xs py-2 whitespace-nowrap text-muted-foreground">{file.dma}</TableCell>
                      <TableCell className="text-xs font-mono py-2 whitespace-nowrap text-muted-foreground">
                        {formatDate(file.uploadedAt)}
                      </TableCell>
                      <TableCell className="py-2 whitespace-nowrap">
                        <ProcessingStatusBadge status={file.processingStatus} />
                      </TableCell>
                      <TableCell className="text-xs font-mono py-2 text-right whitespace-nowrap text-muted-foreground">
                        {formatFileSize(file.fileSize)}
                      </TableCell>
                      <TableCell className="text-xs font-mono py-2 text-right">
                        {file.lineItemCount == null ? (
                          <span className="text-muted-foreground/50">—</span>
                        ) : (
                          file.lineItemCount.toLocaleString()
                        )}
                      </TableCell>
                    </TableRow>
                    {/* Error row expansion */}
                    {file.processingStatus === "error" &&
                      file.errorMessage &&
                      file.id !== dismissedError && (
                        <TableRow key={`${file.id}-error`} className="bg-destructive/3">
                          <TableCell colSpan={9} className="py-2 px-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                                <p className="text-[11px] text-destructive leading-relaxed">
                                  {file.errorMessage}
                                </p>
                              </div>
                              <button
                                onClick={() => setDismissedError(file.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                aria-label="Dismiss error"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Upload note */}
      <div className="flex items-start gap-2 px-1">
        <CheckCircle2 className="w-3.5 h-3.5 text-[color:var(--success)] mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Files are parsed by Claude AI. Buy plan Excel files extract line items including station, daypart, rate, and spot counts.
          Invoice PDFs are extracted via structured OCR — confidence scores above 90% are auto-matched.
        </p>
      </div>
    </div>
  );
}

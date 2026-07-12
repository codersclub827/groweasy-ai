"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Loader2,
  Upload,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { CsvPreviewTable, type CsvPreviewRow } from "@/components/upload/csv-preview-table";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type UploadStatus = "idle" | "ready" | "uploading" | "complete" | "error";

type ParsedCsvPreview = {
  columns: string[];
  rows: CsvPreviewRow[];
};

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function validateCsvFile(file: File) {
  const hasCsvExtension = file.name.toLowerCase().endsWith(".csv");
  const hasCsvMimeType =
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/csv" ||
    file.type === "";

  if (!hasCsvExtension || !hasCsvMimeType) {
    return "Please upload a valid .csv file.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File size must be 10 MB or smaller.";
  }

  if (file.size === 0) {
    return "The selected CSV file is empty.";
  }

  return null;
}

export function CsvUploadCard() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<ParsedCsvPreview | null>(null);

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"]
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: (acceptedFiles) => {
      const nextFile = acceptedFiles[0];

      if (!nextFile) {
        return;
      }

      const validationError = validateCsvFile(nextFile);

      if (validationError) {
        setError(validationError);
        setStatus("error");
        setFile(null);
        setProgress(0);
        toast({
          title: "File rejected",
          description: validationError,
          variant: "error"
        });
        return;
      }

      setFile(nextFile);
      setError(null);
      setStatus("ready");
      setProgress(0);
      setPreview(null);
      toast({
        title: "CSV selected",
        description: `${nextFile.name} is ready to preview.`,
        variant: "success"
      });
    },
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      const message =
        rejection?.errors[0]?.message === "File type must be text/csv, application/vnd.ms-excel"
          ? "Please upload a valid .csv file."
          : (rejection?.errors[0]?.message ?? "The selected file could not be uploaded.");

      setError(message);
      setStatus("error");
      setFile(null);
      setProgress(0);
      setPreview(null);
      toast({
        title: "Upload failed",
        description: message,
        variant: "error"
      });
    }
  });

  const fileDetails = useMemo(() => {
    if (!file) {
      return null;
    }

    return {
      name: file.name,
      size: formatBytes(file.size),
      modified: new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(file.lastModified)
    };
  }, [file]);

  useEffect(() => {
    if (status !== "uploading") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(intervalId);
          setStatus("complete");
          return 100;
        }

        return Math.min(current + 8, 100);
      });
    }, 120);

    return () => window.clearInterval(intervalId);
  }, [status]);

  function handleUpload() {
    if (!file) {
      setError("Choose a CSV file before starting upload.");
      setStatus("error");
      toast({
        title: "No file selected",
        description: "Browse or drop a CSV before uploading.",
        variant: "error"
      });
      return;
    }

    setError(null);
    setStatus("uploading");
    setProgress(8);
    toast({
      title: "Parsing CSV",
      description: "Generating a local preview table.",
      variant: "info"
    });

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const columns = results.meta.fields?.filter(Boolean) ?? [];
        const rows = results.data.map((row) =>
          columns.reduce<CsvPreviewRow>((normalizedRow, column) => {
            normalizedRow[column] = String(row[column] ?? "");
            return normalizedRow;
          }, {})
        );

        if (results.errors.length > 0) {
          const parseError = results.errors[0]?.message ?? "The CSV could not be parsed.";
          setError(parseError);
          setStatus("error");
          setPreview(null);
          toast({
            title: "CSV parse error",
            description: parseError,
            variant: "error"
          });
          return;
        }

        if (columns.length === 0 || rows.length === 0) {
          const emptyMessage = "The CSV needs at least one header and one data row for preview.";
          setError(emptyMessage);
          setStatus("error");
          setPreview(null);
          toast({
            title: "Preview unavailable",
            description: emptyMessage,
            variant: "error"
          });
          return;
        }

        setPreview({ columns, rows });
        toast({
          title: "Preview ready",
          description: `${rows.length.toLocaleString()} rows and ${columns.length.toLocaleString()} columns loaded.`,
          variant: "success"
        });
      },
      error: (parseError) => {
        setError(parseError.message);
        setStatus("error");
        setPreview(null);
        toast({
          title: "CSV parse error",
          description: parseError.message,
          variant: "error"
        });
      }
    });
  }

  function handleClear() {
    setFile(null);
    setError(null);
    setStatus("idle");
    setProgress(0);
    setPreview(null);
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>CSV file upload</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Drag a CSV here, browse locally, then parse a frontend preview table.
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/samples/groweasy-sample.csv" download>
                <Download className="h-4 w-4" />
                Sample CSV
              </a>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          <div
            {...getRootProps()}
            className={cn(
              "relative flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-all",
              "bg-muted/30 hover:bg-muted/50",
              isDragActive && "border-primary bg-primary/5 shadow-sm",
              (isDragReject || status === "error") && "border-destructive bg-destructive/5",
              status === "complete" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40"
            )}
          >
            <input {...getInputProps()} />

            <div className="bg-background/40 pointer-events-none absolute inset-4 rounded-lg border opacity-60" />

            <div className="relative z-10 flex max-w-md flex-col items-center">
              <div
                className={cn(
                  "bg-card mb-5 grid h-16 w-16 place-items-center rounded-lg border shadow-sm transition-transform",
                  isDragActive && "scale-105",
                  status === "uploading" && "animate-pulse"
                )}
              >
                {status === "uploading" ? (
                  <Loader2 className="text-primary h-7 w-7 animate-spin" />
                ) : status === "complete" ? (
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Upload className="text-primary h-7 w-7" />
                )}
              </div>

              <h2 className="text-xl font-semibold">
                {isDragActive ? "Drop your CSV here" : "Drag and drop your CSV"}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                Files are validated and parsed in the browser. No backend upload is performed in
                this phase.
              </p>

              <div className="mt-5 grid w-full gap-2 sm:grid-cols-2">
                <Button type="button" onClick={open} variant="outline">
                  <FileSpreadsheet className="h-4 w-4" />
                  Browse file
                </Button>
                <Button type="button" onClick={handleUpload} disabled={status === "uploading"}>
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </Button>
              </div>
            </div>
          </div>

          {fileDetails ? (
            <div className="bg-card flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-md bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{fileDetails.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {fileDetails.size} · Modified {fileDetails.modified}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove selected file</span>
              </Button>
            </div>
          ) : null}

          {status === "uploading" || status === "complete" ? (
            <div className="bg-muted/40 rounded-md border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {status === "complete" ? "Preview ready" : "Parsing preview"}
                </span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <div className="bg-border mt-3 h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          {status === "uploading" ? (
            <div className="bg-card grid gap-3 rounded-md border p-4 sm:grid-cols-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : null}

          {error ? (
            <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-md border p-4 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {preview && status === "complete" ? (
        <CsvPreviewTable columns={preview.columns} rows={preview.rows} />
      ) : null}
    </div>
  );
}

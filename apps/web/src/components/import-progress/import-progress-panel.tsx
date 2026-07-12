"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Loader2,
  PauseCircle,
  ShieldCheck,
  Timer,
  UploadCloud
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const TOTAL_ROWS = 84200;
const TOTAL_BATCHES = 12;

const pipelineSteps = [
  {
    label: "Upload received",
    description: "CSV file validated and queued.",
    icon: UploadCloud,
    completeAt: 8
  },
  {
    label: "Rows validated",
    description: "Invalid rows skipped before import.",
    icon: ShieldCheck,
    completeAt: 28
  },
  {
    label: "CRM mapping",
    description: "Batches normalized into CRM fields.",
    icon: CircleDashed,
    completeAt: 74
  },
  {
    label: "Final confirmation",
    description: "Preparing import summary.",
    icon: CheckCircle2,
    completeAt: 100
  }
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function formatDuration(seconds: number) {
  if (seconds <= 0) {
    return "Almost done";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
}

export function ImportProgressPanel() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(42);

  useEffect(() => {
    const loadingTimeoutId = window.setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Import tracking active",
        description: "Progress metrics are now updating.",
        variant: "success"
      });
    }, 700);

    const intervalId = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return 92;
        }

        return current + 1;
      });
    }, 900);

    return () => {
      window.clearTimeout(loadingTimeoutId);
      window.clearInterval(intervalId);
    };
  }, [toast]);

  const rowsProcessed = Math.round((TOTAL_ROWS * progress) / 100);
  const currentBatch = Math.min(
    TOTAL_BATCHES,
    Math.max(1, Math.ceil((TOTAL_BATCHES * progress) / 100))
  );
  const estimatedSeconds = Math.max(8, Math.round(((100 - progress) / 100) * 138));

  const currentStep = useMemo(
    () =>
      pipelineSteps.find((step) => progress < step.completeAt) ??
      pipelineSteps[pipelineSteps.length - 1],
    [progress]
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="space-y-5 p-5">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32" />
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Processing import</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Live frontend progress state for the current CSV import.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Running
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-5">
          <div className="bg-muted/30 rounded-lg border p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overall progress</p>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-normal">{progress}%</span>
                  <span className="text-muted-foreground pb-1 text-sm">complete</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm sm:flex">
                <div className="bg-card rounded-md border px-3 py-2">
                  <p className="text-muted-foreground text-xs">Current batch</p>
                  <p className="font-medium">
                    {currentBatch} / {TOTAL_BATCHES}
                  </p>
                </div>
                <div className="bg-card rounded-md border px-3 py-2">
                  <p className="text-muted-foreground text-xs">ETA</p>
                  <p className="font-medium">{formatDuration(estimatedSeconds)}</p>
                </div>
              </div>
            </div>

            <div className="bg-border mt-6 h-3 overflow-hidden rounded-full">
              <div
                className="bg-primary relative h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              >
                <span className="absolute inset-0 animate-pulse bg-white/25" />
              </div>
            </div>

            <div className="text-muted-foreground mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>
                {formatNumber(rowsProcessed)} of {formatNumber(TOTAL_ROWS)} rows processed
              </span>
              <span>{formatNumber(TOTAL_ROWS - rowsProcessed)} rows remaining</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Rows processed"
              value={formatNumber(rowsProcessed)}
              detail={`${formatNumber(TOTAL_ROWS)} total`}
            />
            <MetricCard
              label="Current batch"
              value={`${currentBatch}`}
              detail={`${TOTAL_BATCHES} batches queued`}
            />
            <MetricCard
              label="Estimated time"
              value={formatDuration(estimatedSeconds)}
              detail="Based on current pace"
            />
          </div>

          <div className="bg-card flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-md p-2">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div>
                <p className="font-medium">{currentStep.label}</p>
                <p className="text-muted-foreground text-sm">{currentStep.description}</p>
              </div>
            </div>
            <Button type="button" variant="outline" disabled>
              <PauseCircle className="h-4 w-4" />
              Cancel disabled
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Batch timeline</CardTitle>
          <p className="text-muted-foreground mt-1 text-sm">Current import stages.</p>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          {pipelineSteps.map((step) => {
            const isComplete = progress >= step.completeAt;
            const isActive = currentStep.label === step.label;

            return (
              <div key={step.label} className="flex gap-3">
                <div
                  className={cn(
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border",
                    isComplete
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                      : isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {isActive && !isComplete ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">{step.description}</p>
                </div>
              </div>
            );
          })}

          <div className="bg-muted/40 rounded-md border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Timer className="text-primary h-4 w-4" />
              Import remains active
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Cancellation is disabled while the current batch is being committed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="bg-card rounded-md border p-4 transition-transform hover:-translate-y-0.5">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{detail}</p>
    </div>
  );
}

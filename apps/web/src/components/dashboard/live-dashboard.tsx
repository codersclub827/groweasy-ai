"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDownToLine,
  BadgeCheck,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  Sparkles,
  TrendingUp,
  UploadCloud
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LiveMetric = {
  imports: number;
  rows: number;
  matches: number;
  hours: number;
  activeBatches: number;
  queue: number;
  updatedAt: Date;
};

type StatCard = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  tone: "emerald" | "sky" | "violet" | "amber";
};

const imports = [
  {
    name: "Spring leads upload",
    baseRows: 42120,
    status: "Validated",
    time: "Live"
  },
  {
    name: "Retail partner catalog",
    baseRows: 18904,
    status: "Mapping",
    time: "Now"
  },
  {
    name: "Q3 customer enrichment",
    baseRows: 76410,
    status: "Complete",
    time: "Synced"
  }
];

const checks = [
  "AI column mapping ready",
  "Duplicate detection active",
  "Schema validation enabled",
  "Export presets configured"
];

const numberFormatter = new Intl.NumberFormat("en-US");

function formatCompact(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }

  return numberFormatter.format(value);
}

function toneClass(tone: StatCard["tone"]) {
  switch (tone) {
    case "emerald":
      return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300";
    case "sky":
      return "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300";
    case "violet":
      return "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300";
    case "amber":
      return "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300";
  }
}

export function LiveDashboard() {
  const [metrics, setMetrics] = useState<LiveMetric>({
    imports: 1248,
    rows: 842000,
    matches: 96.8,
    hours: 312,
    activeBatches: 7,
    queue: 4,
    updatedAt: new Date()
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMetrics((current) => {
        const matchDelta = Math.random() * 0.28 - 0.08;
        const nextMatches = Math.min(98.6, Math.max(95.9, current.matches + matchDelta));

        return {
          imports: current.imports + Math.floor(Math.random() * 3),
          rows: current.rows + 420 + Math.floor(Math.random() * 1850),
          matches: Number(nextMatches.toFixed(1)),
          hours: current.hours + (Math.random() > 0.72 ? 1 : 0),
          activeBatches: 5 + Math.floor(Math.random() * 5),
          queue: 3 + Math.floor(Math.random() * 5),
          updatedAt: new Date()
        };
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  const stats = useMemo<StatCard[]>(
    () => [
      {
        label: "CSV imports",
        value: numberFormatter.format(metrics.imports),
        change: "+18.2%",
        icon: FileSpreadsheet,
        tone: "emerald"
      },
      {
        label: "Rows processed",
        value: formatCompact(metrics.rows),
        change: "+31.4%",
        icon: Activity,
        tone: "sky"
      },
      {
        label: "AI matches",
        value: `${metrics.matches.toFixed(1)}%`,
        change: "+4.1%",
        icon: BrainCircuit,
        tone: "violet"
      },
      {
        label: "Saved hours",
        value: numberFormatter.format(metrics.hours),
        change: "+22.9%",
        icon: Clock3,
        tone: "amber"
      }
    ],
    [metrics]
  );

  const updatedAt = metrics.updatedAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return (
    <DashboardShell>
      <section className="space-y-6" aria-live="polite">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI importer workspace
            </Badge>
            <div>
              <h1 className="text-foreground text-2xl font-semibold tracking-normal sm:text-3xl">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Monitor live imports, mapping quality, and CSV processing performance from one
                polished command center.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="bg-card rounded-md border px-3 py-2 text-sm shadow-sm">
              <p className="text-muted-foreground text-xs">Plan</p>
              <p className="font-medium">Growth Pro</p>
            </div>
            <div className="bg-card rounded-md border px-3 py-2 text-sm shadow-sm">
              <p className="text-muted-foreground text-xs">Live sync</p>
              <p className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {updatedAt}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <div className={`rounded-md p-2 ${toneClass(stat.tone)}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold tabular-nums">{stat.value}</div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Recent imports</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Current CSV workflows and their processing state.
                  </p>
                </div>
                <Badge variant="outline" className="w-fit gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  Live queue
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {imports.map((item, index) => {
                  const liveRows =
                    item.baseRows + Math.round((metrics.rows - 842000) / (index + 3));

                  return (
                    <div
                      key={item.name}
                      className="hover:bg-muted/40 grid gap-3 px-5 py-4 transition-colors sm:grid-cols-[1fr_auto_auto] sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md border p-2">
                          <UploadCloud className="text-muted-foreground h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-muted-foreground text-sm tabular-nums">
                            {numberFormatter.format(liveRows)} rows
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={item.status === "Mapping" ? "secondary" : "default"}
                        className="w-fit"
                      >
                        {item.status}
                      </Badge>
                      <p className="text-muted-foreground text-sm sm:text-right">{item.time}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Importer readiness</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Core states prepared for a production SaaS workflow.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {checks.map((check) => (
                <div key={check} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium">{check}</span>
                </div>
              ))}
              <div className="bg-muted/50 rounded-md border p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BadgeCheck className="text-primary h-4 w-4" />
                  Live frontend metrics
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  Dashboard values refresh automatically while backend integrations remain
                  untouched.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="grid gap-4 p-5 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Active batches</p>
              <p className="text-muted-foreground text-sm tabular-nums">
                {metrics.activeBatches} batches currently processing.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Export queue</p>
              <p className="text-muted-foreground text-sm tabular-nums">
                {metrics.queue} files awaiting review.
              </p>
            </div>
            <div className="text-primary flex items-center gap-2 text-sm font-medium">
              <ArrowDownToLine className="h-4 w-4" />
              Download-ready layout states
            </div>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}

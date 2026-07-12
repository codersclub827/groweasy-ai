import { BarChart3, Clock3, Download, FileCheck2, FileX2, Percent, Sparkles } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  ResultsDownloadActions,
  ResultsTable,
  type ResultRow
} from "@/components/results/results-dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const importedRows: ResultRow[] = [
  {
    id: "IMP-001",
    name: "Ava Patel",
    email: "ava.patel@example.com",
    company: "Northstar Retail",
    status: "Imported",
    detail: "Mapped to contact"
  },
  {
    id: "IMP-002",
    name: "Marcus Lee",
    email: "marcus.lee@example.com",
    company: "Greenline Foods",
    status: "Imported",
    detail: "Mapped to lead"
  },
  {
    id: "IMP-003",
    name: "Sofia Ramirez",
    email: "sofia.ramirez@example.com",
    company: "Atlas Cloud",
    status: "Imported",
    detail: "Mapped to account"
  },
  {
    id: "IMP-004",
    name: "Noah Chen",
    email: "noah.chen@example.com",
    company: "BrightPath Labs",
    status: "Imported",
    detail: "Mapped to contact"
  },
  {
    id: "IMP-005",
    name: "Mira Shah",
    email: "mira.shah@example.com",
    company: "TerraPulse",
    status: "Imported",
    detail: "Mapped to lead"
  },
  {
    id: "IMP-006",
    name: "Elena Brooks",
    email: "elena.brooks@example.com",
    company: "SummitOps",
    status: "Imported",
    detail: "Mapped to contact"
  }
];

const skippedRows: ResultRow[] = [
  {
    id: "SKP-001",
    name: "Row 14",
    email: "missing-email",
    company: "Unknown",
    status: "Skipped",
    detail: "Invalid email format"
  },
  {
    id: "SKP-002",
    name: "Row 27",
    email: "",
    company: "Empty Record",
    status: "Skipped",
    detail: "Required fields missing"
  },
  {
    id: "SKP-003",
    name: "Row 48",
    email: "duplicate@example.com",
    company: "Duplicate Co",
    status: "Skipped",
    detail: "Potential duplicate"
  }
];

const importedCount = importedRows.length;
const skippedCount = skippedRows.length;
const totalRows = importedCount + skippedCount;
const successRate = Math.round((importedCount / totalRows) * 100);

const summaryCards = [
  {
    label: "Imported",
    value: importedCount.toLocaleString(),
    detail: "Rows committed",
    icon: FileCheck2,
    tone: "emerald"
  },
  {
    label: "Skipped",
    value: skippedCount.toLocaleString(),
    detail: "Rows excluded",
    icon: FileX2,
    tone: "rose"
  },
  {
    label: "Success rate",
    value: `${successRate}%`,
    detail: `${importedCount} of ${totalRows} rows`,
    icon: Percent,
    tone: "sky"
  },
  {
    label: "Processing time",
    value: "1m 42s",
    detail: "End-to-end import",
    icon: Clock3,
    tone: "amber"
  }
];

export default function ResultsPage() {
  return (
    <DashboardShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Import completed
            </Badge>
            <div>
              <h1 className="text-foreground text-2xl font-semibold tracking-normal sm:text-3xl">
                Results Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Review imported and skipped rows, search results, and export the finished import
                summary.
              </p>
            </div>
          </div>

          <ResultsDownloadActions importedRows={importedRows} skippedRows={skippedRows} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {card.label}
                </CardTitle>
                <div
                  className={
                    card.tone === "emerald"
                      ? "rounded-md bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                      : card.tone === "rose"
                        ? "rounded-md bg-rose-50 p-2 text-rose-600 dark:bg-rose-950 dark:text-rose-300"
                        : card.tone === "sky"
                          ? "rounded-md bg-sky-50 p-2 text-sky-600 dark:bg-sky-950 dark:text-sky-300"
                          : "rounded-md bg-amber-50 p-2 text-amber-600 dark:bg-amber-950 dark:text-amber-300"
                  }
                >
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{card.value}</div>
                <p className="text-muted-foreground mt-2 text-xs">{card.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-md p-2">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Import summary ready</p>
                <p className="text-muted-foreground text-sm">
                  Exported files include both imported and skipped row details.
                </p>
              </div>
            </div>
            <div className="text-primary flex items-center gap-2 text-sm font-medium">
              <Download className="h-4 w-4" />
              CSV and JSON downloads available
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-2">
          <ResultsTable
            title="Imported rows"
            description="Rows successfully committed to CRM."
            rows={importedRows}
          />
          <ResultsTable
            title="Skipped rows"
            description="Rows excluded during validation."
            rows={skippedRows}
          />
        </div>
      </section>
    </DashboardShell>
  );
}

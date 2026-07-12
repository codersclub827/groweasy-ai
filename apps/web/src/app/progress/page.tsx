import { Activity, Clock3, DatabaseZap, Sparkles } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ImportProgressPanel } from "@/components/import-progress/import-progress-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const queueStats = [
  {
    label: "Import mode",
    value: "Batch processing",
    icon: DatabaseZap
  },
  {
    label: "Queue status",
    value: "In progress",
    icon: Activity
  },
  {
    label: "Target finish",
    value: "Under 2 min",
    icon: Clock3
  }
];

export default function ImportProgressPage() {
  return (
    <DashboardShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Import pipeline
            </Badge>
            <div>
              <h1 className="text-foreground text-2xl font-semibold tracking-normal sm:text-3xl">
                Import Progress
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Track CSV processing as batches move through validation, mapping, and confirmation.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-md border px-3 py-2 text-sm shadow-sm">
            <p className="text-muted-foreground text-xs">Run ID</p>
            <p className="font-medium">IMP-2407-018</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {queueStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-5">
                <div className="bg-primary/10 text-primary rounded-md p-2">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="font-medium">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ImportProgressPanel />
      </section>
    </DashboardShell>
  );
}

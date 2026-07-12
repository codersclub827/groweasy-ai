import { FileSpreadsheet, ShieldCheck, Sparkles } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CsvUploadCard } from "@/components/upload/csv-upload-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const validationItems = [
  "CSV files only",
  "Maximum file size: 10 MB",
  "Header row recommended",
  "Local validation only"
];

export default function UploadPage() {
  return (
    <DashboardShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              CSV upload workspace
            </Badge>
            <div>
              <h1 className="text-foreground text-2xl font-semibold tracking-normal sm:text-3xl">
                Upload CSV
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                Drop a customer, lead, or product CSV into a polished upload flow with instant
                frontend validation.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-md border px-3 py-2 text-sm shadow-sm">
            <p className="text-muted-foreground text-xs">Mode</p>
            <p className="font-medium">Frontend preview</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <CsvUploadCard />

          <div className="space-y-4">
            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Validation rules</p>
                    <p className="text-muted-foreground text-sm">Checked before upload starts.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {validationItems.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm">
                      <span className="bg-primary h-2 w-2 rounded-full" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-sky-50 p-2 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Expected CSV shape</p>
                    <p className="text-muted-foreground text-sm">Clean headers improve mapping.</p>
                  </div>
                </div>
                <div className="bg-muted/50 text-muted-foreground rounded-md border p-3 font-mono text-xs">
                  first_name,last_name,email,company
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

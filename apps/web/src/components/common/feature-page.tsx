import type { LucideIcon } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeaturePageProps = {
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  cards: Array<{
    title: string;
    description: string;
    value: string;
  }>;
};

export function FeaturePage({ badge, title, description, icon: Icon, cards }: FeaturePageProps) {
  return (
    <DashboardShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {badge}
            </Badge>
            <div>
              <h1 className="text-foreground text-2xl font-semibold tracking-normal sm:text-3xl">
                {title}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
                {description}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-md border px-3 py-2 text-sm shadow-sm">
            <p className="text-muted-foreground text-xs">Status</p>
            <p className="font-medium text-emerald-600 dark:text-emerald-400">Ready</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="pb-3">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">{card.value}</p>
                <p className="text-muted-foreground mt-2 text-sm leading-6">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-md p-2">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{title} workspace</p>
                <p className="text-muted-foreground text-sm">
                  This page is connected to navigation and ready for the next production workflow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}

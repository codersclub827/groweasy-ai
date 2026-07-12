import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-muted/30 flex flex-col items-center justify-center rounded-md border border-dashed px-6 py-10 text-center",
        className
      )}
    >
      <div className="bg-card text-muted-foreground grid h-11 w-11 place-items-center rounded-md border shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6">{description}</p>
    </div>
  );
}

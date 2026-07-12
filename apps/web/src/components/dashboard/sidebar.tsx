"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  ChevronRight,
  FileSpreadsheet,
  Home,
  Layers3,
  ListChecks,
  Settings,
  ShieldCheck,
  Timer,
  UploadCloud,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppRoute =
  | "/"
  | "/upload"
  | "/progress"
  | "/results"
  | "/library"
  | "/mapping"
  | "/analytics"
  | "/templates"
  | "/security"
  | "/settings";

type NavItem =
  | {
      label: string;
      href: AppRoute;
      icon: LucideIcon;
    }
  | {
      label: string;
      icon: LucideIcon;
      href?: never;
    };

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Upload CSV", href: "/upload", icon: UploadCloud },
  { label: "Import Progress", href: "/progress", icon: Timer },
  { label: "Results", href: "/results", icon: ListChecks },
  { label: "CSV Library", href: "/library", icon: FileSpreadsheet },
  { label: "AI Mapping", href: "/mapping", icon: Bot },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Templates", href: "/templates", icon: Layers3 }
];

const lowerNav = [
  { label: "Security", href: "/security", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings }
] satisfies Array<{ label: string; href: AppRoute; icon: LucideIcon }>;

function isLinkedNavItem(item: NavItem): item is Extract<NavItem, { href: AppRoute }> {
  return item.href !== undefined;
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "bg-foreground/20 fixed inset-0 z-40 backdrop-blur-sm transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "bg-card fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-200 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground grid h-9 w-9 place-items-center rounded-md shadow-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">GrowEasy</p>
              <p className="text-muted-foreground mt-1 text-xs">CSV Importer</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close navigation</span>
          </Button>
        </div>

        <nav className="flex-1 space-y-6 px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isLinked = isLinkedNavItem(item);
              const isActive = isLinked && pathname === item.href;
              const itemClassName = cn(
                "flex h-10 w-full items-center justify-between rounded-md px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              );

              if (isLinked) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className={itemClassName}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {isActive ? <ChevronRight className="h-4 w-4" /> : null}
                  </Link>
                );
              }

              return (
                <button key={item.label} type="button" className={itemClassName}>
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1 border-t pt-4">
            {lowerNav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {isActive ? <ChevronRight className="h-4 w-4" /> : null}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t p-4">
          <div className="bg-muted/50 rounded-md border p-3">
            <p className="text-sm font-medium">Import capacity</p>
            <div className="bg-border mt-3 h-2 rounded-full">
              <div className="bg-primary h-2 w-3/4 rounded-full" />
            </div>
            <p className="text-muted-foreground mt-2 text-xs">75% of monthly rows used</p>
          </div>
        </div>
      </aside>
    </>
  );
}

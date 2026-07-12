"use client";

import { Bell, Menu, Search } from "lucide-react";

import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Button } from "@/components/ui/button";

type TopNavbarProps = {
  onMenuClick: () => void;
};

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <header className="bg-background/85 sticky top-0 z-30 border-b backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>

        <div className="hidden min-w-0 flex-1 md:block">
          <div className="relative max-w-md">
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              className="bg-card placeholder:text-muted-foreground focus:border-ring focus:ring-ring/20 h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2"
              placeholder="Search imports, templates, mappings..."
              type="search"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 md:hidden">
          <p className="truncate text-sm font-semibold">GrowEasy Dashboard</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="hidden sm:inline-flex">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <div className="bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold">
            GE
          </div>
        </div>
      </div>
    </header>
  );
}

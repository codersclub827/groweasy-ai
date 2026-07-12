"use client";

import { CheckCircle2, Info, X, XCircle, type LucideIcon } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type Toast = ToastInput & {
  id: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<
  ToastVariant,
  {
    icon: LucideIcon;
    className: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    className:
      "border-emerald-500/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
  },
  error: {
    icon: XCircle,
    className: "border-destructive/30 bg-destructive/10 text-destructive"
  },
  info: {
    icon: Info,
    className: "border-sky-500/30 bg-sky-50 text-sky-900 dark:bg-sky-950 dark:text-sky-100"
  }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      const nextToast: Toast = {
        ...input,
        id,
        variant: input.variant ?? "info"
      };

      setToasts((currentToasts) => [nextToast, ...currentToasts].slice(0, 4));
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  const contextValue = useMemo<ToastContextValue>(() => ({ toast: showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed right-4 top-4 z-[70] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6">
        {toasts.map((toast) => {
          const styles = variantStyles[toast.variant];
          const Icon = styles.icon;

          return (
            <div
              key={toast.id}
              className={cn(
                "shadow-foreground/5 rounded-lg border p-4 shadow-lg backdrop-blur transition-all",
                styles.className
              )}
            >
              <div className="flex gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm leading-5 opacity-80">{toast.description}</p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-70 hover:opacity-100"
                  onClick={() => dismissToast(toast.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss notification</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}

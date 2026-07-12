import type { Metadata } from "next";

import { ToastProvider } from "@/components/ui/toast";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "GrowEasy AI CSV Importer",
  description: "Premium dashboard for AI-assisted CSV imports."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

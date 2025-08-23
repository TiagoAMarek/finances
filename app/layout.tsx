"use client";

import { AppLayout, ThemeProvider } from "@/features/shared/components";
import { Toaster } from "@/features/shared/components/ui";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "../lib/query-provider";
import { MSWProvider } from "../src/components/MSWProvider";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <MSWProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <QueryProvider>
              <AppLayout>
                {children}
                <Analytics />
              </AppLayout>
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </MSWProvider>
      </body>
    </html>
  );
}

"use client";

import '../styles/globals.css';
import { QueryProvider } from '../lib/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { AppLayout } from '@/components/AppLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
"use client";

import '../styles/globals.css';
import { QueryProvider } from '../lib/query-provider';
import Navbar from '@/components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
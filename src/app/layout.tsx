'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (!mounted) return null;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <title>Controle AEE</title>
        <meta name="description" content="Sistema de controle e gestão de Atendimento Educacional Especializado" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}

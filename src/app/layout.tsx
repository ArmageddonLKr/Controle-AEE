import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Controle AEE",
  description: "Sistema de Controle do Atendimento Educacional Especializado",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 ml-60 p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

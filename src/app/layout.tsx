import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Toaster } from "@/components/ui/toaster";
import { TemaProvider } from "@/lib/theme";
import { ClientInit } from "@/components/ClientInit";
import { PageTransition } from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "Controle AEE",
  description: "Sistema de gestão para psicóloga do Atendimento Educacional Especializado",
  manifest: "/Controle-AEE/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Controle AEE",
  },
  icons: {
    icon: "/Controle-AEE/icons/icon-192.png",
    apple: "/Controle-AEE/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <TemaProvider>
          <div
            className="flex min-h-screen"
            style={{ backgroundColor: "var(--bg-primary)" }}
          >
            {/* Sidebar — visível apenas em telas médias e maiores */}
            <Sidebar />

            {/* Conteúdo principal */}
            <main
              className="flex-1 min-h-screen
                         pb-[76px] md:pb-0
                         md:ml-[240px]
                         px-4 py-5
                         md:px-8 md:py-8"
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div className="max-w-7xl mx-auto w-full">
                <PageTransition>{children}</PageTransition>
              </div>
            </main>
          </div>

          {/* Bottom nav — visível apenas em mobile */}
          <MobileNav />

          <Toaster />
          <ClientInit />
        </TemaProvider>
      </body>
    </html>
  );
}

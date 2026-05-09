import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { TemaProvider } from "@/lib/theme";
import { ClientInit } from "@/components/ClientInit";

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
          <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
            <Sidebar />
            <main
              className="flex-1 min-h-screen"
              style={{
                marginLeft: "240px",
                padding: "2rem",
                backgroundColor: "var(--bg-primary)",
              }}
            >
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
          <Toaster />
          <ClientInit />
        </TemaProvider>
      </body>
    </html>
  );
}

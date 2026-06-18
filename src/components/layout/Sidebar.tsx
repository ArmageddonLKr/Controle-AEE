"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTema } from "@/lib/theme";

const navItems = [
  { href: "/",           label: "Início",      icone: LayoutDashboard },
  { href: "/alunos",     label: "Crianças",    icone: Users },
  { href: "/reunioes",   label: "Reuniões",    icone: Handshake },
  { href: "/calendario", label: "Calendário",  icone: Calendar },
  { href: "/relatorios", label: "Relatórios",  icone: BarChart3 },
  { href: "/configuracoes", label: "Configurações", icone: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { tema, alternarTema } = useTema();

  const estaAtivo = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full flex-col z-40 sidebar-aee"
      style={{ width: "240px" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <img
          src="/Controle-AEE/logo.svg"
          alt="Controle AEE"
          width={36}
          height={36}
          className="rounded-lg"
          style={{ background: "var(--sidebar-hover)", padding: "4px" }}
        />
        <div>
          <p className="text-sm font-bold leading-tight" style={{ color: "var(--sidebar-fg)" }}>
            Controle AEE
          </p>
          <p className="text-xs" style={{ color: "var(--sidebar-fg-muted)" }}>
            Gestão Educacional
          </p>
        </div>
      </div>

      {/* Perfil — avatar usa a cor de destaque do tema */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="flex items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
          }}
        >
          RD
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--sidebar-fg)" }}>
            Rafaela Dias
          </p>
          <p className="text-xs" style={{ color: "var(--sidebar-fg-muted)", lineHeight: 1.3 }}>
            Atendimento Educacional Especializado
          </p>
        </div>
      </div>

      {/* Navegação — item ativo usa a cor de destaque escolhida nas configurações */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" role="navigation" aria-label="Menu principal">
        {navItems.map((item) => {
          const Icone = item.icone;
          const ativo = estaAtivo(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                !ativo && "sidebar-link"
              )}
              style={
                ativo
                  ? {
                      backgroundColor: "var(--sidebar-hover)",
                      color: "var(--accent-primary)",
                      borderLeft: "3px solid var(--accent-primary)",
                      paddingLeft: "calc(0.75rem - 3px)",
                    }
                  : {}
              }
              aria-current={ativo ? "page" : undefined}
            >
              <Icone className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé com toggle de tema */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        <p className="text-xs" style={{ color: "var(--sidebar-fg-muted)" }}>
          v2.0
        </p>
        <button
          onClick={alternarTema}
          className="flex items-center justify-center rounded-lg p-2 transition-all duration-200"
          style={{ minWidth: 36, minHeight: 36, background: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--sidebar-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={tema === "claro" ? "Ativar tema escuro" : "Ativar tema claro"}
          aria-label="Alternar tema"
        >
          {tema === "claro" ? (
            <Moon className="h-4 w-4" style={{ color: "var(--sidebar-fg-muted)" }} />
          ) : (
            <Sun className="h-4 w-4 text-yellow-400" />
          )}
        </button>
      </div>
    </aside>
  );
}

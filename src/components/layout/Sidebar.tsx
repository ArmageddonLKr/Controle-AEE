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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTema } from "@/lib/theme";

const navItems = [
  { href: "/", label: "Início", icone: LayoutDashboard },
  { href: "/alunos", label: "Crianças", icone: Users },
  { href: "/calendario", label: "Calendário", icone: Calendar },
  { href: "/relatorios", label: "Relatórios", icone: BarChart3 },
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
      className="fixed left-0 top-0 h-full flex flex-col z-40 sidebar-aee"
      style={{ width: "240px" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <img
          src="/Controle-AEE/logo.svg"
          alt="Controle AEE"
          width={36}
          height={36}
          className="rounded-lg"
          style={{ background: "rgba(255,255,255,0.1)", padding: "4px" }}
        />
        <div>
          <p className="text-sm font-bold text-white leading-tight">Controle AEE</p>
          <p className="text-xs" style={{ color: "rgba(168, 196, 216, 0.7)" }}>
            Gestão Educacional
          </p>
        </div>
      </div>

      {/* Perfil da psicóloga */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #4A9EBF, #6EC6CA)",
          }}
        >
          RD
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">Rafaela Dias</p>
          <p className="text-xs truncate" style={{ color: "rgba(168, 196, 216, 0.7)" }}>
            Psicóloga
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icone = item.icone;
          const ativo = estaAtivo(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                ativo
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              )}
              style={
                ativo
                  ? {
                      backgroundColor: "rgba(74, 158, 191, 0.25)",
                      color: "#6EC6CA",
                      borderLeft: "3px solid #4A9EBF",
                    }
                  : {}
              }
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
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs" style={{ color: "rgba(168, 196, 216, 0.5)" }}>
          v1.0
        </p>
        <button
          onClick={alternarTema}
          className="flex items-center justify-center rounded-lg p-2 transition-all duration-200 hover:bg-white/10"
          title={tema === "claro" ? "Ativar tema escuro" : "Ativar tema claro"}
          aria-label="Alternar tema"
        >
          {tema === "claro" ? (
            <Moon className="h-4 w-4" style={{ color: "rgba(168, 196, 216, 0.7)" }} />
          ) : (
            <Sun className="h-4 w-4 text-yellow-400" />
          )}
        </button>
      </div>
    </aside>
  );
}

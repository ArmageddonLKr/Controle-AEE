"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Handshake,
} from "lucide-react";

const navItems = [
  { href: "/",              label: "Início",     icone: LayoutDashboard },
  { href: "/alunos",        label: "Crianças",   icone: Users },
  { href: "/reunioes",      label: "Reuniões",   icone: Handshake },
  { href: "/calendario",    label: "Calendário", icone: Calendar },
  { href: "/relatorios",    label: "Relatórios", icone: BarChart3 },
  { href: "/configuracoes", label: "Config.",    icone: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  const estaAtivo = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bottom-nav-aee md:hidden" role="navigation" aria-label="Navegação principal">
      {navItems.map((item) => {
        const Icone = item.icone;
        const ativo = estaAtivo(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="bottom-nav-item"
            aria-current={ativo ? "page" : undefined}
            style={ativo ? {
              color: "var(--accent-primary)",
              background: "var(--sidebar-hover)",
            } : {}}
          >
            <Icone size={19} strokeWidth={ativo ? 2.5 : 1.8} />
            <span style={{ fontSize: "0.55rem" }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/",              label: "Início",       icone: LayoutDashboard },
  { href: "/alunos",        label: "Crianças",     icone: Users },
  { href: "/calendario",    label: "Calendário",   icone: Calendar },
  { href: "/relatorios",    label: "Relatórios",   icone: BarChart3 },
  { href: "/configuracoes", label: "Config.",      icone: Settings },
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
            className={`bottom-nav-item${ativo ? " ativo" : ""}`}
            aria-current={ativo ? "page" : undefined}
          >
            <Icone size={20} strokeWidth={ativo ? 2.5 : 1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

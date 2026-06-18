"use client";

import React from "react";
import Link from "next/link";
import { differenceInYears } from "date-fns";
import type { Crianca } from "@/types";
import { diasAteAniversario } from "@/lib/utils/birthday";
import { parseDataLocal } from "@/lib/utils/date";

// ---------------------------------------------------------------------------
// Paleta de cores determinística para o avatar (vibrantes, mas não gritantes)
// ---------------------------------------------------------------------------
const AVATAR_COLORS: { bg: string; text: string }[] = [
  { bg: "#4A9EBF", text: "#FFFFFF" }, // cerulean
  { bg: "#6EC6CA", text: "#FFFFFF" }, // teal
  { bg: "#7B61FF", text: "#FFFFFF" }, // violeta
  { bg: "#F0A500", text: "#FFFFFF" }, // âmbar
  { bg: "#2ECC8E", text: "#FFFFFF" }, // verde-água
  { bg: "#E05577", text: "#FFFFFF" }, // rosa-framboesa
  { bg: "#5B8AF0", text: "#FFFFFF" }, // azul-índigo
  { bg: "#9B59B6", text: "#FFFFFF" }, // roxo suave
];

/** Escolhe a cor pelo somatório dos char codes do nome % 8 */
function avatarColorParaNome(nome: string): { bg: string; text: string } {
  const soma = [...nome].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[soma % AVATAR_COLORS.length];
}

/** Retorna as 2 primeiras iniciais do nome completo */
function iniciaisDoNome(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

// ---------------------------------------------------------------------------
// Badge de status
// ---------------------------------------------------------------------------
function BadgeStatus({ status }: { status: Crianca["status"] }) {
  const classMap: Record<Crianca["status"], string> = {
    ativo: "badge-ativo",
    espera: "badge-espera",
    inativo: "badge-inativo",
  };
  const labelMap: Record<Crianca["status"], string> = {
    ativo: "Ativo",
    espera: "Em espera",
    inativo: "Inativo",
  };
  return (
    <span
      className={`${classMap[status]} inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium`}
    >
      {labelMap[status]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Badge de diagnóstico
// ---------------------------------------------------------------------------
function BadgeDiagnostico({ texto }: { texto: string }) {
  return (
    <span
      className="rounded-lg px-2.5 py-1 text-xs font-medium"
      style={{
        display: "inline-block",
        maxWidth: "100%",
        backgroundColor: "var(--accent-light)",
        color: "var(--accent-primary)",
        border: "1px solid var(--accent-primary)",
      }}
    >
      {/* Diagnósticos longos são limitados a 2 linhas para caberem no card */}
      <span
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.35,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {texto}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Props do componente
// ---------------------------------------------------------------------------
interface AlunoCardProps {
  crianca: Crianca;
  /** Para stagger animation via animationDelay no CSS */
  style?: React.CSSProperties;
}

// ---------------------------------------------------------------------------
// AlunoCard
// ---------------------------------------------------------------------------
export function AlunoCard({ crianca, style }: AlunoCardProps) {
  const { bg, text } = avatarColorParaNome(crianca.nome);
  const iniciais = iniciaisDoNome(crianca.nome);

  const idade = differenceInYears(new Date(), parseDataLocal(crianca.dataNascimento));
  const diasAniv = diasAteAniversario(crianca.dataNascimento);
  const aniversarioProximo = diasAniv <= 7;
  const aniversarioHoje = diasAniv === 0;

  const diagnosticoPrincipal = crianca.diagnosticos[0] ?? null;

  return (
    <Link href={`/alunos/perfil/?id=${crianca.id}`} className="block group">
      <article
        className={`card-aee fade-slide-up relative flex flex-col gap-3 p-4 cursor-pointer${
          aniversarioProximo ? " birthday-border" : ""
        }`}
        style={{
          /* borda dourada animada sobrepõe a borda padrão quando há aniversário */
          border: aniversarioProximo
            ? "2px solid #F0A500"
            : "1px solid var(--border)",
          ...style,
        }}
      >
        {/* Ícone de aniversário — exibido somente quando próximo */}
        {aniversarioProximo && (
          <span
            className="absolute top-3 right-3 text-base"
            title={
              aniversarioHoje
                ? "Aniversário hoje!"
                : `Aniversário em ${diasAniv} dia${diasAniv !== 1 ? "s" : ""}!`
            }
          >
            🎂
          </span>
        )}

        {/* Avatar + informações principais */}
        <div className="flex items-center gap-3">
          {/* Avatar circular */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-full font-bold text-sm select-none"
            style={{
              width: 48,
              height: 48,
              backgroundColor: bg,
              color: text,
              letterSpacing: "0.03em",
            }}
            aria-hidden="true"
          >
            {iniciais}
          </div>

          {/* Nome + idade + status */}
          <div className="min-w-0 flex-1">
            <p
              className="font-bold text-sm leading-tight truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {crianca.nome}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {idade} {idade === 1 ? "ano" : "anos"}
            </p>
          </div>

          {/* Badge de status */}
          <BadgeStatus status={crianca.status} />
        </div>

        {/* Diagnóstico principal */}
        {diagnosticoPrincipal && (
          <div>
            <BadgeDiagnostico texto={diagnosticoPrincipal} />
          </div>
        )}

        {/* Escola e turma */}
        <p
          className="text-xs leading-snug"
          style={{ color: "var(--text-secondary)" }}
        >
          {crianca.escola}
          {crianca.turma ? ` — ${crianca.turma}` : ""}
        </p>

        {/* "Ver perfil" — aparece no hover via Tailwind group */}
        <div
          className="mt-1 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "var(--accent-primary)" }}
        >
          Ver perfil
          <span aria-hidden="true"> →</span>
        </div>
      </article>
    </Link>
  );
}

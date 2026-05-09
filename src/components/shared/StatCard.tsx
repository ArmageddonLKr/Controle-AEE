// StatCard — card de estatística para o dashboard
// Apenas informativo, sem interatividade

import React from "react";

// ---------------------------------------------------------------------------
// Mapa de cores para o círculo do ícone
// ---------------------------------------------------------------------------
const COR_MAP = {
  azul: {
    circulo: "#E0F4F8",           // accent-light claro
    icone: "#4A9EBF",             // accent-primary
  },
  verde: {
    circulo: "#D4F5E7",
    icone: "#2ECC8E",             // --success
  },
  ambar: {
    circulo: "#FFF3CC",
    icone: "#F0A500",             // --warning
  },
  roxo: {
    circulo: "#EDE9FE",
    icone: "#7B61FF",
  },
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface StatCardProps {
  titulo: string;
  valor: string | number;
  icone: React.ReactNode;
  descricao?: string;
  cor?: keyof typeof COR_MAP;
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export function StatCard({
  titulo,
  valor,
  icone,
  descricao,
  cor = "azul",
}: StatCardProps) {
  const { circulo, icone: iconeColor } = COR_MAP[cor];

  return (
    <div
      className="card-aee flex items-start gap-4 p-5"
      /* Sem hover interativo — card puramente informativo */
    >
      {/* Círculo colorido com ícone */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 48,
          height: 48,
          backgroundColor: circulo,
          color: iconeColor,
        }}
        aria-hidden="true"
      >
        {icone}
      </div>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        {/* Valor grande */}
        <p
          className="text-2xl font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {valor}
        </p>

        {/* Título */}
        <p
          className="text-sm font-medium mt-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {titulo}
        </p>

        {/* Descrição opcional */}
        {descricao && (
          <p
            className="text-xs mt-1 leading-snug"
            style={{ color: "var(--text-muted)" }}
          >
            {descricao}
          </p>
        )}
      </div>
    </div>
  );
}

// StatCard — card de estatística do Início.
// Segure o dedo no card (ou clique com o botão direito no computador) para
// abrir o seletor de cor. A cor escolhida vale para TODOS os cards.
"use client";

import React, { useRef, useState } from "react";
import { useTema } from "@/lib/theme";

// ---------------------------------------------------------------------------
// Cores padrão (variadas) usadas quando a Rafaela não escolheu uma cor única
// ---------------------------------------------------------------------------
const COR_MAP = {
  azul:  { circulo: "#E0F4F8", icone: "#4A9EBF" },
  verde: { circulo: "#D4F5E7", icone: "#2ECC8E" },
  ambar: { circulo: "#FFF3CC", icone: "#F0A500" },
  roxo:  { circulo: "#EDE9FE", icone: "#7B61FF" },
} as const;

// Tons fortes e fáceis de enxergar para o seletor rápido
const PRESETS_CARDS = [
  { nome: "Azul",  cor: "#1E6FB8" },
  { nome: "Verde", cor: "#0E7C66" },
  { nome: "Âmbar", cor: "#B45309" },
  { nome: "Roxo",  cor: "#6D28D9" },
  { nome: "Rosa",  cor: "#BE185D" },
];

/** Converte #rrggbb + alfa em rgba() para o fundo claro do círculo */
function hexParaRgba(hex: string, alfa: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
}

export interface StatCardProps {
  titulo: string;
  valor: string | number;
  icone: React.ReactNode;
  descricao?: string;
  cor?: keyof typeof COR_MAP;
}

export function StatCard({ titulo, valor, icone, descricao, cor = "azul" }: StatCardProps) {
  const { corCards, definirCorCards } = useTema();
  const [seletorAberto, setSeletorAberto] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inicioRef = useRef<{ x: number; y: number } | null>(null);

  // Cor efetiva: a escolhida (vale para todos) ou a cor variada padrão
  const circulo = corCards ? hexParaRgba(corCards, 0.16) : COR_MAP[cor].circulo;
  const iconeColor = corCards ?? COR_MAP[cor].icone;

  function limparTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function aoPressionar(e: React.PointerEvent) {
    inicioRef.current = { x: e.clientX, y: e.clientY };
    limparTimer();
    timerRef.current = setTimeout(() => setSeletorAberto(true), 500);
  }

  function aoMover(e: React.PointerEvent) {
    // Se o dedo deslizar (rolagem), cancela o long-press
    if (!inicioRef.current) return;
    const dx = Math.abs(e.clientX - inicioRef.current.x);
    const dy = Math.abs(e.clientY - inicioRef.current.y);
    if (dx > 10 || dy > 10) limparTimer();
  }

  function escolher(c: string | null) {
    definirCorCards(c);
    setSeletorAberto(false);
  }

  return (
    <div
      className="card-aee flex items-start gap-4 p-5 relative"
      style={{ touchAction: "pan-y" }}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={limparTimer}
      onPointerCancel={limparTimer}
      onPointerLeave={limparTimer}
      onContextMenu={(e) => { e.preventDefault(); setSeletorAberto(true); }}
      title="Segure para mudar a cor dos cards"
    >
      {/* Círculo colorido com ícone */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 48, height: 48, backgroundColor: circulo, color: iconeColor }}
        aria-hidden="true"
      >
        {icone}
      </div>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
          {valor}
        </p>
        <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {titulo}
        </p>
        {descricao && (
          <p className="text-xs mt-1 leading-snug" style={{ color: "var(--text-muted)" }}>
            {descricao}
          </p>
        )}
      </div>

      {/* Seletor de cor (abre no long-press) */}
      {seletorAberto && (
        <>
          {/* Fundo para fechar ao tocar fora */}
          <div
            className="fixed inset-0 z-40"
            onPointerDown={(e) => { e.stopPropagation(); setSeletorAberto(false); }}
          />
          <div
            className="absolute z-50 left-3 top-3 rounded-xl p-3"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
              minWidth: 220,
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <p className="text-xs font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Cor dos cards
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Padrão (cores variadas) */}
              <button
                onClick={() => escolher(null)}
                title="Cores variadas (padrão)"
                className="rounded-full text-[10px] font-bold px-2 h-7"
                style={{
                  border: corCards === null ? "2px solid var(--accent-primary)" : "1px solid var(--border)",
                  color: corCards === null ? "var(--accent-primary)" : "var(--text-secondary)",
                  background: "transparent",
                }}
              >
                Padrão
              </button>
              {PRESETS_CARDS.map((p) => (
                <button
                  key={p.cor}
                  onClick={() => escolher(p.cor)}
                  title={p.nome}
                  aria-label={`Cor ${p.nome}`}
                  className="rounded-full"
                  style={{
                    width: 28,
                    height: 28,
                    background: p.cor,
                    border: corCards?.toLowerCase() === p.cor.toLowerCase()
                      ? "3px solid var(--text-primary)"
                      : "2px solid transparent",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <input
                type="color"
                value={corCards ?? "#1E6FB8"}
                onChange={(e) => definirCorCards(e.target.value)}
                aria-label="Escolher qualquer cor"
                style={{ width: 28, height: 28, padding: 0, border: "1px solid var(--border)", borderRadius: 6, background: "transparent", cursor: "pointer" }}
              />
              Outra cor
            </label>
          </div>
        </>
      )}
    </div>
  );
}

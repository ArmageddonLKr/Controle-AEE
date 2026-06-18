// Confete — chuva de confetes sutil sobre o alerta de aniversário.
// Some sozinho após alguns segundos e respeita "prefers-reduced-motion".
"use client";

import { useEffect, useState } from "react";

const CORES = ["#F0A500", "#4A9EBF", "#2ECC8E", "#E05577", "#7B61FF", "#FFD700"];

interface Peca {
  id: number;
  left: number;
  delay: number;
  duracao: number;
  cor: string;
  rot: number;
  drift: number;
  size: number;
}

export function Confete({
  ativo = true,
  quantidade = 38,
}: {
  ativo?: boolean;
  quantidade?: number;
}) {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!ativo) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzir) return;

    const novas: Peca[] = Array.from({ length: quantidade }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duracao: 1.8 + Math.random() * 1.4,
      cor: CORES[i % CORES.length],
      rot: Math.random() * 360,
      drift: (Math.random() - 0.5) * 120,
      size: 6 + Math.random() * 6,
    }));
    setPecas(novas);
    setVisivel(true);
    const t = setTimeout(() => setVisivel(false), 3400);
    return () => clearTimeout(t);
  }, [ativo, quantidade]);

  if (!visivel) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        borderRadius: "inherit",
        zIndex: 1,
      }}
    >
      {pecas.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-12%",
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.42,
            background: p.cor,
            borderRadius: 2,
            // variável usada pela keyframe "confeteCair"
            ["--drift" as string]: `${p.drift}px`,
            animation: `confeteCair ${p.duracao}s ${p.delay}s cubic-bezier(0.3,0.1,0.4,1) forwards`,
            transform: `rotate(${p.rot}deg)`,
          }}
        />
      ))}
    </div>
  );
}

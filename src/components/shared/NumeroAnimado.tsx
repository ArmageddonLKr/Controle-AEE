// NumeroAnimado — anima a contagem de 0 (ou do valor anterior) até o valor
// atual, com desaceleração suave. Respeita "prefers-reduced-motion".
"use client";

import { useEffect, useRef, useState } from "react";

export function NumeroAnimado({
  value,
  duracao = 900,
}: {
  value: number;
  duracao?: number;
}) {
  const [exibido, setExibido] = useState(value);
  const anteriorRef = useRef(0);

  useEffect(() => {
    const de = anteriorRef.current;
    const ate = value;
    anteriorRef.current = value;

    const reduzir =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduzir || de === ate) {
      setExibido(ate);
      return;
    }

    let raf = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / duracao);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setExibido(Math.round(de + (ate - de) * eased));
      if (t < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [value, duracao]);

  return <>{exibido}</>;
}

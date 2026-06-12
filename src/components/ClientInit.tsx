"use client";

import { useEffect } from "react";
import { iniciarSync } from "@/lib/sync";

export function ClientInit() {
  useEffect(() => {
    // Liga a sincronização com a nuvem (offline-first)
    iniciarSync();

    // Registra o service worker (modo offline + atualizações automáticas)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/Controle-AEE/sw.js").catch(() => {});
    }

    // Trava a orientação em retrato quando possível (app instalado/standalone).
    // No navegador comum a API é recusada — aí vale a rotação do aparelho.
    try {
      const orientacao = screen.orientation as ScreenOrientation & {
        lock?: (o: string) => Promise<void>;
      };
      orientacao?.lock?.("portrait").catch(() => {});
    } catch {
      // API não disponível neste navegador
    }
  }, []);

  return null;
}

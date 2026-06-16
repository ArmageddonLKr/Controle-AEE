"use client";

import { useEffect } from "react";
import { iniciarSync } from "@/lib/sync";
import { seedMockData } from "@/lib/storage";
import { CRIANCAS_MOCK, SESSOES_MOCK, EVOLUCOES_MOCK, REUNIOES_MOCK } from "@/lib/mock-data";

export function ClientInit() {
  useEffect(() => {
    // Insere dados de demonstração na primeira abertura (localStorage vazio)
    seedMockData({ criancas: CRIANCAS_MOCK, sessoes: SESSOES_MOCK, evolucoes: EVOLUCOES_MOCK, reunioes: REUNIOES_MOCK });

    // Liga a sincronização automática com a nuvem (offline-first, sem ação do usuário)
    iniciarSync();

    // Registra o service worker (modo offline + atualizações automáticas)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/Controle-AEE/sw.js").catch(() => {});
    }

    // Trava a orientação em retrato quando possível (app instalado/standalone)
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

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

    // Registra o service worker (modo offline + atualizações automáticas).
    // updateViaCache: "none" garante que o navegador sempre confira o
    // sw.js direto da rede (sem usar uma cópia em cache HTTP desatualizada)
    // — é o que permite a atualização chegar sem precisar desinstalar/
    // reinstalar o app.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/Controle-AEE/sw.js", { updateViaCache: "none" })
        .then((registro) => {
          registro.update().catch(() => {});
          // Reforça a checagem por atualização sempre que o app volta ao
          // primeiro plano (ex.: usuária reabre o PWA depois de minimizar).
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              registro.update().catch(() => {});
            }
          });
        })
        .catch(() => {});

      // Quando um novo service worker assume o controle (versão nova já
      // instalada), recarrega a página uma única vez para aplicar a
      // atualização automaticamente, sem ação manual da usuária.
      let jaRecarregou = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (jaRecarregou) return;
        jaRecarregou = true;
        window.location.reload();
      });
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

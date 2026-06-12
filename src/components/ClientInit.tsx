"use client";

import { useEffect } from "react";
import { iniciarSync, ativarSincronizacao } from "@/lib/sync";
import { isSupabaseConnected } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function ClientInit() {
  useEffect(() => {
    // Liga a sincronização com a nuvem (offline-first)
    iniciarSync();

    // Link mágico de ativação: abrir o site com ?ativar=CODIGO liga a
    // sincronização sozinho, sem a Rafaela precisar digitar nada.
    // O código nunca aparece na tela e a URL é limpa em seguida.
    try {
      const params = new URLSearchParams(window.location.search);
      const codigoDoLink = params.get("ativar");
      if (codigoDoLink) {
        // Limpa a URL imediatamente (o código não fica no histórico)
        params.delete("ativar");
        const novaBusca = params.toString();
        window.history.replaceState(
          null,
          "",
          window.location.pathname + (novaBusca ? `?${novaBusca}` : "")
        );

        if (!isSupabaseConnected()) {
          void ativarSincronizacao(codigoDoLink).then((resultado) => {
            toast({
              title: resultado.ok ? "Tudo pronto! ☁️" : "Não deu certo",
              description: resultado.ok
                ? "Seus dados agora ficam salvos na nuvem e aparecem em qualquer aparelho."
                : resultado.mensagem,
            });
          });
        }
      }
    } catch {
      // URL sem suporte a URLSearchParams — segue sem ativação automática
    }

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

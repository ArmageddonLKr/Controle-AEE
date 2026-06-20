"use client";

import { useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";

interface OpcaoExport {
  label: string;
  formato: "pdf" | "word";
  onExportar: () => void | Promise<void>;
}

interface ExportButtonProps {
  opcoes: OpcaoExport[];
  disabled?: boolean;
}

// Altura aproximada de cada item do menu + reserva de segurança para a
// barra de navegação inferior do mobile, que fica sobre a área visível.
const ALTURA_POR_ITEM = 48;
const RESERVA_INFERIOR = 96;

export function ExportButton({ opcoes, disabled = false }: ExportButtonProps) {
  const [aberto, setAberto] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [abrirParaCima, setAbrirParaCima] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);

  function handleAbrir() {
    if (disabled || estaCarregando) return;

    if (!aberto && botaoRef.current) {
      const rect = botaoRef.current.getBoundingClientRect();
      const espacoAbaixo = window.innerHeight - rect.bottom;
      const espacoNecessario = opcoes.length * ALTURA_POR_ITEM + RESERVA_INFERIOR;
      setAbrirParaCima(espacoAbaixo < espacoNecessario);
    }

    setAberto((valor) => !valor);
  }

  async function handleExportar(opcao: OpcaoExport) {
    setLoading(opcao.formato);
    setAberto(false);
    try {
      await opcao.onExportar();
    } finally {
      setLoading(null);
    }
  }

  const estaCarregando = loading !== null;

  return (
    <div className="relative">
      <button
        ref={botaoRef}
        onClick={handleAbrir}
        disabled={disabled || estaCarregando}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "white",
        }}
      >
        <Download className="h-4 w-4" />
        {estaCarregando ? "Gerando..." : "Exportar"}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <>
          {/* Overlay para fechar */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setAberto(false)}
          />
          <div
            className={`absolute right-0 w-48 rounded-xl shadow-lg z-[61] overflow-hidden ${
              abrirParaCima ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            {opcoes.map((opcao) => (
              <button
                key={opcao.formato}
                onClick={() => handleExportar(opcao)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:opacity-80"
                style={{
                  color: "var(--text-primary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {opcao.formato === "pdf" ? (
                  <FileText className="h-4 w-4 flex-shrink-0" style={{ color: "#E05555" }} />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 flex-shrink-0" style={{ color: "var(--accent-primary)" }} />
                )}
                {opcao.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

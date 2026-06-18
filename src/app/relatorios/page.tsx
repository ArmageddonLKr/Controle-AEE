"use client";

import { useState, useMemo } from "react";
import { Download, Search, Loader2 } from "lucide-react";
import { format, isWithinInterval, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { PageHeader } from "@/components/layout/PageHeader";
import { useCriancas, useTodasSessoes } from "@/hooks/useAlunos";
import { parseDataLocal } from "@/lib/utils/date";
import type { Sessao } from "@/types";

// ---------------------------------------------------------------------------
// Opções de filtro
// ---------------------------------------------------------------------------
const TIPOS_SESSAO = ["Todos", "individual", "grupo", "familiar", "orientacao"] as const;
const TIPO_LABEL: Record<string, string> = {
  individual: "Individual",
  grupo: "Grupo",
  familiar: "Familiar",
  orientacao: "Orientação",
  Todos: "Todos",
};

const PRESETS = [
  { label: "Este mês", value: "este_mes" },
  { label: "Mês anterior", value: "mes_anterior" },
  { label: "Último semestre", value: "semestre" },
  { label: "Personalizado", value: "custom" },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getNomeCrianca(criancaId: string, nomes: Map<string, string>): string {
  return nomes.get(criancaId) ?? "—";
}

function getIntervaloPreset(preset: string): { inicio: Date; fim: Date } {
  const hoje = new Date();
  if (preset === "este_mes") return { inicio: startOfMonth(hoje), fim: endOfMonth(hoje) };
  if (preset === "mes_anterior") {
    const ant = subMonths(hoje, 1);
    return { inicio: startOfMonth(ant), fim: endOfMonth(ant) };
  }
  if (preset === "semestre") return { inicio: subMonths(hoje, 6), fim: hoje };
  return { inicio: startOfMonth(hoje), fim: endOfMonth(hoje) };
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function RelatoriosPage() {
  const { criancas, loading: loadingCriancas } = useCriancas();
  const { sessoes, loading: loadingSessoes, isError } = useTodasSessoes();
  const erro = isError ? 'Erro ao carregar sessões.' : null;
  const nomesPorId = useMemo(
    () => new Map(criancas.map((c) => [c.id, c.nome])),
    [criancas]
  );
  const loading = loadingCriancas || loadingSessoes;

  // ---- Estado dos filtros ----
  const [preset, setPreset] = useState<string>("este_mes");
  const [dataInicio, setDataInicio] = useState<string>(
    format(startOfMonth(new Date()), "yyyy-MM-dd")
  );
  const [dataFim, setDataFim] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [criancaFiltro, setCriancaFiltro] = useState<string>("todas");
  const [tipoFiltro, setTipoFiltro] = useState<string>("Todos");
  const [presencaFiltro, setPresencaFiltro] = useState<string>("todas");
  const [buscaNome, setBuscaNome] = useState<string>("");

  // ---- Intervalo efetivo ----
  const intervalo = useMemo(() => {
    if (preset !== "custom") return getIntervaloPreset(preset);
    return { inicio: parseDataLocal(dataInicio), fim: parseDataLocal(dataFim) };
  }, [preset, dataInicio, dataFim]);

  // ---- Sessões filtradas ----
  const sessoesFiltradas = useMemo(() => {
    return sessoes.filter((s) => {
      const data = parseDataLocal(s.data);
      if (!isWithinInterval(data, { start: intervalo.inicio, end: intervalo.fim })) return false;
      if (criancaFiltro !== "todas" && s.criancaId !== criancaFiltro) return false;
      if (tipoFiltro !== "Todos" && s.tipo !== tipoFiltro) return false;
      if (presencaFiltro === "presentes" && !s.presente) return false;
      if (presencaFiltro === "faltas" && s.presente) return false;
      if (buscaNome) {
        const nome = getNomeCrianca(s.criancaId, nomesPorId).toLowerCase();
        if (!nome.includes(buscaNome.toLowerCase())) return false;
      }
      return true;
    });
  }, [sessoes, intervalo, criancaFiltro, tipoFiltro, presencaFiltro, buscaNome, nomesPorId]);

  // ---- Estatísticas ----
  const totalPresencas = sessoesFiltradas.filter((s) => s.presente).length;
  const totalHoras = sessoesFiltradas.reduce((acc, s) => acc + s.duracao, 0);
  const taxaPresenca =
    sessoesFiltradas.length > 0
      ? Math.round((totalPresencas / sessoesFiltradas.length) * 100)
      : 0;

  // ---- Aplicar preset e atualizar datas ----
  function aplicarPreset(p: string) {
    setPreset(p);
    if (p !== "custom") {
      const { inicio, fim } = getIntervaloPreset(p);
      setDataInicio(format(inicio, "yyyy-MM-dd"));
      setDataFim(format(fim, "yyyy-MM-dd"));
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 gap-6">
      {/* ---- Cabeçalho ---- */}
      <PageHeader
        titulo="Relatórios"
        descricao="Filtre e exporte registros de atendimento"
      />

      {erro && (
        <div
          className="px-4 py-3 rounded-lg text-sm"
          style={{ background: "rgba(224,85,85,0.1)", color: "var(--danger)", border: "1px solid rgba(224,85,85,0.3)" }}
        >
          {erro}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16" style={{ color: "var(--text-muted)" }}>
          <Loader2 className="h-5 w-5 animate-spin" />
          Carregando dados...
        </div>
      ) : (
        <>
      {/* ---- Filtros ---- */}
      <div className="card-aee p-5 flex flex-col gap-4">
        <h3 className="font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>
          Filtros
        </h3>

        {/* Presets de período */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => aplicarPreset(p.value)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: preset === p.value ? "var(--accent-primary)" : "var(--bg-primary)",
                color: preset === p.value ? "white" : "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Datas customizadas */}
        {preset === "custom" && (
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>Data início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: "var(--text-muted)" }}>Data fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
              />
            </div>
          </div>
        )}

        {/* Demais filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Busca por nome */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar criança..."
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
            />
          </div>

          {/* Filtro por criança */}
          <select
            value={criancaFiltro}
            onChange={(e) => setCriancaFiltro(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
          >
            <option value="todas">Todas as crianças</option>
            {criancas.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          {/* Filtro por tipo */}
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
          >
            {TIPOS_SESSAO.map((t) => (
              <option key={t} value={t}>{TIPO_LABEL[t]}</option>
            ))}
          </select>

          {/* Filtro por presença */}
          <select
            value={presencaFiltro}
            onChange={(e) => setPresencaFiltro(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
          >
            <option value="todas">Todas</option>
            <option value="presentes">Apenas presentes</option>
            <option value="faltas">Apenas faltas</option>
          </select>
        </div>
      </div>

      {/* ---- Cards de resumo ---- */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total de sessões", valor: sessoesFiltradas.length, cor: "var(--accent-primary)" },
          { label: "Taxa de presença", valor: `${taxaPresenca}%`, cor: "#2ECC8E" },
          { label: "Total de horas", valor: `${Math.floor(totalHoras / 60)}h ${totalHoras % 60}min`, cor: "#A78BFA" },
        ].map((s) => (
          <div
            key={s.label}
            className="card-aee p-4 text-center"
          >
            <p className="text-2xl font-bold" style={{ color: s.cor }}>{s.valor}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ---- Tabela de resultados ---- */}
      <div className="card-aee overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>
            {sessoesFiltradas.length} registro{sessoesFiltradas.length !== 1 ? "s" : ""} encontrado{sessoesFiltradas.length !== 1 ? "s" : ""}
          </h3>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "var(--accent-primary)",
              color: "white",
              opacity: sessoesFiltradas.length === 0 ? 0.5 : 1,
            }}
            disabled={sessoesFiltradas.length === 0}
            title="Exportação disponível em breve"
          >
            <Download size={14} />
            Exportar PDF
          </button>
        </div>

        {sessoesFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <p style={{ color: "var(--text-muted)" }}>
              {sessoes.length === 0
                ? "Nenhuma sessão cadastrada ainda. Registre atendimentos no perfil de cada criança."
                : "Nenhuma sessão encontrada com os filtros selecionados."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border)" }}>
                  {["Data", "Criança", "Tipo", "Duração", "Presença", "Anotações"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessoesFiltradas.map((sessao, idx) => (
                  <tr
                    key={sessao.id}
                    style={{
                      borderBottom: idx < sessoesFiltradas.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                      {format(parseDataLocal(sessao.data), "dd/MM/yyyy")}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>
                      {getNomeCrianca(sessao.criancaId, nomesPorId).split(" ").slice(0, 2).join(" ")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: "var(--accent-light)", color: "var(--accent-primary)" }}
                      >
                        {TIPO_LABEL[sessao.tipo]}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                      {sessao.duracao}min
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: sessao.presente ? "rgba(46,204,142,0.12)" : "rgba(224,85,85,0.1)",
                          color: sessao.presente ? "#2ECC8E" : "#E05555",
                        }}
                      >
                        {sessao.presente ? "✓ Presente" : "✗ Falta"}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3 max-w-xs truncate"
                      style={{ color: "var(--text-muted)" }}
                      title={sessao.anotacoes}
                    >
                      {sessao.anotacoes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

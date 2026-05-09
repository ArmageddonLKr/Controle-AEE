"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, FileSpreadsheet, Filter, Check, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { criancas, sessoes } from "@/lib/mock-data";
import { exportarRelatorioAtendimentosPDF } from "@/lib/utils/export-pdf";
import { exportarRelatorioAtendimentosDocx } from "@/lib/utils/export-docx";
import type { Sessao } from "@/types";

const PRESETS = [
  { label: "Este mês", fn: () => ({ inicio: startOfMonth(new Date()), fim: new Date() }) },
  { label: "Último mês", fn: () => ({ inicio: startOfMonth(subMonths(new Date(), 1)), fim: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Este semestre", fn: () => ({ inicio: startOfYear(new Date()), fim: new Date() }) },
];

const TIPOS_SESSAO = [
  { valor: "", label: "Todos os tipos" },
  { valor: "individual", label: "Individual" },
  { valor: "grupo", label: "Grupo" },
  { valor: "familiar", label: "Familiar" },
  { valor: "orientacao", label: "Orientação" },
];

const TIPOS_LABEL: Record<string, string> = {
  individual: "Individual",
  grupo: "Grupo",
  familiar: "Familiar",
  orientacao: "Orientação",
};

export default function RelatoriosPage() {
  const hoje = new Date();
  const [dataInicio, setDataInicio] = useState(format(startOfMonth(hoje), "yyyy-MM-dd"));
  const [dataFim, setDataFim] = useState(format(hoje, "yyyy-MM-dd"));
  const [criancaFiltro, setCriancaFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [presencaFiltro, setPresencaFiltro] = useState("");
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingWord, setLoadingWord] = useState(false);

  const sessoesFiltradas = useMemo<Sessao[]>(() => {
    return sessoes.filter((s) => {
      const data = new Date(s.data);
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim + "T23:59:59");
      const matchData = data >= inicio && data <= fim;
      const matchCrianca = !criancaFiltro || s.criancaId === criancaFiltro;
      const matchTipo = !tipoFiltro || s.tipo === tipoFiltro;
      const matchPresenca =
        presencaFiltro === ""
          ? true
          : presencaFiltro === "presente"
          ? s.presente
          : !s.presente;
      return matchData && matchCrianca && matchTipo && matchPresenca;
    }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [dataInicio, dataFim, criancaFiltro, tipoFiltro, presencaFiltro]);

  const totalHoras = sessoesFiltradas.reduce((acc, s) => acc + (s.presente ? s.duracao : 0), 0);
  const presentes = sessoesFiltradas.filter((s) => s.presente).length;
  const taxaPresenca = sessoesFiltradas.length > 0
    ? Math.round((presentes / sessoesFiltradas.length) * 100)
    : 0;

  const criancasMap = useMemo(() => {
    const m: Record<string, string> = {};
    criancas.forEach((c) => { m[c.id] = c.nome; });
    return m;
  }, []);

  function aplicarPreset(idx: number) {
    const { inicio, fim } = PRESETS[idx].fn();
    setDataInicio(format(inicio, "yyyy-MM-dd"));
    setDataFim(format(fim, "yyyy-MM-dd"));
  }

  function handleExportPDF() {
    setLoadingPDF(true);
    try {
      const periodo = `${format(new Date(dataInicio), "dd/MM/yyyy", { locale: ptBR })} a ${format(new Date(dataFim), "dd/MM/yyyy", { locale: ptBR })}`;
      const linhas = sessoesFiltradas.map((s) => ({
        data: format(new Date(s.data), "dd/MM/yyyy", { locale: ptBR }),
        crianca: criancasMap[s.criancaId] ?? "-",
        tipo: TIPOS_LABEL[s.tipo] ?? s.tipo,
        duracao: `${s.duracao} min`,
        presenca: s.presente ? "Presente" : `Falta${s.motivoFalta ? ` (${s.motivoFalta})` : ""}`,
        anotacoes: s.anotacoes.substring(0, 60) + (s.anotacoes.length > 60 ? "..." : ""),
      }));
      exportarRelatorioAtendimentosPDF(
        "Relatório de Atendimentos",
        `Período: ${periodo} | Total: ${sessoesFiltradas.length} sessões | Presença: ${taxaPresenca}%`,
        [
          { header: "Data", dataKey: "data" },
          { header: "Criança", dataKey: "crianca" },
          { header: "Tipo", dataKey: "tipo" },
          { header: "Duração", dataKey: "duracao" },
          { header: "Presença", dataKey: "presenca" },
          { header: "Anotações", dataKey: "anotacoes" },
        ],
        linhas,
        `relatorio_${format(new Date(), "yyyyMMdd")}`
      );
    } finally {
      setLoadingPDF(false);
    }
  }

  async function handleExportWord() {
    setLoadingWord(true);
    try {
      const periodo = `${format(new Date(dataInicio), "dd/MM/yyyy", { locale: ptBR })} a ${format(new Date(dataFim), "dd/MM/yyyy", { locale: ptBR })}`;
      await exportarRelatorioAtendimentosDocx(
        "Relatório de Atendimentos — Controle AEE",
        periodo,
        sessoesFiltradas,
        criancasMap
      );
    } finally {
      setLoadingWord(false);
    }
  }

  return (
    <div>
      <PageHeader
        titulo="Relatórios"
        descricao="Filtre e exporte os atendimentos em PDF ou Word"
      />

      {/* Filtros */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" style={{ color: "var(--accent-primary)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Filtros
          </span>
        </div>

        {/* Presets de período */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => aplicarPreset(i)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: "var(--accent-light)",
                color: "var(--accent-primary)",
                border: "1px solid var(--accent-secondary)",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-muted)" }}>
              DATA INÍCIO
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-muted)" }}>
              DATA FIM
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-muted)" }}>
              CRIANÇA
            </label>
            <select
              value={criancaFiltro}
              onChange={(e) => setCriancaFiltro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">Todas</option>
              {criancas.map((c) => (
                <option key={c.id} value={c.id}>{c.nome.split(" ").slice(0, 2).join(" ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-muted)" }}>
              TIPO DE SESSÃO
            </label>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              {TIPOS_SESSAO.map((t) => (
                <option key={t.valor} value={t.valor}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro de presença */}
        <div className="flex gap-2 mt-4">
          {[
            { valor: "", label: "Todas" },
            { valor: "presente", label: "Presenças" },
            { valor: "falta", label: "Faltas" },
          ].map((opt) => (
            <button
              key={opt.valor}
              onClick={() => setPresencaFiltro(opt.valor)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                presencaFiltro === opt.valor
                  ? { backgroundColor: "var(--accent-primary)", color: "white" }
                  : {
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total de sessões", valor: sessoesFiltradas.length },
          { label: "Taxa de presença", valor: `${taxaPresenca}%` },
          { label: "Horas totais", valor: `${Math.floor(totalHoras / 60)}h ${totalHoras % 60}min` },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--accent-primary)" }}>
              {item.valor}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Botões de exportação */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleExportPDF}
          disabled={loadingPDF || sessoesFiltradas.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#E05555", color: "white" }}
        >
          <FileText className="h-4 w-4" />
          {loadingPDF ? "Gerando..." : "Exportar PDF"}
        </button>
        <button
          onClick={handleExportWord}
          disabled={loadingWord || sessoesFiltradas.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--accent-primary)", color: "white" }}
        >
          <FileSpreadsheet className="h-4 w-4" />
          {loadingWord ? "Gerando..." : "Exportar Word"}
        </button>
      </div>

      {/* Tabela de resultados */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        {/* Cabeçalho da tabela */}
        <div
          className="grid text-xs font-semibold uppercase tracking-wider px-4 py-3"
          style={{
            gridTemplateColumns: "100px 1fr 90px 80px 90px",
            backgroundColor: "var(--accent-light)",
            color: "var(--text-muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span>Data</span>
          <span>Criança</span>
          <span>Tipo</span>
          <span>Duração</span>
          <span>Presença</span>
        </div>

        {sessoesFiltradas.length === 0 ? (
          <div className="py-12 text-center" style={{ color: "var(--text-muted)" }}>
            Nenhuma sessão encontrada com os filtros selecionados.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {sessoesFiltradas.map((sessao) => {
              const crianca = criancas.find((c) => c.id === sessao.criancaId);
              return (
                <div
                  key={sessao.id}
                  className="grid items-center px-4 py-3 text-sm"
                  style={{ gridTemplateColumns: "100px 1fr 90px 80px 90px" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>
                    {format(new Date(sessao.data), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                  <span className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {crianca?.nome.split(" ").slice(0, 2).join(" ") ?? "-"}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium w-fit"
                    style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-primary)" }}
                  >
                    {TIPOS_LABEL[sessao.tipo] ?? sessao.tipo}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>{sessao.duracao} min</span>
                  <span className="flex items-center gap-1">
                    {sessao.presente ? (
                      <><Check className="h-3.5 w-3.5" style={{ color: "var(--success)" }} /><span style={{ color: "var(--success)" }}>Presente</span></>
                    ) : (
                      <><X className="h-3.5 w-3.5" style={{ color: "var(--danger)" }} /><span style={{ color: "var(--danger)" }}>Falta</span></>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

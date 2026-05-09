"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Plus, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlunoCard } from "@/components/shared/AlunoCard";
import { criancas } from "@/lib/mock-data";
import type { Crianca } from "@/types";

const STATUS_OPTS = [
  { valor: "todos", label: "Todos" },
  { valor: "ativo", label: "Ativos" },
  { valor: "espera", label: "Em espera" },
  { valor: "inativo", label: "Inativos" },
];

const escolas = [...new Set(criancas.map((c) => c.escola))].sort();
const diagnosticos = [...new Set(criancas.flatMap((c) => c.diagnosticos))].sort();

export default function AlunosPage() {
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [escolaFiltro, setEscolaFiltro] = useState("");
  const [diagnosticoFiltro, setDiagnosticoFiltro] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const criancasFiltradas = useMemo<Crianca[]>(() => {
    return criancas.filter((c) => {
      const matchBusca = busca
        ? c.nome.toLowerCase().includes(busca.toLowerCase()) ||
          (c.apelido?.toLowerCase().includes(busca.toLowerCase()) ?? false)
        : true;
      const matchStatus = statusFiltro === "todos" || c.status === statusFiltro;
      const matchEscola = !escolaFiltro || c.escola === escolaFiltro;
      const matchDiag = !diagnosticoFiltro || c.diagnosticos.includes(diagnosticoFiltro);
      return matchBusca && matchStatus && matchEscola && matchDiag;
    });
  }, [busca, statusFiltro, escolaFiltro, diagnosticoFiltro]);

  return (
    <div>
      <PageHeader
        titulo="Crianças"
        descricao={`${criancasFiltradas.length} de ${criancas.length} criança(s)`}
        acao={
          <button
            disabled
            title="Disponível em breve"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "white",
            }}
          >
            <Plus className="h-4 w-4" />
            Nova Criança
          </button>
        }
      />

      {/* Barra de busca e filtros */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-3">
          {/* Campo de busca */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: mostrarFiltros ? "var(--accent-light)" : "var(--bg-card)",
              border: "1px solid var(--border)",
              color: mostrarFiltros ? "var(--accent-primary)" : "var(--text-secondary)",
            }}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>

        {/* Chips de status */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map((opt) => (
            <button
              key={opt.valor}
              onClick={() => setStatusFiltro(opt.valor)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                statusFiltro === opt.valor
                  ? {
                      backgroundColor: "var(--accent-primary)",
                      color: "white",
                    }
                  : {
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Filtros adicionais */}
        {mostrarFiltros && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-muted)" }}>
                ESCOLA
              </label>
              <select
                value={escolaFiltro}
                onChange={(e) => setEscolaFiltro(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">Todas as escolas</option>
                {escolas.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-muted)" }}>
                DIAGNÓSTICO
              </label>
              <select
                value={diagnosticoFiltro}
                onChange={(e) => setDiagnosticoFiltro(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="">Todos os diagnósticos</option>
                {diagnosticos.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid de cards */}
      {criancasFiltradas.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Nenhuma criança encontrada
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Tente ajustar os filtros de busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {criancasFiltradas.map((crianca, idx) => (
            <AlunoCard
              key={crianca.id}
              crianca={crianca}
              style={{ animationDelay: `${idx * 50}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

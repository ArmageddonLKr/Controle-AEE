// src/app/alunos/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AlunoCard } from '@/components/shared/AlunoCard';
import { Search, Users, UserPlus } from 'lucide-react';
import { useCriancas } from '@/hooks/useAlunos';

const STATUS_OPTS = [
  { valor: 'todos',   label: 'Todos' },
  { valor: 'ativo',   label: 'Ativos' },
  { valor: 'espera',  label: 'Em espera' },
  { valor: 'inativo', label: 'Inativos' },
];

function EstadoVazio() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: "var(--accent-light)" }}
      >
        <Users size={36} style={{ color: "var(--accent-primary)" }} />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        Nenhuma criança cadastrada ainda
      </h2>
      <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
        Cadastre a primeira criança para começar a registrar os atendimentos.
      </p>
      <Link
        href="/alunos/novo"
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
        style={{ background: "var(--accent-primary)" }}
      >
        <UserPlus size={16} />
        Cadastrar criança
      </Link>
    </div>
  );
}

function EstadoSemResultado() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-4xl mb-4">🔍</span>
      <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
        Nenhuma criança encontrada
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
        Tente ajustar os filtros ou o termo de busca.
      </p>
    </div>
  );
}

export default function AlunosPage() {
  const { criancas, loading } = useCriancas();
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  // Permite chegar já filtrado por um link (ex.: card "Crianças ativas" → ?status=ativo)
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get('status');
    if (s && ['todos', 'ativo', 'espera', 'inativo'].includes(s)) setStatusFiltro(s);
  }, []);

  const criancasFiltradas = useMemo(() => {
    return criancas.filter((c) => {
      const matchBusca = !busca || c.nome.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = statusFiltro === 'todos' || c.status === statusFiltro;
      return matchBusca && matchStatus;
    });
  }, [criancas, busca, statusFiltro]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--accent-primary)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Crianças
          </h1>
          {criancas.length > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
              {criancasFiltradas.length} de {criancas.length} encontrada(s)
            </p>
          )}
        </div>
        <Link
          href="/alunos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex-shrink-0"
          style={{ background: "var(--accent-primary)" }}
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Nova Criança</span>
        </Link>
      </div>

      {/* Busca + filtros — só exibe se houver crianças */}
      {criancas.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTS.map((opt) => (
              <button
                key={opt.valor}
                onClick={() => setStatusFiltro(opt.valor)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  minHeight: 36,
                  background: statusFiltro === opt.valor ? "var(--accent-primary)" : "var(--bg-card)",
                  color: statusFiltro === opt.valor ? "#fff" : "var(--text-secondary)",
                  border: `1px solid ${statusFiltro === opt.valor ? "var(--accent-primary)" : "var(--border)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo */}
      {criancas.length === 0 ? (
        <EstadoVazio />
      ) : criancasFiltradas.length === 0 ? (
        <EstadoSemResultado />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {criancasFiltradas.map((crianca, i) => (
            <AlunoCard
              key={crianca.id}
              crianca={crianca}
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

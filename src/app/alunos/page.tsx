// src/app/alunos/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { AlunoCard } from '@/components/shared/AlunoCard';
import type { Crianca } from '@/types';
import { Search } from 'lucide-react';
import { useCriancas } from '@/hooks/useAlunos';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const STATUS_OPTS = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'ativo', label: 'Ativos' },
  { valor: 'espera', label: 'Em espera' },
  { valor: 'inativo', label: 'Inativos' },
];

export default function AlunosPage() {
  const { criancas, loading: isLoading, isError: error } = useCriancas();
  
  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  const criancasFiltradas = useMemo(() => {
    return criancas.filter((c) => {
      const matchBusca = !busca || c.nome.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = statusFiltro === 'todos' || c.status === statusFiltro;
      return matchBusca && matchStatus;
    });
  }, [criancas, busca, statusFiltro]);

  // Tratamento de loading e erro
  if (isLoading) {
    return <div className="p-8 text-center">Carregando crianças...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar os dados.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header da página */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Crianças</h1>
          <p className="text-sm mt-0.5 text-gray-500">
            {`${criancasFiltradas.length} de ${criancas.length} criança(s) encontradas`}
          </p>
        </div>
        <Link href="/alunos/novo" passHref>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            Nova Criança
          </button>
        </Link>
      </div>

      {/* Barra de busca e filtros */}
      <div className="mb-6 space-y-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map((opt) => (
            <button
              key={opt.valor}
              onClick={() => setStatusFiltro(opt.valor)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${statusFiltro === opt.valor ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Alunos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {criancasFiltradas.map((crianca) => (
          <AlunoCard key={crianca.id} crianca={crianca} />
        ))}
      </div>
    </div>
  );
}

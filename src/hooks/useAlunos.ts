"use client";

import { useMemo, useState, useEffect, useSyncExternalStore } from 'react';
import * as storage from '@/lib/storage';
import type { Crianca, Sessao, Evolucao, Reuniao } from '@/types';

// Snapshots vazios estáveis para a renderização no servidor (SSG)
const SEM_CRIANCAS: Crianca[] = [];
const SEM_SESSOES: Sessao[] = [];
const SEM_EVOLUCOES: Evolucao[] = [];
const SEM_REUNIOES: Reuniao[] = [];

// "loading" enquanto o componente ainda não montou no navegador —
// evita mostrar estado vazio antes do localStorage ser lido
function useMontado() {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  return montado;
}

function useCriancasStore(): Crianca[] {
  return useSyncExternalStore(storage.subscribe, storage.getCriancas, () => SEM_CRIANCAS);
}

function useSessoesStore(): Sessao[] {
  return useSyncExternalStore(storage.subscribe, storage.getSessoes, () => SEM_SESSOES);
}

function useEvolucoesStore(): Evolucao[] {
  return useSyncExternalStore(storage.subscribe, storage.getEvolucoes, () => SEM_EVOLUCOES);
}

// Hook para buscar todas as crianças (dados locais do navegador)
export const useCriancas = () => {
  const criancas = useCriancasStore();
  const montado = useMontado();

  const ativas = useMemo(() => criancas.filter((c) => c.status === 'ativo'), [criancas]);
  const emEspera = useMemo(() => criancas.filter((c) => c.status === 'espera'), [criancas]);
  const inativas = useMemo(() => criancas.filter((c) => c.status === 'inativo'), [criancas]);

  return { criancas, ativas, emEspera, inativas, loading: !montado, isError: false };
};

// Hook para buscar uma criança específica por ID
export const useCriancaById = (id: string | undefined) => {
  const criancas = useCriancasStore();
  const montado = useMontado();
  const crianca = useMemo(
    () => (id ? criancas.find((c) => c.id === id) : undefined),
    [criancas, id]
  );
  return { crianca, loading: !montado, isError: false };
};

// Hook para buscar as sessões de uma criança
export const useSessoesByCriancaId = (criancaId: string | undefined) => {
  const todas = useSessoesStore();
  const montado = useMontado();
  const sessoes = useMemo(
    () => (criancaId ? todas.filter((s) => s.criancaId === criancaId) : SEM_SESSOES),
    [todas, criancaId]
  );
  return { sessoes, loading: !montado, isError: false };
};

// Hook para buscar as evoluções de uma criança
export const useEvolucoesByCriancaId = (criancaId: string | undefined) => {
  const todas = useEvolucoesStore();
  const montado = useMontado();
  const evolucoes = useMemo(
    () => (criancaId ? todas.filter((e) => e.criancaId === criancaId) : SEM_EVOLUCOES),
    [todas, criancaId]
  );
  return { evolucoes, loading: !montado, isError: false };
};

// Hook para buscar todas as sessões
export const useTodasSessoes = () => {
  const sessoes = useSessoesStore();
  const montado = useMontado();
  return { sessoes, loading: !montado, isError: false };
};

// Hook para todas as reuniões
export const useReunioes = () => {
  const reunioes = useSyncExternalStore(storage.subscribe, storage.getReunioesAll, () => SEM_REUNIOES);
  const montado = useMontado();
  const reunioesOrdenadas = useMemo(
    () => [...reunioes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
    [reunioes]
  );
  return { reunioes: reunioesOrdenadas, loading: !montado };
};

// Hook para as reuniões vinculadas a uma criança específica
export const useReunioesByCriancaId = (criancaId: string | undefined) => {
  const reunioes = useSyncExternalStore(storage.subscribe, storage.getReunioesAll, () => SEM_REUNIOES);
  const montado = useMontado();
  const doAluno = useMemo(
    () =>
      criancaId
        ? [...reunioes]
            .filter((r) => r.criancasRelacionadas?.includes(criancaId))
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        : SEM_REUNIOES,
    [reunioes, criancaId]
  );
  return { reunioes: doAluno, loading: !montado };
};

// Hook para dados do dashboard
export const useDashboard = () => {
  const sessoes = useSessoesStore();
  const montado = useMontado();

  const sessoesRecentes = useMemo(() => [...sessoes]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 6),
    [sessoes]);

  const sessoesMes = useMemo(() => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return sessoes.filter((s) => new Date(s.data) >= primeiroDia);
  }, [sessoes]);

  return { sessoesRecentes, sessoesMes, loading: !montado, isError: false };
};

"use client";

import { useMemo, useState, useEffect } from 'react';
import { criancas as mockCriancas, sessoes as mockSessoes } from '@/lib/mock-data';
import type { Crianca, Sessao } from '@/types';

// Função que simula o hook useQuery, mas usando dados mock e um delay para parecer real
const useMockQuery = <T>(data: T | undefined) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350); // Simula um delay de rede
    return () => clearTimeout(timer);
  }, []);

  // Para evitar retornar "undefined" durante o loading inicial, retornamos um array/objeto vazio
  const initialData = Array.isArray(data) ? [] : undefined;

  return {
    data: loading ? initialData : data,
    isLoading: loading,
    isError: false,
    error: null,
  };
};

// Hook para buscar todas as crianças (agora do mock)
export const useCriancas = () => {
  const { data: criancas = [], isLoading, isError } = useMockQuery<Crianca[]>(mockCriancas);

  const ativas = useMemo(() => criancas.filter((c) => c.status === 'ativo'), [criancas]);
  const emEspera = useMemo(() => criancas.filter((c) => c.status === 'espera'), [criancas]);
  const inativas = useMemo(() => criancas.filter((c) => c.status === 'inativo'), [criancas]);

  return { criancas, ativas, emEspera, inativas, loading: isLoading, isError };
};

// Hook para buscar uma criança específica por ID (agora do mock)
export const useCriancaById = (id: string | undefined) => {
    const { data: crianca, isLoading, isError } = useMockQuery<Crianca | undefined>(
        id ? mockCriancas.find(c => c.id === id) : undefined
    );
    return { crianca, loading: isLoading, isError };
}

// Hook para buscar as sessões de uma criança (agora do mock)
export const useSessoesByCriancaId = (criancaId: string | undefined) => {
    const { data: sessoes = [], isLoading, isError } = useMockQuery<Sessao[]>(
        criancaId ? mockSessoes.filter(s => s.criancaId === criancaId) : []
    );
    return { sessoes, loading: isLoading, isError };
}

// Hook para buscar todas as sessões (agora do mock)
export const useTodasSessoes = () => {
  const { data: sessoes = [], isLoading, isError } = useMockQuery<Sessao[]>(mockSessoes);
  return { sessoes, loading: isLoading, isError };
};

// Hook para dados do dashboard (agora do mock)
export const useDashboard = () => {
  const { data: sessoes = [], isLoading, isError } = useMockQuery<Sessao[]>(mockSessoes);

  const sessoesRecentes = useMemo(() => sessoes
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 6), 
    [sessoes]);

  const sessoesMes = useMemo(() => {
    if (isLoading) return [];
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return sessoes.filter(s => new Date(s.data) >= primeiroDia);
  }, [sessoes, isLoading]);

  return { sessoesRecentes, sessoesMes, loading: isLoading, isError };
};


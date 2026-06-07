
// src/lib/mock-data.ts
// Dados zerados — prontos para Rafaela cadastrar as crianças reais na próxima fase.
import { Crianca, Sessao, Evolucao } from '@/types';

export const criancas: Crianca[] = [];
export const sessoes: Sessao[] = [];
export const evolucoes: Evolucao[] = [];

export const getCriancas = () => criancas;
export const getCriancaById = (id: string) => criancas.find(c => c.id === id);
export const getSessoesByCriancaId = (criancaId: string) => sessoes.filter(s => s.criancaId === criancaId);
export const getEvolucoesByCriancaId = (criancaId: string) => evolucoes.filter(e => e.criancaId === criancaId);

// src/lib/storage.ts
// Camada de persistência local — os dados ficam salvos no navegador (localStorage).
// Funciona 100% offline e em site estático (GitHub Pages), sem precisar de servidor.
// Quando o Supabase for conectado, esta camada pode ser substituída mantendo a mesma API.
import type { Crianca, Sessao, Evolucao } from '@/types';

const KEYS = {
  criancas: 'controle-aee:criancas',
  sessoes: 'controle-aee:sessoes',
  evolucoes: 'controle-aee:evolucoes',
} as const;

interface Cache {
  criancas: Crianca[];
  sessoes: Sessao[];
  evolucoes: Evolucao[];
}

// Cache em memória — garante referências estáveis para o useSyncExternalStore
let cache: Cache | null = null;
const listeners = new Set<() => void>();

function lerTabela<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    const dados = raw ? JSON.parse(raw) : [];
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function carregar(): Cache {
  cache = {
    criancas: lerTabela<Crianca>(KEYS.criancas),
    sessoes: lerTabela<Sessao>(KEYS.sessoes),
    evolucoes: lerTabela<Evolucao>(KEYS.evolucoes),
  };
  return cache;
}

function notificar() {
  listeners.forEach((l) => l());
}

function gravar<K extends keyof Cache>(tabela: K, dados: Cache[K]) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KEYS[tabela], JSON.stringify(dados));
    } catch {
      // Armazenamento cheio ou indisponível — mantém apenas em memória
    }
  }
  cache = { ...(cache ?? carregar()), [tabela]: dados };
  notificar();
}

// ── Assinatura para hooks reativos ──────────────────────────────────────────
export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// ── Integração com a sincronização na nuvem ─────────────────────────────────
// A camada de sync (src/lib/sync.ts) se registra aqui para ser avisada de
// cada mutação local e replicá-la na nuvem quando houver conexão.
export interface OpMutacao {
  tipo: 'upsert' | 'delete';
  tabela: 'criancas' | 'sessoes' | 'evolucoes';
  id: string;
  dados?: unknown;
}

let aoMutar: ((op: OpMutacao) => void) | null = null;

export function registrarAoMutar(callback: (op: OpMutacao) => void) {
  aoMutar = callback;
}

/** Substitui todos os dados locais (usado ao puxar da nuvem — não dispara sync) */
export function substituirTudo(dados: { criancas: Crianca[]; sessoes: Sessao[]; evolucoes: Evolucao[] }) {
  gravar('criancas', dados.criancas);
  gravar('sessoes', dados.sessoes);
  gravar('evolucoes', dados.evolucoes);
}

export function getCriancas(): Crianca[] {
  return (cache ?? carregar()).criancas;
}

export function getSessoes(): Sessao[] {
  return (cache ?? carregar()).sessoes;
}

export function getEvolucoes(): Evolucao[] {
  return (cache ?? carregar()).evolucoes;
}

// ── Geração de IDs ──────────────────────────────────────────────────────────
export function novoId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ── CRUD: Crianças ──────────────────────────────────────────────────────────
export function addCrianca(dados: Omit<Crianca, 'id'>): Crianca {
  const nova: Crianca = { ...dados, id: novoId() };
  gravar('criancas', [...getCriancas(), nova]);
  aoMutar?.({ tipo: 'upsert', tabela: 'criancas', id: nova.id, dados: nova });
  return nova;
}

export function updateCrianca(id: string, patch: Partial<Omit<Crianca, 'id'>>): void {
  gravar(
    'criancas',
    getCriancas().map((c) => (c.id === id ? { ...c, ...patch } : c))
  );
  const atualizada = getCriancas().find((c) => c.id === id);
  if (atualizada) aoMutar?.({ tipo: 'upsert', tabela: 'criancas', id, dados: atualizada });
}

export function removeCrianca(id: string): void {
  // Remove também as sessões e evoluções vinculadas à criança
  const sessoesRemovidas = getSessoes().filter((s) => s.criancaId === id);
  const evolucoesRemovidas = getEvolucoes().filter((e) => e.criancaId === id);
  gravar('sessoes', getSessoes().filter((s) => s.criancaId !== id));
  gravar('evolucoes', getEvolucoes().filter((e) => e.criancaId !== id));
  gravar('criancas', getCriancas().filter((c) => c.id !== id));
  sessoesRemovidas.forEach((s) => aoMutar?.({ tipo: 'delete', tabela: 'sessoes', id: s.id }));
  evolucoesRemovidas.forEach((e) => aoMutar?.({ tipo: 'delete', tabela: 'evolucoes', id: e.id }));
  aoMutar?.({ tipo: 'delete', tabela: 'criancas', id });
}

// ── CRUD: Sessões ───────────────────────────────────────────────────────────
export function addSessao(dados: Omit<Sessao, 'id'>): Sessao {
  const nova: Sessao = { ...dados, id: novoId() };
  gravar('sessoes', [...getSessoes(), nova]);
  aoMutar?.({ tipo: 'upsert', tabela: 'sessoes', id: nova.id, dados: nova });
  return nova;
}

export function updateSessao(id: string, patch: Partial<Omit<Sessao, 'id' | 'criancaId'>>): void {
  gravar('sessoes', getSessoes().map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const atualizada = getSessoes().find((s) => s.id === id);
  if (atualizada) aoMutar?.({ tipo: 'upsert', tabela: 'sessoes', id, dados: atualizada });
}

export function removeSessao(id: string): void {
  gravar('sessoes', getSessoes().filter((s) => s.id !== id));
  aoMutar?.({ tipo: 'delete', tabela: 'sessoes', id });
}

// ── CRUD: Evoluções ─────────────────────────────────────────────────────────
export function addEvolucao(dados: Omit<Evolucao, 'id'>): Evolucao {
  const nova: Evolucao = { ...dados, id: novoId() };
  gravar('evolucoes', [...getEvolucoes(), nova]);
  aoMutar?.({ tipo: 'upsert', tabela: 'evolucoes', id: nova.id, dados: nova });
  return nova;
}

export function updateEvolucao(id: string, patch: Partial<Omit<Evolucao, 'id' | 'criancaId'>>): void {
  gravar('evolucoes', getEvolucoes().map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const atualizada = getEvolucoes().find((e) => e.id === id);
  if (atualizada) aoMutar?.({ tipo: 'upsert', tabela: 'evolucoes', id, dados: atualizada });
}

export function removeEvolucao(id: string): void {
  gravar('evolucoes', getEvolucoes().filter((e) => e.id !== id));
  aoMutar?.({ tipo: 'delete', tabela: 'evolucoes', id });
}

// ── Seed de dados de demonstração ───────────────────────────────────────────
// Só insere se não houver nenhuma criança ainda (primeira abertura em novo dispositivo).
export function seedMockData(dados: { criancas: Crianca[]; sessoes: Sessao[]; evolucoes: Evolucao[] }): void {
  if (typeof window === 'undefined') return;
  if (getCriancas().length > 0) return; // já tem dados — não sobrescreve
  gravar('criancas', dados.criancas);
  gravar('sessoes', dados.sessoes);
  gravar('evolucoes', dados.evolucoes);
}

// ── Sincronização entre abas abertas do navegador ───────────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && (Object.values(KEYS) as string[]).includes(e.key)) {
      carregar();
      notificar();
    }
  });
}

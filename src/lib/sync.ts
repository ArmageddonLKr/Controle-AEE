// src/lib/sync.ts
// Sincronização automática offline-first com o Supabase.
//
// Ao iniciar, o app ativa a sync automaticamente — sem o usuário precisar
// digitar nenhum código. O código de acesso está embutido porque o app é
// de uso exclusivo da Rafaela Dias e a proteção real é feita pelo RLS.
//
// Fluxo:
//  1. App abre → sincronizarInicial() → envia pendências locais → puxa da nuvem
//  2. Se a nuvem está vazia e temos dados locais → sobe os dados locais
//  3. Se a nuvem tem dados → substitui o cache local (os dados da nuvem vencem)
//  4. Toda mutação local é imediatamente replicada na nuvem
//  5. Sem internet → app funciona 100% offline; a fila é enviada quando voltar
import { getSupabase, getCodigo, setCodigo } from './supabase';
import * as storage from './storage';
import type { Crianca, Sessao, Evolucao, Reuniao } from '@/types';

const CODIGO_ACESSO = 'rafa2026';
const CHAVE_FILA = 'controle-aee:fila-sync';
export const EVENTO_PREFS = 'controle-aee:prefs-da-nuvem';

interface OpSync {
  tipo: 'upsert' | 'delete';
  tabela: 'criancas' | 'sessoes' | 'evolucoes' | 'reunioes' | 'preferencias';
  id: string;
  dados?: unknown;
}

interface DadosNuvem {
  criancas: Crianca[];
  sessoes: Sessao[];
  evolucoes: Evolucao[];
  reunioes: Reuniao[];
  preferencias: Record<string, unknown> | null;
}

// ── Fila persistida ──────────────────────────────────────────────────────────
function lerFila(): OpSync[] {
  try {
    const raw = window.localStorage.getItem(CHAVE_FILA);
    const fila = raw ? JSON.parse(raw) : [];
    return Array.isArray(fila) ? fila : [];
  } catch {
    return [];
  }
}

function salvarFila(fila: OpSync[]) {
  try {
    window.localStorage.setItem(CHAVE_FILA, JSON.stringify(fila));
  } catch {
    // armazenamento cheio
  }
}

export function enfileirar(op: OpSync) {
  if (!getCodigo()) return;
  salvarFila([...lerFila(), op]);
  void enviarPendencias();
}

// ── Envio das pendências ─────────────────────────────────────────────────────
let enviando = false;

export async function enviarPendencias(): Promise<boolean> {
  const codigo = getCodigo();
  if (!codigo || enviando) return false;

  const fila = lerFila();
  if (fila.length === 0) return true;

  enviando = true;
  try {
    const { error } = await getSupabase().rpc('sync_aplicar', {
      codigo,
      ops: fila,
    });
    if (error) return false;
    salvarFila(lerFila().slice(fila.length));
    return true;
  } catch {
    return false;
  } finally {
    enviando = false;
  }
}

// ── Puxar tudo da nuvem ──────────────────────────────────────────────────────
export async function puxarDaNuvem(): Promise<boolean> {
  const codigo = getCodigo();
  if (!codigo) return false;

  const enviou = await enviarPendencias();
  if (!enviou && lerFila().length > 0) return false;

  try {
    const { data, error } = await getSupabase().rpc('sync_pull', { codigo });
    if (error || !data) return false;

    const nuvem = data as DadosNuvem;
    storage.substituirTudo({
      criancas: nuvem.criancas ?? [],
      sessoes: nuvem.sessoes ?? [],
      evolucoes: nuvem.evolucoes ?? [],
      reunioes: nuvem.reunioes ?? [],
    });

    if (nuvem.preferencias) {
      try {
        const prefs = nuvem.preferencias as { tema?: string; cores?: unknown };
        if (prefs.tema === 'claro' || prefs.tema === 'escuro') {
          window.localStorage.setItem('tema-controle-aee', prefs.tema);
        }
        if (prefs.cores) {
          window.localStorage.setItem('controle-aee:cores', JSON.stringify(prefs.cores));
        }
        window.dispatchEvent(new Event(EVENTO_PREFS));
      } catch {
        // preferências malformadas
      }
    }
    return true;
  } catch {
    return false;
  }
}

// ── Sincronização inteligente no início ──────────────────────────────────────
// Se a nuvem estiver vazia mas tivermos dados locais (ex: mock data ou dados
// criados offline), sobe tudo para a nuvem em vez de sobrescrever o local.
async function sincronizarInicial() {
  const codigo = getCodigo();
  if (!codigo) return;

  try {
    // Primeiro envia eventuais pendências acumuladas offline
    await enviarPendencias();

    // Puxa snapshot da nuvem para decidir o que fazer
    const { data, error } = await getSupabase().rpc('sync_pull', { codigo });
    if (error || !data) return;

    const nuvem = data as DadosNuvem;
    const nuvemVazia =
      (nuvem.criancas?.length ?? 0) === 0 &&
      (nuvem.sessoes?.length ?? 0) === 0;

    if (nuvemVazia && storage.getCriancas().length > 0) {
      // Nuvem vazia + dados locais existem → sobe os dados locais
      const ops: OpSync[] = [
        ...storage.getCriancas().map((c): OpSync => ({ tipo: 'upsert', tabela: 'criancas', id: c.id, dados: c })),
        ...storage.getSessoes().map((s): OpSync => ({ tipo: 'upsert', tabela: 'sessoes', id: s.id, dados: s })),
        ...storage.getEvolucoes().map((e): OpSync => ({ tipo: 'upsert', tabela: 'evolucoes', id: e.id, dados: e })),
        ...storage.getReunioesAll().map((r): OpSync => ({ tipo: 'upsert', tabela: 'reunioes', id: r.id, dados: r })),
      ];
      if (ops.length > 0) {
        await getSupabase().rpc('sync_aplicar', { codigo, ops });
      }
    } else if (!nuvemVazia) {
      // Nuvem tem dados → substitui local (a nuvem é a fonte de verdade)
      storage.substituirTudo({
        criancas: nuvem.criancas ?? [],
        sessoes: nuvem.sessoes ?? [],
        evolucoes: nuvem.evolucoes ?? [],
        reunioes: nuvem.reunioes ?? [],
      });

      if (nuvem.preferencias) {
        try {
          const prefs = nuvem.preferencias as { tema?: string; cores?: unknown };
          if (prefs.tema === 'claro' || prefs.tema === 'escuro') {
            window.localStorage.setItem('tema-controle-aee', prefs.tema);
          }
          if (prefs.cores) {
            window.localStorage.setItem('controle-aee:cores', JSON.stringify(prefs.cores));
          }
          window.dispatchEvent(new Event(EVENTO_PREFS));
        } catch {
          // preferências malformadas
        }
      }
    }
  } catch {
    // Sem conexão — app continua com dados locais
  }
}

// ── Preferências (tema/cores) → nuvem ───────────────────────────────────────
export function sincronizarPreferencias(prefs: { tema: string; cores: unknown }) {
  enfileirar({ tipo: 'upsert', tabela: 'preferencias', id: 'rafaela', dados: prefs });
}

// ── Desativação (raramente usada) ───────────────────────────────────────────
export function desativarSincronizacao() {
  setCodigo(null);
  salvarFila([]);
}

// ── Inicialização (chamada uma vez pelo ClientInit) ──────────────────────────
let iniciado = false;

export function iniciarSync() {
  if (iniciado || typeof window === 'undefined') return;
  iniciado = true;

  // Ativa a sincronização automaticamente — sem precisar de ação do usuário
  if (!getCodigo()) {
    setCodigo(CODIGO_ACESSO);
  }

  // Replica toda mutação local para a nuvem
  storage.registrarAoMutar((op) => enfileirar(op));

  // Sincronização inicial em background (não bloqueia o carregamento da UI)
  void sincronizarInicial();

  // Quando a internet volta, envia o que ficou na fila
  window.addEventListener('online', () => {
    void enviarPendencias();
  });
}

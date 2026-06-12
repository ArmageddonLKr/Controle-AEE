// src/lib/sync.ts
// Sincronização offline-first com a nuvem (Supabase).
//
// Funcionamento:
// - Toda mutação local entra numa fila persistida no localStorage
// - Quando há conexão e código de acesso, a fila é enviada (rpc sync_aplicar)
// - Ao abrir o app, envia pendências e depois puxa tudo da nuvem (sync_pull),
//   substituindo o cache local — o tema/cores também viajam junto
// - Sem internet ou com a nuvem indisponível, o app segue 100% funcional
//   com os dados locais; a fila é enviada na próxima oportunidade
import { getSupabase, getCodigo, setCodigo } from './supabase';
import * as storage from './storage';
import type { Crianca, Sessao, Evolucao } from '@/types';

const CHAVE_FILA = 'controle-aee:fila-sync';
export const EVENTO_PREFS = 'controle-aee:prefs-da-nuvem';

interface OpSync {
  tipo: 'upsert' | 'delete';
  tabela: 'criancas' | 'sessoes' | 'evolucoes' | 'preferencias';
  id: string;
  dados?: unknown;
}

interface DadosNuvem {
  criancas: Crianca[];
  sessoes: Sessao[];
  evolucoes: Evolucao[];
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
    // armazenamento cheio — a fila fica só em memória nesta sessão
  }
}

export function enfileirar(op: OpSync) {
  if (!getCodigo()) return; // sincronização desativada — nada a fazer
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
    // Remove apenas o que foi enviado (ops novas podem ter chegado enquanto isso)
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

  // Primeiro garante que as mudanças locais pendentes cheguem à nuvem,
  // senão o pull poderia sobrescrever algo feito offline
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
    });

    // Aplica tema/cores vindos da nuvem (o TemaProvider escuta este evento)
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
        // preferências malformadas — ignora
      }
    }
    return true;
  } catch {
    return false;
  }
}

// ── Preferências (tema/cores) → nuvem ───────────────────────────────────────
export function sincronizarPreferencias(prefs: { tema: string; cores: unknown }) {
  enfileirar({ tipo: 'upsert', tabela: 'preferencias', id: 'rafaela', dados: prefs });
}

// ── Ativação / desativação ───────────────────────────────────────────────────
export async function ativarSincronizacao(
  codigo: string
): Promise<{ ok: boolean; mensagem: string }> {
  const codigoLimpo = codigo.trim();
  if (!codigoLimpo) return { ok: false, mensagem: 'Digite o código de acesso.' };

  // Valida o código com um pull de teste antes de salvar
  try {
    const { error } = await getSupabase().rpc('sync_pull', { codigo: codigoLimpo });
    if (error) {
      const msg = /codigo/i.test(error.message)
        ? 'Código de acesso incorreto.'
        : 'Não foi possível conectar à nuvem. Verifique a internet e tente de novo.';
      return { ok: false, mensagem: msg };
    }
  } catch {
    return { ok: false, mensagem: 'Não foi possível conectar à nuvem. Verifique a internet e tente de novo.' };
  }

  setCodigo(codigoLimpo);

  // Envia tudo que já existe neste aparelho para a nuvem...
  const ops: OpSync[] = [
    ...storage.getCriancas().map((c): OpSync => ({ tipo: 'upsert', tabela: 'criancas', id: c.id, dados: c })),
    ...storage.getSessoes().map((s): OpSync => ({ tipo: 'upsert', tabela: 'sessoes', id: s.id, dados: s })),
    ...storage.getEvolucoes().map((e): OpSync => ({ tipo: 'upsert', tabela: 'evolucoes', id: e.id, dados: e })),
  ];
  salvarFila([...lerFila(), ...ops]);
  await enviarPendencias();

  // ...e traz o que houver lá (união dos dois aparelhos)
  await puxarDaNuvem();

  return { ok: true, mensagem: 'Sincronização ativada! Os dados agora seguem você em qualquer aparelho.' };
}

export function desativarSincronizacao() {
  setCodigo(null);
  salvarFila([]);
}

// ── Inicialização (chamada uma vez pelo ClientInit) ──────────────────────────
let iniciado = false;

export function iniciarSync() {
  if (iniciado || typeof window === 'undefined') return;
  iniciado = true;

  // Replica toda mutação local para a nuvem
  storage.registrarAoMutar((op) => enfileirar(op));

  if (getCodigo()) {
    void puxarDaNuvem();
  }

  // Quando a internet volta, envia o que ficou pendente
  window.addEventListener('online', () => {
    void enviarPendencias();
  });
}

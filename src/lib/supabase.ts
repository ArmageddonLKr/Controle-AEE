// src/lib/supabase.ts
// Cliente Supabase — sincronização na nuvem do Controle AEE.
//
// A URL e a chave "publishable" abaixo são públicas por design (é assim que
// apps Supabase funcionam). A proteção dos dados NÃO depende delas: as
// tabelas têm RLS negando todo acesso direto, e a única porta de entrada são
// as funções sync_pull/sync_aplicar, que exigem o código de acesso correto.
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wmkvxkeymhcguznfnebe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DFrM6N1pKVRnOSf5tN25GQ_qC3GtKpM';

const CHAVE_CODIGO = 'controle-aee:codigo-acesso';

let cliente: SupabaseClient | null = null;

/** Código de acesso salvo neste aparelho (null = sincronização desativada) */
export function getCodigo(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(CHAVE_CODIGO);
  } catch {
    return null;
  }
}

export function setCodigo(codigo: string | null) {
  try {
    if (codigo) window.localStorage.setItem(CHAVE_CODIGO, codigo);
    else window.localStorage.removeItem(CHAVE_CODIGO);
  } catch {
    // armazenamento indisponível
  }
}

export function getSupabase(): SupabaseClient {
  if (!cliente) {
    cliente = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  }
  return cliente;
}

/** true quando a sincronização está ativada neste aparelho */
export function isSupabaseConnected(): boolean {
  return getCodigo() !== null;
}

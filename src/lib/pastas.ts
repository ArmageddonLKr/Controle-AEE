// src/lib/pastas.ts
// Lista de pastas/níveis editável pela Rafaela (renomear, criar, excluir).
// Fica salva no navegador e sincroniza junto com as outras preferências.
// Ao renomear/excluir uma pasta, as crianças daquela pasta são migradas.
import { NIVEIS } from "./niveis";
import { sincronizarPrefs, EVENTO_PREFS } from "./sync";
import * as storage from "./storage";

const KEY = "controle-aee:pastas";

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function ler(): string[] {
  if (typeof window === "undefined") return [...NIVEIS];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        const limpa = arr.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
        if (limpa.length > 0) return limpa;
      }
    }
  } catch {
    /* preferências corrompidas — volta ao padrão */
  }
  return [...NIVEIS];
}

function carregar(): string[] {
  cache = ler();
  return cache;
}

export function getPastas(): string[] {
  return cache ?? carregar();
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notificar() {
  listeners.forEach((l) => l());
}

function salvar(lista: string[]) {
  cache = lista;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(lista));
    } catch {
      /* armazenamento indisponível */
    }
  }
  notificar();
  sincronizarPrefs(); // replica a lista de pastas na nuvem
}

/** Renomeia uma pasta e migra as crianças que estavam nela */
export function renomearPasta(antigo: string, novo: string) {
  const nome = novo.trim();
  if (!nome || nome === antigo) return;
  const lista = Array.from(new Set(getPastas().map((p) => (p === antigo ? nome : p))));
  storage
    .getCriancas()
    .filter((c) => c.nivel === antigo)
    .forEach((c) => storage.updateCrianca(c.id, { nivel: nome }));
  salvar(lista);
}

/** Cria uma nova pasta (ignora duplicadas) */
export function adicionarPasta(nome: string) {
  const n = nome.trim();
  if (!n) return;
  const lista = getPastas();
  if (lista.includes(n)) return;
  salvar([...lista, n]);
}

/** Exclui a pasta; as crianças dela voltam para "Sem pasta" */
export function removerPasta(nome: string) {
  storage
    .getCriancas()
    .filter((c) => c.nivel === nome)
    .forEach((c) => storage.updateCrianca(c.id, { nivel: undefined }));
  salvar(getPastas().filter((p) => p !== nome));
}

// Quando preferências chegam da nuvem (outro aparelho), recarrega a lista
if (typeof window !== "undefined") {
  window.addEventListener(EVENTO_PREFS, () => {
    carregar();
    notificar();
  });
}

"use client";

// Provider de tema e personalização de cores.
// Todas as preferências (tema, cor de destaque, cor da fonte) ficam salvas
// no localStorage e são reaplicadas automaticamente em toda visita.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { sincronizarPreferencias, EVENTO_PREFS } from "./sync";

type Tema = "claro" | "escuro";

interface CoresPrefs {
  corDestaque: string | null; // hex (ex.: "#EC4899") ou null = padrão do tema
  corTexto: string | null;    // hex ou null = padrão do tema
  corNav: string | null;      // cor da barra de navegação (sidebar/bottom-nav) ou null = padrão
  corCards: string | null;    // cor dos cards do Início (todos juntos) ou null = cores variadas padrão
}

interface TemaContexto {
  tema: Tema;
  alternarTema: () => void;
  corDestaque: string | null;
  corTexto: string | null;
  corNav: string | null;
  corCards: string | null;
  definirCorDestaque: (cor: string | null) => void;
  definirCorTexto: (cor: string | null) => void;
  definirCorNav: (cor: string | null) => void;
  definirCorCards: (cor: string | null) => void;
  restaurarCoresPadrao: () => void;
}

const TemaContexto = createContext<TemaContexto>({
  tema: "claro",
  alternarTema: () => {},
  corDestaque: null,
  corTexto: null,
  corNav: null,
  corCards: null,
  definirCorDestaque: () => {},
  definirCorTexto: () => {},
  definirCorNav: () => {},
  definirCorCards: () => {},
  restaurarCoresPadrao: () => {},
});

const CHAVE_TEMA = "tema-controle-aee";
const CHAVE_CORES = "controle-aee:cores";

// ── Utilitários de cor ───────────────────────────────────────────────────────
function hexParaRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgba(hex: string, alpha: number): string {
  const c = hexParaRgb(hex);
  if (!c) return hex;
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
}

/** Mistura a cor com branco (fator 0..1) para gerar um tom mais claro */
function clarear(hex: string, fator: number): string {
  const c = hexParaRgb(hex);
  if (!c) return hex;
  const f = (v: number) => Math.round(v + (255 - v) * fator);
  return `rgb(${f(c.r)}, ${f(c.g)}, ${f(c.b)})`;
}

/** true quando a cor é clara o bastante para exigir texto escuro por cima */
function corEhClara(hex: string): boolean {
  const c = hexParaRgb(hex);
  if (!c) return false;
  // Luminância relativa percebida (0 = preto, 1 = branco)
  const lum = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
  return lum > 0.6;
}

// Aplica (ou remove) as variáveis CSS personalizadas no <html>
function aplicarCores(prefs: CoresPrefs) {
  const raiz = document.documentElement.style;

  if (prefs.corDestaque) {
    raiz.setProperty("--accent-primary", prefs.corDestaque);
    raiz.setProperty("--accent-secondary", clarear(prefs.corDestaque, 0.25));
    raiz.setProperty("--accent-light", rgba(prefs.corDestaque, 0.14));
  } else {
    raiz.removeProperty("--accent-primary");
    raiz.removeProperty("--accent-secondary");
    raiz.removeProperty("--accent-light");
  }

  if (prefs.corTexto) {
    raiz.setProperty("--text-primary", prefs.corTexto);
    raiz.setProperty("--text-secondary", rgba(prefs.corTexto, 0.78));
    raiz.setProperty("--text-muted", rgba(prefs.corTexto, 0.55));
  } else {
    raiz.removeProperty("--text-primary");
    raiz.removeProperty("--text-secondary");
    raiz.removeProperty("--text-muted");
  }

  // Cor da barra de navegação — recalcula o texto para manter contraste legível
  if (prefs.corNav) {
    raiz.setProperty("--bg-sidebar", prefs.corNav);
    if (corEhClara(prefs.corNav)) {
      raiz.setProperty("--sidebar-fg", "#1A2B45");
      raiz.setProperty("--sidebar-fg-muted", "rgba(26,43,69,0.62)");
      raiz.setProperty("--sidebar-border", "rgba(0,0,0,0.08)");
      raiz.setProperty("--sidebar-hover", "rgba(0,0,0,0.05)");
    } else {
      raiz.setProperty("--sidebar-fg", "#FFFFFF");
      raiz.setProperty("--sidebar-fg-muted", "rgba(255,255,255,0.72)");
      raiz.setProperty("--sidebar-border", "rgba(255,255,255,0.10)");
      raiz.setProperty("--sidebar-hover", "rgba(255,255,255,0.08)");
    }
  } else {
    raiz.removeProperty("--bg-sidebar");
    raiz.removeProperty("--sidebar-fg");
    raiz.removeProperty("--sidebar-fg-muted");
    raiz.removeProperty("--sidebar-border");
    raiz.removeProperty("--sidebar-hover");
  }
}

function lerCoresSalvas(): CoresPrefs {
  try {
    const raw = localStorage.getItem(CHAVE_CORES);
    if (raw) {
      const dados = JSON.parse(raw);
      return {
        corDestaque: typeof dados.corDestaque === "string" ? dados.corDestaque : null,
        corTexto: typeof dados.corTexto === "string" ? dados.corTexto : null,
        corNav: typeof dados.corNav === "string" ? dados.corNav : null,
        corCards: typeof dados.corCards === "string" ? dados.corCards : null,
      };
    }
  } catch {
    // preferências corrompidas — volta ao padrão
  }
  return { corDestaque: null, corTexto: null, corNav: null, corCards: null };
}

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("claro");
  const [cores, setCores] = useState<CoresPrefs>({ corDestaque: null, corTexto: null, corNav: null, corCards: null });

  useEffect(() => {
    const temaSalvo = localStorage.getItem(CHAVE_TEMA) as Tema | null;
    if (temaSalvo) {
      setTema(temaSalvo);
      document.documentElement.classList.toggle("dark", temaSalvo === "escuro");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTema("escuro");
      document.documentElement.classList.add("dark");
    }

    const coresSalvas = lerCoresSalvas();
    setCores(coresSalvas);
    aplicarCores(coresSalvas);

    // Quando preferências chegam da nuvem (outro aparelho), reaplica aqui
    function aoReceberPrefsDaNuvem() {
      const temaNuvem = localStorage.getItem(CHAVE_TEMA) as Tema | null;
      if (temaNuvem) {
        setTema(temaNuvem);
        document.documentElement.classList.toggle("dark", temaNuvem === "escuro");
      }
      const coresNuvem = lerCoresSalvas();
      setCores(coresNuvem);
      aplicarCores(coresNuvem);
    }
    window.addEventListener(EVENTO_PREFS, aoReceberPrefsDaNuvem);
    return () => window.removeEventListener(EVENTO_PREFS, aoReceberPrefsDaNuvem);
  }, []);

  function alternarTema() {
    const novoTema: Tema = tema === "claro" ? "escuro" : "claro";
    setTema(novoTema);
    document.documentElement.classList.toggle("dark", novoTema === "escuro");
    localStorage.setItem(CHAVE_TEMA, novoTema);
    sincronizarPreferencias({ tema: novoTema, cores: lerCoresSalvas() });
  }

  const salvarCores = useCallback((novas: CoresPrefs) => {
    setCores(novas);
    aplicarCores(novas);
    try {
      localStorage.setItem(CHAVE_CORES, JSON.stringify(novas));
    } catch {
      // armazenamento indisponível — mantém só na sessão atual
    }
    const temaAtual = (localStorage.getItem(CHAVE_TEMA) as Tema | null) ?? "claro";
    sincronizarPreferencias({ tema: temaAtual, cores: novas });
  }, []);

  const definirCorDestaque = useCallback(
    (cor: string | null) => salvarCores({ ...lerCoresSalvas(), corDestaque: cor }),
    [salvarCores]
  );

  const definirCorTexto = useCallback(
    (cor: string | null) => salvarCores({ ...lerCoresSalvas(), corTexto: cor }),
    [salvarCores]
  );

  const definirCorNav = useCallback(
    (cor: string | null) => salvarCores({ ...lerCoresSalvas(), corNav: cor }),
    [salvarCores]
  );

  const definirCorCards = useCallback(
    (cor: string | null) => salvarCores({ ...lerCoresSalvas(), corCards: cor }),
    [salvarCores]
  );

  const restaurarCoresPadrao = useCallback(
    () => salvarCores({ corDestaque: null, corTexto: null, corNav: null, corCards: null }),
    [salvarCores]
  );

  return (
    <TemaContexto.Provider
      value={{
        tema,
        alternarTema,
        corDestaque: cores.corDestaque,
        corTexto: cores.corTexto,
        corNav: cores.corNav,
        corCards: cores.corCards,
        definirCorDestaque,
        definirCorTexto,
        definirCorNav,
        definirCorCards,
        restaurarCoresPadrao,
      }}
    >
      {children}
    </TemaContexto.Provider>
  );
}

export function useTema() {
  return useContext(TemaContexto);
}

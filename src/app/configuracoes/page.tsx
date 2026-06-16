"use client";

import { useState, useEffect } from "react";
import { useTema } from "@/lib/theme";
import { Sun, Moon, Info, Database, Smartphone, Heart, Palette, RotateCcw, Cloud, CloudOff, RefreshCw } from "lucide-react";
import { isSupabaseConnected, getCodigo } from "@/lib/supabase";
import { desativarSincronizacao, puxarDaNuvem, ativarSincronizacao } from "@/lib/sync";

// Card de status da sincronização entre aparelhos.
// A ativação acontece sozinha pelo link especial (?ativar=...) — a Rafaela
// não digita nada; este card só mostra o status e ações simples.
function CartaoSincronizacao() {
  const [montado, setMontado] = useState(false);
  const [ativada, setAtivada] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [mostrarEntrada, setMostrarEntrada] = useState(false);
  const [codigoAtual, setCodigoAtual] = useState<string | null>(null);

  useEffect(() => {
    setMontado(true);
    const conectado = isSupabaseConnected();
    setAtivada(conectado);
    if (conectado) setCodigoAtual(getCodigo());
  }, []);

  async function handleAtivarCodigo() {
    if (!codigoDigitado.trim()) {
      setMensagem({ tipo: 'erro', texto: 'Digite o código de acesso.' });
      return;
    }
    setOcupado(true);
    setMensagem(null);
    const resultado = await ativarSincronizacao(codigoDigitado.trim());
    if (resultado.ok) {
      setAtivada(true);
      setCodigoAtual(getCodigo());
      setMostrarEntrada(false);
      setCodigoDigitado('');
    }
    setMensagem({ tipo: resultado.ok ? 'ok' : 'erro', texto: resultado.mensagem });
    setOcupado(false);
  }

  async function handleSincronizarAgora() {
    setOcupado(true);
    setMensagem(null);
    const ok = await puxarDaNuvem();
    setMensagem(
      ok
        ? { tipo: "ok", texto: "Tudo sincronizado!" }
        : { tipo: "erro", texto: "Não foi possível sincronizar agora. Verifique a internet." }
    );
    setOcupado(false);
  }

  function handleDesativar() {
    desativarSincronizacao();
    setAtivada(false);
    setCodigoAtual(null);
    setMensagem({ tipo: "ok", texto: "Sincronização desativada neste aparelho. Os dados locais continuam intactos." });
  }

  const botaoPrimario: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.625rem 1.125rem",
    borderRadius: "0.5rem",
    fontSize: "0.8125rem",
    fontWeight: 700,
    cursor: ocupado ? "wait" : "pointer",
    border: "none",
    background: "var(--accent-primary)",
    color: "#fff",
    opacity: ocupado ? 0.7 : 1,
  };

  const botaoDiscreto: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.625rem 1.125rem",
    borderRadius: "0.5rem",
    fontSize: "0.8125rem",
    fontWeight: 600,
    cursor: ocupado ? "wait" : "pointer",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text-secondary)",
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div
          style={{
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "0.625rem",
            background: ativada ? "rgba(46,204,142,0.12)" : "var(--accent-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {ativada
            ? <Cloud size={20} color="var(--success)" />
            : <Database size={20} color="var(--accent-primary)" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem", flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Dados em todos os aparelhos
            </h3>
            {montado && (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: ativada ? "var(--success)" : "var(--text-muted)",
                  background: ativada ? "rgba(46,204,142,0.12)" : "var(--bg-primary)",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "9999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {ativada ? "● Ativa" : "Desativada"}
              </span>
            )}
          </div>

          {!ativada ? (
            <div>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                Para seus dados aparecerem em qualquer celular ou computador, ative a sincronização
                inserindo o <strong>código de acesso</strong> abaixo — basta fazer isso <strong>uma vez por aparelho</strong>.
              </p>
              {!mostrarEntrada ? (
                <button
                  onClick={() => setMostrarEntrada(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.625rem 1.125rem", borderRadius: "0.5rem",
                    fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer",
                    border: "none", background: "var(--accent-primary)", color: "#fff",
                  }}
                >
                  <Cloud size={15} /> Ativar sincronização
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      placeholder="Cole ou digite o código de acesso..."
                      value={codigoDigitado}
                      onChange={(e) => setCodigoDigitado(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') void handleAtivarCodigo(); }}
                      style={{
                        flex: 1, minWidth: 0, padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                        border: "1px solid var(--border)", background: "var(--bg-primary)",
                        color: "var(--text-primary)", fontSize: "0.875rem", outline: "none",
                      }}
                    />
                    <button
                      onClick={() => void handleAtivarCodigo()}
                      disabled={ocupado}
                      style={{
                        padding: "0.5rem 1rem", borderRadius: "0.5rem",
                        fontSize: "0.8125rem", fontWeight: 700, cursor: ocupado ? "wait" : "pointer",
                        border: "none", background: "var(--accent-primary)", color: "#fff",
                        opacity: ocupado ? 0.7 : 1, flexShrink: 0,
                      }}
                    >
                      {ocupado ? "Ativando…" : "Confirmar"}
                    </button>
                  </div>
                  <button
                    onClick={() => { setMostrarEntrada(false); setCodigoDigitado(''); setMensagem(null); }}
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                Este aparelho está sincronizado. Tudo que você registrar aqui aparece nos outros
                aparelhos com o mesmo código ativado — e vice-versa.
              </p>
              {codigoAtual && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap",
                  padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                  background: "var(--bg-primary)", border: "1px solid var(--border)",
                  marginBottom: "0.875rem",
                }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Código:</span>
                  <code style={{ fontSize: "0.8125rem", color: "var(--text-primary)", fontFamily: "monospace", flex: 1, wordBreak: "break-all" }}>
                    {codigoAtual}
                  </code>
                  <button
                    onClick={() => { navigator.clipboard?.writeText(codigoAtual ?? '').catch(() => {}); setMensagem({ tipo: 'ok', texto: 'Código copiado!' }); }}
                    title="Copiar código"
                    style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Copiar
                  </button>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                <button onClick={handleSincronizarAgora} disabled={ocupado} style={botaoPrimario}>
                  <RefreshCw size={15} />
                  {ocupado ? "Sincronizando..." : "Sincronizar agora"}
                </button>
                <button onClick={handleDesativar} disabled={ocupado} style={botaoDiscreto}>
                  <CloudOff size={15} />
                  Desativar neste aparelho
                </button>
              </div>
            </>
          )}

          {mensagem && (
            <p
              style={{
                marginTop: "0.875rem",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: mensagem.tipo === "ok" ? "var(--success)" : "var(--danger)",
              }}
            >
              {mensagem.texto}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Cores de destaque pré-definidas — a Rafaela também pode escolher qualquer
// outra cor pelo seletor livre
const CORES_DESTAQUE = [
  { nome: "Azul AEE",  cor: "#4A9EBF" },
  { nome: "Rosa",      cor: "#EC4899" },
  { nome: "Lilás",     cor: "#A78BFA" },
  { nome: "Roxo",      cor: "#8B5CF6" },
  { nome: "Verde",     cor: "#2ECC8E" },
  { nome: "Teal",      cor: "#14B8A6" },
  { nome: "Âmbar",     cor: "#F0A500" },
  { nome: "Coral",     cor: "#F87171" },
  { nome: "Ciano",     cor: "#06B6D4" },
  { nome: "Índigo",    cor: "#6366F1" },
];

function BolinhaDeCor({
  cor,
  nome,
  ativa,
  onClick,
}: {
  cor: string;
  nome: string;
  ativa: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={nome}
      aria-label={`Cor ${nome}`}
      aria-pressed={ativa}
      style={{
        width: "2.25rem",
        height: "2.25rem",
        borderRadius: "50%",
        background: cor,
        cursor: "pointer",
        border: ativa ? "3px solid var(--text-primary)" : "3px solid transparent",
        outline: ativa ? "2px solid var(--bg-card)" : "none",
        outlineOffset: "-5px",
        transition: "transform 150ms, border-color 150ms",
        flexShrink: 0,
      }}
    />
  );
}

function SeletorDeCores() {
  const {
    corDestaque,
    corTexto,
    definirCorDestaque,
    definirCorTexto,
    restaurarCoresPadrao,
  } = useTema();

  const rotuloPequeno: React.CSSProperties = {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "0.625rem",
  };

  const chipPadrao = (ativo: boolean): React.CSSProperties => ({
    padding: "0.4rem 0.875rem",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    cursor: "pointer",
    border: ativo ? "2px solid var(--accent-primary)" : "2px solid var(--border)",
    background: ativo ? "var(--accent-light)" : "transparent",
    color: ativo ? "var(--accent-primary)" : "var(--text-secondary)",
    transition: "all 150ms",
    flexShrink: 0,
  });

  const seletorLivre: React.CSSProperties = {
    width: "2.25rem",
    height: "2.25rem",
    padding: 0,
    border: "2px dashed var(--border)",
    borderRadius: "50%",
    background: "transparent",
    cursor: "pointer",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        marginTop: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
        <Palette size={16} color="var(--accent-primary)" />
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
          Cores do sistema
        </p>
      </div>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
        Escolha a cor de destaque e a cor do texto do seu jeito. Tudo fica salvo
        automaticamente neste dispositivo.
      </p>

      {/* Cor de destaque */}
      <p style={rotuloPequeno}>Cor de destaque</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", alignItems: "center", marginBottom: "1.25rem" }}>
        <button onClick={() => definirCorDestaque(null)} style={chipPadrao(corDestaque === null)}>
          Padrão
        </button>
        {CORES_DESTAQUE.map((c) => (
          <BolinhaDeCor
            key={c.cor}
            cor={c.cor}
            nome={c.nome}
            ativa={corDestaque?.toLowerCase() === c.cor.toLowerCase()}
            onClick={() => definirCorDestaque(c.cor)}
          />
        ))}
        {/* Seletor livre — qualquer cor */}
        <input
          type="color"
          value={corDestaque ?? "#4A9EBF"}
          onChange={(e) => definirCorDestaque(e.target.value)}
          title="Escolher qualquer cor"
          aria-label="Escolher qualquer cor de destaque"
          style={seletorLivre}
        />
      </div>

      {/* Cor do texto */}
      <p style={rotuloPequeno}>Cor do texto</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", alignItems: "center", marginBottom: "1.25rem" }}>
        <button onClick={() => definirCorTexto(null)} style={chipPadrao(corTexto === null)}>
          Padrão do tema
        </button>
        <input
          type="color"
          value={corTexto ?? "#1A2B45"}
          onChange={(e) => definirCorTexto(e.target.value)}
          title="Escolher qualquer cor de texto"
          aria-label="Escolher qualquer cor de texto"
          style={seletorLivre}
        />
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Toque no círculo para escolher qualquer cor
        </span>
      </div>

      {/* Restaurar tudo */}
      {(corDestaque !== null || corTexto !== null) && (
        <button
          onClick={restaurarCoresPadrao}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: "pointer",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-secondary)",
          }}
        >
          <RotateCcw size={14} />
          Restaurar cores padrão
        </button>
      )}
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { tema, alternarTema } = useTema();

  return (
    <div
      style={{
        maxWidth: "720px",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Cabeçalho da página */}
      <div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.25rem",
          }}
        >
          Configurações
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Personalize o sistema conforme sua preferência
        </p>
      </div>

      {/* ── SEÇÃO 1: Aparência ── */}
      <section>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.875rem",
          }}
        >
          Aparência
        </p>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "0.375rem",
            }}
          >
            Tema do sistema
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Escolha entre tema claro e escuro. Sua preferência será salva automaticamente.
          </p>

          {/* Cards de seleção de tema */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {/* Card Tema Claro */}
            <button
              onClick={() => { if (tema !== "claro") alternarTema(); }}
              aria-pressed={tema === "claro"}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1.25rem 1rem",
                borderRadius: "0.75rem",
                border: tema === "claro"
                  ? "2px solid var(--accent-primary)"
                  : "2px solid var(--border)",
                background: tema === "claro"
                  ? "var(--accent-light)"
                  : "transparent",
                cursor: "pointer",
                transition: "border-color 200ms, background 200ms",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  background: tema === "claro"
                    ? "var(--accent-primary)"
                    : "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 200ms",
                }}
              >
                <Sun
                  size={22}
                  color={tema === "claro" ? "#fff" : "var(--text-muted)"}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.2rem",
                    textAlign: "center",
                  }}
                >
                  Tema Claro
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    textAlign: "center",
                  }}
                >
                  Fundo azul-gelo
                </p>
              </div>
              {tema === "claro" && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--accent-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Ativo
                </span>
              )}
            </button>

            {/* Card Tema Escuro */}
            <button
              onClick={() => { if (tema !== "escuro") alternarTema(); }}
              aria-pressed={tema === "escuro"}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1.25rem 1rem",
                borderRadius: "0.75rem",
                border: tema === "escuro"
                  ? "2px solid var(--accent-primary)"
                  : "2px solid var(--border)",
                background: tema === "escuro"
                  ? "var(--accent-light)"
                  : "transparent",
                cursor: "pointer",
                transition: "border-color 200ms, background 200ms",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "50%",
                  background: tema === "escuro"
                    ? "var(--accent-primary)"
                    : "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 200ms",
                }}
              >
                <Moon
                  size={22}
                  color={tema === "escuro" ? "#fff" : "var(--text-muted)"}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.2rem",
                    textAlign: "center",
                  }}
                >
                  Tema Escuro
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    textAlign: "center",
                  }}
                >
                  Navy midnight
                </p>
              </div>
              {tema === "escuro" && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--accent-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Ativo
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Personalização de cores */}
        <SeletorDeCores />
      </section>

      {/* ── SEÇÃO 2: Sobre o sistema ── */}
      <section>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.875rem",
          }}
        >
          Sobre o sistema
        </p>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.625rem",
                background: "var(--accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Info size={20} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem", marginBottom: "0.25rem" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Controle AEE
                </h3>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "9999px",
                    border: "1px solid var(--border)",
                  }}
                >
                  v2.0
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "0.875rem",
                }}
              >
                Sistema de gestão para o Atendimento Educacional Especializado (AEE), desenvolvido para
                apoiar psicólogas e pedagogas que acompanham crianças com necessidades educacionais especiais.
                Permite registrar sessões, acompanhar a evolução de cada aluno e gerar relatórios profissionais.
              </p>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "0.875rem",
                }}
              >
                O AEE é um serviço da Educação Especial que identifica, elabora e organiza recursos pedagógicos
                e de acessibilidade, que eliminem as barreiras para a plena participação dos estudantes,
                considerando as suas necessidades específicas (Decreto 7.611/2011).
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                <Heart size={13} color="var(--danger)" />
                <span>
                  Desenvolvido por <strong>Rayan</strong>, com cuidado, para Rafaela Dias — Psicóloga AEE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: Sincronização na nuvem ── */}
      <section>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.875rem",
          }}
        >
          Sincronização na nuvem
        </p>
        <CartaoSincronizacao />
      </section>

      {/* ── SEÇÃO 4: Como instalar no celular (PWA) ── */}
      <section>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.875rem",
          }}
        >
          Instalar no celular
        </p>

        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.625rem",
                background: "rgba(46,204,142,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Smartphone size={20} color="var(--success)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.375rem",
                }}
              >
                Instalar como aplicativo
              </h3>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                O Controle AEE é um PWA (Aplicativo Web Progressivo) — pode ser instalado diretamente
                no celular sem precisar da App Store ou Google Play. Funciona como um app nativo,
                inclusive offline.
              </p>

              {/* iPhone / Safari */}
              <div
                style={{
                  padding: "0.875rem 1rem",
                  borderRadius: "0.625rem",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                  marginBottom: "0.625rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>🍎</span>
                  iPhone / Safari
                </p>
                <ol
                  style={{
                    paddingLeft: "1.125rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    margin: 0,
                  }}
                >
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Abra o link do sistema no Safari
                  </li>
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Toque no ícone de compartilhar{" "}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--border)",
                        borderRadius: "0.25rem",
                        padding: "0 0.3rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      ⎙
                    </span>{" "}
                    na barra inferior
                  </li>
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Role para baixo e toque em{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      &ldquo;Adicionar à Tela Início&rdquo;
                    </strong>
                  </li>
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Confirme tocando em{" "}
                    <strong style={{ color: "var(--text-primary)" }}>Adicionar</strong>
                  </li>
                </ol>
              </div>

              {/* Android / Chrome */}
              <div
                style={{
                  padding: "0.875rem 1rem",
                  borderRadius: "0.625rem",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>🤖</span>
                  Android / Chrome
                </p>
                <ol
                  style={{
                    paddingLeft: "1.125rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    margin: 0,
                  }}
                >
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Abra o link do sistema no Chrome
                  </li>
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Toque no menu{" "}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--border)",
                        borderRadius: "0.25rem",
                        padding: "0 0.3rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      ⋮
                    </span>{" "}
                    no canto superior direito
                  </li>
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Toque em{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      &ldquo;Instalar aplicativo&rdquo;
                    </strong>{" "}
                    ou{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      &ldquo;Adicionar à tela inicial&rdquo;
                    </strong>
                  </li>
                  <li style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Confirme a instalação
                  </li>
                </ol>
              </div>

              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.875rem",
                  lineHeight: 1.5,
                }}
              >
                Após instalar, o ícone do Controle AEE aparecerá na tela inicial do celular, assim como
                qualquer outro aplicativo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

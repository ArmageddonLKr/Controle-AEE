"use client";

import { useTema } from "@/lib/theme";
import { Sun, Moon, Info, Database, Smartphone, Heart } from "lucide-react";

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
                  v1.0 — Fase Visual
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
                  Desenvolvido com cuidado para Rafaela Dias — Psicóloga AEE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO 3: Conexão Supabase ── */}
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
          Banco de dados
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
                background: "rgba(240,165,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Database size={20} color="var(--warning)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Supabase — Em breve
                </h3>
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "var(--warning)",
                    background: "rgba(240,165,0,0.12)",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "9999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Fase 2
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                Atualmente os dados ficam salvos com segurança neste dispositivo (no navegador).
                Na segunda fase, os dados serão sincronizados com o Supabase — uma plataforma
                de banco de dados segura e gratuita — permitindo acesso de vários aparelhos.
                A conexão acontecerá quando Rafaela criar sua conta.
              </p>

              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.5rem",
                }}
              >
                Próximos passos
              </p>
              <ol
                style={{
                  paddingLeft: "1.125rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.375rem",
                  margin: 0,
                }}
              >
                {[
                  "Rafaela cria conta gratuita em supabase.com",
                  "Criar projeto com nome \"controle-aee\"",
                  "Copiar a URL e a chave anônima do projeto",
                  "Enviar as credenciais para o desenvolvedor",
                  "Configurar variáveis de ambiente e publicar nova versão",
                  "Migrar os dados deste dispositivo para o banco na nuvem",
                ].map((passo, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      paddingLeft: "0.25rem",
                    }}
                  >
                    {passo}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
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

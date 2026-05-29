"use client";

import { useState, useMemo } from "react";
import { useCriancas, useTodasSessoes } from "@/hooks/useAlunos";
import { isAniversarioHoje, diasAteAniversario } from "@/lib/utils/birthday";
import {
  format,
  differenceInYears,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";

// Gera cor por tipo de sessão
function corTipo(tipo: string) {
  const cores: Record<string, string> = {
    individual: "var(--accent-primary)",
    grupo: "var(--accent-secondary)",
    familiar: "var(--warning)",
    orientacao: "var(--text-muted)",
  };
  return cores[tipo] ?? "var(--accent-primary)";
}

// Label legível do tipo
function labelTipo(tipo: string) {
  const labels: Record<string, string> = {
    individual: "Individual",
    grupo: "Grupo",
    familiar: "Familiar",
    orientacao: "Orientação",
  };
  return labels[tipo] ?? tipo;
}

export default function CalendarioPage() {
  const { criancas, loading: loadingC } = useCriancas();
  const { sessoes, loading: loadingS } = useTodasSessoes();
  const loading = loadingC || loadingS;

  const getNomeCrianca = (id: string): string => {
    const c = criancas.find((x) => x.id === id);
    return c ? (c.apelido ?? c.nome.split(" ")[0]) : "—";
  };

  const getSessoesDoDia = (dia: Date) => {
    const iso = format(dia, "yyyy-MM-dd");
    return sessoes.filter((s) => s.data === iso);
  };

  const getAniversariosDoDia = (dia: Date) => {
    return criancas.filter((c) => {
      const nasc = new Date(c.dataNascimento + "T00:00:00");
      return nasc.getMonth() === dia.getMonth() && nasc.getDate() === dia.getDate();
    });
  };

  const [mesAtual, setMesAtual] = useState<Date>(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);

  // Dias do mês atual preenchendo com nulos para alinhar ao dia da semana
  const diasDoMes = useMemo(() => {
    const inicio = startOfMonth(mesAtual);
    const fim = endOfMonth(mesAtual);
    const dias = eachDayOfInterval({ start: inicio, end: fim });
    // Domingo = 0, queremos começar na coluna correta
    const deslocamento = getDay(inicio); // 0=Dom, 1=Seg …
    const celulas: (Date | null)[] = Array(deslocamento).fill(null).concat(dias);
    return celulas;
  }, [mesAtual]);

  // Próximos 7 eventos: sessões (a partir de hoje) + aniversários (próximos 7 dias)
  const proximosEventos = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    type Evento = {
      tipo: "sessao" | "aniversario";
      data: Date;
      titulo: string;
      subtitulo: string;
    };

    const eventos: Evento[] = [];

    // Sessões futuras (inclusive hoje)
    sessoes.forEach((s) => {
      const data = new Date(s.data + "T00:00:00");
      if (data >= hoje) {
        const crianca = criancas.find((c) => c.id === s.criancaId);
        eventos.push({
          tipo: "sessao",
          data,
          titulo: crianca ? (crianca.apelido ?? crianca.nome.split(" ")[0]) : "Sessão",
          subtitulo: `${labelTipo(s.tipo)} · ${s.hora}`,
        });
      }
    });

    // Aniversários nos próximos 7 dias
    criancas.forEach((c) => {
      const dias = diasAteAniversario(c.dataNascimento);
      if (dias >= 0 && dias <= 7) {
        const nasc = new Date(c.dataNascimento + "T00:00:00");
        const anivData = new Date(hoje);
        anivData.setDate(hoje.getDate() + dias);
        const idade = differenceInYears(anivData, nasc);
        eventos.push({
          tipo: "aniversario",
          data: anivData,
          titulo: c.apelido ?? c.nome.split(" ")[0],
          subtitulo: dias === 0 ? `🎂 ${idade} anos — Hoje!` : `🎂 ${idade} anos — em ${dias} dia${dias !== 1 ? "s" : ""}`,
        });
      }
    });

    // Ordenar por data e pegar os 7 primeiros
    eventos.sort((a, b) => a.data.getTime() - b.data.getTime());
    return eventos.slice(0, 7);
  }, []);

  const sessoesDiaSelecionado = diaSelecionado ? getSessoesDoDia(diaSelecionado) : [];
  const aniversariosDiaSelecionado = diaSelecionado ? getAniversariosDoDia(diaSelecionado) : [];

  const cabecalhosSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "var(--text-primary)",
      }}
    >
      {/* Cabeçalho da página */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.25rem",
          }}
        >
          Calendário
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Visualize sessões e aniversários por mês
        </p>
      </div>

      {/* Layout principal: calendário (2/3) + painel lateral (1/3) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
        }}
        className="md:grid-cols-[2fr_1fr]"
      >
        {/* ── COLUNA ESQUERDA: Calendário ── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          {/* Navegação do mês */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <button
              onClick={() => setMesAtual((m) => subMonths(m, 1))}
              aria-label="Mês anterior"
              style={{
                width: "2.25rem",
                height: "2.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "1.1rem",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "var(--accent-light)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "transparent")
              }
            >
              ‹
            </button>

            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                textTransform: "capitalize",
              }}
            >
              {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>

            <button
              onClick={() => setMesAtual((m) => addMonths(m, 1))}
              aria-label="Próximo mês"
              style={{
                width: "2.25rem",
                height: "2.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "1.1rem",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "var(--accent-light)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background =
                  "transparent")
              }
            >
              ›
            </button>
          </div>

          {/* Grade do calendário */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "0.25rem",
            }}
          >
            {/* Cabeçalho dos dias da semana */}
            {cabecalhosSemana.map((dia) => (
              <div
                key={dia}
                style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  paddingBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {dia}
              </div>
            ))}

            {/* Células dos dias */}
            {diasDoMes.map((dia, idx) => {
              if (!dia) {
                return <div key={`empty-${idx}`} />;
              }

              const sessDia = getSessoesDoDia(dia);
              const anivDia = getAniversariosDoDia(dia);
              const temSessao = sessDia.length > 0;
              const temAniversario = anivDia.length > 0;
              const ehHoje = isToday(dia);
              const ehSelecionado =
                diaSelecionado !== null && isSameDay(dia, diaSelecionado);
              const ehMesAtual = isSameMonth(dia, mesAtual);
              const temEventos = temSessao || temAniversario;

              return (
                <button
                  key={dia.toISOString()}
                  onClick={() => {
                    if (temEventos) {
                      setDiaSelecionado(
                        ehSelecionado ? null : dia
                      );
                    }
                  }}
                  title={
                    temSessao
                      ? `${sessDia.length} sessão(ões)`
                      : temAniversario
                      ? `${anivDia.length} aniversário(s)`
                      : undefined
                  }
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.1rem",
                    borderRadius: "0.5rem",
                    border: ehSelecionado
                      ? "2px solid var(--accent-primary)"
                      : ehHoje
                      ? "2px solid var(--accent-primary)"
                      : "2px solid transparent",
                    background: ehSelecionado
                      ? "var(--accent-light)"
                      : ehHoje
                      ? "var(--accent-light)"
                      : "transparent",
                    cursor: temEventos ? "pointer" : "default",
                    opacity: ehMesAtual ? 1 : 0.3,
                    transition: "background 150ms, border-color 150ms",
                    padding: "0.25rem",
                    minHeight: "2.5rem",
                  }}
                  onMouseEnter={(e) => {
                    if (temEventos && !ehSelecionado) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--accent-light)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!ehSelecionado && !ehHoje) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  {/* Número do dia */}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: ehHoje ? 700 : 400,
                      color: ehHoje
                        ? "var(--accent-primary)"
                        : "var(--text-primary)",
                      lineHeight: 1,
                    }}
                  >
                    {format(dia, "d")}
                  </span>

                  {/* Indicadores de evento */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.2rem",
                      alignItems: "center",
                      minHeight: "0.5rem",
                    }}
                  >
                    {temSessao && (
                      <span
                        style={{
                          width: "0.35rem",
                          height: "0.35rem",
                          borderRadius: "50%",
                          background: "var(--accent-primary)",
                          display: "block",
                        }}
                      />
                    )}
                    {temAniversario && (
                      <span style={{ fontSize: "0.55rem", lineHeight: 1 }}>
                        🎂
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legenda */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  background: "var(--accent-primary)",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Sessão agendada
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span style={{ fontSize: "0.75rem" }}>🎂</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Aniversário
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span
                style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "0.25rem",
                  border: "2px solid var(--accent-primary)",
                  background: "var(--accent-light)",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Hoje / Selecionado
              </span>
            </div>
          </div>
        </div>

        {/* ── COLUNA DIREITA: Próximos eventos + painel do dia ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Painel do dia selecionado */}
          {diaSelecionado && (sessoesDiaSelecionado.length > 0 || aniversariosDiaSelecionado.length > 0) && (
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--accent-primary)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--accent-primary)",
                    textTransform: "capitalize",
                  }}
                >
                  {format(diaSelecionado, "dd 'de' MMMM", { locale: ptBR })}
                </h3>
                <button
                  onClick={() => setDiaSelecionado(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    lineHeight: 1,
                    padding: "0.125rem 0.375rem",
                    borderRadius: "0.25rem",
                  }}
                  aria-label="Fechar painel"
                >
                  ×
                </button>
              </div>

              {/* Aniversários do dia */}
              {aniversariosDiaSelecionado.length > 0 && (
                <div style={{ marginBottom: "0.75rem" }}>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Aniversários 🎂
                  </p>
                  {aniversariosDiaSelecionado.map((c) => {
                    const idade = differenceInYears(
                      diaSelecionado,
                      new Date(c.dataNascimento + "T00:00:00")
                    );
                    return (
                      <div
                        key={c.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.625rem",
                          borderRadius: "0.5rem",
                          background: "var(--accent-light)",
                          marginBottom: "0.375rem",
                        }}
                      >
                        <span style={{ fontSize: "1rem" }}>🎂</span>
                        <div>
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              marginBottom: "0.1rem",
                            }}
                          >
                            {c.apelido ?? c.nome.split(" ")[0]}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {idade} anos
                            {isAniversarioHoje(c.dataNascimento) && " · Hoje! 🎉"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sessões do dia */}
              {sessoesDiaSelecionado.length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Sessões
                  </p>
                  {sessoesDiaSelecionado.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: "0.625rem",
                        borderRadius: "0.5rem",
                        border: "1px solid var(--border)",
                        marginBottom: "0.375rem",
                        position: "relative",
                        paddingLeft: "0.875rem",
                      }}
                    >
                      {/* Faixa colorida lateral */}
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "0.25rem",
                          bottom: "0.25rem",
                          width: "3px",
                          borderRadius: "2px",
                          background: corTipo(s.tipo),
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              marginBottom: "0.1rem",
                            }}
                          >
                            {getNomeCrianca(s.criancaId)}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {labelTipo(s.tipo)} · {s.hora} · {s.duracao} min
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            padding: "0.1rem 0.4rem",
                            borderRadius: "9999px",
                            background: s.presente
                              ? "rgba(46,204,142,0.15)"
                              : "rgba(224,85,85,0.12)",
                            color: s.presente ? "var(--success)" : "var(--danger)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.presente ? "Presente" : "Faltou"}
                        </span>
                      </div>
                      {s.anotacoes && (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            marginTop: "0.375rem",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {s.anotacoes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Próximos 7 eventos */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
              flex: 1,
            }}
          >
            <h3
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: "1rem",
              }}
            >
              Próximos eventos
            </h3>

            {proximosEventos.length === 0 ? (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  padding: "1rem 0",
                }}
              >
                Nenhum evento próximo
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {proximosEventos.map((ev, idx) => (
                  <div
                    key={`${ev.tipo}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.75rem",
                      borderRadius: "0.5rem",
                      background: isToday(ev.data)
                        ? "var(--accent-light)"
                        : "transparent",
                      border: isToday(ev.data)
                        ? "1px solid var(--border)"
                        : "1px solid transparent",
                      transition: "background 150ms",
                    }}
                  >
                    {/* Ícone do tipo de evento */}
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        background:
                          ev.tipo === "aniversario"
                            ? "rgba(240,165,0,0.12)"
                            : "var(--accent-light)",
                        fontSize: ev.tipo === "aniversario" ? "1rem" : "0.8rem",
                        color: "var(--accent-primary)",
                        fontWeight: 700,
                      }}
                    >
                      {ev.tipo === "aniversario" ? "🎂" : "📋"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          marginBottom: "0.1rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.titulo}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {ev.subtitulo}
                      </p>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {format(ev.data, "dd/MM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estilos responsivos via classe Tailwind */}
      <style>{`
        @media (min-width: 768px) {
          .md\\:grid-cols-\\[2fr_1fr\\] {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

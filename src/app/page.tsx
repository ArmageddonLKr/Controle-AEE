"use client";

import { useMemo } from "react";
import { Users, Calendar, Star, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { StatCard } from "@/components/shared/StatCard";
import { BirthdayAlert } from "@/components/shared/BirthdayAlert";
import { useCriancas, useDashboard } from "@/hooks/useAlunos";
import { getGreeting } from "@/lib/utils/greeting";
import { getAniversariosProximos, isAniversarioHoje } from "@/lib/utils/birthday";

const TIPO_LABEL: Record<string, string> = {
  individual: "Individual",
  grupo: "Grupo",
  familiar: "Familiar",
  orientacao: "Orientação",
};

export default function Dashboard() {
  const { criancas, ativas, emEspera, loading: loadingC } = useCriancas();
  const { sessoesRecentes, sessoesMes, loading: loadingS } = useDashboard();

  const aniversariosProximos = useMemo(() => getAniversariosProximos(criancas, 7), [criancas]);
  const aniversariosHoje = useMemo(() => criancas.filter((c) => isAniversarioHoje(c.dataNascimento)), [criancas]);

  const criancasSemSessao = useMemo(() => {
    const limite = new Date();
    limite.setDate(limite.getDate() - 15);
    return ativas.filter((c) => {
      const sessoesC = sessoesRecentes.filter((s) => s.criancaId === c.id);
      if (sessoesC.length === 0) return true;
      return new Date(sessoesC[0].data) < limite;
    });
  }, [ativas, sessoesRecentes]);

  const dataHoje = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const saudacao = getGreeting("Rafaela");

  const loading = loadingC || loadingS;

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 gap-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          {saudacao}
        </h1>
        <p className="text-sm mt-1 capitalize" style={{ color: "var(--text-muted)" }}>
          {dataHoje}
        </p>
      </div>

      {/* Alerta de aniversário hoje */}
      {aniversariosHoje.length > 0 && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, rgba(240,165,0,0.12), rgba(240,165,0,0.04))",
            border: "1px solid rgba(240,165,0,0.4)",
          }}
        >
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold" style={{ color: "#B87800" }}>
              {aniversariosHoje.length === 1
                ? `Hoje é aniversário de ${aniversariosHoje[0].nome.split(" ")[0]}!`
                : `${aniversariosHoje.length} aniversários hoje!`}
            </p>
            <p className="text-sm" style={{ color: "#F0A500" }}>
              {aniversariosHoje.map((c) => c.nome.split(" ")[0]).join(", ")} 🎂
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0,1,2,3].map((i) => (
            <div key={i} className="card-aee p-5 h-28 animate-pulse" style={{ background: "var(--bg-card)" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            titulo="Crianças ativas"
            valor={ativas.length}
            icone={<Users size={22} />}
            descricao={`${emEspera.length} em espera`}
            cor="azul"
          />
          <StatCard
            titulo="Sessões este mês"
            valor={sessoesMes.length}
            icone={<Calendar size={22} />}
            descricao={`${sessoesMes.filter((s) => s.presente).length} com presença`}
            cor="verde"
          />
          <StatCard
            titulo="Aniversários (7 dias)"
            valor={aniversariosProximos.length}
            icone={<Star size={22} />}
            descricao={aniversariosHoje.length > 0 ? `${aniversariosHoje.length} hoje 🎉` : "Nenhum hoje"}
            cor="ambar"
          />
          <StatCard
            titulo="Total de crianças"
            valor={criancas.length}
            icone={<Clock size={22} />}
            descricao={`${criancas.filter((c) => c.status === "inativo").length} inativas`}
            cor="roxo"
          />
        </div>
      )}

      {/* Grade inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <BirthdayAlert criancas={criancas} />

          {criancasSemSessao.length > 0 && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(224, 85, 85, 0.06)", border: "1px solid rgba(224, 85, 85, 0.25)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚠️</span>
                <h3 className="font-semibold text-sm" style={{ color: "#E05555" }}>
                  Sem sessão há mais de 15 dias ({criancasSemSessao.length})
                </h3>
              </div>
              <div className="space-y-1">
                {criancasSemSessao.slice(0, 4).map((c) => (
                  <Link
                    key={c.id}
                    href={`/alunos/perfil?id=${c.id}`}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  >
                    <div
                      className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "rgba(224,85,85,0.12)", color: "#E05555" }}
                    >
                      {c.nome.charAt(0)}
                    </div>
                    <span style={{ color: "var(--text-primary)" }}>{c.nome.split(" ")[0]}</span>
                    <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                      {c.diagnosticos[0] ?? ""}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Estado vazio do dashboard */}
          {!loading && criancas.length === 0 && (
            <div
              className="rounded-xl p-8 text-center"
              style={{ border: "2px dashed var(--border)", background: "var(--bg-card)" }}
            >
              <p className="text-4xl mb-3">👶</p>
              <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                Nenhuma criança cadastrada ainda
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                Cadastre a primeira criança para começar.
              </p>
              <Link
                href="/alunos"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "var(--accent-primary)", color: "#fff" }}
              >
                Ir para Crianças
              </Link>
            </div>
          )}
        </div>

        {/* Sessões recentes */}
        <div className="card-aee p-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
            Sessões recentes
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[0,1,2].map((i) => (
                <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: "var(--bg-primary)" }} />
              ))}
            </div>
          ) : sessoesRecentes.length === 0 ? (
            <div className="py-8 text-center" style={{ color: "var(--text-muted)" }}>
              <p className="text-sm">Nenhuma sessão registrada ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessoesRecentes.map((sessao) => {
                const crianca = criancas.find((c) => c.id === sessao.criancaId);
                if (!crianca) return null;
                return (
                  <div
                    key={sessao.id}
                    className="flex items-center gap-3 pb-3"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "var(--accent-light)", color: "var(--accent-primary)" }}
                    >
                      {crianca.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {crianca.nome.split(" ")[0]} {crianca.nome.split(" ").slice(-1)[0]}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {format(new Date(sessao.data), "dd/MM/yyyy")} · {TIPO_LABEL[sessao.tipo]}
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: sessao.presente ? "rgba(46,204,142,0.12)" : "rgba(224,85,85,0.1)",
                        color: sessao.presente ? "#2ECC8E" : "#E05555",
                      }}
                    >
                      {sessao.presente ? "Presente" : "Falta"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

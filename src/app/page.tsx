
"use client";

import { useMemo } from "react";
import { Users, Calendar, Star, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/StatCard";
import { BirthdayAlert } from "@/components/shared/BirthdayAlert";
import { getGreeting } from "@/lib/utils/greeting";
import { getAniversariosProximos, isAniversarioHoje } from "@/lib/utils/birthday";
import { criancas as mockCriancas, sessoes as mockSessoes } from "@/lib/mock-data";
import { Crianca, Sessao } from "@/types";

const TIPO_LABEL: Record<string, string> = {
  individual:  "Individual",
  grupo:       "Grupo",
  familiar:    "Familiar",
  orientacao:  "Orientação",
};

export default function Dashboard() {
  const criancas: Crianca[] = mockCriancas;
  const sessoes: Sessao[]   = mockSessoes;

  const ativas  = useMemo(() => criancas.filter(c => c.status === 'ativo'),  [criancas]);

  const sessoesRecentes = useMemo(() =>
    [...sessoes]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 6),
  [sessoes]);

  const sessoesMes = useMemo(() => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return sessoes.filter(s => new Date(s.data) >= primeiroDia);
  }, [sessoes]);

  const aniversariosProximos = useMemo(() => getAniversariosProximos(criancas, 7), [criancas]);
  const aniversariosHoje     = useMemo(() => criancas.filter(c => isAniversarioHoje(c.dataNascimento)), [criancas]);

  const criancasSemSessao = useMemo(() => {
    const limite = new Date();
    limite.setDate(limite.getDate() - 15);
    return ativas.filter((c) => {
      const sessoesC = sessoes.filter(s => s.criancaId === c.id);
      if (sessoesC.length === 0) return true;
      const ultima = [...sessoesC].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
      return new Date(ultima.data) < limite;
    });
  }, [ativas, sessoes]);

  const dataHoje  = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const saudacao  = getGreeting("Rafaela Dias");
  const temDados  = criancas.length > 0 || sessoes.length > 0;

  return (
    <div className="flex flex-col gap-5 md:gap-6">

      {/* ── Cabeçalho ── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          {saudacao}
        </h1>
        <p className="text-sm mt-1 capitalize" style={{ color: "var(--text-muted)" }}>
          {dataHoje}
        </p>
      </div>

      {/* ── Alerta de aniversário hoje ── */}
      {aniversariosHoje.length > 0 && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "var(--accent-light)",
            border: "1px solid rgba(74,158,191,0.2)",
          }}
        >
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-sm md:text-base" style={{ color: "var(--accent-primary)" }}>
              {aniversariosHoje.length === 1
                ? `Hoje é aniversário de ${aniversariosHoje[0].nome.split(" ")[0]}!`
                : `${aniversariosHoje.length} aniversários hoje!`}
            </p>
            <p className="text-xs md:text-sm mt-0.5" style={{ color: "var(--accent-primary)", opacity: 0.8 }}>
              {aniversariosHoje.map(c => c.nome.split(" ")[0]).join(", ")} 🎂
            </p>
          </div>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard titulo="Crianças ativas"       valor={ativas.length}               icone={<Users    size={20} />} cor="azul"  />
        <StatCard titulo="Sessões este mês"       valor={sessoesMes.length}           icone={<Calendar size={20} />} cor="verde" />
        <StatCard titulo="Aniversários (7 dias)"  valor={aniversariosProximos.length} icone={<Star     size={20} />} cor="ambar" />
        <StatCard titulo="Total de sessões"        valor={sessoes.length}             icone={<Clock    size={20} />} cor="roxo"  />
      </div>

      {/* ── Estado vazio — sem dados ainda ── */}
      {!temDados && (
        <div
          className="rounded-xl p-8 flex flex-col items-center text-center gap-3"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <span className="text-5xl">👋</span>
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Bem-vinda ao Controle AEE, Rafaela!
          </h2>
          <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
            O sistema está pronto. Em breve você poderá cadastrar as crianças e registrar os atendimentos por aqui.
          </p>
          <Link
            href="/alunos"
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "var(--accent-primary)" }}
          >
            <Users size={16} />
            Ver área de crianças
          </Link>
        </div>
      )}

      {/* ── Grade de conteúdo (visível quando há dados) ── */}
      {temDados && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">

          <div className="flex flex-col gap-5">
            <BirthdayAlert criancas={criancas} />

            {criancasSemSessao.length > 0 && (
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">⚠️</span>
                  <h3 className="font-semibold text-sm" style={{ color: "var(--warning)" }}>
                    Atenção ({criancasSemSessao.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {criancasSemSessao.slice(0, 3).map((c) => (
                    <Link
                      key={c.id}
                      href={`/alunos/${c.id}`}
                      className="block p-2.5 rounded-lg transition-colors"
                      style={{ background: "var(--bg-primary)" }}
                    >
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {c.nome}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        Sem sessão há mais de 15 dias.
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sessões recentes */}
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Sessões recentes
            </h3>
            {sessoesRecentes.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Nenhuma sessão registrada ainda.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessoesRecentes.map((sessao) => {
                  const crianca = criancas.find(c => c.id === sessao.criancaId);
                  if (!crianca) return null;
                  return (
                    <div
                      key={sessao.id}
                      className="flex items-center gap-3 pb-3 last:pb-0"
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
                          {crianca.nome}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {format(new Date(sessao.data), "dd/MM/yyyy")} · {TIPO_LABEL[sessao.tipo]}
                        </p>
                      </div>
                      <Badge variant={sessao.presente ? 'success' : 'destructive'}>
                        {sessao.presente ? "Presente" : "Falta"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

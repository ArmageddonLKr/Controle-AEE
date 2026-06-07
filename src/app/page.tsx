
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
  individual: "Individual",
  grupo: "Grupo",
  familiar: "Familiar",
  orientacao: "Orientação",
};

export default function Dashboard() {
  // Usando dados mock em vez dos hooks do Supabase
  const criancas: Crianca[] = mockCriancas;
  const sessoes: Sessao[] = mockSessoes;

  const ativas = useMemo(() => criancas.filter(c => c.status === 'ativo'), [criancas]);
  const emEspera = useMemo(() => criancas.filter(c => c.status === 'espera'), [criancas]);
  
  const sessoesRecentes = useMemo(() => 
    sessoes
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 6), 
  [sessoes]);

  const sessoesMes = useMemo(() => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    return sessoes.filter(s => new Date(s.data) >= primeiroDia);
  }, [sessoes]);

  const aniversariosProximos = useMemo(() => getAniversariosProximos(criancas, 7), [criancas]);
  const aniversariosHoje = useMemo(() => criancas.filter((c) => isAniversarioHoje(c.dataNascimento)), [criancas]);

  const criancasSemSessao = useMemo(() => {
    const limite = new Date();
    limite.setDate(limite.getDate() - 15);
    return ativas.filter((c) => {
      const sessoesC = sessoes.filter((s) => s.criancaId === c.id);
      if (sessoesC.length === 0) return true;
      const ultimaSessao = sessoesC.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
      return new Date(ultimaSessao.data) < limite;
    });
  }, [ativas, sessoes]);

  const dataHoje = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const saudacao = getGreeting("Rafaela Dias");

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 gap-6 bg-bg-primary">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          {saudacao}
        </h1>
        <p className="text-sm mt-1 capitalize text-text-muted">
          {dataHoje}
        </p>
      </div>

      {/* Alerta de aniversário hoje */}
      {aniversariosHoje.length > 0 && (
        <div className="rounded-xl p-4 flex items-center gap-3 bg-accent-light border border-accent-primary/20">
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-accent-primary">
              {aniversariosHoje.length === 1
                ? `Hoje é aniversário de ${aniversariosHoje[0].nome.split(" ")[0]}!`
                : `${aniversariosHoje.length} aniversários hoje!`}
            </p>
            <p className="text-sm text-accent-primary/80">
              {aniversariosHoje.map((c) => c.nome.split(" ")[0]).join(", ")} 🎂
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard titulo="Crianças ativas" valor={ativas.length} icone={<Users size={22} />} cor="azul" />
        <StatCard titulo="Sessões este mês" valor={sessoesMes.length} icone={<Calendar size={22} />} cor="verde" />
        <StatCard titulo="Aniversários (7 dias)" valor={aniversariosProximos.length} icone={<Star size={22} />} cor="ambar" />
        <StatCard titulo="Total de sessões" valor={sessoes.length} icone={<Clock size={22} />} cor="roxo" />
      </div>

      {/* Grade inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <BirthdayAlert criancas={criancas} />

          {criancasSemSessao.length > 0 && (
             <div className="bg-bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg text-warning">⚠️</span>
                <h3 className="font-semibold text-sm text-warning">
                  Atenção ({criancasSemSessao.length})
                </h3>
              </div>
              <div className="space-y-2">
                {criancasSemSessao.slice(0, 3).map((c) => (
                  <Link key={c.id} href={`/alunos/${c.id}`} className="block p-2 bg-bg-primary hover:bg-bg-primary/50 rounded-md">
                    <p className="text-sm font-medium text-text-primary">{c.nome}</p>
                    <p className="text-xs text-text-muted">Sem sessão há mais de 15 dias.</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sessões recentes */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4 text-text-secondary">
            Sessões recentes
          </h3>
          {sessoesRecentes.length === 0 ? (
            <div className="py-8 text-center text-text-muted">
              <p className="text-sm">Nenhuma sessão registrada ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessoesRecentes.map((sessao) => {
                const crianca = criancas.find((c) => c.id === sessao.criancaId);
                if (!crianca) return null;
                return (
                  <div key={sessao.id} className="flex items-center gap-3 pb-3 border-b border-border last:border-none last:pb-0">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 bg-accent-light text-accent-primary">
                      {crianca.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-text-primary">
                        {crianca.nome}
                      </p>
                      <p className="text-xs text-text-muted">
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
    </div>
  );
}

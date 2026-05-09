"use client";

import { useMemo } from "react";
import { Users, CalendarCheck, Gift, TrendingUp, AlertTriangle, Check, X } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { getGreeting } from "@/lib/utils/greeting";
import {
  criancas,
  sessoes,
  getSessoesDoMes,
  criancasSemSessaoRecente,
} from "@/lib/mock-data";
import { isAniversarioHoje, diasAteAniversario } from "@/lib/utils/birthday";

function getAniversariosProximos() {
  return criancas
    .filter((c) => c.status === "ativo")
    .map((c) => ({
      crianca: c,
      diasAte: diasAteAniversario(c.dataNascimento),
    }))
    .filter(({ diasAte }) => diasAte >= 0 && diasAte <= 7)
    .sort((a, b) => a.diasAte - b.diasAte);
}

function corAvatar(nome: string): string {
  const cores = ["#4A9EBF", "#6EC6CA", "#2ECC8E", "#A78BFA", "#F0A500", "#E05555", "#3B82F6", "#EC4899"];
  let soma = 0;
  for (const c of nome) soma += c.charCodeAt(0);
  return cores[soma % cores.length];
}

export default function DashboardPage() {
  const hoje = new Date();
  const saudacao = getGreeting("Rafaela Dias");
  const dataFormatada = format(hoje, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const criancasAtivas = criancas.filter((c) => c.status === "ativo").length;
  const sessoesDoMes = getSessoesDoMes().length;
  const aniversariosProximos = getAniversariosProximos();
  const totalSessoes = sessoes.length;

  const sessoesRecentes = [...sessoes]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 6);

  const semSessaoRecente = criancasSemSessaoRecente(15);

  const aniversariosHoje = criancas.filter((c) => isAniversarioHoje(c.dataNascimento));

  return (
    <div>
      {/* Banner de aniversário do dia */}
      {aniversariosHoje.length > 0 && (
        <div
          className="mb-6 rounded-xl p-4 flex items-center gap-3"
          style={{
            background: "linear-gradient(135deg, #F0A500 0%, #FFD166 100%)",
            color: "#1A2B45",
          }}
        >
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-bold text-lg">
              Aniversário hoje! 🎂{" "}
              {aniversariosHoje.map((c) => c.nome.split(" ")[0]).join(" e ")}
            </p>
            <p className="text-sm opacity-80">
              {aniversariosHoje.length === 1
                ? `${aniversariosHoje[0].nome.split(" ")[0]} faz ${differenceInYears(hoje, new Date(aniversariosHoje[0].dataNascimento))} anos hoje!`
                : `${aniversariosHoje.length} crianças fazem aniversário hoje!`}
            </p>
          </div>
        </div>
      )}

      {/* Saudação */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {saudacao}
        </h1>
        <p className="capitalize" style={{ color: "var(--text-secondary)" }}>
          {dataFormatada}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          titulo="Crianças ativas"
          valor={criancasAtivas}
          icone={<Users className="h-5 w-5" />}
          cor="azul"
        />
        <StatCard
          titulo="Sessões este mês"
          valor={sessoesDoMes}
          icone={<CalendarCheck className="h-5 w-5" />}
          cor="verde"
        />
        <StatCard
          titulo="Aniversários (7 dias)"
          valor={aniversariosProximos.length}
          icone={<Gift className="h-5 w-5" />}
          cor="ambar"
        />
        <StatCard
          titulo="Total de sessões"
          valor={totalSessoes}
          icone={<TrendingUp className="h-5 w-5" />}
          cor="roxo"
        />
      </div>

      {/* Alerta de crianças sem sessão */}
      {semSessaoRecente.length > 0 && (
        <div
          className="mb-6 rounded-xl p-4 flex items-start gap-3"
          style={{ backgroundColor: "rgba(240, 165, 0, 0.1)", border: "1px solid rgba(240, 165, 0, 0.3)" }}
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#F0A500" }} />
          <div>
            <p className="font-semibold text-sm" style={{ color: "#B87800" }}>
              Crianças sem sessão há mais de 15 dias
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              {semSessaoRecente.map((c) => c.nome.split(" ")[0]).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aniversários próximos */}
        <div className="lg:col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Aniversários Próximos
          </h2>
          {aniversariosProximos.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center text-sm"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Nenhum aniversário nos próximos 7 dias.
            </div>
          ) : (
            <div className="space-y-2">
              {aniversariosProximos.map(({ crianca, diasAte }) => (
                <div
                  key={crianca.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: diasAte === 0 ? "1px solid #F0A500" : "1px solid var(--border)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: corAvatar(crianca.nome),
                    }}
                  >
                    {crianca.nome.split(" ").slice(0, 2).map((p) => p[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {crianca.nome.split(" ")[0]}
                    </p>
                    <p className="text-xs" style={{ color: diasAte === 0 ? "#F0A500" : "var(--text-secondary)" }}>
                      {diasAte === 0 ? "Hoje! 🎂" : `Em ${diasAte} dia${diasAte > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <span className="text-xl">🎂</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sessões recentes */}
        <div className="lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Sessões Recentes
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {sessoesRecentes.map((sessao, idx) => {
              const crianca = criancas.find((c) => c.id === sessao.criancaId);
              if (!crianca) return null;
              const TIPOS: Record<string, string> = {
                individual: "Individual",
                grupo: "Grupo",
                familiar: "Familiar",
                orientacao: "Orientação",
              };
              return (
                <div
                  key={sessao.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderBottom: idx < sessoesRecentes.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: corAvatar(crianca.nome),
                      }}
                    >
                      {crianca.nome.split(" ").slice(0, 2).map((p) => p[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {crianca.nome.split(" ").slice(0, 2).join(" ")}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {format(new Date(sessao.data), "dd/MM/yyyy", { locale: ptBR })} · {sessao.duracao} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: "var(--accent-light)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      {TIPOS[sessao.tipo] ?? sessao.tipo}
                    </span>
                    {sessao.presente ? (
                      <Check className="h-4 w-4" style={{ color: "var(--success)" }} />
                    ) : (
                      <X className="h-4 w-4" style={{ color: "var(--danger)" }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

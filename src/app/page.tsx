export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/shared/StatCard";
import { BirthdayAlert } from "@/components/shared/BirthdayAlert";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarCheck, GraduationCap, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getUpcomingBirthdays } from "@/lib/utils/birthday";
import { TIPOS_ATENDIMENTO, type TipoAtendimento } from "@/types";

const TIPO_VARIANT: Record<string, "default" | "info" | "success" | "warning" | "muted"> = {
  individual: "info",
  grupo: "success",
  avaliacao: "warning",
  reuniao_familia: "muted",
};

export default async function DashboardPage() {
  const [totalAlunos, totalAtivosThisMonth, todosAlunos, ultimos] = await Promise.all([
    prisma.aluno.count({ where: { ativo: true } }),
    prisma.atendimento.count({
      where: {
        data: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.aluno.findMany({ select: { id: true, nome: true, dataNascimento: true, ativo: true } }),
    prisma.atendimento.findMany({
      take: 8,
      orderBy: { data: "desc" },
      include: { aluno: { select: { nome: true } } },
    }),
  ]);

  const aniversariosTotais = getUpcomingBirthdays(todosAlunos as Parameters<typeof getUpcomingBirthdays>[0], 7).length;
  const totalAtendimentos = await prisma.atendimento.count();

  return (
    <div>
      <PageHeader
        title="Início"
        description={`${format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          value={totalAlunos}
          label="Alunos ativos"
          iconClassName="bg-sky-500"
        />
        <StatCard
          icon={CalendarCheck}
          value={totalAtivosThisMonth}
          label="Atendimentos este mês"
          iconClassName="bg-teal-500"
        />
        <StatCard
          icon={GraduationCap}
          value={aniversariosTotais}
          label="Aniversários nos próximos 7 dias"
          iconClassName="bg-amber-500"
        />
        <StatCard
          icon={TrendingUp}
          value={totalAtendimentos}
          label="Total de atendimentos"
          iconClassName="bg-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Birthday Alert */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Aniversários
          </h2>
          <BirthdayAlert alunos={todosAlunos as Parameters<typeof BirthdayAlert>[0]["alunos"]} />
          {aniversariosTotais === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-400 text-sm">
              Nenhum aniversário nos próximos 7 dias.
            </div>
          )}
        </div>

        {/* Recent atendimentos */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
            Atendimentos recentes
          </h2>
          <Card>
            <CardContent className="p-0">
              {ultimos.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">
                  Nenhum atendimento registrado.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {ultimos.map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-700">
                          {a.aluno.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{a.aluno.nome}</p>
                          <p className="text-xs text-slate-400">
                            {format(new Date(a.data), "dd/MM/yyyy", { locale: ptBR })} · {a.duracaoMin} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={TIPO_VARIANT[a.tipo] ?? "muted"}>
                          {TIPOS_ATENDIMENTO[a.tipo as TipoAtendimento] ?? a.tipo}
                        </Badge>
                        {!a.presente && (
                          <Badge variant="destructive">Falta</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, CalendarCheck, TrendingUp, Phone, School, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { calcularIdade } from "@/lib/utils/birthday";
import { TIPOS_ATENDIMENTO, type TipoAtendimento } from "@/types";
import { NovoAtendimentoDialog } from "./NovoAtendimentoDialog";
import { NovaEvolucaoDialog } from "./NovaEvolucaoDialog";

const TIPO_VARIANT: Record<string, "default" | "info" | "success" | "warning" | "muted"> = {
  individual: "info",
  grupo: "success",
  avaliacao: "warning",
  reuniao_familia: "muted",
};

export default async function AlunoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const aluno = await prisma.aluno.findUnique({
    where: { id },
    include: {
      atendimentos: { orderBy: { data: "desc" } },
      evolucoes: { orderBy: { data: "desc" } },
    },
  });

  if (!aluno) notFound();

  const totalPresentes = aluno.atendimentos.filter((a) => a.presente).length;
  const taxaPresenca = aluno.atendimentos.length > 0
    ? Math.round((totalPresentes / aluno.atendimentos.length) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title={aluno.nome}
        description={`${calcularIdade(aluno.dataNascimento)} anos · ${aluno.turma ?? "Turma não informada"}`}
        action={
          <div className="flex gap-2">
            <Link href={`/alunos/${id}/editar`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl font-bold text-sky-700">
                {aluno.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{aluno.nome}</h2>
                <Badge variant={aluno.ativo ? "success" : "muted"}>
                  {aluno.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {aluno.necessidadeEspecial && (
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Necessidade Especial</p>
                <Badge variant="info">{aluno.necessidadeEspecial}</Badge>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Data de Nascimento</p>
              <p className="font-medium text-slate-700">
                {format(new Date(aluno.dataNascimento), "dd/MM/yyyy", { locale: ptBR })}
                <span className="text-slate-400 ml-1">({calcularIdade(aluno.dataNascimento)} anos)</span>
              </p>
            </div>
            {aluno.escola && (
              <div className="flex items-center gap-2 text-slate-700">
                <School className="h-4 w-4 text-slate-400" />
                <span>{aluno.escola}</span>
              </div>
            )}
            {aluno.turma && (
              <div className="flex items-center gap-2 text-slate-700">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span>{aluno.turma}</span>
              </div>
            )}
            {aluno.responsavel && (
              <div className="flex items-center gap-2 text-slate-700">
                <User className="h-4 w-4 text-slate-400" />
                <span>{aluno.responsavel}</span>
              </div>
            )}
            {aluno.telefone && (
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{aluno.telefone}</span>
              </div>
            )}
            {aluno.observacoes && (
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Observações</p>
                <p className="text-slate-600 text-xs leading-relaxed">{aluno.observacoes}</p>
              </div>
            )}

            {/* Stats */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-sky-600">{aluno.atendimentos.length}</p>
                <p className="text-xs text-slate-400">Atendimentos</p>
              </div>
              <div>
                <p className="text-lg font-bold text-teal-600">{taxaPresenca}%</p>
                <p className="text-xs text-slate-400">Presença</p>
              </div>
              <div>
                <p className="text-lg font-bold text-indigo-600">{aluno.evolucoes.length}</p>
                <p className="text-xs text-slate-400">Evoluções</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="atendimentos">
            <TabsList className="mb-4">
              <TabsTrigger value="atendimentos">
                <CalendarCheck className="h-4 w-4 mr-1.5" />
                Atendimentos ({aluno.atendimentos.length})
              </TabsTrigger>
              <TabsTrigger value="evolucao">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                Evolução ({aluno.evolucoes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="atendimentos">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-slate-600">Histórico de atendimentos</h3>
                <NovoAtendimentoDialog alunoId={aluno.id} alunoNome={aluno.nome} />
              </div>
              {aluno.atendimentos.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-sm">
                  Nenhum atendimento registrado ainda.
                </div>
              ) : (
                <div className="space-y-2">
                  {aluno.atendimentos.map((at) => (
                    <div key={at.id} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-center min-w-[48px]">
                            <p className="text-lg font-bold text-slate-800 leading-none">
                              {format(new Date(at.data), "dd", { locale: ptBR })}
                            </p>
                            <p className="text-xs text-slate-400 uppercase">
                              {format(new Date(at.data), "MMM", { locale: ptBR })}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={TIPO_VARIANT[at.tipo] ?? "muted"}>
                                {TIPOS_ATENDIMENTO[at.tipo as TipoAtendimento] ?? at.tipo}
                              </Badge>
                              <span className="text-xs text-slate-400">{at.duracaoMin} min</span>
                              {!at.presente && (
                                <Badge variant="destructive">Falta</Badge>
                              )}
                            </div>
                            {at.objetivo && (
                              <p className="text-xs text-slate-600">{at.objetivo}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      {at.observacoes && (
                        <p className="mt-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
                          {at.observacoes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="evolucao">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-slate-600">Registros de evolução</h3>
                <NovaEvolucaoDialog alunoId={aluno.id} />
              </div>
              {aluno.evolucoes.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-sm">
                  Nenhum registro de evolução ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  {aluno.evolucoes.map((ev) => {
                    let areas: string[] = [];
                    try { areas = JSON.parse(ev.areas ?? "[]"); } catch {}
                    return (
                      <div key={ev.id} className="rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase">
                              {format(new Date(ev.data), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                            {ev.periodo && (
                              <Badge variant="muted">{ev.periodo}</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{ev.descricao}</p>
                        {areas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {areas.map((a) => (
                              <span key={a} className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

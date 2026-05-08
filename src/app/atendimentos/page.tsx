export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { AtendimentosClient } from "./AtendimentosClient";
import type { Atendimento, Aluno } from "@/types";

type AtendimentoRow = Atendimento & {
  aluno: Pick<Aluno, "id" | "nome" | "turma" | "escola">;
};

export default async function AtendimentosPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    tipo?: string;
    dataInicio?: string;
    dataFim?: string;
  }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const tipo = params.tipo ?? "";
  const dataInicio = params.dataInicio ?? "";
  const dataFim = params.dataFim ?? "";

  const atendimentos = await prisma.atendimento.findMany({
    where: {
      ...(search
        ? { aluno: { nome: { contains: search } } }
        : {}),
      ...(tipo ? { tipo } : {}),
      ...(dataInicio || dataFim
        ? {
            data: {
              ...(dataInicio ? { gte: new Date(dataInicio) } : {}),
              ...(dataFim ? { lte: new Date(dataFim + "T23:59:59") } : {}),
            },
          }
        : {}),
    },
    include: {
      aluno: { select: { id: true, nome: true, turma: true, escola: true } },
    },
    orderBy: { data: "desc" },
  }) as AtendimentoRow[];

  return (
    <div>
      <PageHeader
        title="Atendimentos"
        description={`${atendimentos.length} registro(s) encontrado(s)`}
      />
      <AtendimentosClient
        atendimentos={atendimentos}
        initialFilters={{ search, tipo, dataInicio, dataFim }}
      />
    </div>
  );
}

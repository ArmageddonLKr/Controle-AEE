export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TIPOS_ATENDIMENTO, type TipoAtendimento } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dataInicio = searchParams.get("dataInicio");
  const dataFim = searchParams.get("dataFim");
  const alunoId = searchParams.get("alunoId");
  const tipo = searchParams.get("tipo");

  const atendimentos = await prisma.atendimento.findMany({
    where: {
      ...(alunoId ? { alunoId } : {}),
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
      aluno: { select: { nome: true, turma: true } },
    },
    orderBy: { data: "desc" },
  });

  const dados = atendimentos.map((a) => ({
    aluno: a.aluno.nome,
    turma: a.aluno.turma ?? "-",
    data: format(new Date(a.data), "dd/MM/yyyy", { locale: ptBR }),
    tipo: TIPOS_ATENDIMENTO[a.tipo as TipoAtendimento] ?? a.tipo,
    duracao: `${a.duracaoMin}`,
    objetivo: a.objetivo ?? "-",
    presente: a.presente ? "Sim" : "Não",
  }));

  return NextResponse.json({ dados });
}

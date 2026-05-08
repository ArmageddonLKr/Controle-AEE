export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlunosClient } from "./AlunosClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AlunosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; turma?: string; status?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const turma = params.turma ?? "";
  const status = params.status ?? "ativo";

  const alunos = await prisma.aluno.findMany({
    where: {
      ...(search ? { nome: { contains: search } } : {}),
      ...(turma ? { turma: { contains: turma } } : {}),
      ...(status === "ativo"
        ? { ativo: true }
        : status === "inativo"
        ? { ativo: false }
        : {}),
    },
    include: {
      _count: { select: { atendimentos: true } },
    },
    orderBy: { nome: "asc" },
  });

  const turmas = await prisma.aluno
    .findMany({ select: { turma: true }, distinct: ["turma"], where: { turma: { not: null } } })
    .then((r) => r.map((a) => a.turma).filter(Boolean) as string[]);

  return (
    <div>
      <PageHeader
        title="Alunos"
        description={`${alunos.length} aluno(s) encontrado(s)`}
        action={
          <Link href="/alunos/novo">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Novo Aluno
            </Button>
          </Link>
        }
      />
      <AlunosClient alunos={alunos} turmas={turmas} initialFilters={{ search, turma, status }} />
    </div>
  );
}

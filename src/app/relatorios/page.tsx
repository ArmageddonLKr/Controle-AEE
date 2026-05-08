export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { RelatoriosClient } from "./RelatoriosClient";

export default async function RelatoriosPage() {
  const alunos = await prisma.aluno.findMany({
    where: { ativo: true },
    select: { id: true, nome: true, turma: true, escola: true, necessidadeEspecial: true },
    orderBy: { nome: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Gere relatórios filtrados e exporte em PDF ou Excel"
      />
      <RelatoriosClient alunos={alunos} />
    </div>
  );
}

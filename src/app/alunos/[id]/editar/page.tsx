import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlunoForm } from "@/components/shared/AlunoForm";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditarAlunoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const aluno = await prisma.aluno.findUnique({ where: { id } });
  if (!aluno) notFound();

  return (
    <div>
      <PageHeader
        title="Editar Aluno"
        description={`Editando: ${aluno.nome}`}
      />
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <AlunoForm aluno={aluno} />
        </CardContent>
      </Card>
    </div>
  );
}

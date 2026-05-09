import { criancas } from "@/lib/mock-data";
import { AlunoPerfilClient } from "./AlunoPerfilClient";

export function generateStaticParams() {
  return criancas.map((c) => ({ id: c.id }));
}

export default async function PerfilCriancaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AlunoPerfilClient id={id} />;
}

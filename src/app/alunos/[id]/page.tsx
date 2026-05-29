import { AlunoPerfilClient } from "./AlunoPerfilClient";

export function generateStaticParams() {
  return [];
}

export default async function AlunoPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AlunoPerfilClient id={id} />;
}

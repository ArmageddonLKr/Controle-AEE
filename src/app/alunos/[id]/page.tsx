// src/app/alunos/[id]/page.tsx
import { criancas, getCriancaById } from '@/lib/mock-data';
import AlunoPerfilClient from './AlunoPerfilClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return criancas.map((c) => ({ id: c.id }));
}

export default async function AlunoPerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const aluno = getCriancaById(id);

  if (!aluno) {
    notFound();
  }

  return <AlunoPerfilClient aluno={aluno} />;
}

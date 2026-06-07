// src/app/alunos/[id]/page.tsx
import { criancas, getCriancaById } from '@/lib/mock-data';
import AlunoPerfilClient from './AlunoPerfilClient';
import { notFound } from 'next/navigation';

// Apenas os IDs conhecidos são válidos; qualquer outro retorna 404
export const dynamicParams = false;

export function generateStaticParams() {
  // Quando não há crianças cadastradas, retorna lista vazia (nenhuma página é pré-gerada)
  if (criancas.length === 0) return [{ id: '_empty' }];
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

// src/app/alunos/perfil/page.tsx
// Perfil da criança — rota estática que lê o ID pela query string (?id=...),
// permitindo abrir perfis criados em tempo real mesmo em site estático.
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AlunoPerfil from './AlunoPerfil';

function Carregando() {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

function Conteudo() {
  const params = useSearchParams();
  const id = params.get('id') ?? undefined;
  return <AlunoPerfil id={id} />;
}

export default function AlunoPerfilPage() {
  return (
    <Suspense fallback={<Carregando />}>
      <Conteudo />
    </Suspense>
  );
}


// src/app/alunos/[id]/AlunoPerfilClient.tsx
'use client';

import { Crianca } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSessoesByCriancaId, getEvolucoesByCriancaId } from '@/lib/mock-data';
import { differenceInYears, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import SessoesList from '@/components/shared/SessoesList';
import AddSessaoForm from '@/components/shared/AddSessaoForm';

interface AlunoPerfilClientProps {
  aluno: Crianca;
}

export default function AlunoPerfilClient({ aluno }: AlunoPerfilClientProps) {

  const idade = differenceInYears(new Date(), new Date(aluno.dataNascimento));
  const sessoes = getSessoesByCriancaId(aluno.id);
  const evolucoes = getEvolucoesByCriancaId(aluno.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6">
      <aside className="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader className="items-center">
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-4xl font-bold text-blue-800">
              {aluno.nome.charAt(0)}
            </div>
            <CardTitle className="text-2xl pt-4">{aluno.nome}</CardTitle>
            <Badge>{aluno.status}</Badge>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p><strong>Idade:</strong> {idade} anos</p>
            <p><strong>Nascimento:</strong> {format(new Date(aluno.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}</p>
            <p><strong>Escola:</strong> {aluno.escola}</p>
            <p><strong>Diagnósticos:</strong></p>
            <div className="flex flex-wrap gap-2 mt-1">
              {aluno.diagnosticos.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </aside>

      <main className="lg:col-span-3">
        <Tabs defaultValue="sessoes">
          <TabsList className="mb-4">
            <TabsTrigger value="sessoes">Sessões ({sessoes.length})</TabsTrigger>
            <TabsTrigger value="evolucao">Evolução ({evolucoes.length})</TabsTrigger>
            <TabsTrigger value="informacoes">Informações</TabsTrigger>
            <TabsTrigger value="exportar">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="sessoes">
            <Card>
              <CardHeader><CardTitle>Histórico de Sessões</CardTitle></CardHeader>
              <CardContent>
                {sessoes.map(s => (
                  <div key={s.id} className="mb-4 p-2 border-b">
                    <p><strong>Data:</strong> {format(new Date(s.data), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    <p><strong>Tipo:</strong> {s.tipo}</p>
                    <p><strong>Anotações:</strong> {s.anotacoes}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}


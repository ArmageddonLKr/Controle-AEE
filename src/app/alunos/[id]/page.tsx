// src/app/alunos/[id]/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Crianca } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Componentes de UI
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Componentes específicos da página
import SessoesList from '@/components/shared/SessoesList';
import AddSessaoForm from '@/components/shared/AddSessaoForm';

// Ícones
import { User, School, Calendar, BookOpen, Info } from 'lucide-react';

function AlunoPerfilSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
       <Skeleton className="h-80 rounded-lg" />
    </div>
  );
}

export default function AlunoPerfilPage() {
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [aluno, setAluno] = useState<Crianca | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleSessaoAdded = useCallback(() => {
    setRefetchTrigger(prev => prev + 1); // Incrementa para disparar o refetch
  }, []);

  useEffect(() => {
    if (!id) return;

    async function fetchAluno() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('criancas').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) setAluno(data as Crianca);
        else throw new Error('Criança não encontrada.');
      } catch (err: any) {
        setError(err.message);
        toast({ title: 'Erro ao carregar', description: 'Não foi possível encontrar os dados da criança.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    }

    fetchAluno();
  }, [id, toast]);

  if (loading) return <AlunoPerfilSkeleton />;

  if (error || !aluno) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Info className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Perfil não encontrado</h2>
        <p className="text-muted-foreground">A criança que você está procurando não existe ou o link está incorreto.</p>
      </div>
    );
  }
  
  const getAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-bold">
          {aluno.nome.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary">{aluno.nome}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={aluno.status === 'ativo' ? 'success' : 'secondary'}>{aluno.status}</Badge>
            <span className='text-muted-foreground'>·</span>
            <p className="text-muted-foreground">{getAge(aluno.dataNascimento)} anos</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Diagnósticos</CardTitle><BookOpen className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="flex flex-wrap gap-1">{aluno.diagnosticos?.map(d => <Badge key={d} variant="outline">{d}</Badge>) ?? 'N/A'}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Escola</CardTitle><School className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-lg font-semibold">{aluno.escola || 'Não informado'}</p><p className="text-xs text-muted-foreground">{aluno.serie} - {aluno.turma} ({aluno.turno})</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Início</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><p className="text-lg font-semibold">{new Date(aluno.dataInicioAcompanhamento).toLocaleDateString('pt-BR')}</p></CardContent></Card>
      </div>
      
      <Tabs defaultValue="sessoes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessoes">Sessões</TabsTrigger>
          <TabsTrigger value="evolucao" disabled>Evolução</TabsTrigger>
          <TabsTrigger value="informacoes" disabled>Informações</TabsTrigger>
        </TabsList>
        <TabsContent value="sessoes" className="pt-4">
            <div className="flex justify-end mb-4">
                <AddSessaoForm criancaId={aluno.id} onSessaoAdded={handleSessaoAdded} />
            </div>
            <SessoesList criancaId={aluno.id} refetchTrigger={refetchTrigger} />
        </TabsContent>
      </Tabs>

    </div>
  );
}

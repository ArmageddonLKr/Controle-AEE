// src/components/shared/SessoesList.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarOff, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSessoesByCriancaId } from '@/hooks/useAlunos';
import { removeSessao } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface SessoesListProps {
  criancaId: string;
  refetchTrigger?: number;
}

function SessoesListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-background">
      <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Nenhuma sessão registrada</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Use o botão &quot;Nova Sessão&quot; para registrar o primeiro atendimento.
      </p>
    </div>
  );
}

export default function SessoesList({ criancaId }: SessoesListProps) {
  const { sessoes, loading } = useSessoesByCriancaId(criancaId);
  const { toast } = useToast();

  if (loading) {
    return <SessoesListSkeleton />;
  }

  if (sessoes.length === 0) {
    return <EmptyState />;
  }

  function handleExcluir(id: string) {
    removeSessao(id);
    toast({ title: 'Sessão excluída', description: 'O registro foi removido.' });
  }

  const sessoesOrdenadas = [...sessoes].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <div className="space-y-4">
      {sessoesOrdenadas.map((sessao) => (
        <Card key={sessao.id} className="bg-background/80 hover:bg-card transition-colors">
          <CardContent className="p-4 grid gap-3">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-semibold capitalize">
                  {format(new Date(sessao.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tipo: <Badge variant="secondary">{sessao.tipo}</Badge> | Duração: {sessao.duracao} min
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={sessao.presente ? 'success' : 'destructive'}>
                  {sessao.presente ? 'Presente' : 'Faltou'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  title="Excluir sessão"
                  onClick={() => {
                    if (window.confirm('Excluir este registro de sessão? Essa ação não pode ser desfeita.')) {
                      handleExcluir(sessao.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {sessao.anotacoes && (
              <p className="text-sm text-foreground/90">
                <span className="font-semibold">Anotações:</span> {sessao.anotacoes}
              </p>
            )}
            {sessao.evolucaoObservada && (
              <p className="text-sm italic text-primary/90">
                <span className="font-semibold">Evolução:</span> {sessao.evolucaoObservada}
              </p>
            )}
            {!sessao.presente && sessao.motivoFalta && (
              <p className="text-sm text-destructive/90">
                <span className="font-semibold">Motivo da Falta:</span> {sessao.motivoFalta}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// src/components/shared/SessoesList.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Sessao } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarOff } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessoesListProps {
  criancaId: string;
  // Adicionamos uma prop para forçar a atualização a partir do componente pai
  refetchTrigger: number;
}

// Skeleton para a lista de sessões
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

// Estado Vazio para quando não há sessões
function EmptyState() {
  return (
    <div className="text-center py-12 px-6 border-2 border-dashed rounded-lg bg-background">
      <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Nenhuma sessão registrada</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Clique em "Nova Sessão" para adicionar o primeiro registro.
      </p>
    </div>
  );
}

export default function SessoesList({ criancaId, refetchTrigger }: SessoesListProps) {
  const { toast } = useToast();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessoes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sessoes')
        .select('*')
        .eq('crianca_id', criancaId)
        .order('data', { ascending: false });

      if (error) throw error;
      setSessoes(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar sessões:", err.message);
      toast({ title: 'Erro', description: 'Não foi possível carregar o histórico de sessões.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [criancaId, toast]);

  useEffect(() => {
    fetchSessoes();
  }, [fetchSessoes, refetchTrigger]);

  if (loading) {
    return <SessoesListSkeleton />;
  }

  if (sessoes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {sessoes.map((sessao) => (
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
                <Badge variant={sessao.presente ? 'success' : 'destructive'}>
                    {sessao.presente ? 'Presente' : 'Faltou'}
                </Badge>
            </div>
            {sessao.anotacoes && <p className="text-sm text-foreground/90"><span className="font-semibold">Anotações:</span> {sessao.anotacoes}</p>}
            {sessao.evolucao_observada && <p className="text-sm italic text-primary/90"><span className="font-semibold">Evolução:</span> {sessao.evolucao_observada}</p>}
            {!sessao.presente && sessao.motivo_falta && <p className="text-sm text-destructive/90"><span className="font-semibold">Motivo da Falta:</span> {sessao.motivo_falta}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

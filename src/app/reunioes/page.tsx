// src/app/reunioes/page.tsx
// Gestão de reuniões: pedagógicas, familiares, multiprofissionais e formações
'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PlusCircle, Handshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useReunioes } from '@/hooks/useAlunos';
import { addReuniao } from '@/lib/storage';
import FormReuniao from '@/components/shared/ReuniaoForm';
import CardReuniao, { TIPO_INFO } from '@/components/shared/ReuniaoCard';
import type { Reuniao } from '@/types';

const FILTROS = [
  { valor: 'todas',            label: 'Todas' },
  { valor: 'pedagogica',       label: 'Pedagógicas' },
  { valor: 'familiar',         label: 'Familiares' },
  { valor: 'multiprofissional',label: 'Multiprofissional' },
  { valor: 'formacao',         label: 'Formação' },
  { valor: 'outra',            label: 'Outras' },
];

export default function ReunioesPage() {
  const { reunioes, loading } = useReunioes();
  const { toast } = useToast();
  const [filtro, setFiltro] = useState('todas');
  const [busca, setBusca] = useState('');
  const [novaAberta, setNovaAberta] = useState(false);

  const reunioesFiltradas = useMemo(() => {
    return reunioes.filter((r) => {
      const passaFiltro = filtro === 'todas' || r.tipo === filtro;
      const passaBusca = !busca || r.titulo.toLowerCase().includes(busca.toLowerCase())
        || r.participantes.some((p) => p.toLowerCase().includes(busca.toLowerCase()))
        || r.local.toLowerCase().includes(busca.toLowerCase());
      return passaFiltro && passaBusca;
    });
  }, [reunioes, filtro, busca]);

  // Agrupar por mês
  const porMes = useMemo(() => {
    const mapa = new Map<string, Reuniao[]>();
    reunioesFiltradas.forEach((r) => {
      const chave = r.data.slice(0, 7); // "2026-06"
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(r);
    });
    return Array.from(mapa.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [reunioesFiltradas]);

  function handleNovaReuniao(dados: Omit<Reuniao, 'id'>) {
    addReuniao(dados);
    toast({ title: 'Reunião registrada! 📋', description: 'O registro foi salvo.' });
    setNovaAberta(false);
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Reuniões
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {loading ? '…' : `${reunioes.length} ${reunioes.length === 1 ? 'reunião registrada' : 'reuniões registradas'}`}
          </p>
        </div>
        <Dialog open={novaAberta} onOpenChange={setNovaAberta}>
          <DialogTrigger asChild>
            <Button style={{ background: 'var(--accent-primary)' }} className="text-white hover:opacity-90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Reunião
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Nova Reunião</DialogTitle>
            </DialogHeader>
            <FormReuniao onSalvar={handleNovaReuniao} onFechar={() => setNovaAberta(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Busca e filtros */}
      <div className="space-y-3">
        <Input
          placeholder="Buscar por título, participante ou local..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-md"
        />
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map((f) => {
            const ativo = filtro === f.valor;
            const info = f.valor !== 'todas' ? TIPO_INFO[f.valor as Reuniao['tipo']] : null;
            return (
              <button
                key={f.valor}
                onClick={() => setFiltro(f.valor)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                style={ativo ? {
                  background: info ? info.cor : 'var(--accent-primary)',
                  color: '#fff',
                  border: '2px solid transparent',
                } : {
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '2px solid var(--border)',
                }}
              >
                {f.label}
                {f.valor !== 'todas' && (
                  <span className="ml-1.5 opacity-75">
                    {reunioes.filter((r) => r.tipo === f.valor).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
        </div>
      ) : reunioesFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Handshake size={44} style={{ color: 'var(--text-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {busca || filtro !== 'todas' ? 'Nenhuma reunião encontrada' : 'Nenhuma reunião registrada ainda'}
          </p>
          <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>
            {busca || filtro !== 'todas'
              ? 'Tente ajustar os filtros ou a busca.'
              : 'Use o botão "Nova Reunião" para registrar seu primeiro encontro.'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {porMes.map(([chave, itens]) => {
            const [ano, mes] = chave.split('-');
            const nomeMes = format(new Date(Number(ano), Number(mes) - 1, 1), 'MMMM yyyy', { locale: ptBR });
            return (
              <div key={chave}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-sm font-bold capitalize" style={{ color: 'var(--text-secondary)' }}>
                    {nomeMes}
                  </h2>
                  <Badge variant="secondary" className="text-xs">{itens.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {itens.map((r) => <CardReuniao key={r.id} reuniao={r} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

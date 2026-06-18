// src/components/shared/ReuniaoCard.tsx
// Card de reunião — reutilizado na página de Reuniões e no perfil da criança.
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Trash2, Pencil, MapPin, Clock, Users, ChevronDown, ChevronUp, CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { updateReuniao, removeReuniao } from '@/lib/storage';
import { useCriancas } from '@/hooks/useAlunos';
import { parseDataLocal } from '@/lib/utils/date';
import FormReuniao from '@/components/shared/ReuniaoForm';
import type { Reuniao } from '@/types';
import Link from 'next/link';

export const TIPO_INFO: Record<Reuniao['tipo'], { label: string; cor: string; bg: string }> = {
  pedagogica:        { label: 'Pedagógica',       cor: '#4A9EBF', bg: 'rgba(74,158,191,0.12)' },
  familiar:          { label: 'Familiar',          cor: '#2ECC8E', bg: 'rgba(46,204,142,0.12)' },
  multiprofissional: { label: 'Multiprofissional', cor: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  formacao:          { label: 'Formação',          cor: '#F0A500', bg: 'rgba(240,165,0,0.12)' },
  outra:             { label: 'Outra',             cor: '#8FA3BC', bg: 'rgba(143,163,188,0.12)' },
};

export default function CardReuniao({ reuniao }: { reuniao: Reuniao }) {
  const { toast } = useToast();
  const { criancas } = useCriancas();
  const [aberto, setAberto] = useState(false);
  const [editAberto, setEditAberto] = useState(false);
  const info = TIPO_INFO[reuniao.tipo];

  // Crianças vinculadas a esta reunião (conecta a página de Reuniões ao perfil)
  const criancasVinculadas = (reuniao.criancasRelacionadas ?? [])
    .map((id) => criancas.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const dataFormatada = format(parseDataLocal(reuniao.data), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const diaSemana = format(parseDataLocal(reuniao.data), 'EEEE', { locale: ptBR });
  const horas = Math.floor(reuniao.duracao / 60);
  const minutos = reuniao.duracao % 60;
  const duracaoStr = horas > 0
    ? `${horas}h${minutos > 0 ? minutos + 'min' : ''}`
    : `${minutos}min`;

  function handleExcluir() {
    if (!window.confirm('Excluir esta reunião? Essa ação não pode ser desfeita.')) return;
    removeReuniao(reuniao.id);
    toast({ title: 'Reunião excluída', description: 'O registro foi removido.' });
  }

  function handleEditar(dados: Omit<Reuniao, 'id'>) {
    updateReuniao(reuniao.id, dados);
    toast({ title: 'Reunião atualizada!', description: 'As alterações foram salvas.' });
    setEditAberto(false);
  }

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Topo colorido com tipo */}
      <div className="px-4 py-3 flex items-center justify-between gap-2" style={{ background: info.bg, borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ color: info.cor, background: 'rgba(255,255,255,0.25)' }}
          >
            {info.label}
          </span>
          <span className="text-xs capitalize" style={{ color: info.cor, opacity: 0.85 }}>{diaSemana}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {/* Editar */}
          <Dialog open={editAberto} onOpenChange={setEditAberto}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/20" title="Editar reunião">
                <Pencil className="h-3.5 w-3.5" style={{ color: info.cor }} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Editar Reunião</DialogTitle>
              </DialogHeader>
              <FormReuniao inicial={reuniao} onSalvar={handleEditar} onFechar={() => setEditAberto(false)} />
            </DialogContent>
          </Dialog>
          {/* Excluir */}
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-500/20" title="Excluir" onClick={handleExcluir}>
            <Trash2 className="h-3.5 w-3.5" style={{ color: 'var(--danger)' }} />
          </Button>
        </div>
      </div>

      {/* Corpo */}
      <div className="p-4">
        <h3 className="font-bold text-sm mb-3 leading-snug" style={{ color: 'var(--text-primary)' }}>
          {reuniao.titulo}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{dataFormatada} — {reuniao.hora}</span>
            <span className="ml-auto font-medium" style={{ color: 'var(--text-muted)' }}>
              <Clock className="h-3 w-3 inline mr-0.5" />{duracaoStr}
            </span>
          </div>
          {reuniao.local && (
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{reuniao.local}</span>
            </div>
          )}
          {reuniao.participantes.length > 0 && (
            <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <Users className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {reuniao.participantes.slice(0, 3).join(', ')}
                {reuniao.participantes.length > 3 && (
                  <span style={{ color: 'var(--text-muted)' }}> +{reuniao.participantes.length - 3} mais</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Crianças vinculadas — leva ao perfil de cada uma */}
        {criancasVinculadas.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              Crianças:
            </span>
            {criancasVinculadas.map((c) => (
              <Link
                key={c.id}
                href={`/alunos/perfil/?id=${c.id}`}
                className="text-xs font-medium rounded-full px-2 py-0.5 transition-opacity hover:opacity-80"
                style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)' }}
              >
                {c.nome.split(' ')[0]}
              </Link>
            ))}
          </div>
        )}

        {/* Anotações com toggle expand */}
        {reuniao.anotacoes && (
          <div>
            <button
              onClick={() => setAberto(!aberto)}
              className="flex items-center gap-1 text-xs font-semibold mb-1.5 transition-colors"
              style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {aberto ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {aberto ? 'Ocultar anotações' : 'Ver anotações'}
            </button>
            {aberto && (
              <p className="text-xs leading-relaxed whitespace-pre-wrap rounded-lg p-3"
                style={{ color: 'var(--text-secondary)', background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                {reuniao.anotacoes}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

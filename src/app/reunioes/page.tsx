// src/app/reunioes/page.tsx
// Gestão de reuniões: pedagógicas, familiares, multiprofissionais e formações
'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  PlusCircle, Users2, Trash2, Pencil, MapPin, Clock,
  Users, ChevronDown, ChevronUp, CalendarDays,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useReunioes } from '@/hooks/useAlunos';
import { addReuniao, updateReuniao, removeReuniao } from '@/lib/storage';
import type { Reuniao } from '@/types';

// ── Constantes de tipo ───────────────────────────────────────────────────────

const TIPO_INFO: Record<Reuniao['tipo'], { label: string; cor: string; bg: string }> = {
  pedagogica:       { label: 'Pedagógica',      cor: '#4A9EBF', bg: 'rgba(74,158,191,0.12)' },
  familiar:         { label: 'Familiar',         cor: '#2ECC8E', bg: 'rgba(46,204,142,0.12)' },
  multiprofissional:{ label: 'Multiprofissional',cor: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  formacao:         { label: 'Formação',         cor: '#F0A500', bg: 'rgba(240,165,0,0.12)' },
  outra:            { label: 'Outra',            cor: '#8FA3BC', bg: 'rgba(143,163,188,0.12)' },
};

const FILTROS = [
  { valor: 'todas',           label: 'Todas' },
  { valor: 'pedagogica',      label: 'Pedagógicas' },
  { valor: 'familiar',        label: 'Familiares' },
  { valor: 'multiprofissional',label: 'Multiprofissional' },
  { valor: 'formacao',        label: 'Formação' },
  { valor: 'outra',           label: 'Outras' },
];

// ── Formulário (add/edit) ────────────────────────────────────────────────────

const hojeISO = () => new Date().toISOString().split('T')[0];

function FormReuniao({
  inicial,
  onSalvar,
  onFechar,
}: {
  inicial?: Reuniao;
  onSalvar: (dados: Omit<Reuniao, 'id'>) => void;
  onFechar: () => void;
}) {
  const [data, setData] = useState(inicial?.data ?? hojeISO());
  const [hora, setHora] = useState(inicial?.hora ?? '08:00');
  const [duracao, setDuracao] = useState(String(inicial?.duracao ?? 60));
  const [titulo, setTitulo] = useState(inicial?.titulo ?? '');
  const [tipo, setTipo] = useState<Reuniao['tipo']>(inicial?.tipo ?? 'pedagogica');
  const [participantes, setParticipantes] = useState(inicial?.participantes.join(', ') ?? 'Rafaela Dias, ');
  const [local, setLocal] = useState(inicial?.local ?? '');
  const [anotacoes, setAnotacoes] = useState(inicial?.anotacoes ?? '');
  const [erro, setErro] = useState('');

  function handleSalvar() {
    if (!titulo.trim()) { setErro('Informe o título da reunião.'); return; }
    if (!data) { setErro('Informe a data.'); return; }
    onSalvar({
      data,
      hora,
      duracao: Math.max(5, parseInt(duracao, 10) || 60),
      titulo: titulo.trim(),
      tipo,
      participantes: participantes.split(',').map((p) => p.trim()).filter(Boolean),
      local: local.trim(),
      anotacoes: anotacoes.trim(),
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="r-titulo">Título da reunião *</Label>
        <Input id="r-titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Reunião Pedagógica — Ana Beatriz" className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="r-data">Data *</Label>
          <Input id="r-data" type="date" value={data} onChange={(e) => setData(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="r-hora">Hora</Label>
          <Input id="r-hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="r-duracao">Duração (min)</Label>
          <Input id="r-duracao" type="number" min={5} step={5} value={duracao}
            onChange={(e) => setDuracao(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as Reuniao['tipo'])}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pedagogica">Pedagógica</SelectItem>
              <SelectItem value="familiar">Familiar</SelectItem>
              <SelectItem value="multiprofissional">Multiprofissional</SelectItem>
              <SelectItem value="formacao">Formação</SelectItem>
              <SelectItem value="outra">Outra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="r-participantes">Participantes (separados por vírgula)</Label>
        <Input id="r-participantes" value={participantes}
          onChange={(e) => setParticipantes(e.target.value)}
          placeholder="Rafaela Dias, Nome do Participante..." className="mt-1" />
      </div>
      <div>
        <Label htmlFor="r-local">Local</Label>
        <Input id="r-local" value={local} onChange={(e) => setLocal(e.target.value)}
          placeholder="Ex.: Sala de reuniões, Videoconferência..." className="mt-1" />
      </div>
      <div>
        <Label htmlFor="r-anotacoes">Anotações / Ata</Label>
        <Textarea id="r-anotacoes" rows={4} value={anotacoes}
          onChange={(e) => setAnotacoes(e.target.value)}
          placeholder="O que foi discutido, decisões tomadas, encaminhamentos..." className="mt-1" />
      </div>
      {erro && <p className="text-sm" style={{ color: 'var(--danger)' }}>{erro}</p>}
      <DialogFooter>
        <Button variant="outline" onClick={onFechar}>Cancelar</Button>
        <Button onClick={handleSalvar}>
          {inicial ? 'Salvar Alterações' : 'Registrar Reunião'}
        </Button>
      </DialogFooter>
    </div>
  );
}

// ── Card de reunião ──────────────────────────────────────────────────────────

function CardReuniao({ reuniao }: { reuniao: Reuniao }) {
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);
  const [editAberto, setEditAberto] = useState(false);
  const info = TIPO_INFO[reuniao.tipo];

  const dataFormatada = format(new Date(reuniao.data + 'T12:00:00'), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const diaSemana = format(new Date(reuniao.data + 'T12:00:00'), 'EEEE', { locale: ptBR });
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

// ── Página principal ─────────────────────────────────────────────────────────

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
          <Users2 size={44} style={{ color: 'var(--text-muted)' }} />
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

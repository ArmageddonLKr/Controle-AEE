// src/components/shared/AddSessaoForm.tsx
// Formulário de nova sessão — salva nos dados locais do navegador
'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addSessao } from '@/lib/storage';
import type { Sessao } from '@/types';

interface AddSessaoFormProps {
  criancaId: string;
  onSessaoAdded?: () => void;
}

const hojeISO = () => new Date().toISOString().split('T')[0];

export default function AddSessaoForm({ criancaId, onSessaoAdded }: AddSessaoFormProps) {
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);

  const [data, setData] = useState(hojeISO());
  const [hora, setHora] = useState('09:00');
  const [duracao, setDuracao] = useState('45');
  const [tipo, setTipo] = useState<Sessao['tipo']>('individual');
  const [presente, setPresente] = useState('sim');
  const [motivoFalta, setMotivoFalta] = useState('');
  const [anotacoes, setAnotacoes] = useState('');
  const [evolucaoObservada, setEvolucaoObservada] = useState('');
  const [erro, setErro] = useState('');

  function limpar() {
    setData(hojeISO());
    setHora('09:00');
    setDuracao('45');
    setTipo('individual');
    setPresente('sim');
    setMotivoFalta('');
    setAnotacoes('');
    setEvolucaoObservada('');
    setErro('');
  }

  function handleSalvar() {
    if (!data) {
      setErro('Informe a data da sessão.');
      return;
    }
    const duracaoNum = parseInt(duracao, 10);
    if (!duracaoNum || duracaoNum <= 0) {
      setErro('Informe uma duração válida em minutos.');
      return;
    }

    addSessao({
      criancaId,
      data,
      hora,
      duracao: duracaoNum,
      tipo,
      presente: presente === 'sim',
      motivoFalta: presente === 'nao' && motivoFalta ? motivoFalta : undefined,
      anotacoes,
      evolucaoObservada: evolucaoObservada || undefined,
    });

    toast({ title: 'Sessão registrada!', description: 'O registro foi salvo neste dispositivo.' });
    setAberto(false);
    limpar();
    onSessaoAdded?.();
  }

  return (
    <Dialog open={aberto} onOpenChange={(open) => { setAberto(open); if (!open) limpar(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Sessão
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Nova Sessão</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sessao-data">Data</Label>
            <Input id="sessao-data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sessao-hora">Hora</Label>
            <Input id="sessao-hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sessao-duracao">Duração (min)</Label>
            <Input
              id="sessao-duracao"
              type="number"
              min={5}
              step={5}
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
            />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as Sessao['tipo'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="grupo">Grupo</SelectItem>
                <SelectItem value="familiar">Familiar</SelectItem>
                <SelectItem value="orientacao">Orientação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Presença</Label>
            <Select value={presente} onValueChange={setPresente}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">✓ Presente</SelectItem>
                <SelectItem value="nao">✗ Faltou</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {presente === 'nao' && (
            <div className="col-span-2">
              <Label htmlFor="sessao-motivo">Motivo da falta</Label>
              <Input
                id="sessao-motivo"
                value={motivoFalta}
                onChange={(e) => setMotivoFalta(e.target.value)}
                placeholder="Ex.: criança doente"
              />
            </div>
          )}
          <div className="col-span-2">
            <Label htmlFor="sessao-anotacoes">Anotações</Label>
            <Textarea
              id="sessao-anotacoes"
              rows={3}
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              placeholder="O que foi trabalhado na sessão..."
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="sessao-evolucao">Evolução observada (opcional)</Label>
            <Textarea
              id="sessao-evolucao"
              rows={2}
              value={evolucaoObservada}
              onChange={(e) => setEvolucaoObservada(e.target.value)}
            />
          </div>
        </div>

        {erro && <p className="text-sm" style={{ color: 'var(--danger)' }}>{erro}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>Salvar Sessão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

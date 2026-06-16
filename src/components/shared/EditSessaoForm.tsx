// src/components/shared/EditSessaoForm.tsx
// Modal para editar uma sessão existente
'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
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
import { updateSessao } from '@/lib/storage';
import type { Sessao } from '@/types';

interface EditSessaoFormProps {
  sessao: Sessao;
}

export default function EditSessaoForm({ sessao }: EditSessaoFormProps) {
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);

  const [data, setData] = useState(sessao.data);
  const [hora, setHora] = useState(sessao.hora);
  const [duracao, setDuracao] = useState(String(sessao.duracao));
  const [tipo, setTipo] = useState<Sessao['tipo']>(sessao.tipo);
  const [presente, setPresente] = useState(sessao.presente ? 'sim' : 'nao');
  const [motivoFalta, setMotivoFalta] = useState(sessao.motivoFalta ?? '');
  const [anotacoes, setAnotacoes] = useState(sessao.anotacoes);
  const [evolucaoObservada, setEvolucaoObservada] = useState(sessao.evolucaoObservada ?? '');
  const [erro, setErro] = useState('');

  function resetar() {
    setData(sessao.data);
    setHora(sessao.hora);
    setDuracao(String(sessao.duracao));
    setTipo(sessao.tipo);
    setPresente(sessao.presente ? 'sim' : 'nao');
    setMotivoFalta(sessao.motivoFalta ?? '');
    setAnotacoes(sessao.anotacoes);
    setEvolucaoObservada(sessao.evolucaoObservada ?? '');
    setErro('');
  }

  function handleSalvar() {
    if (!data) { setErro('Informe a data.'); return; }
    const duracaoNum = parseInt(duracao, 10);
    if (!duracaoNum || duracaoNum <= 0) { setErro('Informe uma duração válida.'); return; }

    updateSessao(sessao.id, {
      data,
      hora,
      duracao: duracaoNum,
      tipo,
      presente: presente === 'sim',
      motivoFalta: presente === 'nao' && motivoFalta ? motivoFalta : undefined,
      anotacoes,
      evolucaoObservada: evolucaoObservada || undefined,
    });

    toast({ title: 'Sessão atualizada!', description: 'As alterações foram salvas.' });
    setAberto(false);
  }

  return (
    <Dialog open={aberto} onOpenChange={(open) => { setAberto(open); if (!open) resetar(); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" title="Editar sessão">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Sessão</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-sessao-data">Data</Label>
            <Input id="edit-sessao-data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-sessao-hora">Hora</Label>
            <Input id="edit-sessao-hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-sessao-duracao">Duração (min)</Label>
            <Input
              id="edit-sessao-duracao"
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
              <Label htmlFor="edit-sessao-motivo">Motivo da falta</Label>
              <Input
                id="edit-sessao-motivo"
                value={motivoFalta}
                onChange={(e) => setMotivoFalta(e.target.value)}
                placeholder="Ex.: criança doente"
              />
            </div>
          )}
          <div className="col-span-2">
            <Label htmlFor="edit-sessao-anotacoes">Anotações</Label>
            <Textarea
              id="edit-sessao-anotacoes"
              rows={3}
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="edit-sessao-evolucao">Evolução observada (opcional)</Label>
            <Textarea
              id="edit-sessao-evolucao"
              rows={2}
              value={evolucaoObservada}
              onChange={(e) => setEvolucaoObservada(e.target.value)}
            />
          </div>
        </div>

        {erro && <p className="text-sm" style={{ color: 'var(--danger)' }}>{erro}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

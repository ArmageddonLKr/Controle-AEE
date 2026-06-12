// src/components/shared/AddEvolucaoForm.tsx
// Formulário de novo registro de evolução — salva nos dados locais do navegador
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
import { useToast } from '@/hooks/use-toast';
import { addEvolucao } from '@/lib/storage';

interface AddEvolucaoFormProps {
  criancaId: string;
}

export default function AddEvolucaoForm({ criancaId }: AddEvolucaoFormProps) {
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);

  const [periodo, setPeriodo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [areas, setAreas] = useState('');
  const [proximosPassos, setProximosPassos] = useState('');
  const [erro, setErro] = useState('');

  function limpar() {
    setPeriodo('');
    setDescricao('');
    setAreas('');
    setProximosPassos('');
    setErro('');
  }

  function handleSalvar() {
    if (!periodo.trim()) {
      setErro('Informe o período (ex.: "1º Semestre 2026").');
      return;
    }
    if (!descricao.trim()) {
      setErro('Descreva a evolução observada.');
      return;
    }

    addEvolucao({
      criancaId,
      data: new Date().toISOString().split('T')[0],
      periodo: periodo.trim(),
      descricao: descricao.trim(),
      areas: areas ? areas.split(',').map((a) => a.trim()).filter(Boolean) : [],
      proximosPassos: proximosPassos.trim() || undefined,
    });

    toast({ title: 'Evolução registrada!', description: 'O registro foi salvo neste dispositivo.' });
    setAberto(false);
    limpar();
  }

  return (
    <Dialog open={aberto} onOpenChange={(open) => { setAberto(open); if (!open) limpar(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Evolução
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Evolução</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="evolucao-periodo">Período</Label>
            <Input
              id="evolucao-periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              placeholder='Ex.: "1º Semestre 2026"'
            />
          </div>
          <div>
            <Label htmlFor="evolucao-areas">Áreas trabalhadas (separadas por vírgula)</Label>
            <Input
              id="evolucao-areas"
              value={areas}
              onChange={(e) => setAreas(e.target.value)}
              placeholder="Ex.: Linguagem, Coordenação motora, Socialização"
            />
          </div>
          <div>
            <Label htmlFor="evolucao-descricao">Descrição</Label>
            <Textarea
              id="evolucao-descricao"
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os avanços observados no período..."
            />
          </div>
          <div>
            <Label htmlFor="evolucao-passos">Próximos passos (opcional)</Label>
            <Textarea
              id="evolucao-passos"
              rows={2}
              value={proximosPassos}
              onChange={(e) => setProximosPassos(e.target.value)}
            />
          </div>
        </div>

        {erro && <p className="text-sm" style={{ color: 'var(--danger)' }}>{erro}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
          <Button onClick={handleSalvar}>Salvar Evolução</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// src/components/shared/EditEvolucaoForm.tsx
// Modal para editar um registro de evolução existente
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
import { useToast } from '@/hooks/use-toast';
import { updateEvolucao } from '@/lib/storage';
import type { Evolucao } from '@/types';

interface EditEvolucaoFormProps {
  evolucao: Evolucao;
}

export default function EditEvolucaoForm({ evolucao }: EditEvolucaoFormProps) {
  const { toast } = useToast();
  const [aberto, setAberto] = useState(false);

  const [periodo, setPeriodo] = useState(evolucao.periodo);
  const [areas, setAreas] = useState(evolucao.areas.join(', '));
  const [descricao, setDescricao] = useState(evolucao.descricao);
  const [proximosPassos, setProximosPassos] = useState(evolucao.proximosPassos ?? '');
  const [erro, setErro] = useState('');

  function resetar() {
    setPeriodo(evolucao.periodo);
    setAreas(evolucao.areas.join(', '));
    setDescricao(evolucao.descricao);
    setProximosPassos(evolucao.proximosPassos ?? '');
    setErro('');
  }

  function handleSalvar() {
    if (!periodo.trim()) { setErro('Informe o período.'); return; }
    if (!descricao.trim()) { setErro('Descreva a evolução.'); return; }

    updateEvolucao(evolucao.id, {
      periodo: periodo.trim(),
      areas: areas ? areas.split(',').map((a) => a.trim()).filter(Boolean) : [],
      descricao: descricao.trim(),
      proximosPassos: proximosPassos.trim() || undefined,
    });

    toast({ title: 'Evolução atualizada!', description: 'As alterações foram salvas.' });
    setAberto(false);
  }

  return (
    <Dialog open={aberto} onOpenChange={(open) => { setAberto(open); if (!open) resetar(); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" title="Editar evolução">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Evolução</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-ev-periodo">Período</Label>
            <Input
              id="edit-ev-periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              placeholder='Ex.: "1º Semestre 2026"'
            />
          </div>
          <div>
            <Label htmlFor="edit-ev-areas">Áreas trabalhadas (separadas por vírgula)</Label>
            <Input
              id="edit-ev-areas"
              value={areas}
              onChange={(e) => setAreas(e.target.value)}
              placeholder="Ex.: Linguagem, Coordenação motora, Socialização"
            />
          </div>
          <div>
            <Label htmlFor="edit-ev-descricao">Descrição</Label>
            <Textarea
              id="edit-ev-descricao"
              rows={5}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-ev-passos">Próximos passos (opcional)</Label>
            <Textarea
              id="edit-ev-passos"
              rows={2}
              value={proximosPassos}
              onChange={(e) => setProximosPassos(e.target.value)}
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

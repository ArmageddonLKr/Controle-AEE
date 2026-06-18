// src/components/shared/ReuniaoForm.tsx
// Formulário de criação/edição de reunião — reutilizado na página de Reuniões
// e na aba "Reuniões" do perfil da criança.
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCriancas } from '@/hooks/useAlunos';
import { hojeISO } from '@/lib/utils/date';
import type { Reuniao } from '@/types';

export default function FormReuniao({
  inicial,
  onSalvar,
  onFechar,
  criancaIdFixa,
}: {
  inicial?: Reuniao;
  onSalvar: (dados: Omit<Reuniao, 'id'>) => void;
  onFechar: () => void;
  /** Quando informado, a reunião fica sempre vinculada a esta criança */
  criancaIdFixa?: string;
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

  // Crianças vinculadas — começam pelas já vinculadas + a criança fixa (se houver)
  const { criancas } = useCriancas();
  const [relacionadas, setRelacionadas] = useState<string[]>(() => {
    const base = new Set(inicial?.criancasRelacionadas ?? []);
    if (criancaIdFixa) base.add(criancaIdFixa);
    return Array.from(base);
  });

  function alternarCrianca(id: string) {
    if (id === criancaIdFixa) return; // a criança fixa não pode ser desvinculada aqui
    setRelacionadas((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    );
  }

  function handleSalvar() {
    if (!titulo.trim()) { setErro('Informe o título da reunião.'); return; }
    if (!data) { setErro('Informe a data.'); return; }

    // Mantém os vínculos escolhidos e garante a criança fixa (quando houver)
    const finais = new Set(relacionadas);
    if (criancaIdFixa) finais.add(criancaIdFixa);

    onSalvar({
      data,
      hora,
      duracao: Math.max(5, parseInt(duracao, 10) || 60),
      titulo: titulo.trim(),
      tipo,
      participantes: participantes.split(',').map((p) => p.trim()).filter(Boolean),
      local: local.trim(),
      anotacoes: anotacoes.trim(),
      ...(finais.size > 0 ? { criancasRelacionadas: Array.from(finais) } : {}),
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
      {/* Crianças relacionadas — conecta a reunião aos perfis das crianças */}
      {criancas.length > 0 && (
        <div>
          <Label>Crianças relacionadas</Label>
          <p className="text-xs mt-0.5 mb-2" style={{ color: 'var(--text-muted)' }}>
            Vincule esta reunião a uma ou mais crianças. Ela aparecerá na aba
            &ldquo;Reuniões&rdquo; do perfil de cada uma.
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
            {criancas.map((c) => {
              const ativo = relacionadas.includes(c.id);
              const fixa = c.id === criancaIdFixa;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => alternarCrianca(c.id)}
                  disabled={fixa}
                  title={fixa ? 'Reunião do perfil desta criança' : undefined}
                  className="text-xs font-medium rounded-full px-2.5 py-1 transition-all"
                  style={{
                    border: ativo ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                    background: ativo ? 'var(--accent-light)' : 'transparent',
                    color: ativo ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    cursor: fixa ? 'default' : 'pointer',
                    opacity: fixa ? 0.85 : 1,
                  }}
                >
                  {ativo ? '✓ ' : ''}{c.nome.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      )}

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

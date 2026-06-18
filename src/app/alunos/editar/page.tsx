// src/app/alunos/editar/page.tsx
// Edição de cadastro de criança — lê o ID da query string e pré-preenche o formulário
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCriancaById } from '@/hooks/useAlunos';
import { updateCrianca } from '@/lib/storage';
import { NIVEIS } from '@/lib/niveis';

const formSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  apelido: z.string().optional(),
  dataNascimento: z.string().refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Data inválida'),
  genero: z.enum(['M', 'F']),
  status: z.enum(['ativo', 'inativo', 'espera']),
  escola: z.string().optional(),
  turma: z.string().optional(),
  serie: z.string().optional(),
  nivel: z.string().optional(),
  turno: z.enum(['manhã', 'tarde', 'integral']).optional(),
  professorRegente: z.string().optional(),
  diagnosticos: z.string().optional(),
  cids: z.string().optional(),
  dataInicioAcompanhamento: z.string().refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Data inválida'),
  observacoesImportantes: z.string().optional(),
  medicamentos: z.string().optional(),
  alergias: z.string().optional(),
  responsaveis: z.array(z.object({
    nome: z.string().min(1, 'Nome obrigatório'),
    parentesco: z.string().min(1, 'Parentesco obrigatório'),
    telefone: z.string().optional(),
    email: z.string().optional(),
    responsavelLegal: z.boolean().optional(),
  })).optional(),
});

type FormData = z.infer<typeof formSchema>;

function Carregando() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
    </div>
  );
}

function NaoEncontrada() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4 gap-3">
      <UserX size={44} style={{ color: 'var(--text-muted)' }} />
      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Criança não encontrada</h2>
      <Link href="/alunos" className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'var(--accent-primary)' }}>
        <ArrowLeft size={16} /> Voltar para Crianças
      </Link>
    </div>
  );
}

function EditarForm({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { crianca, loading } = useCriancaById(id);

  const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: crianca ? {
      nome: crianca.nome,
      apelido: crianca.apelido ?? '',
      dataNascimento: crianca.dataNascimento,
      genero: crianca.genero,
      status: crianca.status,
      escola: crianca.escola ?? '',
      turma: crianca.turma ?? '',
      serie: crianca.serie ?? '',
      nivel: crianca.nivel ?? '',
      turno: crianca.turno ?? 'manhã',
      professorRegente: crianca.professorRegente ?? '',
      diagnosticos: crianca.diagnosticos.join(', '),
      cids: crianca.cids.join(', '),
      dataInicioAcompanhamento: crianca.dataInicioAcompanhamento,
      observacoesImportantes: crianca.observacoesImportantes ?? '',
      medicamentos: crianca.medicamentos?.join(', ') ?? '',
      alergias: crianca.alergias?.join(', ') ?? '',
      responsaveis: crianca.responsaveis.length > 0
        ? crianca.responsaveis
        : [{ nome: '', parentesco: '', telefone: '', email: '', responsavelLegal: true }],
    } : undefined,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'responsaveis' });

  const onSubmit = (data: FormData) => {
    updateCrianca(id, {
      nome: data.nome,
      apelido: data.apelido || undefined,
      dataNascimento: data.dataNascimento,
      genero: data.genero,
      status: data.status,
      escola: data.escola ?? '',
      turma: data.turma ?? '',
      serie: data.serie ?? '',
      nivel: data.nivel || undefined,
      turno: data.turno ?? 'manhã',
      professorRegente: data.professorRegente || undefined,
      diagnosticos: data.diagnosticos ? data.diagnosticos.split(',').map((s) => s.trim()).filter(Boolean) : [],
      cids: data.cids ? data.cids.split(',').map((s) => s.trim()).filter(Boolean) : [],
      dataInicioAcompanhamento: data.dataInicioAcompanhamento,
      observacoesImportantes: data.observacoesImportantes || undefined,
      medicamentos: data.medicamentos ? data.medicamentos.split(',').map((s) => s.trim()).filter(Boolean) : [],
      alergias: data.alergias ? data.alergias.split(',').map((s) => s.trim()).filter(Boolean) : [],
      responsaveis: (data.responsaveis ?? [])
        .filter((r) => r.nome.trim())
        .map((r) => ({
          nome: r.nome,
          parentesco: r.parentesco,
          telefone: r.telefone ?? '',
          email: r.email || undefined,
          responsavelLegal: r.responsavelLegal ?? false,
        })),
    });
    toast({ title: 'Cadastro atualizado! ✅', description: 'As alterações foram salvas com sucesso.' });
    router.push(`/alunos/perfil/?id=${id}`);
  };

  if (loading) return <Carregando />;
  if (!crianca) return <NaoEncontrada />;

  const inputCls = "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition";
  const labelCls = "text-sm font-semibold";

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/alunos/perfil/?id=${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6"
        style={{ color: 'var(--accent-primary)' }}
      >
        <ArrowLeft size={16} /> Voltar ao perfil
      </Link>

      <div className="flex items-center gap-3 mb-8 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
          style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
          {crianca.nome.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Editar Cadastro</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{crianca.nome}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ── Dados Pessoais ── */}
        <section className="rounded-xl p-5 space-y-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--accent-primary)' }}>👤 Dados Pessoais</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label className={labelCls} htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" {...register('nome')} className={`mt-1 ${errors.nome ? 'border-red-500' : ''}`} />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <Label className={labelCls} htmlFor="apelido">Apelido</Label>
              <Input id="apelido" {...register('apelido')} className="mt-1" placeholder="Como a criança é chamada" />
            </div>
            <div>
              <Label className={labelCls} htmlFor="dataNascimento">Data de Nascimento *</Label>
              <Input id="dataNascimento" type="date" {...register('dataNascimento')} className={`mt-1 ${errors.dataNascimento ? 'border-red-500' : ''}`} />
              {errors.dataNascimento && <p className="text-red-500 text-xs mt-1">{errors.dataNascimento.message}</p>}
            </div>
            <div>
              <Label className={labelCls}>Gênero *</Label>
              <Controller name="genero" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div>
              <Label className={labelCls}>Status *</Label>
              <Controller name="status" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="espera">Lista de Espera</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div>
              <Label className={labelCls} htmlFor="dataInicioAcompanhamento">Início do Acompanhamento *</Label>
              <Input id="dataInicioAcompanhamento" type="date" {...register('dataInicioAcompanhamento')} className="mt-1" />
            </div>
          </div>
        </section>

        {/* ── Escola ── */}
        <section className="rounded-xl p-5 space-y-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--accent-primary)' }}>🏫 Informações Escolares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label className={labelCls}>Pasta / Nível</Label>
              <Controller name="nivel" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Escolha a pasta..." /></SelectTrigger>
                  <SelectContent>
                    {NIVEIS.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div className="sm:col-span-2">
              <Label className={labelCls} htmlFor="escola">Escola</Label>
              <Input id="escola" {...register('escola')} className="mt-1" />
            </div>
            <div>
              <Label className={labelCls} htmlFor="serie">Série / Ano</Label>
              <Input id="serie" {...register('serie')} className="mt-1" />
            </div>
            <div>
              <Label className={labelCls} htmlFor="turma">Turma</Label>
              <Input id="turma" {...register('turma')} className="mt-1" />
            </div>
            <div>
              <Label className={labelCls}>Turno</Label>
              <Controller name="turno" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manhã">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div>
              <Label className={labelCls} htmlFor="professorRegente">Professor(a) Regente</Label>
              <Input id="professorRegente" {...register('professorRegente')} className="mt-1" />
            </div>
          </div>
        </section>

        {/* ── Responsáveis ── */}
        <section className="rounded-xl p-5 space-y-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold" style={{ color: 'var(--accent-primary)' }}>👨‍👩‍👧 Responsáveis</h2>
            <Button type="button" variant="outline" size="sm"
              onClick={() => append({ nome: '', parentesco: '', telefone: '', email: '', responsavelLegal: false })}>
              <PlusCircle className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
          {fields.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum responsável cadastrado.</p>
          )}
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg p-4 space-y-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
                  Responsável {index + 1}
                </span>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(index)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className={labelCls}>Nome *</Label>
                  <Input {...register(`responsaveis.${index}.nome`)} className="mt-1" placeholder="Nome completo" />
                </div>
                <div>
                  <Label className={labelCls}>Parentesco *</Label>
                  <Input {...register(`responsaveis.${index}.parentesco`)} className="mt-1" placeholder="Mãe, Pai, Avó…" />
                </div>
                <div>
                  <Label className={labelCls}>Telefone</Label>
                  <Input {...register(`responsaveis.${index}.telefone`)} className="mt-1" placeholder="(00) 00000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <Label className={labelCls}>E-mail</Label>
                  <Input {...register(`responsaveis.${index}.email`)} type="email" className="mt-1" placeholder="email@exemplo.com" />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id={`resp-legal-${index}`} {...register(`responsaveis.${index}.responsavelLegal`)} className="w-4 h-4" />
                  <Label htmlFor={`resp-legal-${index}`} className="text-xs font-medium cursor-pointer">Responsável legal</Label>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ── Dados Clínicos ── */}
        <section className="rounded-xl p-5 space-y-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--accent-primary)' }}>🩺 Dados Clínicos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className={labelCls} htmlFor="diagnosticos">Diagnósticos (separados por vírgula)</Label>
              <Textarea id="diagnosticos" rows={2} {...register('diagnosticos')} className="mt-1" placeholder="Ex.: TEA, TDAH" />
            </div>
            <div>
              <Label className={labelCls} htmlFor="cids">CIDs (separados por vírgula)</Label>
              <Textarea id="cids" rows={2} {...register('cids')} className="mt-1" placeholder="Ex.: F84.0, F90.0" />
            </div>
            <div>
              <Label className={labelCls} htmlFor="medicamentos">Medicamentos (separados por vírgula)</Label>
              <Textarea id="medicamentos" rows={2} {...register('medicamentos')} className="mt-1" />
            </div>
            <div>
              <Label className={labelCls} htmlFor="alergias">Alergias (separadas por vírgula)</Label>
              <Textarea id="alergias" rows={2} {...register('alergias')} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label className={labelCls} htmlFor="observacoesImportantes">Observações Importantes</Label>
              <Textarea id="observacoesImportantes" rows={4} {...register('observacoesImportantes')} className="mt-1"
                placeholder="Informações críticas que a psicóloga precisa saber…" />
            </div>
          </div>
        </section>

        {/* ── Ações ── */}
        <div className="flex gap-3 justify-end pb-8">
          <Link href={`/alunos/perfil/?id=${id}`}>
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" size="lg">Salvar Alterações</Button>
        </div>
      </form>
    </div>
  );
}

function Conteudo() {
  const params = useSearchParams();
  const id = params.get('id') ?? '';
  return <EditarForm id={id} />;
}

export default function EditarAlunoPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <Conteudo />
    </Suspense>
  );
}

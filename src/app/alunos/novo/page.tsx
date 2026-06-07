// src/app/alunos/novo/page.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Validação completa do formulário
const formSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  dataNascimento: z.string().refine(v => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Data inválida (YYYY-MM-DD)'),
  genero: z.enum(['M', 'F']),
  status: z.enum(['ativo', 'inativo', 'espera']),
  escola: z.string().optional(),
  turma: z.string().optional(),
  serie: z.string().optional(),
  turno: z.enum(['manhã', 'tarde', 'integral']).optional(),
  diagnosticos: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  dataInicioAcompanhamento: z.string().refine(v => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Data inválida (YYYY-MM-DD)'),
  observacoesImportantes: z.string().optional(),
  medicamentos: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
  alergias: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : []),
});

type FormData = z.infer<typeof formSchema>;

export default function NovoAlunoPage() {
  const _router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, control } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'ativo',
      dataInicioAcompanhamento: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (_data: FormData) => {
    toast({
      title: 'Funcionalidade em breve',
      description: 'O cadastro de novas crianças estará disponível na próxima fase do sistema.',
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Nova Criança</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NOME */}
          <div className="md:col-span-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
          </div>

          {/* DATA NASCIMENTO */}
          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input id="dataNascimento" type="date" {...register('dataNascimento')} />
            {errors.dataNascimento && <p className="text-red-500 text-sm mt-1">{errors.dataNascimento.message}</p>}
          </div>

          {/* GÊNERO */}
          <div>
            <Label>Gênero</Label>
            <Controller
              name="genero"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">Feminino</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero.message}</p>}
          </div>
          
          {/* STATUS */}
          <div>
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="espera">Lista de Espera</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* DATA INÍCIO ACOMPANHAMENTO */}
          <div>
            <Label htmlFor="dataInicioAcompanhamento">Início do Acompanhamento</Label>
            <Input id="dataInicioAcompanhamento" type="date" {...register('dataInicioAcompanhamento')} />
            {errors.dataInicioAcompanhamento && <p className="text-red-500 text-sm mt-1">{errors.dataInicioAcompanhamento.message}</p>}
          </div>

        </div>

        <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Informações Escolares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ESCOLA */}
              <div>
                <Label htmlFor="escola">Escola</Label>
                <Input id="escola" {...register('escola')} />
              </div>
              {/* SÉRIE */}
              <div>
                <Label htmlFor="serie">Série / Ano</Label>
                <Input id="serie" {...register('serie')} />
              </div>
              {/* TURMA */}
              <div>
                <Label htmlFor="turma">Turma</Label>
                <Input id="turma" {...register('turma')} />
              </div>
              {/* TURNO */}
              <div>
                <Label>Turno</Label>
                <Controller
                  name="turno"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manhã">Manhã</SelectItem>
                        <SelectItem value="tarde">Tarde</SelectItem>
                        <SelectItem value="integral">Integral</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
        </div>

        <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Informações Clínicas</h2>
            {/* DIAGNÓSTICOS */}
            <div>
              <Label htmlFor="diagnosticos">Diagnósticos (separados por vírgula)</Label>
              <Textarea id="diagnosticos" {...register('diagnosticos')} />
            </div>

            {/* MEDICAMENTOS */}
            <div>
              <Label htmlFor="medicamentos">Medicamentos (separados por vírgula)</Label>
              <Textarea id="medicamentos" {...register('medicamentos')} />
            </div>

            {/* ALERGIAS */}
            <div>
              <Label htmlFor="alergias">Alergias (separadas por vírgula)</Label>
              <Textarea id="alergias" {...register('alergias')} />
            </div>

            {/* OBSERVAÇÕES */}
            <div>
              <Label htmlFor="observacoesImportantes">Observações Importantes</Label>
              <Textarea id="observacoesImportantes" {...register('observacoesImportantes')} rows={4} />
            </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
            <Button type="submit" size="lg">Salvar Cadastro</Button>
        </div>
      </form>
    </div>
  );
}

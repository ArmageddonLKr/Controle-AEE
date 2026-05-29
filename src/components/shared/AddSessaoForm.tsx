// src/components/shared/AddSessaoForm.tsx
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetDescription, SheetFooter, SheetTrigger
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Loader2, PlusCircle } from 'lucide-react';

// Schema de validação com Zod
const sessaoSchema = z.object({
  data: z.string().nonempty({ message: "A data é obrigatória." }),
  duracao: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive({ message: "A duração deve ser um número positivo." })
  ),
  tipo: z.enum(['individual', 'grupo', 'familiar', 'orientacao'], { required_error: "O tipo é obrigatório." }),
  anotacoes: z.string().nonempty({ message: "As anotações são obrigatórias." }),
  presente: z.boolean().default(true),
  motivo_falta: z.string().optional(),
  evolucao_observada: z.string().optional(),
}).refine(data => !data.presente ? !!data.motivo_falta : true, {
    message: 'O motivo da falta é obrigatório se a criança não estava presente.',
    path: ['motivo_falta'],
});

interface AddSessaoFormProps {
  criancaId: string;
  onSessaoAdded: () => void; // Callback para notificar o pai
}

export default function AddSessaoForm({ criancaId, onSessaoAdded }: AddSessaoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, watch, control, formState: { errors }, reset } = useForm<z.infer<typeof sessaoSchema>>({
    resolver: zodResolver(sessaoSchema),
    defaultValues: {
      presente: true,
      data: new Date().toISOString().split('T')[0], // Hoje como padrão
      anotacoes: '',
      duracao: 50,
      evolucao_observada: '',
      motivo_falta: '',
      tipo: 'individual'
    },
  });
  
  const isPresent = watch('presente');

  async function onSubmit(values: z.infer<typeof sessaoSchema>) {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('sessoes').insert([
        { ...values, crianca_id: criancaId },
      ]);

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Nova sessão registrada." });
      onSessaoAdded(); // Notifica o componente pai
      reset(); // Limpa o formulário
      setIsOpen(false); // Fecha o painel
    } catch (err: any) {
      console.error("Erro ao adicionar sessão:", err.message);
      toast({ title: 'Erro', description: 'Não foi possível salvar a sessão.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Nova Sessão</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Adicionar Nova Sessão</SheetTitle>
          <SheetDescription>Preencha os detalhes do atendimento.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          
          <div className="grid grid-cols-3 gap-4">
              <div>
                  <Label htmlFor="data">Data</Label>
                  <Input id="data" type="date" {...register('data')} />
                  {errors.data && <p className="text-xs text-destructive mt-1">{errors.data.message}</p>}
              </div>
              <div>
                  <Label htmlFor="duracao">Duração (min)</Label>
                  <Input id="duracao" type="number" {...register('duracao')} />
                  {errors.duracao && <p className="text-xs text-destructive mt-1">{errors.duracao.message}</p>}
              </div>
               <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Controller
                        control={control}
                        name="tipo"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="grupo">Grupo</SelectItem>
                                    <SelectItem value="familiar">Familiar</SelectItem>
                                    <SelectItem value="orientacao">Orientação</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                   {errors.tipo && <p className="text-xs text-destructive mt-1">{errors.tipo.message}</p>}
                </div>
          </div>

          <div>
            <Label htmlFor="anotacoes">Anotações Principais</Label>
            <Textarea id="anotacoes" {...register('anotacoes')} />
            {errors.anotacoes && <p className="text-xs text-destructive mt-1">{errors.anotacoes.message}</p>}
          </div>

           <div>
            <Label htmlFor="evolucao_observada">Evolução Observada</Label>
            <Textarea id="evolucao_observada" {...register('evolucao_observada')} />
          </div>

          <div className="flex items-center space-x-2">
             <Controller
                control={control}
                name="presente"
                render={({ field }) => (
                    <Checkbox id="presente" checked={field.value} onCheckedChange={field.onChange} />
                )}
            />
            <Label htmlFor="presente">Criança esteve presente?</Label>
          </div>

          {!isPresent && (
            <div>
              <Label htmlFor="motivo_falta">Motivo da falta</Label>
              <Input id="motivo_falta" {...register('motivo_falta')} />
              {errors.motivo_falta && <p className="text-xs text-destructive mt-1">{errors.motivo_falta.message}</p>}
            </div>
          )}
          
          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              Salvar Sessão
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

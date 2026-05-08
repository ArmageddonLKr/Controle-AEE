"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { alunoSchema, type AlunoFormData } from "@/lib/validations/aluno";
import { criarAluno, atualizarAluno } from "@/app/actions/alunos";
import { NECESSIDADES_ESPECIAIS } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import type { Aluno } from "@/types";

interface AlunoFormProps {
  aluno?: Aluno;
  onSuccess?: () => void;
}

export function AlunoForm({ aluno, onSuccess }: AlunoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEdit = !!aluno;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: aluno
      ? {
          nome: aluno.nome,
          dataNascimento: format(new Date(aluno.dataNascimento), "yyyy-MM-dd"),
          turma: aluno.turma ?? "",
          escola: aluno.escola ?? "",
          responsavel: aluno.responsavel ?? "",
          telefone: aluno.telefone ?? "",
          necessidadeEspecial: aluno.necessidadeEspecial ?? "",
          observacoes: aluno.observacoes ?? "",
          ativo: aluno.ativo,
        }
      : { ativo: true },
  });

  const necessidade = watch("necessidadeEspecial");

  const onSubmit = async (data: AlunoFormData) => {
    setLoading(true);
    try {
      const result = isEdit
        ? await atualizarAluno(aluno.id, data as Record<string, unknown>)
        : await criarAluno(data as Record<string, unknown>);

      if (!result.success) {
        toast({ title: "Erro ao salvar.", description: "Verifique os campos.", variant: "destructive" });
        return;
      }

      toast({
        title: isEdit ? "Aluno atualizado!" : "Aluno cadastrado!",
        variant: "success",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/alunos");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="nome">Nome completo *</Label>
          <Input id="nome" {...register("nome")} placeholder="Nome do aluno" />
          {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dataNascimento">Data de nascimento *</Label>
          <Input id="dataNascimento" type="date" {...register("dataNascimento")} />
          {errors.dataNascimento && (
            <p className="text-xs text-destructive">{errors.dataNascimento.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="necessidadeEspecial">Necessidade especial</Label>
          <Select
            value={necessidade ?? ""}
            onValueChange={(v) => setValue("necessidadeEspecial", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Não informado</SelectItem>
              {NECESSIDADES_ESPECIAIS.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="turma">Turma</Label>
          <Input id="turma" {...register("turma")} placeholder="Ex: 3º Ano A" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="escola">Escola</Label>
          <Input id="escola" {...register("escola")} placeholder="Nome da escola" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="responsavel">Responsável</Label>
          <Input id="responsavel" {...register("responsavel")} placeholder="Nome do responsável" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" {...register("telefone")} placeholder="(11) 99999-9999" />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            {...register("observacoes")}
            placeholder="Informações adicionais sobre o aluno..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar aluno"}
        </Button>
      </div>
    </form>
  );
}

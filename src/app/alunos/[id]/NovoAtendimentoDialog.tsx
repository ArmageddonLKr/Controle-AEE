"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { atendimentoSchema, type AtendimentoFormData } from "@/lib/validations/atendimento";
import { registrarAtendimento } from "@/app/actions/atendimentos";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Props {
  alunoId: string;
  alunoNome: string;
}

export function NovoAtendimentoDialog({ alunoId, alunoNome }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<AtendimentoFormData>({
      resolver: zodResolver(atendimentoSchema),
      defaultValues: {
        alunoId,
        data: format(new Date(), "yyyy-MM-dd"),
        duracaoMin: 50,
        presente: true,
      },
    });

  const tipo = watch("tipo");
  const presente = watch("presente");

  const onSubmit = async (data: AtendimentoFormData) => {
    setLoading(true);
    try {
      const result = await registrarAtendimento(data as Record<string, unknown>);
      if (result.success) {
        toast({ title: "Atendimento registrado!", variant: "success" });
        reset({ alunoId, data: format(new Date(), "yyyy-MM-dd"), duracaoMin: 50, presente: true });
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Novo Atendimento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Atendimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("alunoId")} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Data</Label>
              <Input type="date" {...register("data")} />
              {errors.data && <p className="text-xs text-destructive">{errors.data.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Duração (min)</Label>
              <Input type="number" {...register("duracaoMin")} min={5} max={240} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Tipo de atendimento</Label>
            <Select value={tipo} onValueChange={(v) => setValue("tipo", v as AtendimentoFormData["tipo"])}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="grupo">Grupo</SelectItem>
                <SelectItem value="avaliacao">Avaliação</SelectItem>
                <SelectItem value="reuniao_familia">Reunião com Família</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Objetivo</Label>
            <Input {...register("objetivo")} placeholder="Objetivo do atendimento" />
          </div>

          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea {...register("observacoes")} rows={2} placeholder="Observações..." />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="presente"
              checked={presente}
              onChange={(e) => setValue("presente", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-600"
            />
            <Label htmlFor="presente">Aluno presente</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

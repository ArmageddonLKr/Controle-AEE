"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { registrarEvolucao } from "@/app/actions/atendimentos";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AREAS_OPCOES = [
  "Comunicação",
  "Socialização",
  "Cognição",
  "Motricidade",
  "Leitura",
  "Escrita",
  "Matemática",
  "Autonomia",
  "Autocuidado",
  "Atenção",
];

interface Props {
  alunoId: string;
}

export function NovaEvolucaoDialog({ alunoId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [areasSelecionadas, setAreasSelecionadas] = useState<string[]>([]);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      data: format(new Date(), "yyyy-MM-dd"),
      periodo: "",
      descricao: "",
    },
  });

  const toggleArea = (area: string) => {
    setAreasSelecionadas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const onSubmit = async (data: { data: string; periodo: string; descricao: string }) => {
    if (!data.descricao.trim()) return;
    setLoading(true);
    try {
      await registrarEvolucao({
        alunoId,
        data: data.data,
        periodo: data.periodo || undefined,
        descricao: data.descricao,
        areas: areasSelecionadas,
      });
      toast({ title: "Evolução registrada!", variant: "success" });
      reset({ data: format(new Date(), "yyyy-MM-dd"), periodo: "", descricao: "" });
      setAreasSelecionadas([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Nova Evolução
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Evolução</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Data</Label>
              <Input type="date" {...register("data")} />
            </div>
            <div className="space-y-1.5">
              <Label>Período</Label>
              <Input {...register("periodo")} placeholder="Ex: 1º Bimestre" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Áreas trabalhadas</Label>
            <div className="flex flex-wrap gap-1.5">
              {AREAS_OPCOES.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    areasSelecionadas.includes(area)
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição da evolução *</Label>
            <Textarea
              {...register("descricao")}
              rows={4}
              placeholder="Descreva os avanços, dificuldades e observações do período..."
            />
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

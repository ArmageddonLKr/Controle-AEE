"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { ExportButton } from "@/components/shared/ExportButton";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { TIPOS_ATENDIMENTO, type TipoAtendimento } from "@/types";

type AlunoBasico = {
  id: string;
  nome: string;
  turma: string | null;
  escola: string | null;
  necessidadeEspecial: string | null;
};

type RelRow = {
  aluno: string;
  turma: string;
  data: string;
  tipo: string;
  duracao: string;
  objetivo: string;
  presente: string;
};

interface Props {
  alunos: AlunoBasico[];
}

const TIPO_VARIANT: Record<string, "default" | "info" | "success" | "warning" | "muted"> = {
  individual: "info",
  grupo: "success",
  avaliacao: "warning",
  reuniao_familia: "muted",
};

export function RelatoriosClient({ alunos }: Props) {
  const [dataInicio, setDataInicio] = useState(
    format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd")
  );
  const [dataFim, setDataFim] = useState(format(new Date(), "yyyy-MM-dd"));
  const [alunoId, setAlunoId] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [dados, setDados] = useState<RelRow[] | null>(null);
  const [loading, startTransition] = useTransition();

  const gerarRelatorio = () => {
    startTransition(async () => {
      const params = new URLSearchParams();
      if (dataInicio) params.set("dataInicio", dataInicio);
      if (dataFim) params.set("dataFim", dataFim);
      if (alunoId && alunoId !== "todos") params.set("alunoId", alunoId);
      if (tipo && tipo !== "todos") params.set("tipo", tipo);

      const res = await fetch(`/api/relatorios?${params.toString()}`);
      const json = await res.json();
      setDados(json.dados ?? []);
    });
  };

  const stats = dados
    ? {
        total: dados.length,
        presentes: dados.filter((d) => d.presente === "Sim").length,
        totalMin: dados.reduce((acc, d) => acc + parseInt(d.duracao), 0),
      }
    : null;

  const exportColumns = [
    { header: "Aluno", dataKey: "aluno" },
    { header: "Turma", dataKey: "turma" },
    { header: "Data", dataKey: "data" },
    { header: "Tipo", dataKey: "tipo" },
    { header: "Duração", dataKey: "duracao" },
    { header: "Objetivo", dataKey: "objetivo" },
    { header: "Presente", dataKey: "presente" },
  ];

  const columns: ColumnDef<RelRow>[] = [
    { accessorKey: "aluno", header: "Aluno" },
    { accessorKey: "turma", header: "Turma" },
    { accessorKey: "data", header: "Data" },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => {
        const chave = Object.entries(TIPOS_ATENDIMENTO).find(
          ([, v]) => v === row.original.tipo
        )?.[0];
        return (
          <Badge variant={TIPO_VARIANT[chave ?? ""] ?? "muted"}>
            {row.original.tipo}
          </Badge>
        );
      },
    },
    { accessorKey: "duracao", header: "Duração" },
    {
      accessorKey: "objetivo",
      header: "Objetivo",
      cell: ({ row }) => (
        <span className="text-sm line-clamp-1">{row.original.objetivo}</span>
      ),
    },
    {
      accessorKey: "presente",
      header: "Presença",
      cell: ({ row }) => (
        <Badge variant={row.original.presente === "Sim" ? "success" : "destructive"}>
          {row.original.presente}
        </Badge>
      ),
    },
  ];

  const subtitleExport = `Período: ${dataInicio ? format(new Date(dataInicio), "dd/MM/yyyy") : "início"} a ${dataFim ? format(new Date(dataFim), "dd/MM/yyyy") : "hoje"}`;

  return (
    <div className="space-y-6">
      {/* Filter card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>Data início</Label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Data fim</Label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Aluno</Label>
              <Select value={alunoId} onValueChange={setAlunoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os alunos</SelectItem>
                  {alunos.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="grupo">Grupo</SelectItem>
                  <SelectItem value="avaliacao">Avaliação</SelectItem>
                  <SelectItem value="reuniao_familia">Reunião com Família</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={gerarRelatorio} disabled={loading}>
              <FileBarChart className="h-4 w-4" />
              {loading ? "Gerando..." : "Gerar Relatório"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {dados !== null && (
        <div className="space-y-4">
          {/* Summary */}
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-sky-600">{stats.total}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Atendimentos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-teal-600">
                    {stats.total > 0 ? Math.round((stats.presentes / stats.total) * 100) : 0}%
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Taxa de presença</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-2xl font-bold text-indigo-600">
                    {Math.round(stats.totalMin / 60)}h
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Total de horas</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600">
              {dados.length} registro(s) no período
            </h3>
            <ExportButton
              title="Relatório de Atendimentos — Controle AEE"
              subtitle={subtitleExport}
              columns={exportColumns}
              data={dados}
              filename={`relatorio-aee-${dataInicio}-${dataFim}`}
              disabled={dados.length === 0}
            />
          </div>

          <DataTable
            columns={columns}
            data={dados}
            emptyMessage="Nenhum registro encontrado para os filtros selecionados."
          />
        </div>
      )}
    </div>
  );
}

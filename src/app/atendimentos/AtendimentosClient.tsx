"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Search, X, Eye } from "lucide-react";
import type { Atendimento, Aluno } from "@/types";
import { DataTable } from "@/components/shared/DataTable";
import { ExportButton } from "@/components/shared/ExportButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIPOS_ATENDIMENTO, type TipoAtendimento } from "@/types";

type AtendimentoRow = Atendimento & {
  aluno: Pick<Aluno, "id" | "nome" | "turma" | "escola">;
};

const TIPO_VARIANT: Record<string, "default" | "info" | "success" | "warning" | "muted"> = {
  individual: "info",
  grupo: "success",
  avaliacao: "warning",
  reuniao_familia: "muted",
};

interface Props {
  atendimentos: AtendimentoRow[];
  initialFilters: { search: string; tipo: string; dataInicio: string; dataFim: string };
}

export function AtendimentosClient({ atendimentos, initialFilters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialFilters.search);
  const [tipo, setTipo] = useState(initialFilters.tipo || "todos");
  const [dataInicio, setDataInicio] = useState(initialFilters.dataInicio);
  const [dataFim, setDataFim] = useState(initialFilters.dataFim);
  const [, startTransition] = useTransition();

  const applyFilters = useCallback(
    (s: string, t: string, di: string, df: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (s) params.set("search", s); else params.delete("search");
      if (t && t !== "todos") params.set("tipo", t); else params.delete("tipo");
      if (di) params.set("dataInicio", di); else params.delete("dataInicio");
      if (df) params.set("dataFim", df); else params.delete("dataFim");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  const clearFilters = () => {
    setSearch(""); setTipo("todos"); setDataInicio(""); setDataFim("");
    startTransition(() => router.push(pathname));
  };

  const exportData = atendimentos.map((a) => ({
    aluno: a.aluno.nome,
    turma: a.aluno.turma ?? "-",
    data: format(new Date(a.data), "dd/MM/yyyy", { locale: ptBR }),
    tipo: TIPOS_ATENDIMENTO[a.tipo as TipoAtendimento] ?? a.tipo,
    duracao: `${a.duracaoMin} min`,
    objetivo: a.objetivo ?? "-",
    presente: a.presente ? "Sim" : "Não",
  }));

  const exportColumns = [
    { header: "Aluno", dataKey: "aluno" },
    { header: "Turma", dataKey: "turma" },
    { header: "Data", dataKey: "data" },
    { header: "Tipo", dataKey: "tipo" },
    { header: "Duração", dataKey: "duracao" },
    { header: "Objetivo", dataKey: "objetivo" },
    { header: "Presente", dataKey: "presente" },
  ];

  const columns: ColumnDef<AtendimentoRow>[] = [
    {
      accessorKey: "data",
      header: "Data",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {format(new Date(row.original.data), "dd/MM/yyyy", { locale: ptBR })}
        </span>
      ),
    },
    {
      id: "aluno",
      header: "Aluno",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-800">{row.original.aluno.nome}</p>
          {row.original.aluno.turma && (
            <p className="text-xs text-slate-400">{row.original.aluno.turma}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <Badge variant={TIPO_VARIANT[row.original.tipo] ?? "muted"}>
          {TIPOS_ATENDIMENTO[row.original.tipo as TipoAtendimento] ?? row.original.tipo}
        </Badge>
      ),
    },
    {
      accessorKey: "duracaoMin",
      header: "Duração",
      cell: ({ row }) => <span className="text-sm">{row.original.duracaoMin} min</span>,
    },
    {
      accessorKey: "objetivo",
      header: "Objetivo",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600 line-clamp-1">
          {row.original.objetivo ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "presente",
      header: "Presença",
      cell: ({ row }) => (
        <Badge variant={row.original.presente ? "success" : "destructive"}>
          {row.original.presente ? "Presente" : "Falta"}
        </Badge>
      ),
    },
    {
      id: "acoes",
      header: "",
      cell: ({ row }) => (
        <Link href={`/alunos/${row.original.aluno.id}`}>
          <Button variant="ghost" size="icon" title="Ver aluno">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const hasFilters = search || (tipo && tipo !== "todos") || dataInicio || dataFim;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por aluno..."
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); applyFilters(e.target.value, tipo, dataInicio, dataFim); }}
          />
        </div>

        <Select value={tipo} onValueChange={(v) => { setTipo(v); applyFilters(search, v, dataInicio, dataFim); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="grupo">Grupo</SelectItem>
            <SelectItem value="avaliacao">Avaliação</SelectItem>
            <SelectItem value="reuniao_familia">Reunião com Família</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="w-36"
            value={dataInicio}
            onChange={(e) => { setDataInicio(e.target.value); applyFilters(search, tipo, e.target.value, dataFim); }}
          />
          <span className="text-slate-400 text-sm">até</span>
          <Input
            type="date"
            className="w-36"
            value={dataFim}
            onChange={(e) => { setDataFim(e.target.value); applyFilters(search, tipo, dataInicio, e.target.value); }}
          />
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}

        <div className="ml-auto">
          <ExportButton
            title="Atendimentos"
            subtitle={`Exportado em ${format(new Date(), "dd/MM/yyyy")}`}
            columns={exportColumns}
            data={exportData}
            filename="atendimentos-controle-aee"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={atendimentos}
        emptyMessage="Nenhum atendimento encontrado."
      />
    </div>
  );
}

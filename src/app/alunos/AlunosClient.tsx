"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Eye, Pencil, Search, X, MoreHorizontal, UserX, UserCheck } from "lucide-react";
import type { Aluno } from "@/types";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calcularIdade, isAniversarioHoje } from "@/lib/utils/birthday";
import { alternarStatusAluno } from "@/app/actions/alunos";
import { toast } from "@/hooks/use-toast";

type AlunoRow = Aluno & { _count?: { atendimentos: number } };

interface AlunosClientProps {
  alunos: AlunoRow[];
  turmas: string[];
  initialFilters: { search: string; turma: string; status: string };
}

export function AlunosClient({ alunos, turmas, initialFilters }: AlunosClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialFilters.search);
  const [turma, setTurma] = useState(initialFilters.turma || "todos");
  const [status, setStatus] = useState(initialFilters.status || "ativo");
  const [, startTransition] = useTransition();

  const applyFilters = useCallback(
    (newSearch: string, newTurma: string, newStatus: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newSearch) params.set("search", newSearch); else params.delete("search");
      if (newTurma && newTurma !== "todos") params.set("turma", newTurma); else params.delete("turma");
      if (newStatus && newStatus !== "todos") params.set("status", newStatus); else params.delete("status");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  const handleAlternarStatus = async (id: string) => {
    const result = await alternarStatusAluno(id);
    if (result.success) {
      toast({ title: "Status atualizado com sucesso.", variant: "success" });
    }
  };

  const exportData = alunos.map((a) => ({
    nome: a.nome,
    dataNascimento: format(new Date(a.dataNascimento), "dd/MM/yyyy", { locale: ptBR }),
    idade: `${calcularIdade(a.dataNascimento)} anos`,
    turma: a.turma ?? "-",
    escola: a.escola ?? "-",
    responsavel: a.responsavel ?? "-",
    necessidade: a.necessidadeEspecial ?? "-",
    status: a.ativo ? "Ativo" : "Inativo",
  }));

  const exportColumns = [
    { header: "Nome", dataKey: "nome" },
    { header: "Data Nasc.", dataKey: "dataNascimento" },
    { header: "Idade", dataKey: "idade" },
    { header: "Turma", dataKey: "turma" },
    { header: "Escola", dataKey: "escola" },
    { header: "Responsável", dataKey: "responsavel" },
    { header: "Necessidade", dataKey: "necessidade" },
    { header: "Status", dataKey: "status" },
  ];

  const columns: ColumnDef<AlunoRow>[] = [
    {
      accessorKey: "nome",
      header: "Aluno",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-xs font-bold text-sky-700 shrink-0">
            {row.original.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800">
              {row.original.nome}
              {isAniversarioHoje(row.original.dataNascimento) && (
                <span className="ml-1" title="Aniversário hoje!">🎂</span>
              )}
            </p>
            {row.original.necessidadeEspecial && (
              <p className="text-xs text-slate-400">{row.original.necessidadeEspecial}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "dataNascimento",
      header: "Nascimento / Idade",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">
            {format(new Date(row.original.dataNascimento), "dd/MM/yyyy", { locale: ptBR })}
          </p>
          <p className="text-xs text-slate-400">{calcularIdade(row.original.dataNascimento)} anos</p>
        </div>
      ),
    },
    {
      accessorKey: "turma",
      header: "Turma",
      cell: ({ row }) => row.original.turma ?? <span className="text-slate-400">-</span>,
    },
    {
      accessorKey: "escola",
      header: "Escola",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.escola ?? "-"}</span>
      ),
    },
    {
      id: "atendimentos",
      header: "Atendimentos",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-sky-700">
          {row.original._count?.atendimentos ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.ativo ? "success" : "muted"}>
          {row.original.ativo ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      id: "acoes",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`/alunos/${row.original.id}`}>
            <Button variant="ghost" size="icon" title="Ver detalhes">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/alunos/${row.original.id}/editar`}>
            <Button variant="ghost" size="icon" title="Editar">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAlternarStatus(row.original.id)}>
                {row.original.ativo ? (
                  <><UserX className="h-4 w-4 mr-2" />Desativar</>
                ) : (
                  <><UserCheck className="h-4 w-4 mr-2" />Reativar</>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              applyFilters(e.target.value, turma, status);
            }}
          />
          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              onClick={() => { setSearch(""); applyFilters("", turma, status); }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select value={turma} onValueChange={(v) => { setTurma(v); applyFilters(search, v, status); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Turma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as turmas</SelectItem>
            {turmas.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => { setStatus(v); applyFilters(search, turma, v); }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativo">Ativos</SelectItem>
            <SelectItem value="inativo">Inativos</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <ExportButton
            title="Lista de Alunos"
            subtitle={`Exportado em ${format(new Date(), "dd/MM/yyyy")}`}
            columns={exportColumns}
            data={exportData}
            filename="alunos-controle-aee"
          />
        </div>
      </div>

      <DataTable columns={columns} data={alunos} emptyMessage="Nenhum aluno encontrado." />
    </div>
  );
}

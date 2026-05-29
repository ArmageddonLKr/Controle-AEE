"use client";

// useAlunos.ts — CRUD completo via Supabase
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Crianca, Sessao, Evolucao, Responsavel } from "@/types";

// ─── helpers de mapeamento Supabase → tipo local ──────────────────────────
function mapCrianca(row: Record<string, unknown>): Crianca {
  return {
    id: row.id as string,
    nome: row.nome as string,
    apelido: row.apelido as string | undefined,
    foto: row.foto as string | undefined,
    dataNascimento: row.data_nascimento as string,
    genero: row.genero as "M" | "F",
    status: row.status as "ativo" | "inativo" | "espera",
    escola: row.escola as string,
    turma: row.turma as string,
    serie: row.serie as string,
    turno: row.turno as "manhã" | "tarde" | "integral",
    professorRegente: row.professor_regente as string | undefined,
    diagnosticos: (row.diagnosticos as string[]) ?? [],
    cids: (row.cids as string[]) ?? [],
    dataInicioAcompanhamento: row.data_inicio_acompanhamento as string,
    responsaveis: [], // carregado separadamente
    observacoesImportantes: row.observacoes_importantes as string | undefined,
    medicamentos: (row.medicamentos as string[]) ?? [],
    alergias: (row.alergias as string[]) ?? [],
  };
}

function mapResponsavel(row: Record<string, unknown>): Responsavel {
  return {
    nome: row.nome as string,
    parentesco: row.parentesco as string,
    telefone: row.telefone as string,
    email: row.email as string | undefined,
    responsavelLegal: row.responsavel_legal as boolean,
  };
}

function mapSessao(row: Record<string, unknown>): Sessao {
  return {
    id: row.id as string,
    criancaId: row.crianca_id as string,
    data: row.data as string,
    hora: row.hora as string,
    duracao: row.duracao as number,
    tipo: row.tipo as Sessao["tipo"],
    presente: row.presente as boolean,
    motivoFalta: row.motivo_falta as string | undefined,
    anotacoes: row.anotacoes as string,
    evolucaoObservada: row.evolucao_observada as string | undefined,
  };
}

function mapEvolucao(row: Record<string, unknown>): Evolucao {
  return {
    id: row.id as string,
    criancaId: row.crianca_id as string,
    data: row.data as string,
    periodo: row.periodo as string,
    descricao: row.descricao as string,
    areas: (row.areas as string[]) ?? [],
    proximosPassos: row.proximos_passos as string | undefined,
  };
}

// ─── Hook principal ────────────────────────────────────────────────────────
export function useCriancas() {
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      // Busca crianças
      const { data: criancasData, error: errC } = await supabase
        .from("criancas")
        .select("*")
        .order("nome");
      if (errC) throw errC;

      // Busca responsáveis de todas as crianças de uma vez
      const { data: respData, error: errR } = await supabase
        .from("responsaveis")
        .select("*");
      if (errR) throw errR;

      const lista: Crianca[] = (criancasData ?? []).map((row) => {
        const c = mapCrianca(row as Record<string, unknown>);
        c.responsaveis = (respData ?? [])
          .filter((r) => r.crianca_id === c.id)
          .map((r) => mapResponsavel(r as Record<string, unknown>));
        return c;
      });

      setCriancas(lista);
    } catch (e) {
      setErro("Erro ao carregar dados. Verifique sua conexão.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // ─── Getters ────────────────────────────────────────────────────
  const ativas = criancas.filter((c) => c.status === "ativo");
  const emEspera = criancas.filter((c) => c.status === "espera");
  const inativas = criancas.filter((c) => c.status === "inativo");

  function getCrianca(id: string): Crianca | undefined {
    return criancas.find((c) => c.id === id);
  }

  // ─── CRUD Crianças ───────────────────────────────────────────────
  async function criarCrianca(
    dados: Omit<Crianca, "id"> & { responsaveis: Responsavel[] }
  ): Promise<{ id: string } | null> {
    const { responsaveis, ...resto } = dados;

    const payload = {
      nome: resto.nome,
      apelido: resto.apelido || null,
      data_nascimento: resto.dataNascimento,
      genero: resto.genero,
      status: resto.status,
      escola: resto.escola,
      turma: resto.turma,
      serie: resto.serie,
      turno: resto.turno,
      professor_regente: resto.professorRegente || null,
      diagnosticos: resto.diagnosticos,
      cids: resto.cids,
      data_inicio_acompanhamento: resto.dataInicioAcompanhamento,
      observacoes_importantes: resto.observacoesImportantes || null,
      medicamentos: resto.medicamentos ?? [],
      alergias: resto.alergias ?? [],
    };

    const { data, error } = await supabase
      .from("criancas")
      .insert(payload)
      .select("id")
      .single();

    if (error) { console.error(error); return null; }

    // Insere responsáveis
    if (responsaveis.length > 0) {
      const respPayload = responsaveis.map((r) => ({
        crianca_id: data.id,
        nome: r.nome,
        parentesco: r.parentesco,
        telefone: r.telefone,
        email: r.email || null,
        responsavel_legal: r.responsavelLegal,
      }));
      await supabase.from("responsaveis").insert(respPayload);
    }

    await carregar();
    return { id: data.id };
  }

  async function atualizarCrianca(
    id: string,
    dados: Partial<Crianca> & { responsaveis?: Responsavel[] }
  ): Promise<boolean> {
    const { responsaveis, ...resto } = dados;

    const payload: Record<string, unknown> = {};
    if (resto.nome !== undefined) payload.nome = resto.nome;
    if (resto.apelido !== undefined) payload.apelido = resto.apelido || null;
    if (resto.dataNascimento !== undefined) payload.data_nascimento = resto.dataNascimento;
    if (resto.genero !== undefined) payload.genero = resto.genero;
    if (resto.status !== undefined) payload.status = resto.status;
    if (resto.escola !== undefined) payload.escola = resto.escola;
    if (resto.turma !== undefined) payload.turma = resto.turma;
    if (resto.serie !== undefined) payload.serie = resto.serie;
    if (resto.turno !== undefined) payload.turno = resto.turno;
    if (resto.professorRegente !== undefined) payload.professor_regente = resto.professorRegente || null;
    if (resto.diagnosticos !== undefined) payload.diagnosticos = resto.diagnosticos;
    if (resto.cids !== undefined) payload.cids = resto.cids;
    if (resto.dataInicioAcompanhamento !== undefined) payload.data_inicio_acompanhamento = resto.dataInicioAcompanhamento;
    if (resto.observacoesImportantes !== undefined) payload.observacoes_importantes = resto.observacoesImportantes || null;
    if (resto.medicamentos !== undefined) payload.medicamentos = resto.medicamentos;
    if (resto.alergias !== undefined) payload.alergias = resto.alergias;
    payload.updated_at = new Date().toISOString();

    const { error } = await supabase.from("criancas").update(payload).eq("id", id);
    if (error) { console.error(error); return false; }

    // Atualiza responsáveis: apaga e recria
    if (responsaveis !== undefined) {
      await supabase.from("responsaveis").delete().eq("crianca_id", id);
      if (responsaveis.length > 0) {
        const respPayload = responsaveis.map((r) => ({
          crianca_id: id,
          nome: r.nome,
          parentesco: r.parentesco,
          telefone: r.telefone,
          email: r.email || null,
          responsavel_legal: r.responsavelLegal,
        }));
        await supabase.from("responsaveis").insert(respPayload);
      }
    }

    await carregar();
    return true;
  }

  async function deletarCrianca(id: string): Promise<boolean> {
    const { error } = await supabase.from("criancas").delete().eq("id", id);
    if (error) { console.error(error); return false; }
    await carregar();
    return true;
  }

  return {
    criancas,
    ativas,
    emEspera,
    inativas,
    loading,
    erro,
    carregar,
    getCrianca,
    criarCrianca,
    atualizarCrianca,
    deletarCrianca,
  };
}

// ─── Hook de sessões de uma criança ───────────────────────────────────────
export function useSessoes(criancaId: string) {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    if (!criancaId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("sessoes")
      .select("*")
      .eq("crianca_id", criancaId)
      .order("data", { ascending: false });
    if (!error) setSessoes((data ?? []).map((r) => mapSessao(r as Record<string, unknown>)));
    setLoading(false);
  }, [criancaId]);

  useEffect(() => { carregar(); }, [carregar]);

  async function criarSessao(dados: Omit<Sessao, "id" | "criancaId">): Promise<boolean> {
    const { error } = await supabase.from("sessoes").insert({
      crianca_id: criancaId,
      data: dados.data,
      hora: dados.hora,
      duracao: dados.duracao,
      tipo: dados.tipo,
      presente: dados.presente,
      motivo_falta: dados.motivoFalta || null,
      anotacoes: dados.anotacoes ?? "",
      evolucao_observada: dados.evolucaoObservada || null,
    });
    if (error) { console.error(error); return false; }
    await carregar();
    return true;
  }

  const taxaPresenca = sessoes.length === 0
    ? 0
    : Math.round((sessoes.filter((s) => s.presente).length / sessoes.length) * 100);

  return { sessoes, loading, carregar, criarSessao, taxaPresenca };
}

// ─── Hook de evoluções de uma criança ────────────────────────────────────
export function useEvolucoes(criancaId: string) {
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    if (!criancaId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("evolucoes")
      .select("*")
      .eq("crianca_id", criancaId)
      .order("data", { ascending: false });
    if (!error) setEvolucoes((data ?? []).map((r) => mapEvolucao(r as Record<string, unknown>)));
    setLoading(false);
  }, [criancaId]);

  useEffect(() => { carregar(); }, [carregar]);

  async function criarEvolucao(dados: Omit<Evolucao, "id" | "criancaId">): Promise<boolean> {
    const { error } = await supabase.from("evolucoes").insert({
      crianca_id: criancaId,
      data: dados.data,
      periodo: dados.periodo,
      descricao: dados.descricao,
      areas: dados.areas,
      proximos_passos: dados.proximosPassos || null,
    });
    if (error) { console.error(error); return false; }
    await carregar();
    return true;
  }

  return { evolucoes, loading, carregar, criarEvolucao };
}

// ─── Hook do dashboard (sessões recentes + stats globais) ─────────────────
export function useDashboard() {
  const [sessoesRecentes, setSessoesRecentes] = useState<Sessao[]>([]);
  const [sessoesMes, setSessoesMes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)
        .toISOString()
        .split("T")[0];

      const [{ data: recentes }, { data: mes }] = await Promise.all([
        supabase.from("sessoes").select("*").order("data", { ascending: false }).limit(6),
        supabase.from("sessoes").select("*").gte("data", inicioMes),
      ]);

      setSessoesRecentes((recentes ?? []).map((r) => mapSessao(r as Record<string, unknown>)));
      setSessoesMes((mes ?? []).map((r) => mapSessao(r as Record<string, unknown>)));
      setLoading(false);
    }
    carregar();
  }, []);

  return { sessoesRecentes, sessoesMes, loading };
}

// ─── Todas as sessões (relatórios) ───────────────────────────────────────
export function useTodasSessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    const { data, error } = await supabase
      .from("sessoes")
      .select("*")
      .order("data", { ascending: false });
    if (error) {
      console.error(error);
      setErro("Erro ao carregar sessões.");
      setSessoes([]);
    } else {
      setSessoes((data ?? []).map((r) => mapSessao(r as Record<string, unknown>)));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { sessoes, loading, erro, carregar };
}

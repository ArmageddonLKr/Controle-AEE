"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Plus, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { AlunoCard } from "@/components/shared/AlunoCard";
import { useCriancas } from "@/hooks/useAlunos";
import type { Crianca, Responsavel } from "@/types";

// ─── tipos do formulário ──────────────────────────────────────────────────
interface ResponsavelForm {
  nome: string;
  parentesco: string;
  telefone: string;
  email: string;
  responsavelLegal: boolean;
}

interface FormData {
  // Dados pessoais
  nome: string;
  apelido: string;
  dataNascimento: string;
  genero: "M" | "F" | "";
  status: "ativo" | "espera" | "inativo";
  // Escola
  escola: string;
  turma: string;
  serie: string;
  turno: "manhã" | "tarde" | "integral" | "";
  professorRegente: string;
  dataInicioAcompanhamento: string;
  // Clínico
  diagnosticos: string;   // texto livre, separado por vírgula
  cids: string;           // texto livre, separado por vírgula
  medicamentos: string;
  alergias: string;
  observacoesImportantes: string;
  // Responsáveis
  responsaveis: ResponsavelForm[];
}

const FORM_VAZIO: FormData = {
  nome: "", apelido: "", dataNascimento: "", genero: "", status: "ativo",
  escola: "", turma: "", serie: "", turno: "", professorRegente: "",
  dataInicioAcompanhamento: new Date().toISOString().split("T")[0],
  diagnosticos: "", cids: "", medicamentos: "", alergias: "",
  observacoesImportantes: "",
  responsaveis: [{ nome: "", parentesco: "", telefone: "", email: "", responsavelLegal: true }],
};

const STATUS_OPTS = [
  { valor: "todos", label: "Todos" },
  { valor: "ativo", label: "Ativos" },
  { valor: "espera", label: "Em espera" },
  { valor: "inativo", label: "Inativos" },
];

// ─── helpers de estilo ────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.875rem",
  outline: "none", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)",
  color: "var(--text-primary)",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "0.3rem",
};

function CampoTexto({
  label, value, onChange, placeholder, required, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && " *"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

function CampoSelect({
  label, value, onChange, opcoes, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  opcoes: { valor: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && " *"}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required} style={inputStyle}>
        <option value="">Selecione...</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{
        fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.06em", color: "var(--accent-primary)",
        paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)", marginBottom: "0.875rem",
      }}>
        {titulo}
      </h3>
      {children}
    </div>
  );
}

// ─── Modal de cadastro ────────────────────────────────────────────────────
function ModalNovaCrianca({
  onClose,
  onSalvar,
}: {
  onClose: () => void;
  onSalvar: (dados: Omit<Crianca, "id"> & { responsaveis: Responsavel[] }) => Promise<void>;
}) {
  const [form, setForm] = useState<FormData>(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  function set(campo: keyof FormData, valor: unknown) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => { const n = { ...prev }; delete n[campo]; return n; });
  }

  function setResp(idx: number, campo: keyof ResponsavelForm, valor: unknown) {
    setForm((prev) => {
      const novos = [...prev.responsaveis];
      novos[idx] = { ...novos[idx], [campo]: valor };
      return { ...prev, responsaveis: novos };
    });
  }

  function addResponsavel() {
    setForm((prev) => ({
      ...prev,
      responsaveis: [...prev.responsaveis, { nome: "", parentesco: "", telefone: "", email: "", responsavelLegal: false }],
    }));
  }

  function removeResponsavel(idx: number) {
    setForm((prev) => ({ ...prev, responsaveis: prev.responsaveis.filter((_, i) => i !== idx) }));
  }

  function validar(): boolean {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Nome é obrigatório";
    if (!form.dataNascimento) e.dataNascimento = "Data de nascimento é obrigatória";
    if (!form.genero) e.genero = "Gênero é obrigatório";
    if (!form.escola.trim()) e.escola = "Escola é obrigatória";
    if (!form.turma.trim()) e.turma = "Turma é obrigatória";
    if (!form.serie.trim()) e.serie = "Série é obrigatória";
    if (!form.turno) e.turno = "Turno é obrigatório";
    if (!form.dataInicioAcompanhamento) e.dataInicioAcompanhamento = "Data de início é obrigatória";
    if (form.diagnosticos.trim() === "") e.diagnosticos = "Informe pelo menos um diagnóstico";
    form.responsaveis.forEach((r, i) => {
      if (!r.nome.trim()) e[`resp_${i}_nome`] = "Nome do responsável obrigatório";
      if (!r.telefone.trim()) e[`resp_${i}_telefone`] = "Telefone obrigatório";
      if (!r.parentesco.trim()) e[`resp_${i}_parentesco`] = "Parentesco obrigatório";
    });
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSalvar() {
    if (!validar()) return;
    setSalvando(true);
    try {
      const dados: Omit<Crianca, "id"> & { responsaveis: Responsavel[] } = {
        nome: form.nome.trim(),
        apelido: form.apelido.trim() || undefined,
        dataNascimento: form.dataNascimento,
        genero: form.genero as "M" | "F",
        status: form.status,
        escola: form.escola.trim(),
        turma: form.turma.trim(),
        serie: form.serie.trim(),
        turno: form.turno as "manhã" | "tarde" | "integral",
        professorRegente: form.professorRegente.trim() || undefined,
        dataInicioAcompanhamento: form.dataInicioAcompanhamento,
        diagnosticos: form.diagnosticos.split(",").map((d) => d.trim()).filter(Boolean),
        cids: form.cids.split(",").map((c) => c.trim()).filter(Boolean),
        medicamentos: form.medicamentos.split(",").map((m) => m.trim()).filter(Boolean),
        alergias: form.alergias.split(",").map((a) => a.trim()).filter(Boolean),
        observacoesImportantes: form.observacoesImportantes.trim() || undefined,
        responsaveis: form.responsaveis.map((r) => ({
          nome: r.nome.trim(),
          parentesco: r.parentesco.trim(),
          telefone: r.telefone.trim(),
          email: r.email.trim() || undefined,
          responsavelLegal: r.responsavelLegal,
        })),
      };
      await onSalvar(dados);
      onClose();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl flex flex-col"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}
      >
        {/* Header do modal */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Nova Criança</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Preencha os dados para cadastrar</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo do formulário */}
        <div className="px-6 py-5 flex flex-col gap-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>

          {/* Dados pessoais */}
          <Secao titulo="Dados Pessoais">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <CampoTexto label="Nome completo" value={form.nome} onChange={(v) => set("nome", v)} required placeholder="Nome da criança" />
                {erros.nome && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.nome}</p>}
              </div>
              <CampoTexto label="Apelido (opcional)" value={form.apelido} onChange={(v) => set("apelido", v)} placeholder="Como é chamada" />
              <div>
                <CampoTexto label="Data de nascimento" type="date" value={form.dataNascimento} onChange={(v) => set("dataNascimento", v)} required />
                {erros.dataNascimento && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.dataNascimento}</p>}
              </div>
              <div>
                <CampoSelect
                  label="Gênero" value={form.genero} onChange={(v) => set("genero", v)} required
                  opcoes={[{ valor: "M", label: "Masculino" }, { valor: "F", label: "Feminino" }]}
                />
                {erros.genero && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.genero}</p>}
              </div>
              <CampoSelect
                label="Status" value={form.status} onChange={(v) => set("status", v)}
                opcoes={[{ valor: "ativo", label: "Ativo" }, { valor: "espera", label: "Em espera" }, { valor: "inativo", label: "Inativo" }]}
              />
            </div>
          </Secao>

          {/* Escola */}
          <Secao titulo="Escola e Acompanhamento">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <CampoTexto label="Nome da escola" value={form.escola} onChange={(v) => set("escola", v)} required placeholder="Ex: EMEF João Paulo II" />
                {erros.escola && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.escola}</p>}
              </div>
              <div>
                <CampoTexto label="Turma" value={form.turma} onChange={(v) => set("turma", v)} required placeholder="Ex: 3A" />
                {erros.turma && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.turma}</p>}
              </div>
              <div>
                <CampoTexto label="Série / Ano" value={form.serie} onChange={(v) => set("serie", v)} required placeholder="Ex: 3º ano" />
                {erros.serie && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.serie}</p>}
              </div>
              <div>
                <CampoSelect
                  label="Turno" value={form.turno} onChange={(v) => set("turno", v)} required
                  opcoes={[{ valor: "manhã", label: "Manhã" }, { valor: "tarde", label: "Tarde" }, { valor: "integral", label: "Integral" }]}
                />
                {erros.turno && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.turno}</p>}
              </div>
              <CampoTexto label="Professor(a) regente" value={form.professorRegente} onChange={(v) => set("professorRegente", v)} placeholder="Nome do professor" />
              <div>
                <CampoTexto label="Início do acompanhamento" type="date" value={form.dataInicioAcompanhamento} onChange={(v) => set("dataInicioAcompanhamento", v)} required />
                {erros.dataInicioAcompanhamento && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.dataInicioAcompanhamento}</p>}
              </div>
            </div>
          </Secao>

          {/* Dados clínicos */}
          <Secao titulo="Dados Clínicos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <CampoTexto
                  label="Diagnósticos (separados por vírgula)"
                  value={form.diagnosticos}
                  onChange={(v) => set("diagnosticos", v)}
                  required
                  placeholder="Ex: TEA, TDAH"
                />
                {erros.diagnosticos && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros.diagnosticos}</p>}
              </div>
              <CampoTexto label="CIDs (separados por vírgula)" value={form.cids} onChange={(v) => set("cids", v)} placeholder="Ex: F84.0, F90.0" />
              <CampoTexto label="Medicamentos (separados por vírgula)" value={form.medicamentos} onChange={(v) => set("medicamentos", v)} placeholder="Ex: Ritalina 10mg" />
              <div className="sm:col-span-2">
                <CampoTexto label="Alergias (separadas por vírgula)" value={form.alergias} onChange={(v) => set("alergias", v)} placeholder="Ex: Dipirona, Amendoim" />
              </div>
              <div className="sm:col-span-2">
                <label style={labelStyle}>Observações importantes</label>
                <textarea
                  value={form.observacoesImportantes}
                  onChange={(e) => set("observacoesImportantes", e.target.value)}
                  placeholder="Informações relevantes para o atendimento..."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </div>
          </Secao>

          {/* Responsáveis */}
          <Secao titulo="Responsáveis">
            <div className="flex flex-col gap-4">
              {form.responsaveis.map((r, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 flex flex-col gap-3"
                  style={{ border: "1px solid var(--border)", background: "var(--bg-primary)" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold" style={{ color: "var(--accent-primary)" }}>
                      Responsável {idx + 1}
                    </p>
                    {form.responsaveis.length > 1 && (
                      <button
                        onClick={() => removeResponsavel(idx)}
                        className="text-xs px-2 py-1 rounded"
                        style={{ color: "var(--danger)", background: "rgba(224,85,85,0.08)" }}
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <CampoTexto label="Nome" value={r.nome} onChange={(v) => setResp(idx, "nome", v)} required placeholder="Nome completo" />
                      {erros[`resp_${idx}_nome`] && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros[`resp_${idx}_nome`]}</p>}
                    </div>
                    <div>
                      <CampoTexto label="Parentesco" value={r.parentesco} onChange={(v) => setResp(idx, "parentesco", v)} required placeholder="Ex: Mãe, Pai, Avó" />
                      {erros[`resp_${idx}_parentesco`] && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros[`resp_${idx}_parentesco`]}</p>}
                    </div>
                    <div>
                      <CampoTexto label="Telefone" type="tel" value={r.telefone} onChange={(v) => setResp(idx, "telefone", v)} required placeholder="(86) 99999-9999" />
                      {erros[`resp_${idx}_telefone`] && <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>{erros[`resp_${idx}_telefone`]}</p>}
                    </div>
                    <CampoTexto label="E-mail (opcional)" type="email" value={r.email} onChange={(v) => setResp(idx, "email", v)} placeholder="email@exemplo.com" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.responsavelLegal}
                      onChange={(e) => setResp(idx, "responsavelLegal", e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                      Responsável legal
                    </span>
                  </label>
                </div>
              ))}
              <button
                onClick={addResponsavel}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ border: "1px dashed var(--border)", color: "var(--accent-primary)", background: "transparent" }}
              >
                <Plus size={15} />
                Adicionar responsável
              </button>
            </div>
          </Secao>
        </div>

        {/* Footer do modal */}
        <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)", background: "transparent" }}
            disabled={salvando}
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={salvando}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: salvando ? "var(--accent-secondary)" : "var(--accent-primary)",
              color: "#fff",
              opacity: salvando ? 0.8 : 1,
            }}
          >
            {salvando ? <><Loader2 size={15} className="animate-spin" /> Salvando...</> : "Cadastrar criança"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────
export default function AlunosPage() {
  const { criancas, loading, erro, criarCrianca } = useCriancas();
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [escolaFiltro, setEscolaFiltro] = useState("");
  const [diagnosticoFiltro, setDiagnosticoFiltro] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);

  const escolas = useMemo(() => [...new Set(criancas.map((c) => c.escola))].sort(), [criancas]);
  const diagnosticos = useMemo(() => [...new Set(criancas.flatMap((c) => c.diagnosticos))].sort(), [criancas]);

  const criancasFiltradas = useMemo(() => {
    return criancas.filter((c) => {
      const matchBusca = !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) || (c.apelido?.toLowerCase().includes(busca.toLowerCase()) ?? false);
      const matchStatus = statusFiltro === "todos" || c.status === statusFiltro;
      const matchEscola = !escolaFiltro || c.escola === escolaFiltro;
      const matchDiag = !diagnosticoFiltro || c.diagnosticos.includes(diagnosticoFiltro);
      return matchBusca && matchStatus && matchEscola && matchDiag;
    });
  }, [criancas, busca, statusFiltro, escolaFiltro, diagnosticoFiltro]);

  async function handleSalvar(dados: Omit<Crianca, "id"> & { responsaveis: Responsavel[] }) {
    setErroSalvar(null);
    const resultado = await criarCrianca(dados);
    if (!resultado) {
      setErroSalvar("Erro ao salvar. Tente novamente.");
      throw new Error("Falha ao salvar");
    }
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header da página */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Crianças</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {loading ? "Carregando..." : `${criancasFiltradas.length} de ${criancas.length} criança(s)`}
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--accent-primary)", color: "white" }}
        >
          <Plus className="h-4 w-4" />
          Nova Criança
        </button>
      </div>

      {erroSalvar && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{ background: "rgba(224,85,85,0.1)", color: "var(--danger)", border: "1px solid rgba(224,85,85,0.3)" }}>
          {erroSalvar}
        </div>
      )}

      {erro && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(224,85,85,0.1)", color: "var(--danger)" }}>
          {erro}
        </div>
      )}

      {/* Barra de busca e filtros */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar por nome ou apelido..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            />
          </div>
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: mostrarFiltros ? "var(--accent-light)" : "var(--bg-card)",
              border: "1px solid var(--border)",
              color: mostrarFiltros ? "var(--accent-primary)" : "var(--text-secondary)",
            }}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {mostrarFiltros ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Chips de status */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map((opt) => (
            <button
              key={opt.valor}
              onClick={() => setStatusFiltro(opt.valor)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                statusFiltro === opt.valor
                  ? { backgroundColor: "var(--accent-primary)", color: "white" }
                  : { backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Filtros extras */}
        {mostrarFiltros && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div>
              <label style={labelStyle}>Escola</label>
              <select
                value={escolaFiltro}
                onChange={(e) => setEscolaFiltro(e.target.value)}
                style={{ ...inputStyle }}
              >
                <option value="">Todas as escolas</option>
                {escolas.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Diagnóstico</label>
              <select
                value={diagnosticoFiltro}
                onChange={(e) => setDiagnosticoFiltro(e.target.value)}
                style={{ ...inputStyle }}
              >
                <option value="">Todos os diagnósticos</option>
                {diagnosticos.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[0,1,2,3].map((i) => (
            <div key={i} className="card-aee h-36 animate-pulse" style={{ background: "var(--bg-card)" }} />
          ))}
        </div>
      ) : criancas.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: "var(--bg-card)", border: "2px dashed var(--border)" }}
        >
          <p className="text-4xl mb-3">👶</p>
          <p className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Nenhuma criança cadastrada ainda
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Clique em <strong>Nova Criança</strong> para fazer o primeiro cadastro.
          </p>
          <button
            onClick={() => setModalAberto(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--accent-primary)", color: "#fff" }}
          >
            <Plus size={15} />
            Cadastrar primeira criança
          </button>
        </div>
      ) : criancasFiltradas.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
            Nenhuma criança encontrada
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tente ajustar os filtros de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {criancasFiltradas.map((crianca, idx) => (
            <AlunoCard key={crianca.id} crianca={crianca} style={{ animationDelay: `${idx * 50}ms` }} />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <ModalNovaCrianca
          onClose={() => setModalAberto(false)}
          onSalvar={handleSalvar}
        />
      )}
    </div>
  );
}

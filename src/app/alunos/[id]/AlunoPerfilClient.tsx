"use client";

import { useState } from "react";
import { format, differenceInYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, Calendar, School, Clock, User,
  FileText, Download, CheckCircle, XCircle, Loader2,
} from "lucide-react";
import { useCriancas, useSessoes, useEvolucoes } from "@/hooks/useAlunos";
import { exportarFichaCriancaPDF } from "@/lib/utils/export-pdf";
import { exportarFichaCriancaDocx } from "@/lib/utils/export-docx";

// ─── Avatar ───────────────────────────────────────────────────────────────
const CORES_AVATAR = [
  { bg: "#E0F4F8", text: "#1E3A5F" }, { bg: "#D1F0E8", text: "#1A5F3F" },
  { bg: "#FAE5D3", text: "#7D3B0A" }, { bg: "#E8E0F8", text: "#3B1A7D" },
  { bg: "#FCE4EC", text: "#7D1A2F" }, { bg: "#E0EBF8", text: "#1A3D7D" },
  { bg: "#FFF3CD", text: "#7D5A00" }, { bg: "#D4EDDA", text: "#1A5F30" },
];
function corAvatar(nome: string) {
  const soma = nome.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CORES_AVATAR[soma % CORES_AVATAR.length];
}
function iniciais(nome: string) {
  const p = nome.trim().split(" ");
  if (p.length === 1) return p[0][0].toUpperCase();
  return (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

// ─── Config ───────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ativo: { label: "Ativo", bg: "var(--success)", color: "#fff" },
  espera: { label: "Em espera", bg: "var(--warning)", color: "#fff" },
  inativo: { label: "Inativo", bg: "var(--text-muted)", color: "#fff" },
} as const;

const TIPO_SESSAO: Record<string, { label: string; bg: string; color: string }> = {
  individual: { label: "Individual", bg: "var(--accent-light)", color: "var(--accent-primary)" },
  grupo: { label: "Grupo", bg: "#D1F0E8", color: "#1A5F3F" },
  familiar: { label: "Familiar", bg: "#FAE5D3", color: "#7D3B0A" },
  orientacao: { label: "Orientação", bg: "#E8E0F8", color: "#3B1A7D" },
};

// ─── Subcomponentes ───────────────────────────────────────────────────────
function SecaoInfo({ titulo, icone, children }: { titulo: string; icone: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card-aee" style={{ padding: "1rem 1.125rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingBottom: "0.625rem", borderBottom: "1px solid var(--border)" }}>
        <span style={{ color: "var(--accent-primary)" }}>{icone}</span>
        <h2 style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>{titulo}</h2>
      </div>
      {children}
    </div>
  );
}

function ItemInfo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.2rem" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{valor}</p>
    </div>
  );
}

function GradeInfo({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>{children}</div>;
}

// ─── Componente principal ─────────────────────────────────────────────────
export function AlunoPerfilClient({ id }: { id: string }) {
  const { getCrianca, loading: loadingC } = useCriancas();
  const { sessoes, loading: loadingS, taxaPresenca } = useSessoes(id);
  const { evolucoes, loading: loadingE } = useEvolucoes(id);

  const crianca = getCrianca(id);

  const [abaAtiva, setAbaAtiva] = useState<"sessoes" | "evolucao" | "informacoes" | "exportar">("sessoes");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);

  // Loading
  if (loadingC) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "0.75rem", color: "var(--text-muted)" }}>
        <Loader2 size={24} className="animate-spin" />
        <span>Carregando...</span>
      </div>
    );
  }

  // Não encontrada
  if (!crianca) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
        <XCircle size={48} style={{ color: "var(--danger)" }} />
        <p style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text-primary)" }}>Criança não encontrada</p>
        <Link href="/alunos" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: "var(--accent-primary)", color: "#fff", fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}>
          <ArrowLeft size={16} /> Voltar para Crianças
        </Link>
      </div>
    );
  }

  const cor = corAvatar(crianca.nome);
  const statusCfg = STATUS_CONFIG[crianca.status];
  const idade = differenceInYears(new Date(), new Date(crianca.dataNascimento));
  const dataNascFormatada = format(new Date(crianca.dataNascimento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dataInicioFormatada = format(new Date(crianca.dataInicioAcompanhamento), "dd/MM/yyyy", { locale: ptBR });

  function handleExportPdf() {
    setLoadingPdf(true);
    try { exportarFichaCriancaPDF(crianca!, sessoes, evolucoes); } finally { setLoadingPdf(false); }
  }
  async function handleExportDocx() {
    setLoadingDocx(true);
    try { await exportarFichaCriancaDocx(crianca!, sessoes, evolucoes); } finally { setLoadingDocx(false); }
  }

  return (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", minHeight: "100%", padding: "1.5rem" }}>
      {/* SIDEBAR DO PERFIL */}
      <aside style={{ width: "240px", minWidth: "240px", display: "flex", flexDirection: "column", background: "var(--bg-card)", borderRadius: "0.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid var(--border)", overflow: "hidden" }}>
        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <Link href="/alunos" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--accent-primary)", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Voltar
          </Link>
        </div>

        {/* Avatar + nome */}
        <div style={{ padding: "1.25rem 1rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.625rem", textAlign: "center", borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: cor.bg, color: cor.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.375rem", fontWeight: 700 }}>
            {iniciais(crianca.nome)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>{crianca.nome}</span>
            {crianca.apelido && <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>"{crianca.apelido}"</span>}
            <span style={{ display: "inline-block", padding: "0.15rem 0.6rem", borderRadius: 9999, fontSize: "0.7rem", fontWeight: 700, background: statusCfg.bg, color: statusCfg.color, marginTop: "0.125rem" }}>{statusCfg.label}</span>
          </div>
        </div>

        {/* Infos básicas */}
        <div style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.625rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <Calendar size={13} style={{ color: "var(--text-muted)", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>{idade} anos</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{dataNascFormatada}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <School size={13} style={{ color: "var(--text-muted)", marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>{crianca.escola}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{crianca.turma} · {crianca.serie} · {crianca.turno}</div>
            </div>
          </div>
        </div>

        {/* Diagnósticos */}
        <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Diagnósticos</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            {crianca.diagnosticos.map((d) => (
              <span key={d} style={{ padding: "0.2rem 0.5rem", borderRadius: 9999, fontSize: "0.68rem", fontWeight: 600, background: "var(--accent-light)", color: "var(--accent-primary)" }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Responsáveis */}
        {crianca.responsaveis.length > 0 && (
          <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.625rem" }}>Responsáveis</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {crianca.responsaveis.map((r, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.2rem" }}>
                    <User size={11} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>{r.nome}</span>
                  </div>
                  <div style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                      {r.parentesco}
                      {r.responsavelLegal && <span style={{ marginLeft: "0.35rem", padding: "0.05rem 0.35rem", borderRadius: 9999, background: "var(--accent-light)", color: "var(--accent-primary)", fontSize: "0.6rem", fontWeight: 700 }}>legal</span>}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "var(--text-secondary)" }}><Phone size={10} />{r.telefone}</span>
                    {r.email && <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.68rem", color: "var(--text-muted)", wordBreak: "break-all" }}><Mail size={10} />{r.email}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Início */}
        <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Clock size={12} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Início do acompanhamento</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>{dataInicioFormatada}</div>
          </div>
        </div>

        {/* Observações */}
        {crianca.observacoesImportantes && (
          <div style={{ margin: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", background: "#FFF8E1", border: "1px solid #F0A500" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#7D5A00", marginBottom: "0.3rem" }}>⚠️ Obs. importantes</p>
            <p style={{ fontSize: "0.68rem", color: "#5A4000", lineHeight: 1.5, margin: 0 }}>{crianca.observacoesImportantes}</p>
          </div>
        )}

        {/* Medicamentos */}
        {crianca.medicamentos && crianca.medicamentos.length > 0 && (
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>💊 Medicamentos</p>
            <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {crianca.medicamentos.map((m) => <li key={m} style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{m}</li>)}
            </ul>
          </div>
        )}

        {/* Mini stats */}
        <div style={{ padding: "0.875rem 1rem", borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.25rem", textAlign: "center", marginTop: "auto" }}>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-primary)" }}>{loadingS ? "..." : sessoes.length}</div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", lineHeight: 1.3 }}>Sessões</div>
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--success)" }}>{loadingS ? "..." : `${taxaPresenca}%`}</div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", lineHeight: 1.3 }}>Presença</div>
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-secondary)" }}>{loadingE ? "..." : evolucoes.length}</div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", lineHeight: 1.3 }}>Evoluções</div>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{crianca.nome}</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>{idade} anos · {crianca.escola} · {crianca.serie}</p>
        </div>

        {/* Abas */}
        <div style={{ display: "flex", gap: "0.25rem", borderBottom: "2px solid var(--border)" }}>
          {([
            { key: "sessoes", label: "📓 Sessões", count: loadingS ? null : sessoes.length },
            { key: "evolucao", label: "📈 Evolução", count: loadingE ? null : evolucoes.length },
            { key: "informacoes", label: "📋 Informações", count: null },
            { key: "exportar", label: "📤 Exportar", count: null },
          ] as const).map((aba) => {
            const ativa = abaAtiva === aba.key;
            return (
              <button
                key={aba.key}
                onClick={() => setAbaAtiva(aba.key)}
                style={{
                  padding: "0.625rem 1rem", borderRadius: "0.5rem 0.5rem 0 0", border: "none",
                  borderBottom: ativa ? "2px solid var(--accent-primary)" : "2px solid transparent",
                  background: ativa ? "var(--accent-light)" : "transparent",
                  color: ativa ? "var(--accent-primary)" : "var(--text-muted)",
                  fontWeight: ativa ? 700 : 500, fontSize: "0.8rem", cursor: "pointer",
                  transition: "all 200ms ease", display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: -2,
                }}
              >
                {aba.label}
                {aba.count !== null && (
                  <span style={{ padding: "0.1rem 0.4rem", borderRadius: 9999, fontSize: "0.65rem", fontWeight: 700, background: ativa ? "var(--accent-primary)" : "var(--border)", color: ativa ? "#fff" : "var(--text-muted)" }}>
                    {aba.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Aba Sessões */}
        {abaAtiva === "sessoes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>Histórico cronológico de sessões</p>
              <button
                disabled
                title="Em desenvolvimento"
                style={{ padding: "0.4rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, cursor: "not-allowed", opacity: 0.5 }}
              >
                + Nova Sessão
              </button>
            </div>
            {loadingS ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
              </div>
            ) : sessoes.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", border: "2px dashed var(--border)", borderRadius: "0.75rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                Nenhuma sessão registrada ainda.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {sessoes.map((s) => {
                  const tipoCfg = TIPO_SESSAO[s.tipo] ?? TIPO_SESSAO.individual;
                  return (
                    <div key={s.id} className="card-aee" style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem", borderLeft: s.presente ? "3px solid var(--success)" : "3px solid var(--danger)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>{format(new Date(s.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{format(new Date(s.data), "EEEE", { locale: ptBR })}</span>
                        <span style={{ padding: "0.15rem 0.5rem", borderRadius: 9999, fontSize: "0.68rem", fontWeight: 700, background: tipoCfg.bg, color: tipoCfg.color }}>{tipoCfg.label}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "var(--text-muted)" }}><Clock size={11} />{s.duracao} min</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", fontWeight: 600, color: s.presente ? "var(--success)" : "var(--danger)", marginLeft: "auto" }}>
                          {s.presente ? <><CheckCircle size={13} /> Presente</> : <><XCircle size={13} /> Falta</>}
                        </span>
                      </div>
                      {!s.presente && s.motivoFalta && <div style={{ padding: "0.35rem 0.625rem", borderRadius: "0.375rem", background: "#FFF8E1", border: "1px solid #F0A500", fontSize: "0.72rem", color: "#7D5A00" }}>Motivo: {s.motivoFalta}</div>}
                      {s.anotacoes && <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>{s.anotacoes}</p>}
                      {s.evolucaoObservada && <p style={{ fontSize: "0.72rem", color: "var(--accent-primary)", fontStyle: "italic", margin: 0 }}>✦ {s.evolucaoObservada}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Aba Evolução */}
        {abaAtiva === "evolucao" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>Registros de progresso e evolução terapêutica</p>
            {loadingE ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
              </div>
            ) : evolucoes.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center", border: "2px dashed var(--border)", borderRadius: "0.75rem", color: "var(--text-muted)" }}>
                Nenhum registro de evolução ainda.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {evolucoes.map((e) => (
                  <div key={e.id} className="card-aee" style={{ padding: "1rem 1.125rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--accent-primary)" }}>{e.periodo}</h3>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{format(new Date(e.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                      {e.areas.map((area) => <span key={area} style={{ padding: "0.2rem 0.55rem", borderRadius: 9999, fontSize: "0.68rem", fontWeight: 600, background: "var(--accent-light)", color: "var(--accent-primary)" }}>{area}</span>)}
                    </div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{e.descricao}</p>
                    {e.proximosPassos && (
                      <div style={{ padding: "0.5rem 0.75rem", borderRadius: "0.375rem", background: "var(--accent-light)", borderLeft: "3px solid var(--accent-primary)" }}>
                        <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-primary)", marginBottom: "0.2rem" }}>Próximos passos</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{e.proximosPassos}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Aba Informações */}
        {abaAtiva === "informacoes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <SecaoInfo titulo="Dados Pessoais" icone={<User size={14} />}>
              <GradeInfo>
                <ItemInfo label="Gênero" valor={crianca.genero === "M" ? "Masculino" : "Feminino"} />
                <ItemInfo label="Data de nascimento" valor={dataNascFormatada} />
                <ItemInfo label="Idade" valor={`${idade} anos`} />
                <ItemInfo label="Turno" valor={crianca.turno} />
                {crianca.professorRegente && <ItemInfo label="Professor(a) regente" valor={crianca.professorRegente} />}
              </GradeInfo>
            </SecaoInfo>
            <SecaoInfo titulo="Família e Responsáveis" icone={<User size={14} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {crianca.responsaveis.map((r, i) => (
                  <div key={i} style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{r.nome}</span>
                      <span style={{ padding: "0.1rem 0.4rem", borderRadius: 9999, fontSize: "0.65rem", fontWeight: 600, background: "var(--accent-light)", color: "var(--accent-primary)" }}>{r.parentesco}</span>
                      {r.responsavelLegal && <span style={{ padding: "0.1rem 0.4rem", borderRadius: 9999, fontSize: "0.6rem", fontWeight: 700, background: "var(--success)", color: "#fff" }}>responsável legal</span>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}><Phone size={12} style={{ color: "var(--text-muted)" }} />{r.telefone}</span>
                      {r.email && <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.78rem", color: "var(--text-secondary)" }}><Mail size={12} style={{ color: "var(--text-muted)" }} />{r.email}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </SecaoInfo>
            <SecaoInfo titulo="Dados Clínicos" icone={<FileText size={14} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>Diagnósticos</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {crianca.diagnosticos.map((d) => <span key={d} style={{ padding: "0.25rem 0.625rem", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 600, background: "var(--accent-light)", color: "var(--accent-primary)" }}>{d}</span>)}
                  </div>
                </div>
                {crianca.cids.length > 0 && (
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>CIDs</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {crianca.cids.map((cid) => <span key={cid} style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: 600, background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>{cid}</span>)}
                    </div>
                  </div>
                )}
                {crianca.medicamentos && crianca.medicamentos.length > 0 && (
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>Medicamentos</p>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                      {crianca.medicamentos.map((m) => <li key={m} style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{m}</li>)}
                    </ul>
                  </div>
                )}
                {crianca.alergias && crianca.alergias.length > 0 && (
                  <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>Alergias</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                      {crianca.alergias.map((a) => <span key={a} style={{ padding: "0.25rem 0.625rem", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 600, background: "#FCE4EC", color: "#C62828" }}>{a}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </SecaoInfo>
            <SecaoInfo titulo="Histórico e Escola" icone={<School size={14} />}>
              <GradeInfo>
                <ItemInfo label="Escola" valor={crianca.escola} />
                <ItemInfo label="Turma" valor={crianca.turma} />
                <ItemInfo label="Série" valor={crianca.serie} />
                <ItemInfo label="Turno" valor={crianca.turno} />
                <ItemInfo label="Início do AEE" valor={dataInicioFormatada} />
                {crianca.professorRegente && <ItemInfo label="Professor regente" valor={crianca.professorRegente} />}
              </GradeInfo>
            </SecaoInfo>
          </div>
        )}

        {/* Aba Exportar */}
        {abaAtiva === "exportar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
              Gere e baixe a ficha completa de {crianca.nome} no formato desejado.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <button
                onClick={handleExportPdf}
                disabled={loadingPdf}
                style={{ padding: "1.5rem", borderRadius: "0.75rem", border: "2px solid var(--border)", background: "var(--bg-card)", cursor: loadingPdf ? "wait" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", transition: "all 200ms ease", opacity: loadingPdf ? 0.7 : 1 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: "0.75rem", background: "#FFEBEE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Download size={24} style={{ color: "#C62828" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{loadingPdf ? "Gerando PDF..." : "Exportar PDF"}</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>Ficha completa + histórico</p>
                </div>
              </button>
              <button
                onClick={handleExportDocx}
                disabled={loadingDocx}
                style={{ padding: "1.5rem", borderRadius: "0.75rem", border: "2px solid var(--border)", background: "var(--bg-card)", cursor: loadingDocx ? "wait" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", transition: "all 200ms ease", opacity: loadingDocx ? 0.7 : 1 }}
              >
                <div style={{ width: 52, height: 52, borderRadius: "0.75rem", background: "#E3F2FD", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={24} style={{ color: "#1565C0" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{loadingDocx ? "Gerando Word..." : "Exportar Word"}</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>Documento editável (.docx)</p>
                </div>
              </button>
            </div>
            <div style={{ padding: "0.875rem 1rem", borderRadius: "0.625rem", background: "var(--accent-light)", border: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--accent-primary)" }}>O arquivo gerado inclui:</strong> dados pessoais, responsáveis, diagnósticos e CIDs, histórico completo de {sessoes.length} sessões e {evolucoes.length} registro(s) de evolução.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

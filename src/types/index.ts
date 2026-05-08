import type { Aluno, Atendimento, Evolucao } from "@prisma/client";

export type { Aluno, Atendimento, Evolucao };

export type TipoAtendimento =
  | "individual"
  | "grupo"
  | "avaliacao"
  | "reuniao_familia";

export const TIPOS_ATENDIMENTO: Record<TipoAtendimento, string> = {
  individual: "Individual",
  grupo: "Grupo",
  avaliacao: "Avaliação",
  reuniao_familia: "Reunião com Família",
};

export const NECESSIDADES_ESPECIAIS = [
  "TEA",
  "TDAH",
  "Deficiência Visual",
  "Deficiência Auditiva",
  "Deficiência Física",
  "Deficiência Intelectual",
  "Síndrome de Down",
  "Dislexia",
  "Outro",
] as const;

export type AlunoComAtendimentos = Aluno & {
  atendimentos: Atendimento[];
  _count?: { atendimentos: number };
};

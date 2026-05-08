import { z } from "zod";

export const atendimentoSchema = z.object({
  alunoId: z.string().min(1, "Aluno é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  tipo: z.enum(["individual", "grupo", "avaliacao", "reuniao_familia"], {
    required_error: "Tipo é obrigatório",
  }),
  duracaoMin: z.coerce.number().int().min(5).max(240).default(50),
  objetivo: z.string().optional(),
  observacoes: z.string().optional(),
  presente: z.boolean().default(true),
});

export type AtendimentoFormData = z.infer<typeof atendimentoSchema>;

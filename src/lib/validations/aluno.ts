import { z } from "zod";

export const alunoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  turma: z.string().optional(),
  escola: z.string().optional(),
  responsavel: z.string().optional(),
  telefone: z.string().optional(),
  necessidadeEspecial: z.string().optional(),
  observacoes: z.string().optional(),
  ativo: z.boolean().optional().default(true),
});

export type AlunoFormData = z.infer<typeof alunoSchema>;

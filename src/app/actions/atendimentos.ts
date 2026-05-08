"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { atendimentoSchema } from "@/lib/validations/atendimento";

export async function registrarAtendimento(formData: Record<string, unknown>) {
  const validated = atendimentoSchema.safeParse(formData);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const { data: dataStr, alunoId, tipo, duracaoMin, objetivo, observacoes, presente } = validated.data;

  await prisma.atendimento.create({
    data: {
      alunoId,
      data: new Date(dataStr),
      tipo,
      duracaoMin,
      objetivo,
      observacoes,
      presente,
    },
  });

  revalidatePath("/atendimentos");
  revalidatePath(`/alunos/${alunoId}`);
  return { success: true };
}

export async function atualizarAtendimento(id: string, formData: Record<string, unknown>) {
  const validated = atendimentoSchema.safeParse(formData);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const { data: dataStr, ...rest } = validated.data;

  await prisma.atendimento.update({
    where: { id },
    data: {
      ...rest,
      data: new Date(dataStr),
    },
  });

  revalidatePath("/atendimentos");
  return { success: true };
}

export async function excluirAtendimento(id: string, alunoId: string) {
  await prisma.atendimento.delete({ where: { id } });
  revalidatePath("/atendimentos");
  revalidatePath(`/alunos/${alunoId}`);
  return { success: true };
}

export async function registrarEvolucao(formData: {
  alunoId: string;
  data: string;
  periodo?: string;
  descricao: string;
  areas?: string[];
}) {
  await prisma.evolucao.create({
    data: {
      alunoId: formData.alunoId,
      data: new Date(formData.data),
      periodo: formData.periodo,
      descricao: formData.descricao,
      areas: formData.areas ? JSON.stringify(formData.areas) : null,
    },
  });

  revalidatePath(`/alunos/${formData.alunoId}`);
  return { success: true };
}

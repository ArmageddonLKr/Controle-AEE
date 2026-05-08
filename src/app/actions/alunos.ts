"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { alunoSchema } from "@/lib/validations/aluno";

export async function criarAluno(formData: Record<string, unknown>) {
  const validated = alunoSchema.safeParse(formData);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const { dataNascimento, ...rest } = validated.data;

  await prisma.aluno.create({
    data: {
      ...rest,
      dataNascimento: new Date(dataNascimento),
    },
  });

  revalidatePath("/alunos");
  return { success: true };
}

export async function atualizarAluno(id: string, formData: Record<string, unknown>) {
  const validated = alunoSchema.safeParse(formData);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  const { dataNascimento, ...rest } = validated.data;

  await prisma.aluno.update({
    where: { id },
    data: {
      ...rest,
      dataNascimento: new Date(dataNascimento),
    },
  });

  revalidatePath("/alunos");
  revalidatePath(`/alunos/${id}`);
  return { success: true };
}

export async function alternarStatusAluno(id: string) {
  const aluno = await prisma.aluno.findUnique({ where: { id }, select: { ativo: true } });
  if (!aluno) return { success: false };

  await prisma.aluno.update({
    where: { id },
    data: { ativo: !aluno.ativo },
  });

  revalidatePath("/alunos");
  revalidatePath(`/alunos/${id}`);
  return { success: true };
}

export async function excluirAluno(id: string) {
  await prisma.aluno.delete({ where: { id } });
  revalidatePath("/alunos");
  return { success: true };
}

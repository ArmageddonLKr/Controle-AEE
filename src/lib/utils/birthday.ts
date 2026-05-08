import {
  differenceInDays,
  differenceInYears,
  setYear,
  isBefore,
  startOfDay,
} from "date-fns";
import type { Aluno } from "@/types";

export function getUpcomingBirthdays(alunos: Aluno[], daysAhead = 7) {
  const today = startOfDay(new Date());
  const year = today.getFullYear();

  return alunos
    .filter((a) => a.ativo && a.dataNascimento != null)
    .map((a) => {
      const bday = new Date(a.dataNascimento);
      let nextBday = setYear(
        new Date(bday.getFullYear(), bday.getMonth(), bday.getDate()),
        year
      );
      if (isBefore(nextBday, today)) {
        nextBday = setYear(nextBday, year + 1);
      }
      const daysUntil = differenceInDays(nextBday, today);
      return { aluno: a, daysUntil, nextBday };
    })
    .filter(({ daysUntil }) => daysUntil >= 0 && daysUntil <= daysAhead)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

export function calcularIdade(dataNascimento: Date): number {
  return differenceInYears(new Date(), new Date(dataNascimento));
}

export function isAniversarioHoje(dataNascimento: Date): boolean {
  const today = new Date();
  const bday = new Date(dataNascimento);
  return (
    bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate()
  );
}

import {
  differenceInDays,
  differenceInYears,
  setYear,
  isBefore,
  startOfDay,
} from "date-fns";
import type { Crianca } from "@/types";

export function getAniversariosProximos(criancas: Crianca[], diasAdiante = 7) {
  const hoje = startOfDay(new Date());
  const ano = hoje.getFullYear();

  return criancas
    .filter((c) => c.status === "ativo" && c.dataNascimento)
    .map((c) => {
      const nasc = new Date(c.dataNascimento);
      let proximoAniv = setYear(
        new Date(nasc.getFullYear(), nasc.getMonth(), nasc.getDate()),
        ano
      );
      if (isBefore(proximoAniv, hoje)) {
        proximoAniv = setYear(proximoAniv, ano + 1);
      }
      const diasAte = differenceInDays(proximoAniv, hoje);
      return { crianca: c, diasAte, proximoAniv };
    })
    .filter(({ diasAte }) => diasAte >= 0 && diasAte <= diasAdiante)
    .sort((a, b) => a.diasAte - b.diasAte);
}

export function calcularIdade(dataNascimento: string): number {
  return differenceInYears(new Date(), new Date(dataNascimento));
}

export function isAniversarioHoje(dataNascimento: string): boolean {
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  return nasc.getMonth() === hoje.getMonth() && nasc.getDate() === hoje.getDate();
}

export function diasAteAniversario(dataNascimento: string): number {
  const hoje = startOfDay(new Date());
  const ano = hoje.getFullYear();
  const nasc = new Date(dataNascimento);
  let proximoAniv = setYear(
    new Date(nasc.getFullYear(), nasc.getMonth(), nasc.getDate()),
    ano
  );
  if (isBefore(proximoAniv, hoje)) {
    proximoAniv = setYear(proximoAniv, ano + 1);
  }
  return differenceInDays(proximoAniv, hoje);
}

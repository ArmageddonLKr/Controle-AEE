// src/lib/utils/date.ts
// Conversão segura de datas "puras" (YYYY-MM-DD) para Date.
//
// PROBLEMA: `new Date("2026-06-27")` é interpretado pelo navegador como
// meia-noite em UTC. No Brasil (UTC-3) isso vira 26/06 às 21h — ou seja, o
// dia "anda" para trás (27 vira 26). É por isso que aniversários e sessões
// apareciam um dia antes/depois do escolhido.
//
// SOLUÇÃO: montar a data no fuso LOCAL, ancorada ao meio-dia, para nunca
// cruzar a virada do dia por causa do fuso horário.
export function parseDataLocal(iso: string | undefined | null): Date {
  if (!iso) return new Date(NaN);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (m) {
    const [, ano, mes, dia] = m;
    return new Date(Number(ano), Number(mes) - 1, Number(dia), 12, 0, 0, 0);
  }
  // Já é um ISO com hora (ou outro formato) — deixa o navegador resolver.
  return new Date(iso);
}

// Data de "hoje" no formato YYYY-MM-DD usando o fuso LOCAL.
// (new Date().toISOString() usa UTC e, à noite no Brasil, retornaria o dia
// seguinte — por isso montamos manualmente a partir do horário local.)
export function hojeISO(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

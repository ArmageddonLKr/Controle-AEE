import { getUpcomingBirthdays } from "@/lib/utils/birthday";
import type { Aluno } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BirthdayAlertProps {
  alunos: Aluno[];
}

export function BirthdayAlert({ alunos }: BirthdayAlertProps) {
  const upcoming = getUpcomingBirthdays(alunos, 7);

  if (upcoming.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎂</span>
        <h3 className="font-semibold text-amber-900">
          Aniversários próximos ({upcoming.length})
        </h3>
      </div>
      <div className="space-y-2">
        {upcoming.map(({ aluno, daysUntil, nextBday }) => (
          <div
            key={aluno.id}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-amber-100"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                {aluno.nome.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-800">
                {aluno.nome}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-amber-700">
                {daysUntil === 0
                  ? "Hoje!"
                  : daysUntil === 1
                  ? "Amanhã"
                  : `Em ${daysUntil} dias`}
              </span>
              <p className="text-xs text-slate-400">
                {format(nextBday, "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

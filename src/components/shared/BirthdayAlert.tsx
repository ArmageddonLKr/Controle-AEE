import { getAniversariosProximos } from "@/lib/utils/birthday";
import type { Crianca } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BirthdayAlertProps {
  criancas: Crianca[];
}

export function BirthdayAlert({ criancas }: BirthdayAlertProps) {
  const proximos = getAniversariosProximos(criancas, 7);

  if (proximos.length === 0) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "rgba(240, 165, 0, 0.08)",
        border: "1px solid rgba(240, 165, 0, 0.3)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎂</span>
        <h3 className="font-semibold" style={{ color: "#B87800" }}>
          Aniversários próximos ({proximos.length})
        </h3>
      </div>
      <div className="space-y-2">
        {proximos.map(({ crianca, diasAte, proximoAniv }) => (
          <div
            key={crianca.id}
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "#FFF8E6", color: "#B87800" }}
              >
                {crianca.nome.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {crianca.nome.split(" ")[0]}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium" style={{ color: "#F0A500" }}>
                {diasAte === 0 ? "Hoje! 🎉" : diasAte === 1 ? "Amanhã" : `Em ${diasAte} dias`}
              </span>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {format(proximoAniv, "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { ReactNode } from "react";

interface PageHeaderProps {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}

export function PageHeader({ titulo, descricao, acao }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1
          className="text-2xl font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {titulo}
        </h1>
        {descricao && (
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {descricao}
          </p>
        )}
      </div>
      {acao && <div className="flex-shrink-0">{acao}</div>}
    </div>
  );
}

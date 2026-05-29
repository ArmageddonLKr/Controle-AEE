"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlunoPerfilClient } from "../[id]/AlunoPerfilClient";
import { Loader2 } from "lucide-react";

function PerfilInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  return <AlunoPerfilClient id={id} />;
}

export default function PerfilPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          <Loader2 size={24} className="animate-spin" />
          <span>Carregando...</span>
        </div>
      }
    >
      <PerfilInner />
    </Suspense>
  );
}

// PageTransition — aplica um fade + leve subida a cada troca de tela.
// A "key" pelo caminho reinicia a animação quando a rota muda.
"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
}

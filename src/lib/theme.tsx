"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Tema = "claro" | "escuro";

interface TemaContexto {
  tema: Tema;
  alternarTema: () => void;
}

const TemaContexto = createContext<TemaContexto>({
  tema: "claro",
  alternarTema: () => {},
});

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-controle-aee") as Tema | null;
    if (temaSalvo) {
      setTema(temaSalvo);
      document.documentElement.classList.toggle("dark", temaSalvo === "escuro");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTema("escuro");
      document.documentElement.classList.add("dark");
    }
  }, []);

  function alternarTema() {
    const novoTema: Tema = tema === "claro" ? "escuro" : "claro";
    setTema(novoTema);
    document.documentElement.classList.toggle("dark", novoTema === "escuro");
    localStorage.setItem("tema-controle-aee", novoTema);
  }

  return (
    <TemaContexto.Provider value={{ tema, alternarTema }}>
      {children}
    </TemaContexto.Provider>
  );
}

export function useTema() {
  return useContext(TemaContexto);
}

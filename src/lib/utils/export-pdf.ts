import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Crianca, Sessao, Evolucao } from "@/types";

export interface ColunaExport {
  header: string;
  dataKey: string;
}

export function exportarRelatorioAtendimentosPDF(
  titulo: string,
  subtitulo: string,
  colunas: ColunaExport[],
  linhas: Record<string, unknown>[],
  nomeArquivo: string
) {
  const doc = new jsPDF({ orientation: "landscape" });
  const larguraPagina = doc.internal.pageSize.width;

  // Cabeçalho colorido
  doc.setFillColor(30, 58, 95); // azul-petróleo
  doc.rect(0, 0, larguraPagina, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Controle AEE", 14, 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Rafaela Dias — Atendimento Educacional Especializado", 14, 17);

  const dataHora = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  doc.text(`Gerado em: ${dataHora}`, larguraPagina - 14, 14, { align: "right" });

  // Título da seção
  doc.setTextColor(26, 43, 69);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 14, 32);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 96, 128);
  doc.text(subtitulo, 14, 39);

  // Tabela
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoTable(doc, {
    startY: 46,
    columns: colunas.map((c) => ({ header: c.header, dataKey: c.dataKey })),
    body: linhas as any,
    headStyles: {
      fillColor: [30, 58, 95],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: [240, 247, 255] },
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      textColor: [26, 43, 69],
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${nomeArquivo}.pdf`);
}

export function exportarFichaCriancaPDF(crianca: Crianca, sessoes: Sessao[], evolucoes: Evolucao[]) {
  const doc = new jsPDF();
  const larguraPagina = doc.internal.pageSize.width;

  // Cabeçalho
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, larguraPagina, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Controle AEE — Ficha da Criança", 14, 11);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Rafaela Dias — Atendimento Educacional Especializado", 14, 19);

  const dataHora = format(new Date(), "dd/MM/yyyy", { locale: ptBR });
  doc.text(`Gerado em: ${dataHora}`, larguraPagina - 14, 19, { align: "right" });

  // Dados da criança
  doc.setTextColor(26, 43, 69);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(crianca.nome, 14, 35);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(74, 96, 128);
  doc.text(`${crianca.escola} — ${crianca.turma} | Turno: ${crianca.turno}`, 14, 42);
  doc.text(`Diagnóstico(s): ${crianca.diagnosticos.join(", ")}`, 14, 49);
  doc.text(`Status: ${crianca.status} | Início: ${format(new Date(crianca.dataInicioAcompanhamento), "dd/MM/yyyy", { locale: ptBR })}`, 14, 56);

  // Tabela de sessões
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 43, 69);
  doc.text("Histórico de Sessões", 14, 68);

  const linhasSessoes = sessoes.map((s) => ({
    data: format(new Date(s.data), "dd/MM/yyyy", { locale: ptBR }),
    tipo: s.tipo,
    duracao: `${s.duracao} min`,
    presenca: s.presente ? "Presente" : `Falta${s.motivoFalta ? ` (${s.motivoFalta})` : ""}`,
    anotacoes: s.anotacoes.substring(0, 80) + (s.anotacoes.length > 80 ? "..." : ""),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoTable(doc, {
    startY: 72,
    columns: [
      { header: "Data", dataKey: "data" },
      { header: "Tipo", dataKey: "tipo" },
      { header: "Duração", dataKey: "duracao" },
      { header: "Presença", dataKey: "presenca" },
      { header: "Anotações", dataKey: "anotacoes" },
    ],
    body: linhasSessoes as any,
    headStyles: { fillColor: [30, 58, 95], textColor: 255, fontSize: 8 },
    alternateRowStyles: { fillColor: [240, 247, 255] },
    styles: { fontSize: 7, cellPadding: 2, textColor: [26, 43, 69] },
    columnStyles: { anotacoes: { cellWidth: 80 } },
    margin: { left: 14, right: 14 },
  });

  const nomeArquivo = crianca.nome.replace(/\s+/g, "_");
  doc.save(`ficha_${nomeArquivo}.pdf`);
}

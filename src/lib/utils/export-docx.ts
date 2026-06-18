import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from "docx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Crianca, Sessao, Evolucao } from "@/types";
import { parseDataLocal } from "./date";

const AZUL_PETROLEO = "1E3A5F";
const AZUL_CLARO = "E0F4F8";

function cabecalhoDoc(): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: "Controle AEE",
          bold: true,
          size: 32,
          color: AZUL_PETROLEO,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Rafaela Dias — Atendimento Educacional Especializado",
          size: 20,
          color: "4A6080",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Documento gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
          size: 18,
          color: "8FA3BC",
          italics: true,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];
}

function linhaTabela(
  celulas: string[],
  ehCabecalho = false
): TableRow {
  return new TableRow({
    tableHeader: ehCabecalho,
    children: celulas.map(
      (texto) =>
        new TableCell({
          shading: ehCabecalho
            ? { type: ShadingType.SOLID, color: AZUL_PETROLEO }
            : undefined,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: texto,
                  bold: ehCabecalho,
                  color: ehCabecalho ? "FFFFFF" : "1A2B45",
                  size: 18,
                }),
              ],
            }),
          ],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "D1E3F0" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1E3F0" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "D1E3F0" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "D1E3F0" },
          },
        })
    ),
  });
}

export async function exportarRelatorioAtendimentosDocx(
  titulo: string,
  periodo: string,
  sessoes: Sessao[],
  criancasMap: Record<string, string>
) {
  const tabela = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      linhaTabela(["Data", "Criança", "Tipo", "Duração", "Presença"], true),
      ...sessoes.map((s) =>
        linhaTabela([
          format(parseDataLocal(s.data), "dd/MM/yyyy", { locale: ptBR }),
          criancasMap[s.criancaId] ?? s.criancaId,
          s.tipo,
          `${s.duracao} min`,
          s.presente ? "✓ Presente" : `✗ Falta${s.motivoFalta ? ` (${s.motivoFalta})` : ""}`,
        ])
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          ...cabecalhoDoc(),
          new Paragraph({
            text: titulo,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Período: ${periodo}`, size: 20, color: "4A6080" }),
            ],
          }),
          new Paragraph({ text: "" }),
          tabela,
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total de sessões: ${sessoes.length} | Presenças: ${sessoes.filter((s) => s.presente).length} | Faltas: ${sessoes.filter((s) => !s.presente).length}`,
                size: 18,
                bold: true,
                color: AZUL_PETROLEO,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio_atendimentos_${Date.now()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportarFichaCriancaDocx(
  crianca: Crianca,
  sessoes: Sessao[],
  evolucoes: Evolucao[]
) {
  const tabelaSessoes = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      linhaTabela(["Data", "Tipo", "Duração", "Presença", "Anotações"], true),
      ...sessoes.map((s) =>
        linhaTabela([
          format(parseDataLocal(s.data), "dd/MM/yyyy", { locale: ptBR }),
          s.tipo,
          `${s.duracao} min`,
          s.presente ? "✓ Presente" : `✗ Falta`,
          s.anotacoes.substring(0, 100) + (s.anotacoes.length > 100 ? "..." : ""),
        ])
      ),
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          ...cabecalhoDoc(),
          new Paragraph({
            text: `Ficha: ${crianca.nome}`,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Escola: ${crianca.escola} — ${crianca.turma}`, size: 20 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Diagnóstico(s): ${crianca.diagnosticos.join(", ")}`, size: 20 }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Status: ${crianca.status} | Início do acompanhamento: ${format(parseDataLocal(crianca.dataInicioAcompanhamento), "dd/MM/yyyy", { locale: ptBR })}`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Histórico de Sessões", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "" }),
          tabelaSessoes,
          new Paragraph({ text: "" }),
          new Paragraph({ text: "Registros de Evolução", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: "" }),
          ...evolucoes.flatMap((e) => [
            new Paragraph({
              children: [
                new TextRun({ text: `${e.periodo}`, bold: true, size: 22, color: AZUL_PETROLEO }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: e.descricao, size: 18 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Áreas: ${e.areas.join(", ")}`,
                  size: 18,
                  color: "4A6080",
                  italics: true,
                }),
              ],
            }),
            new Paragraph({ text: "" }),
          ]),
        ],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  const nomeArquivo = crianca.nome.replace(/\s+/g, "_");
  const url = URL.createObjectURL(buffer);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ficha_${nomeArquivo}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

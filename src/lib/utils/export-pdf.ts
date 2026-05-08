import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface ExportColumn {
  header: string;
  dataKey: string;
}

export function exportToPDF(
  title: string,
  subtitle: string,
  columns: ExportColumn[],
  rows: Record<string, unknown>[],
  filename: string
) {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.width;

  // Header bar
  doc.setFillColor(2, 132, 199); // sky-600
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Controle AEE", 14, 14);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const datahora = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  doc.text(`Gerado em: ${datahora}`, pageWidth - 14, 14, { align: "right" });

  // Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 34);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, 14, 41);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  autoTable(doc, {
    startY: 48,
    columns: columns.map((c) => ({ header: c.header, dataKey: c.dataKey })),
    body: rows as any,
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      textColor: [30, 41, 59],
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}

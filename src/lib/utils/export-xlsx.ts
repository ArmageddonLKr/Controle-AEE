import * as XLSX from "xlsx";

export interface XLSXColumn {
  header: string;
  key: string;
}

export function exportToXLSX(
  sheetName: string,
  columns: XLSXColumn[],
  rows: Record<string, unknown>[],
  filename: string
) {
  const wsData = [
    columns.map((c) => c.header),
    ...rows.map((r) => columns.map((c) => r[c.key] ?? "")),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

"use client";

import { Download, FileText, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { exportToPDF, type ExportColumn } from "@/lib/utils/export-pdf";
import { exportToXLSX, type XLSXColumn } from "@/lib/utils/export-xlsx";

interface ExportButtonProps {
  title: string;
  subtitle?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
  filename: string;
  disabled?: boolean;
}

export function ExportButton({
  title,
  subtitle = "",
  columns,
  data,
  filename,
  disabled = false,
}: ExportButtonProps) {
  const handlePDF = () => {
    exportToPDF(title, subtitle, columns, data, filename);
  };

  const handleXLSX = () => {
    const xlsxCols: XLSXColumn[] = columns.map((c) => ({
      header: c.header,
      key: c.dataKey,
    }));
    exportToXLSX(title, xlsxCols, data, filename);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || data.length === 0}>
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Formato de exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePDF}>
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          Exportar PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleXLSX}>
          <Sheet className="h-4 w-4 mr-2 text-emerald-600" />
          Exportar Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Download, Inbox, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export type ResultRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "Imported" | "Skipped";
  detail: string;
};

type ResultsTableProps = {
  title: string;
  description: string;
  rows: ResultRow[];
};

type ResultsDownloadActionsProps = {
  importedRows: ResultRow[];
  skippedRows: ResultRow[];
};

function escapeCsvValue(value: string) {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function rowsToCsv(rows: ResultRow[]) {
  const headers = ["id", "name", "email", "company", "status", "detail"];
  const body = rows.map((row) =>
    headers.map((header) => escapeCsvValue(String(row[header as keyof ResultRow]))).join(",")
  );

  return [headers.join(","), ...body].join("\n");
}

function downloadFile(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function ResultsDownloadActions({ importedRows, skippedRows }: ResultsDownloadActionsProps) {
  const { toast } = useToast();
  const allRows = [...importedRows, ...skippedRows];

  function handleCsvDownload() {
    downloadFile("groweasy-import-results.csv", rowsToCsv(allRows), "text/csv;charset=utf-8");
    toast({
      title: "CSV downloaded",
      description: "Import results were exported as a CSV file.",
      variant: "success"
    });
  }

  function handleJsonDownload() {
    downloadFile(
      "groweasy-import-results.json",
      JSON.stringify(
        {
          imported: importedRows,
          skipped: skippedRows,
          summary: {
            imported: importedRows.length,
            skipped: skippedRows.length,
            total: allRows.length
          }
        },
        null,
        2
      ),
      "application/json;charset=utf-8"
    );
    toast({
      title: "JSON downloaded",
      description: "Import results were exported as structured JSON.",
      variant: "success"
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex">
      <Button type="button" variant="outline" onClick={handleCsvDownload}>
        <Download className="h-4 w-4" />
        CSV
      </Button>
      <Button type="button" onClick={handleJsonDownload}>
        <Download className="h-4 w-4" />
        JSON
      </Button>
    </div>
  );
}

export function ResultsTable({ title, description, rows }: ResultsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<ResultRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-muted-foreground text-xs">{row.original.id}</p>
          </div>
        )
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <span className="block max-w-[220px] truncate">{getValue<string>() || "—"}</span>
        )
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ getValue }) => (
          <span className="block max-w-[180px] truncate">{getValue<string>() || "—"}</span>
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "Imported" ? "default" : "secondary"}>
            {row.original.status}
          </Badge>
        )
      },
      {
        accessorKey: "detail",
        header: "Detail",
        cell: ({ getValue }) => (
          <span className="block max-w-[220px] truncate">{getValue<string>()}</span>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 4
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const filteredRows = table.getFilteredRowModel().rows.length;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          </div>
          <Badge variant="outline" className="w-fit">
            {rows.length.toLocaleString()} rows
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="bg-card placeholder:text-muted-foreground focus:border-ring focus:ring-ring/20 h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2"
            placeholder={`Search ${title.toLowerCase()}...`}
            type="search"
          />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No rows available"
            description="This table will populate once an import produces matching results."
          />
        ) : filteredRows === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching rows"
            description="Try a different search term or clear the search field."
          />
        ) : (
          <div className="overflow-hidden rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-muted-foreground whitespace-nowrap border-b px-4 py-3 text-xs font-semibold uppercase"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="odd:bg-background even:bg-muted/30 hover:bg-primary/5 border-b transition-colors last:border-b-0"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-top">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Showing {table.getRowModel().rows.length} of {filteredRows.toLocaleString()} matching
            rows
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-muted-foreground min-w-24 text-center text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.max(1, table.getPageCount())}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

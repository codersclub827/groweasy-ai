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
import { CheckCircle2, ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export type CsvPreviewRow = Record<string, string>;

type CsvPreviewTableProps = {
  columns: string[];
  rows: CsvPreviewRow[];
};

export function CsvPreviewTable({ columns, rows }: CsvPreviewTableProps) {
  const { toast } = useToast();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const tableColumns = useMemo<ColumnDef<CsvPreviewRow>[]>(
    () =>
      columns.map((column) => ({
        accessorKey: column,
        header: column,
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>();

          return <span className="block max-w-[260px] truncate">{value?.trim() || "—"}</span>;
        }
      })),
    [columns]
  );

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 8
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const visibleRows = table.getFilteredRowModel().rows.length;

  function handleConfirmImport() {
    setIsConfirmed(true);
    toast({
      title: "Import confirmed",
      description: "The CSV preview was confirmed locally.",
      variant: "success"
    });
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>CSV preview</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Review parsed rows before confirming the import.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Badge variant="secondary">{rows.length.toLocaleString()} rows</Badge>
            <Badge variant="outline">{columns.length.toLocaleString()} columns</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="bg-card placeholder:text-muted-foreground focus:border-ring focus:ring-ring/20 h-10 w-full rounded-md border pl-9 pr-3 text-sm outline-none transition-colors focus:ring-2"
              placeholder="Search preview rows..."
              type="search"
            />
          </div>

          <Button type="button" onClick={handleConfirmImport}>
            <CheckCircle2 className="h-4 w-4" />
            Confirm import
          </Button>
        </div>

        {isConfirmed ? (
          <div className="flex items-start gap-3 rounded-md border border-emerald-500/30 bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Import confirmed in the frontend preview. Backend processing is not connected yet.
            </p>
          </div>
        ) : null}

        {rows.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No preview rows"
            description="Upload a CSV with at least one data row to generate a preview."
          />
        ) : visibleRows === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching rows"
            description="Clear the search field or try another value."
          />
        ) : (
          <div className="overflow-hidden rounded-md border">
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-muted sticky top-0 z-10">
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
                      className="odd:bg-background even:bg-muted/30 hover:bg-primary/5 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="border-b px-4 py-3 align-top">
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
            Showing {table.getRowModel().rows.length} of {visibleRows.toLocaleString()} matching
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
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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

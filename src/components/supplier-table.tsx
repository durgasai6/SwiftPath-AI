"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Minus
} from "lucide-react";
import type { Supplier } from "@/types";
import { RiskGauge } from "@/components/risk-gauge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, financialHealthLabel, riskBadgeClass, riskLevelLabel, timeAgo } from "@/lib/utils";

interface SupplierTableProps {
  data: Supplier[];
  isLoading?: boolean;
}

function TrendIndicator({ direction }: { direction: Supplier["riskTrend"] }) {
  if (direction === "up") return <ArrowUp className="h-4 w-4 text-danger" />;
  if (direction === "down") return <ArrowDown className="h-4 w-4 text-success" />;
  return <Minus className="h-4 w-4 text-muted" />;
}

function FinancialIndicator({ health }: { health: Supplier["financialHealth"] }) {
  if (health === "up") return <ArrowUp className="h-4 w-4 text-success" />;
  if (health === "down") return <ArrowDown className="h-4 w-4 text-danger" />;
  return <Minus className="h-4 w-4 text-warning" />;
}

export function SupplierTable({ data, isLoading = false }: SupplierTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<Supplier>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            aria-label="Select row"
          />
        )
      },
      {
        accessorKey: "name",
        header: "Supplier",
        cell: ({ row }) => {
          const supplier = row.original;

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{supplier.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{supplier.name}</p>
                <p className="text-sm text-muted">{supplier.locationLabel}</p>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span className="text-base">{row.original.flag}</span>
            <span>{row.original.country}</span>
          </div>
        )
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>
      },
      {
        accessorKey: "riskScore",
        header: "Risk Score",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <RiskGauge value={row.original.riskScore} size="sm" />
            <Badge className={cn("capitalize", riskBadgeClass(row.original.riskLevel))}>
              {riskLevelLabel(row.original.riskLevel)}
            </Badge>
          </div>
        )
      },
      {
        accessorKey: "newsSignals",
        header: "News Signals",
        cell: ({ row }) => <span className="font-mono text-sm text-foreground">{row.original.newsSignals}</span>
      },
      {
        accessorKey: "financialHealth",
        header: "Financial Health",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <FinancialIndicator health={row.original.financialHealth} />
            <span>{financialHealthLabel(row.original.financialHealth)}</span>
          </div>
        )
      },
      {
        accessorKey: "lastScannedAt",
        header: "Last Scanned",
        cell: ({ row }) => <span className="text-sm text-muted">{timeAgo(row.original.lastScannedAt)}</span>
      },
      {
        id: "trend",
        header: "Trend",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <TrendIndicator direction={row.original.riskTrend} />
            <span>{row.original.trendDelta > 0 ? `+${row.original.trendDelta}` : row.original.trendDelta}</span>
          </div>
        )
      },
      {
        id: "actions",
        header: "",
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Rescan Now</DropdownMenuItem>
              <DropdownMenuItem>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6
      }
    }
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedCount > 0 ? (
        <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{selectedCount}</span> suppliers selected
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              Rescan Selected
            </Button>
            <Button variant="secondary" size="sm">
              Export
            </Button>
            <Button variant="danger" size="sm">
              Remove
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="border-b border-white/10 bg-white/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted"
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
                <tr key={row.id} className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted">
            <span>{table.getState().pagination.pageSize}</span>
            <span>rows per page</span>
          </div>
        </div>
      </div>
    </div>
  );
}

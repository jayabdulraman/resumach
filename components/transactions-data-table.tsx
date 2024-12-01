"use client"

import * as React from "react"
import {
  CaretSortIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
// Import the utility functions
import { formatDate, formatFileSize } from '@/utils/formatting';
import { Toaster } from "./ui/toaster"

type Transaction = {
  id: string
  user_id: string
  package_id: string
  credits_amount: number
  stripe_payment_intent_id: string
  amount_paid: number
  created_at: string
  status: 'completed' | 'pending' | 'failed'
};

interface DataTableProps {
  data: Transaction[];
}

export function TransactionsDataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  
  useEffect(() => {
    setTransactionsData(data)
  }, [data])

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{formatDate(row.getValue("created_at"))}</div>,
    },
    {
      accessorKey: "amount_paid",
      header: () => <div className="text-center">Amount ($)</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("amount_paid")}</div>,
    },
    {
      accessorKey: "credits_amount",
      header: () => <div className="text-center">Credit</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("credits_amount")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => <div className="capitalize text-center">{row.getValue("status")}</div>,
    },
  ]

  const table = useReactTable<Transaction>({
    data: transactionsData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search files..."
          value={(table.getColumn("created_at")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("created_at")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* Removed the showing rows message from here */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-left flex-1">
          Showing {table.getRowModel().rows.length} of {data.length} rows
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

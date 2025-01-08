"use client"

import * as React from "react"
import {
  CaretSortIcon,
  DotsHorizontalIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import Link from 'next/link'
import { ResumeDto } from "@/lib/dto/resume"
import { generatePDF } from "@/app/(protected)/(builder)/builder/print-resume/print"
import { useToast } from "@/components/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Toaster } from "./ui/toaster"
import { deleteResumeAction } from "@/lib/adapter/actions"
import { useRouter } from "next/navigation"

type FileData = {
  id: string;
  owner: string | undefined;
  fileName: string;
  fileUrl: string | undefined;
  dateModified: string;
  fileSize: number | undefined; // Adjust type as necessary
  resume: ResumeDto | undefined;
};

interface DataTableProps {
  data: FileData[];
  onDeleteSuccess: () => Promise<void>;
}

interface DeleteDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  fileName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteDialog = ({ isOpen, isLoading, fileName, onClose, onConfirm }: DeleteDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete "{fileName}"? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="sm:justify-start">
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Yes, delete"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export function CustomizedResumeDataTable({ data, onDeleteSuccess }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [filesData, setFilesData] = useState<FileData[]>([]); // State to hold file data
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null)

  const { toast } = useToast()  // Use the useToast hook

  const router = useRouter();
  
  useEffect(() => {
    setFilesData(data)
  }, [data])

  // Handle download action
  const handleDownload = async (file: FileData) => {
    // Show a toast with a loading spinner
    toast({
      title: "Download in progress...",
      description: "Your file is being prepared for download.",
      icon: <Loader2 className="animate-spin h-5 w-5" />,
    })

    try {
      const res = await generatePDF("resume-id", file.resume as ResumeDto, file.id)
      // @ts-ignore
      if (res.success) {
        // Update the toast to indicate success
        toast({
          title: "Download ready ✅",
          description: "Your file is ready for download.",
          duration: 5000,
        })
      } else {
        // Update the toast to indicate an error
        toast({
          title: "Download failed ❌",
          description: "There was an error preparing your file. Please try again!",
          variant: "destructive",
          duration: 5000,
      });
      }
     
      } catch (error) {
      // Update the toast to indicate an error
      toast({
        title: "Download failed ❌",
        description: "There was an error preparing your file.",
        variant: "destructive",
        duration: 5000,
      })
      }
  }

  // Handle delete action
  const handleDeleteClick = (file: FileData) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      setIsDeleting(true);
      await deleteResumeAction(fileToDelete.id, fileToDelete.owner as string);
      setFilesData(prev => prev.filter(file => file.id !== fileToDelete.id));
      setDeleteDialogOpen(false);
      toast({
        title: "File successfully deleted ✅!",
        duration: 5000,
      })
      // Call the refresh callback after successful deletion
      await onDeleteSuccess();
    } catch (error) {
      toast({
        title: `Error deleting ${fileToDelete.fileName} ❌!`,
        variant: "destructive",
        duration: 5000,
      })
      console.error('Error deleting file:', error);
      // You might want to show an error toast here
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
      router.refresh();
    }
  };

  const columns: ColumnDef<FileData>[] = [
    {
      accessorKey: "fileName",
      header: "File Name",
      cell: ({ row }) => 
        <div className="capitalize">
          <Link className="hover:underline" href={`/builder/${row.original.id}`}>
            {row.getValue("fileName")}
          </Link>
        </div>,
    },
    {
      accessorKey: "dateModified",
      header: ({ column }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Modified
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-right">{formatDate(row.getValue("dateModified"))}</div>,
    },
    {
      accessorKey: "fileSize",
      header: () => <div className="text-right">File Size</div>,
      cell: ({ row }) => <div className="text-right">{formatFileSize(row.getValue("fileSize"))}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const file = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/builder/${file.id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {handleDownload(file)}} className="cursor-pointer">
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClick(file)} className="cursor-pointer text-red-600 focus:text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable<FileData>({
    data: filesData,
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
      <DeleteDialog
        isOpen={deleteDialogOpen}
        isLoading={isDeleting}
        fileName={fileToDelete?.fileName || ""}
        onClose={() => {
          setDeleteDialogOpen(false);
          setFileToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search files..."
          value={(table.getColumn("fileName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("fileName")?.setFilterValue(event.target.value)
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

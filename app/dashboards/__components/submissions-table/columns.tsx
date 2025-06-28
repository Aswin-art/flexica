"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/format";
import { CellAction } from "./cell-action";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "image",
    header: () => <p>GAMBAR LOKASI</p>,
    cell: ({ row }) => (
      <div className="max-w-[120px]">
        <Image
          src={row.getValue("image")}
          alt="Location Image"
          width={100}
          height={100}
          loading="lazy"
          className="object-cover rounded"
        />
      </div>
    ),
    size: 140,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant={"ghost"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        NAMA <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">{row.getValue("name")}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "address",
    header: () => <p>ALAMAT</p>,
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate">{row.getValue("address")}</div>
    ),
    size: 250,
  },
  {
    accessorKey: "description",
    header: () => <p>CATATAN</p>,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.getValue("description")}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "status",
    header: () => <p>STATUS</p>,
    cell: ({ row }) => (
      <div className="max-w-[80px] truncate">
        {row.original.status ? "Disetujui" : "Menunggu"}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: () => <p>TANGGAL PENGAJUAN</p>,
    cell: ({ row }) => (
      <div className="max-w-[160px] truncate">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
    size: 160,
  },
  {
    id: "actions",
    header: () => <p>AKSI</p>,
    cell: ({ row }) => <CellAction data={row.original} />,
    size: 100,
  },
];

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/format";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { ThumbsDown, ThumbsUp } from "lucide-react";

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
  },
  {
    accessorKey: "locationImage",
    header: () => <p>GAMBAR LOKASI</p>,
    cell: ({ row }) => (
      <Image
        src={row.original.location.image}
        alt="Location Image"
        width={200}
        height={200}
        className="object-contain rounded-lg"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "locationName",
    header: () => <p>NAMA LOKASI</p>,
    cell: ({ row }) => (
      <p className="max-w-[100px] truncate">{row.original.location.name}</p>
    ),
    filterFn: (row, columnId, filterValue) => {
      const locationName = row.original.location.name?.toLowerCase() ?? "";
      return locationName.includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "userName",
    header: () => <p>NAMA PENGGUNA</p>,
    cell: ({ row }) => (
      <p className="max-w-[100px] truncate">{row.original.user.name}</p>
    ),
  },
  {
    accessorKey: "userEmail",
    header: () => <p>EMAIL PENGGUNA</p>,
    cell: ({ row }) => (
      <p className="max-w-[100px] truncate">{row.original.user.email}</p>
    ),
  },
  {
    accessorKey: "comment",
    header: () => <p>KOMENTAR</p>,
    cell: ({ row }) => (
      <p className="max-w-[300px] truncate">{row.original.comment}</p>
    ),
  },
  {
    accessorKey: "vote",
    header: () => <p>ULASAN</p>,
    cell: ({ row }) => (
      <p className="max-w-[300px] truncate">
        {row.original.vote ? <ThumbsUp /> : <ThumbsDown />}
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <p>TANGGAL ULASAN</p>,
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    id: "actions",
    header: () => <p>AKSI</p>,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

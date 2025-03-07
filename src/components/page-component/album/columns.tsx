"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { type AlbumColumn } from "@/lib/album_validators";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";
export const columns: ColumnDef<AlbumColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "专辑ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "cover",
    header: "封面",
    cell: ({ row }) => (
      <Image
        width={40}
        height={40}
        src={row.getValue("cover")}
        alt="专辑封面"
        className=" rounded object-cover"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "album_title",
    header: "专辑标题",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.getValue("album_title")}
      </div>
    ),
  },
  {
    accessorKey: "desc",
    header: "专辑描述",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-sm text-muted-foreground">
        {row.getValue("desc") || "暂无描述"}
      </div>
    ),
  },
  {
    accessorKey: "release_date",
    header: "发行日期",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {format(new Date(row.getValue("release_date")), "yyyy-MM-dd")}
      </span>
    ),
  },
  {
    accessorKey: "artist_id",
    header: "艺人ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        #{row.getValue("artist_id")}
      </span>
    ),
  },

  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

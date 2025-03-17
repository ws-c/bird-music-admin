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
      <div className="flex max-w-[200px] flex-col gap-1 truncate font-medium">
        {row.getValue("album_title")}
        <span className="text-xs text-muted-foreground">
          {row.original.artists.name}
        </span>
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
    accessorKey: "_count",
    header: "歌曲数量",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.songs}
      </span>
    ),
  },
  {
    accessorKey: "create_time",
    header: "创建时间",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {format(new Date(row.getValue("create_time")), "yyyy-MM-dd HH:mm:ss")}
      </span>
    ),
  },
  {
    accessorKey: "update_time",
    header: "更新时间",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {format(new Date(row.getValue("update_time")), "yyyy-MM-dd HH:mm:ss")}
      </span>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

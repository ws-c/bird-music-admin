"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { type UserColumn } from "@/lib/user_validators";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";
export const columns: ColumnDef<UserColumn>[] = [
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
    header: "用户ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "cover",
    header: "头像",
    cell: ({ row }) => (
      <Image
        width={40}
        height={40}
        src={row.getValue("cover") || "https://temp.im/40x40"}
        alt="头像"
        className=" rounded object-cover"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "username",
    header: "用户名",
    cell: ({ row }) => (
      <div className="flex max-w-[200px] truncate font-medium">
        {row.getValue("username")}
      </div>
    ),
  },
  {
    accessorKey: "user_likes_songs",
    header: "喜欢歌曲数量",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.user_likes_songs}
      </span>
    ),
  },
  {
    accessorKey: "playlist_create_count",
    header: "创建歌单数量",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.playlist}
      </span>
    ),
  },
  {
    accessorKey: "playlist_collect_count",
    header: "收藏歌单数量",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.playlist_collect}
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

"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type UserColumn } from "@/lib/user_validators";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export const columns: ColumnDef<UserColumn>[] = [
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
    id: "user_likes_songs_count",
    accessorFn: (row) => row._count?.user_likes_songs || 0,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>喜欢歌曲数量</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.user_likes_songs}
      </span>
    ),
  },
  {
    id: "playlist_create_count",
    accessorFn: (row) => row._count?.playlist || 0,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>创建歌单数量</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.playlist}
      </span>
    ),
  },
  {
    id: "playlist_collect_count",
    accessorFn: (row) => row._count?.playlist_collect || 0,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>收藏歌单数量</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.playlist_collect}
      </span>
    ),
  },
  {
    accessorKey: "create_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>创建时间</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {format(new Date(row.getValue("create_time")), "yyyy-MM-dd HH:mm:ss")}
      </span>
    ),
  },
  {
    accessorKey: "update_time",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>更新时间</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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

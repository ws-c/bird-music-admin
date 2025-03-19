"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type ArtistColumn } from "@/lib/artist_validators";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export const columns: ColumnDef<ArtistColumn>[] = [
  {
    accessorKey: "id",
    header: "艺人ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "image_url",
    header: "艺人图片",
    cell: ({ row }) => (
      <Image
        width={40}
        height={40}
        src={row.getValue("image_url")}
        alt="艺人图片"
        className=" rounded object-cover"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "艺人名称",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "biography",
    header: "艺人简介",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-sm text-muted-foreground">
        {row.getValue("biography") || "暂无简介"}
      </div>
    ),
  },
  {
    id: "albums_count",
    accessorFn: (row) => row._count?.albums || 0,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>专辑数量</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.albums}
      </span>
    ),
  },
  {
    id: "songs_count",
    accessorFn: (row) => row._count?.song_artists || 0,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>参与歌曲数量</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original._count?.song_artists}
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

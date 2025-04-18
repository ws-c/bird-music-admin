"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { type SongColumn } from "@/lib/song_validators";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";
import { typeOptions } from "@/components/constants/genre";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/utils/formatTime";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
export const columns: ColumnDef<SongColumn>[] = [
  {
    accessorKey: "id",
    header: "歌曲ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "albums.cover",
    header: "封面",
    cell: ({ row }) => (
      <Image
        width={40}
        height={40}
        src={row.original.albums.cover}
        alt="专辑封面"
        className=" rounded object-cover"
      />
    ),
    enableSorting: false,
  },

  {
    accessorKey: "song_title",
    header: "标题",
    cell: ({ row }) => (
      <div className="flex max-w-[300px]  flex-col gap-1 truncate font-medium">
        {row.getValue("song_title")}
        <span className="text-xs text-muted-foreground">
          {row.original.song_artists
            .map((artist) => artist.artists.name)
            .join(" / ")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "albums.album_title",
    header: "专辑标题",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-muted-foreground">
        {row.original.albums.album_title}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "时长",
    cell: ({ row }) => <span>{formatTime(row.getValue("duration"))}</span>,
  },
  {
    accessorKey: "tags",
    header: "风格类型",
    cell: ({ row }) => {
      const tags = row.getValue<number[]>("tags") || [];
      const getTagLabel = (value: number) =>
        typeOptions.find((opt) => opt.value === value)?.label || "未知";

      return (
        <div className="flex max-w-[200px] flex-wrap gap-1">
          {tags.length === 0 ? (
            <span className="text-xs text-muted-foreground">无标签</span>
          ) : (
            tags.map((tagValue) => (
              <Badge
                key={tagValue}
                variant="outline"
                className="px-2 py-0.5 text-xs font-medium"
              >
                {getTagLabel(tagValue)}
              </Badge>
            ))
          )}
        </div>
      );
    },
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
  // 隐藏的搜索字段
  {
    accessorKey: "artists_search",
    header: "", // 隐藏表头
    cell: () => null, // 隐藏单元格
    enableSorting: false,
    enableHiding: true,
    // 将多个艺人名称合并为可搜索的字符串
    accessorFn: (row) => row.song_artists.map((a) => a.artists.name).join(" "),
  },
];

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
export const columns: ColumnDef<SongColumn>[] = [
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

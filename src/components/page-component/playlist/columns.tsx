"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { type PlaylistColumn } from "@/lib/playlist_validators";
import { CellAction } from "./cell-action";
import { format } from "date-fns";
import Image from "next/image";
import { typeOptions } from "@/components/constants/genre";
import { Badge } from "@/components/ui/badge";
export const columns: ColumnDef<PlaylistColumn>[] = [
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
    header: "歌单ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">#{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "img",
    header: "封面",
    cell: ({ row }) => (
      <Image
        width={40}
        height={40}
        src={row.getValue("img") || "https://temp.im/40x40"}
        alt="歌单封面"
        className=" rounded object-cover"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "歌单标题",
    cell: ({ row }) => (
      <div className="flex max-w-[200px] flex-col gap-1 truncate font-medium">
        {row.getValue("name")}
        <span className="text-xs text-muted-foreground">
          {row.original.author}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "desc",
    header: "歌单描述",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-sm text-muted-foreground">
        {row.getValue("desc") || "暂无描述"}
      </div>
    ),
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
    accessorKey: "isPrivate",
    header: "是否私密",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("isPrivate") === "1" ? (
          <Badge className="bg-green-500 text-white">是</Badge>
        ) : (
          <Badge className="bg-red-500 text-white">否</Badge>
        )}
      </span>
    ),
  },
  {
    accessorKey: "user_id",
    header: "作者id",
    cell: ({ row }) => (
      <span className="text-muted-foreground">#{row.getValue("user_id")}</span>
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

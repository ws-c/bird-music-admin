"use client";
import React from "react";
import { Heading } from "@/components/common/heading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table/data-table";
import { type PlaylistColumn } from "@/lib/playlist_validators";
import { columns } from "./columns";

interface PlaylistClientProps {
  data: PlaylistColumn[];
}
export const PlaylistClient = ({ data }: PlaylistClientProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="歌单管理"
          description="管理您的歌单信息，进行歌单的创建、编辑和删除"
        />
        <Button
          onClick={() => {
            router.push("/playlists/new");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> 新建歌单
        </Button>
      </div>
      <Separator />
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

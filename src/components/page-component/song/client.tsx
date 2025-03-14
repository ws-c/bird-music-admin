"use client";
import React from "react";
import { Heading } from "@/components/common/heading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table/data-table";
import { type SongColumn } from "@/lib/song_validators";
import { columns } from "./columns";

interface SongClientProps {
  data: SongColumn[];
}
export const SongClient = ({ data }: SongClientProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="歌曲管理"
          description="管理您的歌曲信息，进行歌曲的创建、编辑和删除"
        />
        <Button
          onClick={() => {
            router.push("/songs/new");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> 新建歌曲
        </Button>
      </div>
      <Separator />
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

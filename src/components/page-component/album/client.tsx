"use client";
import React from "react";
import { Heading } from "@/components/common/heading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table/data-table";
import { type AlbumColumn } from "@/lib/album_validators";
import { columns } from "./columns";

interface AlbumClientProps {
  data: AlbumColumn[];
}
export const AlbumClient = ({ data }: AlbumClientProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="专辑管理"
          description="管理您的专辑信息，进行专辑的创建、编辑和删除"
        />
        <Button
          onClick={() => {
            router.push("/albums/new");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

"use client";
import React from "react";
import { Heading } from "@/components/common/heading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import type { ArtistColumn } from "@/lib/artist_validators";

interface ArtistClientProps {
  data: ArtistColumn[];
}
export const ArtistClient = ({ data }: ArtistClientProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="艺人管理"
          description="管理您的艺人信息，进行艺人的创建、编辑和删除"
        />
        <Button
          onClick={() => {
            router.push("/artists/new");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> 新建艺人
        </Button>
      </div>
      <Separator />
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

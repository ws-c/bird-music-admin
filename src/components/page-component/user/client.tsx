"use client";
import React from "react";
import { Heading } from "@/components/common/heading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table/data-table";
import { type UserColumn } from "@/lib/user_validators";
import { columns } from "./columns";

interface UserClientProps {
  data: UserColumn[];
}
export const UserClient = ({ data }: UserClientProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="用户管理"
          description="管理您的用户信息，进行用户的创建、编辑和删除"
        />
        <Button
          onClick={() => {
            router.push("/users/new");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> 新建用户
        </Button>
      </div>
      <Separator />
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

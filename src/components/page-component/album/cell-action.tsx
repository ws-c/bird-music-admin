"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";
import { AlertModal } from "@/components/common/alert-modal";
import type { AlbumColumn } from "@/lib/album_validators";

interface CellActionProps {
  data: AlbumColumn;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // 获取专辑列表的查询（用于删除后刷新）
  const { refetch } = api.albums.getAll.useQuery(undefined, {
    enabled: false,
  });

  // 删除专辑mutation
  const { mutate: deleteAlbum, isLoading: deleteLoading } =
    api.albums.delete.useMutation({
      onSuccess: async () => {
        toast.success("专辑删除成功");
        await refetch(); // 刷新专辑列表
        router.refresh(); // 刷新页面路由
      },
      onError: (error) => {
        toast.error(`删除失败: ${error.message}`);
      },
    });

  return (
    <div className="flex justify-center space-x-2">
      {/* 编辑按钮 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary"
              onClick={() => router.push(`albums/${data.id}`)}
            >
              <Pencil className="h-4 w-4 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>编辑专辑</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 删除按钮 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary"
              onClick={() => setAlertModalOpen(true)}
            >
              <Trash2 className="h-4 w-4 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>删除专辑</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 删除确认弹窗 */}
      <AlertModal
        title="确认删除专辑？"
        description="该操作将永久删除专辑及其所有关联歌曲"
        name={data.album_title}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        onConfirm={() => deleteAlbum(data.id)}
        loading={deleteLoading}
      />
    </div>
  );
}

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
import type { ArtistColumn } from "@/lib/artist_validators";

interface CellActionProps {
  data: ArtistColumn;
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // 获取艺人列表的查询（用于删除后刷新）
  const { refetch } = api.artists.getAll.useQuery(undefined, {
    enabled: false,
  });

  // 删除专辑mutation
  const { mutate: deleteArtist, isLoading: deleteLoading } =
    api.artists.delete.useMutation({
      onSuccess: async () => {
        toast.success("艺人删除成功");
        setAlertModalOpen(false);
        await refetch(); // 刷新艺人列表
        // router.refresh(); // 刷新页面路由
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
              onClick={() => router.push(`artists/${data.id}`)}
            >
              <Pencil className="h-4 w-4 text-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>编辑艺人</p>
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
            <p>删除艺人</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 删除确认弹窗 */}
      <AlertModal
        title="确认删除艺人？"
        description="该操作将永久删除艺人及其所有关联歌曲和专辑"
        name={data.name}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        onConfirm={() => deleteArtist(data.id)}
        loading={deleteLoading}
      />
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-misused-promises */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { Heading } from "@/components/common/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/common/alert-modal";
import {
  type PlaylistFormValues,
  type PlaylistColumn,
  PlaylistBaseSchema,
} from "@/lib/playlist_validators";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/common/img-uploader";
import { MultiSelect } from "@/components/common/multi-select";
import { typeOptions } from "@/components/constants/genre";
import { Checkbox } from "@/components/ui/checkbox";

interface PlaylistFormProps {
  playlists: PlaylistColumn | null;
}

export const PlaylistForm = ({ playlists }: PlaylistFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = playlists ? "编辑歌单" : "新建歌单";
  const description = playlists ? "修改歌单信息" : "添加新歌单";
  const toastMessage = playlists ? "歌单更新成功" : "歌单创建成功";
  const action = playlists ? "保存" : "创建";

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(PlaylistBaseSchema),
    defaultValues: playlists
      ? {
          ...playlists,

          tags: playlists.tags as number[],
        }
      : undefined,
  });

  // 获取歌单列表的查询（用于操作后刷新）
  const { refetch } = api.playlists.getAll.useQuery(undefined, {
    enabled: false,
  });

  const { mutate: createPlaylist } = api.playlists.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success(toastMessage);
      await refetch();
      router.push("/playlists");
    },
  });

  const { mutate: updatePlaylist } = api.playlists.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success(toastMessage);
      await refetch();
      router.push("/playlists");
    },
  });

  const { mutate: deletePlaylist } = api.playlists.delete.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success("歌单删除成功");
      await refetch();
      router.push("/playlists");
    },
  });

  const onSubmit = (values: PlaylistFormValues) => {
    try {
      setLoading(true);
      if (playlists) {
        updatePlaylist({
          ...values,
          id: playlists.id,
          desc: values.desc ?? undefined,
        });
      } else {
        createPlaylist({
          ...values,
          desc: values.desc ?? undefined,
        });
      }
    } catch (error) {
      toast.error("操作失败，请检查表单");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    if (playlists?.id) {
      deletePlaylist(playlists.id);
    }
  };

  return (
    <>
      <div className="mx-auto flex w-2/5 min-w-96 items-center justify-between">
        <Heading title={title} description={description} />
        {playlists && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-2/5 min-w-96 space-y-8 text-center"
        >
          <div className="mt-8 flex flex-col gap-6">
            {/* 歌单标题 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 flex-shrink-0 text-right">
                      标题：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <Input
                        {...field}
                        placeholder="请输入标题"
                        disabled={loading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />

            {/* 封面 */}
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 flex-shrink-0 text-right">
                      封面：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        catalogue="playlist"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />
            {/* 歌单作者 */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 flex-shrink-0 text-right">
                      作者：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <Input
                        {...field}
                        placeholder="请输入作者的用户名"
                        disabled={loading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />
            {/* 歌单描述 */}
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormLabel className=" w-20 flex-shrink-0 pt-2 text-right">
                      描述：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="输入歌单描述（可选）"
                        disabled={loading}
                        rows={4} // 设置默认显示行高度
                        className="resize-y" // 允许垂直调整大小
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />
            {/* 标签 */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className=" w-20 flex-shrink-0 text-right">
                        标签：
                      </FormLabel>
                      <MultiSelect
                        options={typeOptions.map((tag) => ({
                          value: tag.value.toString(),
                          label: tag.label,
                        }))}
                        onValueChange={(values) =>
                          // 转换为数字数组
                          field.onChange(values.map((v) => parseInt(v)))
                        }
                        defaultValue={field.value?.map((i) => i.toString())}
                        placeholder="选择标签"
                        variant="secondary"
                        animation={1}
                        maxCount={3}
                      />
                    </div>
                    <FormMessage className="ml-12" />
                  </FormItem>
                );
              }}
            />
            {/* 是否私密 */}
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="w-20 flex-shrink-0  text-right">
                      是否私密：
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        id="isPrivate"
                        checked={field.value === "1"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "1" : "0")
                        }
                        disabled={loading}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            ></FormField>
          </div>
          <Separator />
          <div className="flex justify-end gap-4 pl-4">
            <Button
              disabled={loading}
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-xl"
            >
              取消
            </Button>
            <Button disabled={loading} type="submit" className="rounded-xl">
              {action}
            </Button>
          </div>
        </form>
      </Form>

      <AlertModal
        title="确认删除？"
        description="此操作将永久删除该专辑及其关联数据"
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
    </>
  );
};

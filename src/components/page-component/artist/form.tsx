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
  ArtistBaseSchema,
  type ArtistColumn,
  type ArtistFormValues,
} from "@/lib/artist_validators";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/common/img-uploader";

interface ArtistFormProps {
  artists: ArtistColumn | null;
}

export const ArtistForm = ({ artists }: ArtistFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = artists ? "编辑艺人" : "新建艺人";
  const description = artists ? "修改艺人信息" : "添加新艺人";
  const toastMessage = artists ? "艺人更新成功" : "艺人创建成功";
  const action = artists ? "保存" : "创建";

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(ArtistBaseSchema),
    defaultValues: artists ?? undefined,
  });

  const { mutate: createArtist } = api.artists.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.push("/artists");
    },
  });

  const { mutate: updateArtist } = api.artists.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.push("/artists");
    },
  });

  const { mutate: deleteArtist } = api.artists.delete.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("艺人删除成功");
      router.push("/artists");
    },
  });

  const onSubmit = (values: ArtistFormValues) => {
    try {
      setLoading(true);
      if (artists) {
        updateArtist({
          ...values,
          id: artists.id,
          biography: values.biography ?? undefined,
        });
      } else {
        createArtist({
          ...values,
          biography: values.biography ?? undefined,
        });
      }
    } catch (error) {
      toast.error("操作失败，请检查表单");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    if (artists?.id) {
      deleteArtist(artists.id);
    }
  };

  return (
    <>
      <div className="mx-auto flex w-1/2 min-w-96 items-center justify-between">
        <Heading title={title} description={description} />
        {artists && (
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
          className="mx-auto w-1/2 min-w-96 space-y-8 text-center"
        >
          <div className="flex flex-col gap-6">
            {/* 艺人名称 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center ">
                    <FormLabel className=" flex-shrink-0">艺人名称：</FormLabel>
                    <FormControl className="flex-grow">
                      <Input
                        {...field}
                        placeholder="请输入艺人名称"
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
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center ">
                    <FormLabel className=" flex-shrink-0">艺人图片：</FormLabel>
                    <FormControl className="flex-grow">
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        catalogue="artists"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />

            {/* 艺人简介 */}
            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start">
                    <FormLabel className="flex-shrink-0 pt-2">
                      艺人简介：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="输入艺人简介（可选）"
                        disabled={loading}
                        rows={8} // 设置默认显示行高度
                        className="resize-y" // 允许垂直调整大小
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4 pl-4">
            <Button
              disabled={loading}
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button disabled={loading} type="submit">
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

/* eslint-disable @typescript-eslint/no-misused-promises */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertModal } from "@/components/common/alert-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  type AlbumFormValues,
  type AlbumColumn,
  AlbumBaseSchema,
} from "@/lib/album_validators";
import type { ArtistColumn } from "@/lib/artist_validators";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/common/img-uploader";

interface AlbumFormProps {
  albums: AlbumColumn | null;
  artists: ArtistColumn[];
}

export const AlbumForm = ({ albums, artists }: AlbumFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = albums ? "编辑专辑" : "新建专辑";
  const description = albums ? "修改专辑信息" : "添加新专辑";
  const toastMessage = albums ? "专辑更新成功" : "专辑创建成功";
  const action = albums ? "保存" : "创建";

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(AlbumBaseSchema),
    defaultValues: albums ?? undefined,
  });

  const { mutate: createAlbum } = api.albums.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.push("/albums");
    },
  });

  const { mutate: updateAlbum } = api.albums.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.push("/albums");
    },
  });

  const { mutate: deleteAlbum } = api.albums.delete.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("专辑删除成功");
      router.push("/albums");
    },
  });

  const onSubmit = (values: AlbumFormValues) => {
    try {
      setLoading(true);
      if (albums) {
        updateAlbum({
          ...values,
          id: albums.id,
          desc: values.desc ?? undefined,
        });
      } else {
        createAlbum({
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
    if (albums?.id) {
      deleteAlbum(albums.id);
    }
  };

  return (
    <>
      <div className="mx-auto flex w-2/5 min-w-96 items-center justify-between">
        <Heading title={title} description={description} />
        {albums && (
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
            {/* 专辑标题 */}
            <FormField
              control={form.control}
              name="album_title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 text-right flex-shrink-0">标题：</FormLabel>
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

            {/* 艺人作者 */}
            <FormField
              control={form.control}
              name="artist_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 text-right flex-shrink-0">作者：</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择作者" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {artists.map((artist) => (
                          <SelectItem
                            key={artist.id}
                            value={artist.id.toString()}
                          >
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />

            {/* 发行日期 */}
            <FormField
              control={form.control}
              name="release_date"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 text-right flex-shrink-0">发行日期：</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="flex-grow">
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
                            ) : (
                              <span>选择日期</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />

            {/* 封面 */}
            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 text-right flex-shrink-0">封面：</FormLabel>
                    <FormControl className="flex-grow">
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        catalogue="album_cover"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />

            {/* 专辑描述 */}
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-2">
                    <FormLabel className=" w-20 text-right flex-shrink-0 pt-2">描述：</FormLabel>
                    <FormControl className="flex-grow">
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        placeholder="输入描述（可选）"
                        disabled={loading}
                        rows={6} // 设置默认显示行高度
                        className="resize-y" // 允许垂直调整大小
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />
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

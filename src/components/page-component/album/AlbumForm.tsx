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

interface AlbumFormProps {
  albums: AlbumColumn;
  artists: ArtistColumn[];
}

export const AlbumForm = ({ albums, artists }: AlbumFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = albums ? "编辑专辑" : "新建专辑";
  const description = albums ? "修改专辑信息" : "添加新专辑";
  const toastMessage = albums ? "专辑更新成功" : "专辑创建成功";
  const action = albums ? "保存修改" : "创建专辑";

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(AlbumBaseSchema),
    defaultValues: albums,
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
      <div className="flex items-center justify-between">
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
          className="w-full space-y-8"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="album_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑标题</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="请输入专辑标题"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artist_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>艺人作者</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择艺术家" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="release_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>发行日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>封面URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="输入封面图片地址"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>专辑描述</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="输入专辑描述（可选）"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
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

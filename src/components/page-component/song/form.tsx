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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertModal } from "@/components/common/alert-modal";
import { type SongFormValues, SongBaseSchema } from "@/lib/song_validators";
import type { ArtistColumn } from "@/lib/artist_validators";
import type { AlbumColumn } from "@/lib/album_validators";
import { typeOptions } from "@/components/constants/genre";
import { put } from "@/utils/oss";
import { MultiSelect } from "@/components/common/multi-select";
interface SongFormProps {
  songs: SongFormValues | null;
  artists: ArtistColumn[];
  albums: (AlbumColumn & { artist_id: number })[];
}

export const SongForm = ({ songs, artists, albums }: SongFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = songs ? "编辑单曲" : "新建单曲";
  const description = songs ? "修改单曲信息" : "添加新单曲";
  const toastMessage = songs ? "单曲更新成功" : "单曲创建成功";
  const action = songs ? "保存" : "创建";

  const form = useForm<SongFormValues>({
    resolver: zodResolver(SongBaseSchema),
    defaultValues: songs ?? undefined,
  });
  const filePath = form.watch("file_path");
  const lyricPath = form.watch("lyric");
  // 添加文件名提取函数
  const getFileName = (url: string) => {
    try {
      const path = new URL(url).pathname;
      return decodeURIComponent(path.split("/").pop() || url);
    } catch {
      return "未知文件";
    }
  };

  // 获取单曲列表的查询（用于操作后刷新）
  const { refetch } = api.songs.getAll.useQuery(undefined, {
    enabled: false,
  });

  const { mutate: createSong } = api.songs.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success(toastMessage);
      await refetch();
      router.push("/songs");
    },
  });

  const { mutate: updateSong } = api.songs.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success(toastMessage);
      await refetch();
      router.push("/songs");
    },
  });

  const { mutate: deleteSong } = api.songs.delete.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success("单曲删除成功");
      await refetch();
      router.push("/songs");
    },
  });

  const onSubmit = (values: SongFormValues) => {
    try {
      setLoading(true);
      const selectedAlbum = albums.find((a) => a.id === values.albums_id);
      if (!values.artist_id.includes(selectedAlbum?.artist_id as number)) {
        return form.setError("artist_id", {
          type: "manual",
          message: "艺人必须包含专辑对应的艺人",
        });
      }
      if (songs) {
        updateSong({
          ...values,
          id: songs.id,
          tags: values.tags ?? undefined,
          lyric: values.lyric ?? undefined,
        });
      } else {
        createSong({
          ...values,
          tags: values.tags ?? undefined,
          lyric: values.lyric ?? undefined,
        });
      }
    } catch (error) {
      toast.error("操作失败，请检查表单");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    if (songs?.id) {
      deleteSong(songs.id);
    }
  };
  const handleAudioFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 文件大小验证
    if (file.size > 10 * 1024 * 1024) {
      toast.error("文件大小不能超过10MB");
      return;
    }

    // 读取音频时长
    const getAudioDuration = (file: File): Promise<number> => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);

        audio.onloadedmetadata = () => {
          URL.revokeObjectURL(url); // 清理内存
          resolve(audio.duration);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("无法读取音频文件"));
        };
      });
    };

    try {
      setLoading(true);
      const [url, duration] = await Promise.all([
        put(`song/${Date.now()}_${file.name}`, file),
        getAudioDuration(file),
      ]);

      if (url && duration) {
        // 同步到表单
        form.setValue("file_path", url);
        form.setValue("duration", Math.round(duration));
      }
    } catch (error) {
      toast.error("文件处理失败，请重试");
    } finally {
      setLoading(false);
    }
  };
  const handleLyricFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024) {
      toast.error("文件大小不能超过100KB");
      return;
    }
    const url = await put(`lyric/${Date.now()}_${file.name}`, file);
    if (url) {
      form.setValue("lyric", url);
    }
  };
  return (
    <>
      <div className="mx-auto flex w-2/5 min-w-96 items-center justify-between ">
        <Heading title={title} description={description} />
        {songs && (
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
          className="mx-auto w-2/5 min-w-96 space-y-8 "
        >
          <div className="mt-8 flex flex-col gap-6">
            {/* 歌名 */}
            <FormField
              control={form.control}
              name="song_title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" flex-shrink-0">歌名：</FormLabel>
                    <FormControl className="flex-grow">
                      <Input
                        {...field}
                        placeholder="请输入歌名"
                        disabled={loading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-12" />
                </FormItem>
              )}
            />
            {/* 专辑 */}
            <FormField
              control={form.control}
              name="albums_id"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" flex-shrink-0">专辑：</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择专辑" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {albums.map((album) => (
                          <SelectItem
                            key={album.id}
                            value={album.id.toString()}
                          >
                            {album.album_title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage className="ml-12" />
                </FormItem>
              )}
            />
            {/* 艺人 */}
            <FormField
              control={form.control}
              name="artist_id"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className=" flex-shrink-0">艺人：</FormLabel>
                      <MultiSelect
                        options={artists.map((artist) => ({
                          value: artist.id.toString(),
                          label: artist.name,
                        }))}
                        onValueChange={(values) =>
                          // 转换为数字数组
                          field.onChange(values.map((v) => parseInt(v)))
                        }
                        defaultValue={songs?.song_artists.map((i) =>
                          i.artist_id.toString()
                        )}
                        placeholder="选择艺人"
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
            {/* 标签 */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className=" flex-shrink-0">标签：</FormLabel>
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
            {/* 音频 */}
            <FormField
              control={form.control}
              name="file_path"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="flex-shrink-0">音频：</FormLabel>
                    <FormControl className="flex-grow">
                      {filePath ? (
                        <div className="flex items-center gap-4">
                          <audio
                            controls
                            src={filePath}
                            className="h-10 flex-1"
                          >
                            您的浏览器不支持音频播放
                          </audio>
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-xl"
                            onClick={() =>
                              document.getElementById("audio-input")?.click()
                            }
                            disabled={loading}
                          >
                            替换
                          </Button>
                          <Input
                            id="audio-input"
                            type="file"
                            accept=".mp3,.m4a,.wav"
                            className="hidden"
                            onChange={handleAudioFileChange}
                          />
                        </div>
                      ) : (
                        <Input
                          type="file"
                          accept=".mp3,.m4a,.wav"
                          onChange={handleAudioFileChange}
                        />
                      )}
                    </FormControl>
                  </div>
                  <FormMessage className="ml-12" />
                </FormItem>
              )}
            />

            {/* 歌词 */}
            <FormField
              control={form.control}
              name="lyric"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="flex-shrink-0">歌词：</FormLabel>
                    <FormControl className="flex-grow">
                      {lyricPath ? (
                        <div className="flex items-center gap-4">
                          <div className="flex flex-1 items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {getFileName(lyricPath)}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-xl"
                            onClick={() =>
                              document.getElementById("lyric-input")?.click()
                            }
                            disabled={loading}
                          >
                            替换
                          </Button>
                          <Input
                            id="lyric-input"
                            type="file"
                            accept=".lrc"
                            className="hidden"
                            onChange={handleLyricFileChange}
                          />
                        </div>
                      ) : (
                        <Input
                          type="file"
                          accept=".lrc"
                          onChange={handleLyricFileChange}
                        />
                      )}
                    </FormControl>
                  </div>
                  <FormMessage className="ml-12" />
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

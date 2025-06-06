import { z } from "zod";

// 专辑表单校验规则
export const AlbumBaseSchema = z.object({
  album_title: z
    .string()
    .min(1, "专辑标题不能为空")
    .max(30, "标题最长30个字符")
    .transform((str) => str.trim()),

  desc: z
    .string()
    .max(2000, "描述最长2000个字符")
    .optional()
    .nullable()
    .transform((str) => str?.trim() || null),

  artist_id: z.coerce
    .number()
    .int("必须是整数ID")
    .positive("艺人ID不合法")
    .refine((val) => val !== null, {
      message: "请选择关联艺人",
    }),

  release_date: z.coerce.date().refine((val) => val !== null, {
    message: "请选择发行日期",
  }),

  cover: z
    .string()
    .url("必须是有效的URL地址")
    .refine((url) => /\.(jpe?g|png|webp)$/i.test(url), {
      message: "仅支持JPG/PNG/WEBP格式",
    }),
});

// 专辑数据类型（表格）
export type AlbumColumn = Omit<z.infer<typeof AlbumBaseSchema>, "artist_id"> & {
  id: number;
  update_time: Date;
  create_time: Date;
  _count?: {
    songs: number;
  };
  artists: {
    name: string;
  };
};
// 专辑新建表单
export type AlbumFormValues = z.infer<typeof AlbumBaseSchema>;

// 专辑更新校验规则（需要包含ID）
export const updateAlbumFormSchema = AlbumBaseSchema.extend({
  id: z.number().int(),
});

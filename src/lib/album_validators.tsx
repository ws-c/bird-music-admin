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
    .max(1000, "描述最长1000个字符")
    .optional()
    .transform((str) => str?.trim() || null),

  artist_id: z.coerce
    .number()
    .int("必须是整数ID")
    .positive("艺术家ID不合法")
    .nullable()
    .refine((val) => val !== null, {
      message: "请选择关联艺术家",
    }),

  release_date: z.coerce
    .date()
    .nullable()
    .refine((val) => val !== null, {
      message: "请选择发行日期",
    }),

  cover: z
    .string()
    .url("必须是有效的URL地址")
    .refine((url) => /\.(jpe?g|png|webp)$/i.test(url), {
      message: "仅支持JPG/PNG/WEBP格式",
    }),
});

// 专辑数据类型（对应表格）
export type AlbumColumn = z.infer<typeof AlbumBaseSchema> & {
  id: number;
};
// 专辑数据类型（对应表单）
export type AlbumFormValues = z.infer<typeof AlbumBaseSchema>;

// 专辑更新表单（需要包含ID）
export const updateAlbumFormSchema = AlbumBaseSchema.extend({
  id: z.number().int(),
});

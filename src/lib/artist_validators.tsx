import { z } from "zod";

// 艺人基础校验规则
export const ArtistBaseSchema = z.object({
  name: z
    .string()
    .min(1, "艺人名称不能为空")
    .max(20, "名称长度不能超过20个字符")
    .transform((str) => str.trim()),

  biography: z
    .string()
    .max(1000, "简介长度不能超过1000个字符")
    .optional()
    .transform((str) => str?.trim() || null),

  image_url: z
    .string()
    .url("必须是有效的URL地址")
    .refine((url) => /\.(jpe?g|png|webp)$/i.test(url), {
      message: "仅支持 JPG/PNG/WEBP 格式的图片",
    }),
});

// 艺人数据类型（表格）
export type ArtistColumn = z.infer<typeof ArtistBaseSchema> & {
  id: number;
  update_time: Date;
  create_time: Date;
  _count?: {
    albums: number;
    song_artists: number;
  };
};

// 艺人新建表单
export type ArtistFormValues = z.infer<typeof ArtistBaseSchema>;

// 艺人更新校验规则（包含ID）
export const updateArtistFormSchema = ArtistBaseSchema.extend({
  id: z.number().int().positive(),
});

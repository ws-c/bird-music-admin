import { type JsonValue } from "next-auth/adapters";
import { z } from "zod";

// 歌单表单校验规则
export const PlaylistBaseSchema = z.object({
  name: z
    .string()
    .min(1, "歌单标题不能为空")
    .max(30, "标题最长30个字符")
    .transform((str) => str.trim()),

  desc: z
    .string()
    .max(2000, "描述最长2000个字符")
    .optional()
    .transform((str) => str?.trim() || null),

  img: z
    .string()
    .url("必须是有效的URL地址")
    .refine((url) => /\.(jpe?g|png|webp)$/i.test(url), {
      message: "仅支持JPG/PNG/WEBP格式",
    })
    .optional()
    .nullable(),

  isPrivate: z.string().optional().nullable(),

  tags: z
    .array(z.number().int().min(1).max(20))
    .max(3, "最多选择3个标签")
    .optional(),

  author: z.string(),
});

// 歌单数据类型（表格）
export type PlaylistColumn = Omit<
  z.infer<typeof PlaylistBaseSchema>,
  "tags" | "user_id"
> & {
  id: number;
  author: string;
  user_id: number;
  update_time: Date;
  create_time: Date;
  tags?: number[] | JsonValue;
  _count?: {
    playlist_songs: number;
  };
};

// 歌单新建表单
export type PlaylistFormValues = z.infer<typeof PlaylistBaseSchema>;

// 歌单更新校验规则（需要包含ID）
export const updatePlaylistFormSchema = PlaylistBaseSchema.extend({
  id: z.number().int(),
});

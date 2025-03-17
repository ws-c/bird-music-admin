import { z } from "zod";

// 表单校验规则
export const UserBaseSchema = z.object({
  username: z
    .string()
    .min(1, "用户名不能为空")
    .max(20, "用户名最长20个字符")
    .transform((str) => str.trim()),
  password: z
    .string()
    .min(6, "密码至少6个字符")
    .max(20, "密码最长20个字符")
    .transform((str) => str.trim()),
  cover: z
    .string()
    .url("必须是有效的URL地址")
    .refine((url) => /\.(jpe?g|png|webp)$/i.test(url), {
      message: "仅支持JPG/PNG/WEBP格式",
    })
    .optional()
    .nullable(),
});

// 数据类型（表格）
export type UserColumn = Omit<z.infer<typeof UserBaseSchema>, "password"> & {
  id: number;
  update_time: Date;
  create_time: Date;
  _count?: {
    playlist_collect: number;
    playlist: number;
    user_likes_songs: number;
  };
};
// 新建表单
export type UserFormValues = z.infer<typeof UserBaseSchema>;

// 更新校验规则（需要包含ID, 密码为空就是代表不改密码）
export const updateUserFormSchema = UserBaseSchema.omit({
  password: true,
}).extend({
  id: z.number().int(),
  password: z
    .string()
    .min(6, "密码至少6个字符")
    .max(20, "密码最长20个字符")
    .transform((str) => str.trim())
    .optional(),
});

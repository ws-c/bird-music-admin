import { type JsonValue } from "next-auth/adapters";
import { z } from "zod";

// 歌曲基础校验规则
export const SongBaseSchema = z.object({
  song_title: z
    .string()
    .min(1, "歌曲名称不能为空")
    .max(30, "名称长度不能超过30个字符")
    .transform((str) => str.trim()),

  duration: z
    .number()
    .int("必须是整数")
    .positive("时长不能为负")
    .min(1, "时长不能为0"),

  file_path: z.string().url("必须是有效的URL地址"),

  albums_id: z.number().int().positive(),

  lyric: z
    .string()
    .url("必须是有效的URL地址")
    .refine((url) => /\.(lrc)$/i.test(url), {
      message: "仅支持LRC格式",
    })
    .optional()
    .nullable(),

  tags: z
    .array(z.number().int().min(1).max(20))
    .max(3, "最多选择3个标签")
    .optional(),

  artist_id: z.array(z.number().int().positive()).max(3, "最多选择3个艺人"),
});

// 歌曲数据类型（表格）
export type SongColumn = Omit<
  z.infer<typeof SongBaseSchema>,
  "tags" | "albums_id" | "artist_id"
> & {
  id: number;
  update_time: Date;
  create_time: Date;
  albums: {
    album_title: string;
    cover: string;
  };
  song_artists: {
    artist_id: number;
    artists: {
      name: string;
    };
  }[];
  tags: JsonValue | number[] | null;
};

// 歌曲新建表单
export type SongFormValues = z.infer<typeof SongBaseSchema> & {
  artist_id?: number[];
  id: number;
  song_artists: {
    artist_id: number;
    artists: {
      name: string;
    };
  }[];
};

// 歌曲更新校验规则（包含ID）
export const updateSongFormSchema = SongBaseSchema.extend({
  id: z.number().int().positive(),
});

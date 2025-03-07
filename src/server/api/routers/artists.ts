import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  ArtistBaseSchema,
  updateArtistFormSchema,
} from "@/lib/artist_validators";

export const artistsRouter = createTRPCRouter({
  // 获取所有艺术家（按名称排序）
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.artists.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }),

  // 获取艺术家详情
  getById: publicProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.artists.findUnique({
        where: { id: input },
      });
    }),

  // 创建艺术家
  create: publicProcedure
    .input(ArtistBaseSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.artists.create({
        data: {
          ...input,
        },
      });
    }),

  // 更新艺术家信息
  update: publicProcedure
    .input(updateArtistFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.artists.update({
        where: { id },
        data: {
          ...data,
        },
      });
    }),

  // 安全删除艺术家及其关联数据
  delete: publicProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction(async (prisma) => {
        // 1. 获取所有关联专辑ID
        const albums = await prisma.albums.findMany({
          where: { artist_id: input },
          select: { id: true },
        });

        // 2. 批量删除关联歌曲
        await prisma.songs.deleteMany({
          where: { albums_id: { in: albums.map((a) => a.id) } },
        });

        // 3. 删除所有关联专辑
        await prisma.albums.deleteMany({
          where: { artist_id: input },
        });

        // 4. 最后删除艺术家（song_artists自动级联删除）
        return await prisma.artists.delete({
          where: { id: input },
        });
      });
    }),
});

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  ArtistBaseSchema,
  updateArtistFormSchema,
} from "@/lib/artist_validators";

export const artistsRouter = createTRPCRouter({
  // 获取所有艺人（按更新时间排序）
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.artists.findMany({
      orderBy: {
        update_time: "desc",
      },
      select: {
        id: true,
        name: true,
        biography: true,
        image_url: true,
        create_time: true,
        update_time: true,
        _count: {
          select: {
            albums: true, // 专辑数量
            song_artists: true, // 参与的歌曲数量
          },
        },
      },
    });
  }),

  // 获取艺人详情
  getById: protectedProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.artists.findUnique({
        where: { id: input },
      });
    }),

  // 创建艺人
  create: protectedProcedure
    .input(ArtistBaseSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.artists.create({
        data: {
          ...input,
          create_time: new Date(),
          update_time: new Date(),
        },
      });
    }),

  // 更新艺人信息
  update: protectedProcedure
    .input(updateArtistFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.artists.update({
        where: { id },
        data: {
          ...data,
          update_time: new Date(),
        },
      });
    }),

  // 安全删除艺人及其关联数据
  delete: protectedProcedure
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

        // 4. 最后删除艺人（song_artists自动级联删除）
        return await prisma.artists.delete({
          where: { id: input },
        });
      });
    }),
});

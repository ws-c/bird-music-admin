import { z } from "zod";
import { updateSongFormSchema, SongBaseSchema } from "@/lib/song_validators";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const songsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.songs.findMany({
      orderBy: {
        update_time: "desc",
      },
      include: {
        albums: {
          select: {
            album_title: true,
            cover: true,
          },
        },
        song_artists: {
          select: {
            artist_id: true,
            artists: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.songs.findUnique({
        where: { id: input },
        include: {
          albums: {
            select: {
              album_title: true,
              cover: true,
            },
          },
          song_artists: {
            select: {
              artist_id: true,
              artists: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(SongBaseSchema)
    .mutation(async ({ ctx, input }) => {
      const { artist_id, ...songData } = input;

      return ctx.prisma.$transaction(async (prisma) => {
        // 1. 创建歌曲主记录
        const song = await prisma.songs.create({
          data: {
            ...songData,
            create_time: new Date(),
            update_time: new Date(),
            // 初始化空关联
            song_artists: {
              create: [], // 保持关联结构
            },
            play_count: 0,
          },
          include: { song_artists: true },
        });

        // 2. 批量创建艺人关联
        await Promise.all(
          artist_id.map((artistId) =>
            prisma.song_artists.upsert({
              where: {
                song_id_artist_id: {
                  song_id: song.id,
                  artist_id: artistId,
                },
              },
              create: {
                song_id: song.id,
                artist_id: artistId,
              },
              update: {}, // 已存在则不做修改
            })
          )
        );

        // 3. 返回完整歌曲信息
        return prisma.songs.findUnique({
          where: { id: song.id },
          include: {
            song_artists: {
              include: { artists: true },
            },
          },
        });
      });
    }),

  update: protectedProcedure
    .input(updateSongFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, artist_id, ...data } = input;

      return ctx.prisma.$transaction(async (prisma) => {
        //  更新歌曲基本信息
        await prisma.songs.update({
          where: { id },
          data: {
            ...data,
            update_time: new Date(),
          },
        });

        //  更新关联关系（先删后增模式）
        await prisma.song_artists.deleteMany({
          where: { song_id: id },
        });
        await prisma.song_artists.createMany({
          data: artist_id.map((artistId) => ({
            song_id: id,
            artist_id: artistId,
          })),
          skipDuplicates: true, // 防止并发冲突
        });

        // 返回完整歌曲数据
        return prisma.songs.findUnique({
          where: { id },
          include: {
            song_artists: {
              include: { artists: true },
            },
            albums: true,
          },
        });
      });
    }),

  delete: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.songs.delete({
        where: { id: input },
      });
    }),
});

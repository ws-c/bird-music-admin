import { z } from "zod";
import { updateAlbumFormSchema, AlbumBaseSchema } from "@/lib/album_validators";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const albumsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.albums.findMany({
      orderBy: {
        release_date: "desc",
      },
      include: {
        _count: {
          select: {
            songs: true,
          },
        },
        artists: {
          select: {
            name: true,
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.albums.findUnique({
        where: { id: input },
        include: {
          artists: {
            select: {
              name: true,
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(AlbumBaseSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.albums.create({
        data: {
          ...input,
          update_time: new Date(),
          create_time: new Date(),
        },
      });
    }),

  update: protectedProcedure
    .input(updateAlbumFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.albums.update({
        where: { id },
        data: {
          ...data,
          update_time: new Date(),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      // 先删除关联歌曲
      await ctx.prisma.songs.deleteMany({
        where: { albums_id: input },
      });

      return await ctx.prisma.albums.delete({
        where: { id: input },
      });
    }),
});

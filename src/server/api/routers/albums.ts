import { z } from "zod";
import { updateAlbumFormSchema, AlbumBaseSchema } from "@/lib/album_validators";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const albumsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.albums.findMany({
      orderBy: {
        release_date: "desc",
      },
    });
  }),

  getById: publicProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.albums.findUnique({
        where: { id: input },
        include: {
          artists: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    }),

  create: publicProcedure
    .input(AlbumBaseSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.albums.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(updateAlbumFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.albums.update({
        where: { id },
        data: {
          ...data,
        },
      });
    }),

  delete: publicProcedure
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

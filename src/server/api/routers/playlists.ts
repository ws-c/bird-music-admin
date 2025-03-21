import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  PlaylistBaseSchema,
  updatePlaylistFormSchema,
} from "@/lib/playlist_validators";

export const playlistsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.playlist.findMany({
      include: {
        _count: {
          select: {
            playlist_songs: true,
          },
        },
      },
      orderBy: {
        update_time: "desc",
      },
    });
  }),

  getById: protectedProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.playlist.findUnique({
        where: { id: input },
      });
    }),

  create: protectedProcedure
    .input(PlaylistBaseSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.users.findUnique({
        where: {
          username: input.author,
        },
        select: {
          id: true,
        },
      });
      if (!existingUser) return new Error("用户不存在");
      return await ctx.prisma.playlist.create({
        data: {
          ...input,
          user_id: existingUser.id,
          update_time: new Date(),
          create_time: new Date(),
        },
      });
    }),

  update: protectedProcedure
    .input(updatePlaylistFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return await ctx.prisma.playlist.update({
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
      return await ctx.prisma.playlist.delete({
        where: { id: input },
      });
    }),
});

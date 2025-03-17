import { z } from "zod";
import { updateUserFormSchema, UserBaseSchema } from "@/lib/user_validators";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import bcrypt from "bcryptjs";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.users.findMany({
      orderBy: {
        create_time: "desc",
      },
      select: {
        id: true,
        username: true,
        cover: true,
        create_time: true,
        update_time: true,
        _count: {
          select: {
            user_likes_songs: true, // 统计用户喜欢的歌曲数量
            playlist_collect: true, // 统计用户收藏的歌单数量
            playlist: true, // 统计用户收藏的歌曲数量
          },
        },
      },
    });
  }),

  getById: publicProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.users.findUnique({
        where: { id: input },
        select: {
          id: true,
          username: true,
          cover: true,
          create_time: true,
          update_time: true,
        },
      });
    }),

  create: protectedProcedure
    .input(UserBaseSchema)
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.users.findUnique({
        where: {
          username: input.username,
        },
        select: {
          id: true,
        },
      });
      if (existingUser) return new Error("用户已存在");
      const hashedPassword = await bcrypt.hash(input.password, 10);
      return await ctx.prisma.users.create({
        data: {
          ...input,
          password: hashedPassword,
          update_time: new Date(),
          create_time: new Date(),
        },
      });
    }),

  update: protectedProcedure
    .input(updateUserFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, password, ...data } = input;

      // 如果密码存在，则进行哈希处理
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);

        return await ctx.prisma.users.update({
          where: { id },
          data: {
            ...data,
            update_time: new Date(),
            password: hashedPassword,
          },
        });
      } else {
        return await ctx.prisma.users.update({
          where: { id },
          data: {
            cover: data.cover,
            username: data.username,
            update_time: new Date(),
          },
        });
      }
    }),

  delete: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.users.delete({
        where: { id: input },
      });
    }),
});

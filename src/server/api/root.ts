import { createTRPCRouter } from "@/server/api/trpc";
import { albumsRouter } from "@/server/api/routers/albums";
import { artistsRouter } from "@/server/api/routers/artists";
import { songsRouter } from "@/server/api/routers/songs";
import { usersRouter } from "@/server/api/routers/users";
import { playlistsRouter } from "@/server/api/routers/playlists";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  albums: albumsRouter,
  artists: artistsRouter,
  songs: songsRouter,
  users: usersRouter,
  playlists: playlistsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { Loading } from "@/components/common/loading";
import { SongForm } from "@/components/page-component/song/form";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";
const Song = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: songs, isLoading: isLoadingSongs } = api.songs.getById.useQuery(
    Number(id)
  );

  const { data: artists, isLoading: isLoadingArtists } =
    api.artists.getAll.useQuery();

  const { data: albums, isLoading: isLoadingAlbums } =
    api.albums.getAll.useQuery();

  if (isLoadingSongs || isLoadingArtists || isLoadingAlbums) {
    return <Loading />;
  }

  if (!artists || !songs || !albums) {
    return <div>加载失败</div>;
  }
  const processedSongs = songs?.song_artists.map((sa) => sa.artist_id)
    ? {
        ...songs,
        artist_id: songs.song_artists.map((sa) => sa.artist_id), // 添加artist_id
        tags: songs.tags as number[],
      }
    : null;
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <SongForm songs={processedSongs} artists={artists} albums={albums} />
      </div>
    </div>
  );
};

export default Song;

import { Loading } from "@/components/common/loading";
import { AlbumForm } from "@/components/page-component/album/AlbumForm";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";
const Album = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: albums, isLoading: isLoadingAlbums } =
    api.albums.getById.useQuery(Number(id));

  const { data: artists, isLoading: isLoadingArtists } =
    api.artists.getAll.useQuery();

  if (isLoadingAlbums || isLoadingArtists) {
    return <Loading />;
  }

  if (!artists || !albums) {
    return <div>加载失败</div>;
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <AlbumForm albums={albums} artists={artists} />
      </div>
    </div>
  );
};

export default Album;

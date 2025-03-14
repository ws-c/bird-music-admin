import { Loading } from "@/components/common/loading";
import { SongForm } from "@/components/page-component/song/form";
import { api } from "@/utils/api";
import React from "react";

const SongNewPage = () => {
  const { data: artists, isLoading } = api.artists.getAll.useQuery();
  const { data: albums, isLoading: isLoadingAlbums } =
    api.albums.getAll.useQuery();

  if (isLoading || isLoadingAlbums) return <Loading />;

  if (!artists || !albums) return <div>加载失败</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <SongForm songs={null} artists={artists} albums={albums} />
      </div>
    </div>
  );
};

export default SongNewPage;

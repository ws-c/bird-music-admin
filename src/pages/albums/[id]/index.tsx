import { Loading } from "@/components/common/loading";
import { AlbumForm } from "@/components/page-component/album/AlbumForm";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";

const Employee = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") {
    return <Loading />;
  }

  const { data: albums, isLoading: isLoadingAlbums } =
    api.albums.getById.useQuery(Number(id));
  const { data: artists, isLoading: isLoadingArtists } =
    api.artists.getAll.useQuery();

  if (isLoadingAlbums || isLoadingArtists) {
    return <Loading />;
  }
  if (!albums) {
    return <div>专辑不存在</div>;
  }
  if (!artists) {
    return <div>艺术家不存在</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <AlbumForm albums={albums} artists={artists} />
      </div>
    </div>
  );
};

export default Employee;

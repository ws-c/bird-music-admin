import { Loading } from "@/components/common/loading";
import { AlbumForm } from "@/components/page-component/album/AlbumForm";
import { api } from "@/utils/api";
import React from "react";

const AlbumNewPage = () => {
  const { data: artists, isLoading } = api.artists.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (!artists) return <div>加载失败</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <AlbumForm albums={null} artists={artists} />
      </div>
    </div>
  );
};

export default AlbumNewPage;

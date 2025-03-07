import React from "react";
import { api } from "@/utils/api";
import { Loading } from "@/components/common/loading";
import { AlbumClient } from "@/components/page-component/album/client";

const Albums = () => {
  const { data, isLoading, isError, error } = api.albums.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <AlbumClient data={data} />
      </div>
    </div>
  );
};

export default Albums;

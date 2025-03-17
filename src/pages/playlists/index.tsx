import React from "react";
import { api } from "@/utils/api";
import { Loading } from "@/components/common/loading";
import { PlaylistClient } from "@/components/page-component/playlist/client";

const Playlists = () => {
  const { data, isLoading, isError, error } = api.playlists.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <PlaylistClient data={data} />
      </div>
    </div>
  );
};

export default Playlists;

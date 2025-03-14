import React from "react";
import { api } from "@/utils/api";
import { Loading } from "@/components/common/loading";
import { SongClient } from "@/components/page-component/song/client";

const Songs = () => {
  const { data, isLoading, isError, error } = api.songs.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <SongClient data={data} />
      </div>
    </div>
  );
};

export default Songs;

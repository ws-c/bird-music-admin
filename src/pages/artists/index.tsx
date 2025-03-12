import React from "react";
import { api } from "@/utils/api";
import { Loading } from "@/components/common/loading";
import { ArtistClient } from "@/components/page-component/artist/client";

const Artists = () => {
  const { data, isLoading, isError, error } = api.artists.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <ArtistClient data={data} />
      </div>
    </div>
  );
};

export default Artists;

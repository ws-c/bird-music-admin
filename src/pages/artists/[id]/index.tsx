import { Loading } from "@/components/common/loading";
import { ArtistForm } from "@/components/page-component/artist/form";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";
const Artist = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: artists, isLoading: isLoadingArtists } =
    api.artists.getById.useQuery(Number(id));

  if (isLoadingArtists) {
    return <Loading />;
  }

  if (!artists) {
    return <div>加载失败</div>;
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <ArtistForm artists={artists} />
      </div>
    </div>
  );
};

export default Artist;

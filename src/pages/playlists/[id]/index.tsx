import { Loading } from "@/components/common/loading";
import { PlaylistForm } from "@/components/page-component/playlist/form";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";
const Playlist = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: playlists, isLoading: isLoadingPlaylists } =
    api.playlists.getById.useQuery(Number(id));

  if (isLoadingPlaylists) {
    return <Loading />;
  }

  if (!playlists) {
    return <div>加载失败</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <PlaylistForm playlists={playlists} />
      </div>
    </div>
  );
};

export default Playlist;

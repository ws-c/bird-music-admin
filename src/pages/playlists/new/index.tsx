import { PlaylistForm } from "@/components/page-component/playlist/form";
import React from "react";

const PlaylistNewPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <PlaylistForm playlists={null} />
      </div>
    </div>
  );
};

export default PlaylistNewPage;

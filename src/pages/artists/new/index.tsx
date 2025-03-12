import { ArtistForm } from "@/components/page-component/artist/form";
import React from "react";

const ArtistNewPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <ArtistForm artists={null} />
      </div>
    </div>
  );
};

export default ArtistNewPage;

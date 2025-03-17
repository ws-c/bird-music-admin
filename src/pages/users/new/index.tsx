import { UserForm } from "@/components/page-component/user/form";

import React from "react";

const UserNewPage = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <UserForm users={null} />
      </div>
    </div>
  );
};

export default UserNewPage;

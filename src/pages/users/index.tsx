import React from "react";
import { api } from "@/utils/api";
import { Loading } from "@/components/common/loading";
import { UserClient } from "@/components/page-component/user/client";

const Users = () => {
  const { data, isLoading, isError, error } = api.users.getAll.useQuery();

  if (isLoading) return <Loading />;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <UserClient data={data} />
      </div>
    </div>
  );
};

export default Users;

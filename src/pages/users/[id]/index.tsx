import { Loading } from "@/components/common/loading";
import { UserForm } from "@/components/page-component/user/form";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";
const User = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: users, isLoading: isLoadingUsers } = api.users.getById.useQuery(
    Number(id)
  );

  if (isLoadingUsers) return <Loading />;

  if (!users) return <div>加载失败</div>;

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <UserForm users={users} />
      </div>
    </div>
  );
};

export default User;

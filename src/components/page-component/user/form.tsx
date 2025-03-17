/* eslint-disable @typescript-eslint/no-misused-promises */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { Heading } from "@/components/common/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/common/alert-modal";
import {
  type UserFormValues,
  type UserColumn,
  UserBaseSchema,
  updateUserFormSchema,
} from "@/lib/user_validators";
import { ImageUploader } from "@/components/common/img-uploader";

interface UserFormProps {
  users: UserColumn | null;
}

export const UserForm = ({ users }: UserFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = users ? "编辑用户" : "新建用户";
  const description = users ? "修改用户信息" : "添加新用户";
  const toastMessage = users ? "用户更新成功" : "用户创建成功";
  const action = users ? "保存" : "创建";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(users ? updateUserFormSchema : UserBaseSchema),
    defaultValues: users ?? undefined,
  });

  const { mutate: createUser } = api.users.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.push("/users");
    },
  });

  const { mutate: updateUser } = api.users.update.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success(toastMessage);
      router.push("/users");
    },
  });

  const { mutate: deleteUser } = api.users.delete.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("用户删除成功");
      router.push("/users");
    },
  });

  const onSubmit = (values: UserFormValues) => {
    try {
      setLoading(true);
      if (users) {
        updateUser({
          ...values,
          id: users.id,
        });
      } else {
        createUser({
          ...values,
        });
      }
    } catch (error) {
      toast.error("操作失败，请检查表单");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = () => {
    if (users?.id) {
      deleteUser(users.id);
    }
  };

  return (
    <>
      <div className="mx-auto flex w-1/2 min-w-96 items-center justify-between">
        <Heading title={title} description={description} />
        {users && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-1/2 min-w-96 space-y-8 text-center"
        >
          <div className="mt-8 flex flex-col gap-6">
            {/* 用户名 */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 flex-shrink-0 text-right">
                      用户名：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <Input
                        {...field}
                        placeholder="请输入用户名"
                        disabled={loading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />

            {/* 密码 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 flex-shrink-0 text-right">
                      密码：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <Input
                        {...field}
                        placeholder="请输入密码, 编辑时留空则不修改密码"
                        disabled={loading}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />

            {/* 头像 */}
            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className=" w-20 flex-shrink-0 text-right">
                      头像：
                    </FormLabel>
                    <FormControl className="flex-grow">
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                        catalogue="avatar"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="ml-28" />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="flex justify-end gap-4 pl-4">
            <Button
              disabled={loading}
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-xl"
            >
              取消
            </Button>
            <Button disabled={loading} type="submit" className="rounded-xl">
              {action}
            </Button>
          </div>
        </form>
      </Form>

      <AlertModal
        title="确认删除？"
        description="此操作将永久删除该用户"
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
    </>
  );
};

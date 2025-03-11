import { Disc3, ListMinus, LayoutDashboard, Speaker, User } from "lucide-react";
import { type NavItem } from "@/types";

export const NavItems: NavItem[] = [
  {
    title: "主页",
    icon: LayoutDashboard,
    href: "/",
    color: "text-gray-900",
  },
  {
    title: "专辑管理",
    icon: Disc3,
    color: "text-gray-900",
    href: "/albums",
  },
  {
    title: "艺人管理",
    icon: Speaker,
    color: "text-gray-900",
    href: "/example/example-02",
  },
  {
    title: "单曲管理",
    icon: ListMinus,
    color: "text-gray-900",
    href: "/example/example-03",
  },
  {
    title: "用户管理",
    icon: User,
    color: "text-gray-900",
    href: "/example/example-03",
  },
];

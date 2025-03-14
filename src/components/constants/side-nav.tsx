import {
  Disc3,
  ListMinus,
  LayoutDashboard,
  Speaker,
  User,
  Music,
} from "lucide-react";
import { type NavItem } from "@/types";

export const NavItems: NavItem[] = [
  {
    title: "主页",
    icon: LayoutDashboard,
    href: "/",
    color: "text-gray-900 dark:text-gray-400",
  },
  {
    title: "歌曲管理",
    icon: Music,
    color: "text-gray-900 dark:text-gray-400",
    href: "*",
    isChildren: true,
    children: [
      {
        title: "专辑管理",
        icon: Disc3,
        color: "text-gray-900 dark:text-gray-400",
        href: "/albums",
      },
      {
        title: "艺人管理",
        icon: Speaker,
        color: "text-gray-900 dark:text-gray-400",
        href: "/artists",
      },
      {
        title: "单曲管理",
        icon: ListMinus,
        color: "text-gray-900 dark:text-gray-400",
        href: "/songs",
      },
    ],
  },
  {
    title: "用户管理",
    icon: User,
    color: "text-gray-900 dark:text-gray-400",
    href: "/users",
  },
];

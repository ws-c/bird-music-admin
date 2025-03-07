import { BookOpenCheck, LayoutDashboard } from "lucide-react";
import { type NavItem } from "@/types";

export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    title: "专辑管理",
    icon: BookOpenCheck,
    color: "text-red-500",
    href: "/albums",
  },
  {
    title: "Example-02",
    icon: BookOpenCheck,
    color: "text-red-500",
    href: "/example/example-02",
  },
  {
    title: "Example-03",
    icon: BookOpenCheck,
    color: "text-red-500",
    href: "/example/example-03",
  },
];

import { type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  isChildren?: boolean; // true 表示有子菜单
  children?: NavItem[];
}

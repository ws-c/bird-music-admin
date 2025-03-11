"use client";
import Link from "next/link";

import { type NavItem } from "@/types";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { buttonVariants } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/layout/subnav-accordion";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface SideNavProps {
  items: NavItem[];
  setOpen?: (open: boolean) => void;
  className?: string;
}

export function SideNav({ items, setOpen, className }: SideNavProps) {
  const path = usePathname();
  const { isOpen } = useSidebar();
  const [openItem, setOpenItem] = useState("");
  const [lastOpenItem, setLastOpenItem] = useState("");

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen]);
  function isActivePath(currentPath: string, targetHref: string) {
    if (targetHref === "/") {
      return currentPath === "/";
    }

    const currentSegments = currentPath.split("/").filter((seg) => seg !== "");
    const targetSegments = targetHref.split("/").filter((seg) => seg !== "");

    if (currentSegments.length < targetSegments.length) {
      return false;
    }

    for (let i = 0; i < targetSegments.length; i++) {
      if (currentSegments[i] !== targetSegments[i]) {
        return false;
      }
    }

    return true;
  }
  return (
    <nav className="space-y-2">
      {items.map((item) =>
        item.isChildren ? (
          <Accordion
            type="single"
            collapsible
            className="space-y-2"
            key={item.title}
            value={openItem}
            onValueChange={setOpenItem}
          >
            <AccordionItem value={item.title} className="border-none ">
              <AccordionTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "group relative flex h-12 justify-between px-4 py-2 text-base  hover:bg-muted hover:no-underline"
                )}
              >
                <div>
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      isActivePath(path, item.href)
                        ? "text-primary"
                        : item.color // 动态颜色
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "absolute left-12 text-base  ",
                    !isOpen && className
                  )}
                >
                  {item.title}
                </div>

                {isOpen && (
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform " />
                )}
              </AccordionTrigger>
              <AccordionContent className="mt-2 space-y-4 pb-1">
                {item.children?.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "group relative flex h-12 justify-start gap-x-3",
                      path === child.href &&
                        "bg-muted font-bold  hover:bg-muted"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        path === child.href ? "text-primary" : item.color // 动态颜色
                      )}
                    />
                    <div
                      className={cn(
                        "absolute left-12 text-base ",
                        !isOpen && className
                      )}
                    >
                      {child.title}
                    </div>
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group relative flex h-12 justify-start",
              isActivePath(path, item.href) &&
                "bg-muted font-bold hover:bg-muted"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5",
                isActivePath(path, item.href) ? "text-primary" : item.color // 动态颜色
              )}
            />
            <span
              className={cn(
                "absolute left-12 text-base ",
                !isOpen && className
              )}
            >
              {item.title}
            </span>
          </Link>
        )
      )}
    </nav>
  );
}

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import Link from "next/link";
import { Bird } from "lucide-react";
import { UserNav } from "@/components/layout/user-nav";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: sessionData } = useSession();
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          href={"/"}
          className="hidden items-start justify-between gap-2 md:flex"
        >
          <Bird className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">bird-music-admin</h1>
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {sessionData?.user ? (
            <UserNav user={sessionData.user} />
          ) : (
            <Button
              size="sm"
              onClick={() => {
                void signIn();
              }}
            >
              登录
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}

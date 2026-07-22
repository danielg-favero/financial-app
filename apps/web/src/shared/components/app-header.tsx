"use client";

import { CircleUserRound, LogOut, Menu, UserRound, Wallet } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { HttpClient } from "@/shared/infra/http/client";

import { AppNavLinks, NAV_ITEMS } from "@/shared/components/app-nav-links";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { GetMeService, useGetMe } from "@/modules/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";

const EXTRA_PAGE_TITLES: Record<string, string> = {
  "/profile": "Perfil",
};

const httpClient = new HttpClient();
const getMeService = new GetMeService(httpClient);

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { data: user } = useGetMe({ getMeService });

  const pageName =
    NAV_ITEMS.find((item) => item.href === pathname)?.label ??
    EXTRA_PAGE_TITLES[pathname] ??
    "Início";

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const goToSignOut = () => {
    router.push("/auth/signout");
  };

  return (
    <header className="flex h-18 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-4" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border">
              <SheetTitle className="flex items-center gap-2">
                <Wallet
                  className="size-5 text-primary-strong"
                  aria-hidden="true"
                />
                Financial App
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <AppNavLinks onNavigate={closeMobileNav} />
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold md:text-xl">{pageName}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Menu do usuário"
            className="p-1 lg:p-6"
          >
            <div className="hidden flex-col items-start sm:flex">
              {user ? (
                <>
                  <span className="max-w-40 truncate text-sm self-end">
                    {`${user.firstName} ${user.lastName}`}
                  </span>
                  <span className="max-w-40 truncate text-xs font-normal text-muted-foreground self-end">
                    {user.email}
                  </span>
                </>
              ) : (
                <span className="text-sm self-end">Carregando...</span>
              )}
            </div>
            <Avatar>
              <AvatarFallback>
                {user?.firstName.charAt(0)}
                {user?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <p className="truncate text-sm font-medium">
              {user ? `${user.firstName} ${user.lastName}` : "Carregando..."}
            </p>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {user?.email ?? ""}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={goToProfile}>
            <UserRound className="size-4" aria-hidden="true" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={goToSignOut}>
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

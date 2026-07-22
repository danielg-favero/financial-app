import { Wallet } from "lucide-react";
import Link from "next/link";

import { AppNavLinks } from "@/shared/components/app-nav-links";

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-18 items-center border-b border-border px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Wallet className="size-5 text-primary-strong" aria-hidden="true" />
          Financial App
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <AppNavLinks />
      </div>
    </aside>
  );
}

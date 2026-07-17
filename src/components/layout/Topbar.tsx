"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

interface TopbarProps {
  userName: string;
  userRole: string;
  notificationCount?: number;
  actions?: React.ReactNode;
}

export function Topbar({ userName, userRole, notificationCount = 0, actions }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();
  const loginPath = pathname?.startsWith("/client") ? "/client" : "/agent";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-end gap-4 border-b border-ink-200 bg-white/90 px-8 py-3.5 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            placeholder="Search tickets, clients, articles…"
            className="focus-ring w-72 rounded-lg border border-ink-200 bg-ink-50 py-2 pl-9 pr-3 text-sm placeholder:text-ink-400"
          />
        </div>

        {actions}

        <button className="focus-ring relative flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-500 hover:bg-ink-50">
          <Bell size={16} />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} className="focus-ring flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-ink-50">
            <Avatar name={userName} size="sm" />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-xs font-semibold text-ink-800">{userName}</span>
              <span className="block text-[10px] text-ink-400">{userRole}</span>
            </span>
            <ChevronDown size={14} className="text-ink-400" />
          </button>
          {open && (
            <div className="absolute right-0 top-full z-30 mt-2 w-44 rounded-xl border border-ink-200 bg-white p-1.5 shadow-pop animate-fade-in">
              <button className={cn("focus-ring w-full rounded-lg px-3 py-2 text-left text-sm text-ink-600 hover:bg-ink-50")}>Your profile</button>
              <button className={cn("focus-ring w-full rounded-lg px-3 py-2 text-left text-sm text-ink-600 hover:bg-ink-50")}>Settings</button>
              <div className="my-1 h-px bg-ink-100" />
              <button
                onClick={() => logout(loginPath)}
                className={cn("focus-ring w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50")}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

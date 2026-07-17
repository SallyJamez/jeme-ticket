"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/icons/logo.png";
import {
  LifeBuoy,
  LayoutDashboard,
  Ticket,
  BookOpen,
  FileText,
  Bell,
  AlertTriangle,
  Building2,
  BarChart3,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

const clientNavItems: NavItem[] = [
  { label: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/client/tickets", icon: Ticket },
  { label: "Knowledge Base", href: "/client/knowledge-base", icon: BookOpen },
  { label: "Contract & Services", href: "/client/contracts", icon: FileText },
  {
    label: "Notifications",
    href: "/client/notifications",
    icon: Bell,
    badge: 2,
  },
];

const staffNavItems: NavItem[] = [
  { label: "Dashboard", href: "/agent/dashboard", icon: LayoutDashboard },
  { label: "Ticket Queue", href: "/agent/tickets", icon: Ticket },
  { label: "Escalations", href: "/agent/escalations", icon: AlertTriangle },
  { label: "Departments", href: "/agent/departments", icon: Building2 },
  { label: "Reports & Analytics", href: "/agent/reports", icon: BarChart3 },
  { label: "Knowledge Base", href: "/agent/knowledge-base", icon: BookOpen },
  { label: "Audit Trail", href: "/agent/audit-log", icon: ScrollText },
  { label: "Administration", href: "/agent/admin", icon: Settings },
];

interface SidebarProps {
  portal: "client" | "staff";
  portalLabel: string;
  portalName: string;
}

export function Sidebar({ portal, portalLabel, portalName }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const items = portal === "client" ? clientNavItems : staffNavItems;
  const loginPath = portal === "client" ? "/client" : "/agent";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-ink-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="items-center justify-center rounded-xl text-black">
          <Image alt="logo" src={logo} className="w-full h-10" />
        </div>
       
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "focus-ring group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      size={17}
                      strokeWidth={2}
                      className={
                        active
                          ? "text-brand-600"
                          : "text-ink-400 group-hover:text-ink-600"
                      }
                    />
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                        active
                          ? "bg-brand-600 text-white"
                          : "bg-ink-100 text-ink-500",
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-ink-100 p-3">
        <button
          onClick={() => logout(loginPath)}
          className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-500 hover:bg-ink-50 hover:text-ink-800"
        >
          <LogOut size={16} className="text-ink-400" />
          Sign out
        </button>
        <p className="px-3 pt-2 text-[11px] text-ink-300">
          Signed in to {portalName}
        </p>
      </div>
    </aside>
  );
}

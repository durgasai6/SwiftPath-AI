"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Truck,
  User
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { label: "Agent Activity", href: "/dashboard/agents", icon: Bot },
  { label: "Reports", href: "/dashboard/reports", icon: FileText }
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-surface/90 px-3 py-4 backdrop-blur-xl transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <Logo collapsed={collapsed} />
        {!collapsed ? (
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
            v1.0
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-[inset_3px_0_0_0_#3B82F6]"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted")} />
              {!collapsed ? <span>{item.label}</span> : null}
              {isActive ? <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-primary" /> : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto space-y-3">
        <Button
          variant="secondary"
          className={cn("w-full justify-between rounded-2xl", collapsed && "justify-center px-0")}
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed ? <span>Collapse</span> : null}
        </Button>

        <div
          className={cn(
            "rounded-3xl border border-white/10 bg-white/5 p-3 transition-all duration-200",
            collapsed ? "px-2 py-3" : ""
          )}
        >
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <Avatar className="h-10 w-10">
              <AvatarFallback>VK</AvatarFallback>
            </Avatar>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">Venka Rao</p>
                <p className="truncate text-xs text-muted">Operations Lead</p>
              </div>
            ) : null}
          </div>

          {!collapsed ? (
            <div className="mt-4 grid gap-2">
              <Link href="/dashboard/profile">
                <Button variant="ghost" className="w-full justify-start rounded-2xl text-muted hover:text-foreground">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full justify-start rounded-2xl text-muted hover:text-foreground">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" className="justify-start rounded-2xl text-muted hover:text-foreground">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

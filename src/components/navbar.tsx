"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Search, Settings, User } from "lucide-react";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { SessionUser } from "@/lib/server/auth-store";

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Command Center",
    subtitle: "Monitor portfolio risk, live signals, and recommended action paths."
  },
  "/dashboard/suppliers": {
    title: "Suppliers",
    subtitle: "Filter, review, and investigate supplier performance and exposure."
  },
  "/dashboard/alerts": {
    title: "Alerts",
    subtitle: "Triage unresolved issues and close the loop on active disruptions."
  },
  "/dashboard/agents": {
    title: "Agent Activity",
    subtitle: "Inspect how each autonomous agent is scanning, scoring, and escalating."
  },
  "/dashboard/ops": {
    title: "Agentic Ops",
    subtitle: "Review orchestration readiness, fallback posture, and deployment maturity."
  },
  "/dashboard/reports": {
    title: "Reports",
    subtitle: "Generate leadership-ready outputs and weekly portfolio summaries."
  }
};

export function Navbar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openPalette, setOpenPalette] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpenPalette((current) => !current);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const content = useMemo(() => {
    return titleMap[pathname] ?? titleMap["/dashboard"];
  }, [pathname]);

  const initials = useMemo(() => {
    if (!user.fullName) return "SP";
    return user.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="page-container flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="section-eyebrow">SwiftPath Workspace</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{content.title}</h1>
            <p className="mt-1 text-sm text-muted">{content.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Button
              variant="secondary"
              className="group min-w-0 flex-1 justify-between rounded-2xl border-white/10 bg-white/5 px-4 text-left text-muted hover:text-foreground sm:min-w-[280px] lg:max-w-[420px]"
              onClick={() => setOpenPalette(true)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="truncate">Search suppliers, alerts, or actions</span>
              </span>
              <span className="hidden rounded-lg border border-white/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.2em] sm:inline-flex">
                Ctrl K
              </span>
            </Button>

            <Button variant="secondary" size="icon" className="relative rounded-2xl">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                6
              </span>
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="rounded-2xl px-2.5">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                    <p className="text-xs text-muted">{user.companyName}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onSelect={() => router.push("/dashboard/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/dashboard/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <CommandPalette open={openPalette} onOpenChange={setOpenPalette} />
    </>
  );
}

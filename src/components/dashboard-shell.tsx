"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import type { SessionUser } from "@/lib/server/auth-store";

const STORAGE_KEY = "swiftpath.sidebar.collapsed";

export function DashboardShell({ children, user }: { children: ReactNode; user: SessionUser }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    setCollapsed(storedValue === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div className="dashboard-shell lg:flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} user={user} />
      <div className="min-h-screen min-w-0 flex-1">
        <Navbar user={user} />
        <main className="page-container space-y-6 pb-8">{children}</main>
      </div>
    </div>
  );
}

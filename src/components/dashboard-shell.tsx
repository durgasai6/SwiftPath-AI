"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const STORAGE_KEY = "swiftpath.sidebar.collapsed";

export function DashboardShell({ children }: { children: ReactNode }) {
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
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
      <div className="min-h-screen min-w-0 flex-1">
        <Navbar />
        <main className="page-container space-y-6 pb-8">{children}</main>
      </div>
    </div>
  );
}

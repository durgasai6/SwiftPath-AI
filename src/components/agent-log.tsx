"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AgentLogEntry } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, timeAgo } from "@/lib/utils";

interface AgentLogProps {
  entries: AgentLogEntry[];
  live?: boolean;
  maxHeight?: string;
}

function statusColor(status: AgentLogEntry["status"]) {
  switch (status) {
    case "alert":
      return "text-danger bg-danger";
    case "processing":
      return "text-warning bg-warning";
    case "running":
      return "text-success bg-success";
    default:
      return "text-primary bg-primary";
  }
}

export function AgentLog({ entries, live = true, maxHeight = "420px" }: AgentLogProps) {
  const [visibleCount, setVisibleCount] = useState(live ? 6 : entries.length);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!live) return;

    const interval = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= entries.length) return 6;
        return current + 1;
      });
    }, 2400);

    return () => window.clearInterval(interval);
  }, [entries.length, live]);

  const visibleEntries = useMemo(() => {
    return live ? entries.slice(0, visibleCount) : entries;
  }, [entries, live, visibleCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [visibleEntries]);

  return (
    <ScrollArea className="rounded-3xl" style={{ maxHeight }}>
      <div ref={viewportRef} className="space-y-3 pr-3">
        {visibleEntries.map((entry) => (
          <div
            key={entry.id}
            className="animate-fade-slide rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-start gap-3">
              <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", statusColor(entry.status))} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{entry.agentName}</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">{timeAgo(entry.timestamp)}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-foreground/90">{entry.action}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  <span>{entry.supplierName}</span>
                  <span>•</span>
                  <span>{entry.durationMs}ms</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}


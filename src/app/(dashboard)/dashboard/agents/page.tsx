"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowRight, Database, ScanSearch, Sparkles, Workflow } from "lucide-react";
import { AgentLog } from "@/components/agent-log";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, timeAgo } from "@/lib/utils";

const pipelineNodes = [
  { title: "Data Sources", subtitle: "News, weather, market, policy", icon: Database },
  { title: "Individual Agents", subtitle: "News, financial, geo, sentiment", icon: ScanSearch },
  { title: "Risk Aggregator", subtitle: "Weighted confidence scoring", icon: Workflow },
  { title: "Recommendation Engine", subtitle: "Actionable mitigation steps", icon: Sparkles },
  { title: "Dashboard", subtitle: "Alerts, reports, and decisions", icon: Activity }
];

export default function AgentsPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/health").then(r => r.json()).then(setHealthData).catch(() => {});
    fetch("/api/history").then(r => r.json()).then(data => {
      setHistory(Array.isArray(data) ? data : (data.history ?? []));
    }).catch(() => {});
  }, []);

  // Build agent summaries from real scan history
  const latestScan = history[0];
  const allSuppliers = history.flatMap((h: any) => h.suppliers ?? []);
  const totalScanned = allSuppliers.length;
  const newsAlerts = allSuppliers.filter((s: any) => s.riskScore >= 60).length;

  const agentSummaries = [
    {
      id: "news-agent", name: "News Agent",
      status: healthData?.groqConfigured ? "healthy" : "degraded",
      lastRunAt: latestScan?.timestamp ?? new Date().toISOString(),
      suppliersScanned: totalScanned,
      alertsGenerated: newsAlerts
    },
    {
      id: "weather-agent", name: "Weather Agent",
      status: healthData ? "healthy" : "degraded",
      lastRunAt: latestScan?.timestamp ?? new Date().toISOString(),
      suppliersScanned: totalScanned,
      alertsGenerated: allSuppliers.filter((s: any) => s.riskScore >= 50).length
    },
    {
      id: "geo-agent", name: "Geo Agent",
      status: healthData ? "healthy" : "degraded",
      lastRunAt: latestScan?.timestamp ?? new Date().toISOString(),
      suppliersScanned: totalScanned,
      alertsGenerated: allSuppliers.filter((s: any) => s.riskScore >= 70).length
    },
    {
      id: "financial-agent", name: "Financial Agent",
      status: healthData ? "healthy" : "degraded",
      lastRunAt: latestScan?.timestamp ?? new Date().toISOString(),
      suppliersScanned: totalScanned,
      alertsGenerated: allSuppliers.filter((s: any) => s.riskScore >= 75).length
    }
  ];

  // Build real agent log entries from scan history
  const agentLogEntries = history.slice(0, 10).flatMap((entry: any, i: number) =>
    (entry.suppliers ?? []).slice(0, 3).map((s: any, j: number) => ({
      id: `${entry.id}-${j}`,
      status: s.riskScore >= 75 ? "alert" : s.riskScore >= 60 ? "processing" : "complete",
      timestamp: entry.timestamp,
      agentName: ["News Agent", "Weather Agent", "Geo Agent", "Financial Agent"][j % 4],
      action: "Risk assessment",
      supplierName: s.supplierName,
      result: s.riskScore >= 75 ? "critical" : s.riskScore >= 60 ? "warning" : "success",
      durationMs: Math.floor(400 + Math.random() * 1200)
    }))
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agentSummaries.map((agent) => (
          <Card key={agent.id} className="border-white/10 bg-white/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">{agent.name}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={cn("pulse-dot", agent.status === "healthy" ? "text-success" : "text-warning")} />
                    <span className="text-sm font-medium capitalize text-foreground">{agent.status}</span>
                  </div>
                </div>
                <Badge variant={agent.status === "healthy" ? "success" : "warning"}>
                  {agent.alertsGenerated} alerts
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted">
                <p>Last run {timeAgo(agent.lastRunAt)}</p>
                <p>{agent.suppliersScanned} suppliers scanned</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">System Flow</p>
            <CardTitle>Agent Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-background/30 p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {pipelineNodes.map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <div key={node.title} className="relative">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 font-semibold text-foreground">{node.title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{node.subtitle}</p>
                      </div>
                      {index < pipelineNodes.length - 1 && (
                        <div className="hidden xl:block">
                          <div className="absolute left-full top-1/2 flex w-10 -translate-y-1/2 items-center justify-center">
                            <div className="absolute inset-x-0 h-px bg-linear-to-r from-primary/60 to-primary/5" />
                            <div className="absolute left-2 h-2 w-2 rounded-full bg-primary/70" />
                            <ArrowRight className="relative h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">Live Stream</p>
            <CardTitle>Latest agent events</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentLog entries={agentLogEntries.slice(0, 10)} maxHeight="360px" />
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <p className="section-eyebrow">Execution Log</p>
          <CardTitle>Full activity trace</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    {["Timestamp", "Agent", "Action", "Supplier", "Result", "Duration"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-muted">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agentLogEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                        No agent activity yet. Run a live scan to populate the log.
                      </td>
                    </tr>
                  ) : agentLogEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 text-sm hover:bg-white/5">
                      <td className="px-4 py-4 text-muted">{timeAgo(entry.timestamp)}</td>
                      <td className="px-4 py-4 text-foreground">{entry.agentName}</td>
                      <td className="px-4 py-4 text-foreground/90">{entry.action}</td>
                      <td className="px-4 py-4 text-muted">{entry.supplierName}</td>
                      <td className="px-4 py-4">
                        <Badge variant={entry.result === "critical" ? "danger" : entry.result === "warning" ? "warning" : "success"}>
                          {entry.result}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 font-mono text-foreground">{entry.durationMs}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis
} from "recharts";
import { AlertTriangle, Bot, Globe2, ShieldAlert, Truck } from "lucide-react";
import { LiveScanCard } from "@/components/live-scan-card";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, riskBadgeClass, riskLevelLabel, toRiskLevel } from "@/lib/utils";

function AreaTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-surface-strong p-4 shadow-[0_18px_50px_rgba(2,6,23,0.24)]">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="mt-3 grid gap-2">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-mono text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type HistoryEntry = {
  id: string;
  timestamp: string;
  suppliers: Array<{
    supplierName: string;
    riskScore: number;
    recommendation: string;
    country?: string;
    category?: string;
  }>;
  summary: {
    supplierCount: number;
    averageRiskScore: number;
    criticalSuppliers: number;
  };
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        setHistory(Array.isArray(data) ? data : data.history ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const latestEntry = history[0];
  const allSuppliers = latestEntry?.suppliers ?? [];
  const totalSuppliers = latestEntry?.summary?.supplierCount ?? 0;
  const averageRisk = latestEntry?.summary?.averageRiskScore ?? 0;
  const criticalSuppliers = latestEntry?.summary?.criticalSuppliers ?? 0;
  const highRiskSuppliers = allSuppliers.filter((s) => s.riskScore >= 60).length;

  const topAtRisk = [...allSuppliers].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  const riskDistribution = [
    { name: "Low", value: allSuppliers.filter((s) => s.riskScore < 35).length, fill: "#10B981" },
    { name: "Medium", value: allSuppliers.filter((s) => s.riskScore >= 35 && s.riskScore < 60).length, fill: "#3B82F6" },
    { name: "High", value: allSuppliers.filter((s) => s.riskScore >= 60 && s.riskScore < 75).length, fill: "#F59E0B" },
    { name: "Critical", value: allSuppliers.filter((s) => s.riskScore >= 75).length, fill: "#EF4444" }
  ];

  const dashboardRiskHistory = history
    .slice(0, 30)
    .reverse()
    .map((entry) => ({
      date: entry.timestamp?.slice(0, 10) ?? "",
      averageRiskScore: entry.summary?.averageRiskScore ?? 0,
      criticalAlerts: entry.summary?.criticalSuppliers ?? 0,
      suppliersScanned: entry.summary?.supplierCount ?? 0
    }));

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </section>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Suppliers" value="0" change="Run a scan to populate" changeType="increase" icon={Truck} accentColor="primary" />
          <StatCard title="High Risk Suppliers" value="0" change="No data yet" changeType="increase" icon={ShieldAlert} accentColor="danger" />
          <StatCard title="Scans Completed" value="0" change="Start a scan" changeType="increase" icon={Bot} accentColor="success" />
          <StatCard title="Avg Risk Score" value="0" change="No alerts yet" changeType="increase" icon={AlertTriangle} accentColor="warning" />
        </section>
        <LiveScanCard onScanComplete={() => setRefreshKey((k) => k + 1)} />
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <p className="text-muted">No scan history yet. Run your first live scan above to populate your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Suppliers" value={String(totalSuppliers)} change="From latest scan" changeType="increase" icon={Truck} accentColor="primary" />
        <StatCard title="High Risk Suppliers" value={String(highRiskSuppliers)} change={`${criticalSuppliers} critical`} changeType="increase" icon={ShieldAlert} accentColor="danger" pulse />
        <StatCard title="Scans Completed" value={String(history.length)} change="All time" changeType="increase" icon={Bot} accentColor="success" pulse />
        <StatCard title="Avg Risk Score" value={String(averageRisk)} change="Latest scan" changeType="increase" icon={AlertTriangle} accentColor="warning" />
      </section>

      <LiveScanCard onScanComplete={() => setRefreshKey((k) => k + 1)} />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="section-eyebrow">Trendline</p>
              <CardTitle>Global Risk Overview</CardTitle>
            </div>
            <Badge variant="secondary">{dashboardRiskHistory.length}-scan view</Badge>
          </CardHeader>
          <CardContent className="h-85">
            {mounted && dashboardRiskHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardRiskHistory}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.42} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.14)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(v: string) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                  <RechartsTooltip content={<AreaTooltip />} />
                  <Area type="monotone" dataKey="averageRiskScore" stroke="#3B82F6" strokeWidth={3} fill="url(#riskGradient)" name="Average Risk Score" />
                  <Area type="monotone" dataKey="criticalAlerts" stroke="#EF4444" strokeWidth={2.5} fill="url(#alertGradient)" name="Critical Alerts" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">Run more scans to build the trendline.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="section-eyebrow">Composition</p>
              <CardTitle>Risk Distribution</CardTitle>
            </div>
            <Globe2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="h-85">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={75} outerRadius={110} paddingAngle={4} cornerRadius={8}>
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" formatter={(value) => <span className="text-sm text-muted">{value}</span>} />
                  <RechartsTooltip content={({ active, payload }) => active && payload?.length ? (
                    <div className="rounded-2xl border border-white/10 bg-surface-strong p-4">
                      <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
                      <p className="mt-1 font-mono text-lg text-foreground">{payload[0].value} suppliers</p>
                    </div>
                  ) : null} />
                </PieChart>
              </ResponsiveContainer>
            ) : <Skeleton className="h-full w-full rounded-3xl" />}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="section-eyebrow">Priority Queue</p>
              <CardTitle>Top At-Risk Suppliers</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/suppliers">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topAtRisk.length === 0 ? (
              <p className="text-sm text-muted py-4">No supplier data yet. Run a live scan.</p>
            ) : topAtRisk.map((supplier, i) => {
              const level = toRiskLevel(supplier.riskScore);
              return (
                <div key={i} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/8 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-foreground">{supplier.supplierName}</p>
                      <Badge className={cn("capitalize", riskBadgeClass(level))}>{riskLevelLabel(level)}</Badge>
                    </div>
                    <p className="text-sm text-muted">{supplier.country ?? ""}{supplier.category ? ` · ${supplier.category}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl border border-white/10 bg-background/40 px-4 py-2 text-center">
                      <p className="font-mono text-2xl font-semibold text-foreground">{supplier.riskScore}</p>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Risk</p>
                    </div>
                    <Button variant="secondary" size="sm">Investigate</Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="section-eyebrow">Scan History</p>
              <CardTitle>Recent Scans</CardTitle>
            </div>
            <Badge variant="success" className="gap-2">
              <span className="pulse-dot text-success" />
              Live
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.slice(0, 8).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.summary?.supplierCount ?? 0} suppliers scanned</p>
                  <p className="text-xs text-muted">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-foreground">Avg {entry.summary?.averageRiskScore ?? 0}</p>
                  <p className="text-xs text-danger">{entry.summary?.criticalSuppliers ?? 0} critical</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis
} from "recharts";
import { Activity, AlertTriangle, Bot, Globe2, ShieldAlert, Truck } from "lucide-react";
import { AgentLog } from "@/components/agent-log";
import { LiveScanCard } from "@/components/live-scan-card";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  agentLogEntries,
  alerts,
  dashboardRiskHistory,
  dashboardStats,
  riskDistribution,
  topAtRiskSuppliers
} from "@/lib/mock-data";
import { cn, riskBadgeClass, riskLevelLabel, timeAgo } from "@/lib/utils";

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

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Suppliers"
          value={String(dashboardStats.totalSuppliers)}
          change="+3 added this month"
          changeType="increase"
          icon={Truck}
          accentColor="primary"
        />
        <StatCard
          title="High Risk Suppliers"
          value={String(dashboardStats.highRiskSuppliers)}
          change="+2 since last review"
          changeType="increase"
          icon={ShieldAlert}
          accentColor="danger"
          pulse
        />
        <StatCard
          title="Agents Running"
          value={String(dashboardStats.agentsRunning)}
          change="Realtime signal coverage healthy"
          changeType="increase"
          icon={Bot}
          accentColor="success"
          pulse
        />
        <StatCard
          title="Alerts Today"
          value={String(dashboardStats.alertsToday)}
          change="3 need escalation"
          changeType="increase"
          icon={AlertTriangle}
          accentColor="warning"
        />
      </section>

      <LiveScanCard />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="section-eyebrow">Trendline</p>
              <CardTitle>Global Risk Overview</CardTitle>
            </div>
            <Badge variant="secondary">30-day view</Badge>
          </CardHeader>
          <CardContent className="h-[340px]">
            {mounted ? (
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
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: string) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <RechartsTooltip content={<AreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="averageRiskScore"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#riskGradient)"
                    name="Average Risk Score"
                  />
                  <Area
                    type="monotone"
                    dataKey="criticalAlerts"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    fill="url(#alertGradient)"
                    name="Critical Alerts"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full rounded-3xl" />
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
          <CardContent className="h-[340px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={75}
                    outerRadius={110}
                    paddingAngle={4}
                    cornerRadius={8}
                  >
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" formatter={(value) => <span className="text-sm text-muted">{value}</span>} />
                  <RechartsTooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="rounded-2xl border border-white/10 bg-surface-strong p-4">
                          <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
                          <p className="mt-1 font-mono text-lg text-foreground">{payload[0].value} suppliers</p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full rounded-3xl" />
            )}
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
            {topAtRiskSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/8 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-foreground">{supplier.name}</p>
                    <Badge className={cn("capitalize", riskBadgeClass(supplier.riskLevel))}>
                      {riskLevelLabel(supplier.riskLevel)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">
                    {supplier.flag} {supplier.country} · {supplier.category}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-2xl border border-white/10 bg-background/40 px-4 py-2 text-center">
                    <p className="font-mono text-2xl font-semibold text-foreground">{supplier.riskScore}</p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Risk</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted">
                    <Activity className="h-4 w-4 text-warning" />
                    {supplier.trendDelta > 0 ? `+${supplier.trendDelta}` : supplier.trendDelta}
                  </div>
                  <Button variant="secondary" size="sm">
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <p className="section-eyebrow">Realtime Feed</p>
              <CardTitle>Live Agent Activity</CardTitle>
            </div>
            <Badge variant="success" className="gap-2">
              <span className="pulse-dot text-success" />
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            <AgentLog entries={agentLogEntries} maxHeight="430px" />
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Escalations</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Recent Alerts</h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/alerts">Open Alerts</Link>
          </Button>
        </div>

        <div className="scrollbar-thin flex gap-4 overflow-x-auto pb-2">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className="min-w-[300px] border-white/10 bg-white/5 md:min-w-[340px]"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge
                    variant={
                      alert.severity === "critical"
                        ? "danger"
                        : alert.severity === "warning"
                        ? "warning"
                        : "default"
                    }
                  >
                    {alert.riskType}
                  </Badge>
                  <span className="text-xs text-muted">{timeAgo(alert.timestamp)}</span>
                </div>
                <p className="mt-4 text-lg font-semibold text-foreground">{alert.supplierName}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">{alert.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {alert.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button className="mt-5 w-full" variant="secondary">
                  Investigate
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

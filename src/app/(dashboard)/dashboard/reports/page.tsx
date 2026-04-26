"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Download, FileOutput } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";



export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);

  const [history, setHistory] = useState<any[]>([]);

useEffect(() => {
  fetch("/api/history")
    .then((r) => r.json())
    .then((data) => setHistory(Array.isArray(data) ? data : (data.history ?? [])))
    .catch(() => {});
}, []);

// Derive reports from real scan history
const reports = history.map((entry: any, i: number) => ({
  id: entry.id ?? `r-${i}`,
  name: `Supplier Risk Scan — ${new Date(entry.timestamp).toLocaleDateString()}`,
  dateRange: new Date(entry.timestamp).toLocaleDateString(),
  supplierCount: entry.summary?.supplierCount ?? 0,
  generatedAt: entry.timestamp,
  format: "JSON",
  summary: `Average risk: ${entry.summary?.averageRiskScore ?? 0}. Critical suppliers: ${entry.summary?.criticalSuppliers ?? 0}.`
}));

const weeklyDigest = history.length > 0 ? {
  headline: `Latest scan: avg risk ${history[0].summary?.averageRiskScore ?? 0}, ${history[0].summary?.criticalSuppliers ?? 0} critical suppliers.`,
  overview: `You have completed ${history.length} scans. Your most recent scan covered ${history[0].summary?.supplierCount ?? 0} suppliers.`,
  sections: [
    { title: "Most Recent Scan", description: new Date(history[0].timestamp).toLocaleString() },
    { title: "Critical Suppliers", description: `${history[0].summary?.criticalSuppliers ?? 0} suppliers scored 75+ risk in the latest scan.` },
    { title: "Recommended Action", description: "Review critical suppliers and run targeted rescans for updated intelligence." }
  ]
} : {
  headline: "No scan data yet.",
  overview: "Run your first live scan to generate reports.",
  sections: []
};

const weeklyAlertCounts = history.slice(0, 4).map((entry: any, i: number) => ({
  week: `Scan ${i + 1}`,
  low: (entry.suppliers ?? []).filter((s: any) => s.riskScore < 35).length,
  medium: (entry.suppliers ?? []).filter((s: any) => s.riskScore >= 35 && s.riskScore < 60).length,
  high: (entry.suppliers ?? []).filter((s: any) => s.riskScore >= 60).length
})).reverse();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-eyebrow">Reporting</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Reports & Summaries</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Generate leadership-ready exports, review prior reports, and keep a structured narrative of portfolio risk changes.
          </p>
        </div>
        <Button>
          <FileOutput className="h-4 w-4" />
          Generate Report
        </Button>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-white/10 bg-white/5">
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{report.name}</p>
                    <Badge variant="secondary">{report.format}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">{report.dateRange}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/85">{report.summary}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted">
                    {report.supplierCount} suppliers · generated {formatDate(report.generatedAt)}
                  </p>
                </div>
                <Button variant="secondary">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">Weekly Digest</p>
            <CardTitle>{weeklyDigest.headline}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-7 text-muted">{weeklyDigest.overview}</p>
            <div className="grid gap-4">
              {weeklyDigest.sections.map((section) => (
                <div key={section.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-foreground">{section.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{section.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <p className="section-eyebrow">Weekly Alert Volume</p>
          <CardTitle>Alert counts by severity</CardTitle>
        </CardHeader>
        <CardContent className="h-[360px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAlertCounts}>
                <CartesianGrid stroke="rgba(148,163,184,0.14)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="rounded-2xl border border-white/10 bg-surface-strong p-4">
                        <p className="text-sm font-semibold text-foreground">{label}</p>
                        {payload.map((item) => (
                          <div key={item.dataKey as string} className="mt-2 flex items-center justify-between gap-4 text-sm">
                            <span className="text-muted">{item.name}</span>
                            <span className="font-mono text-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="low" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="medium" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="high" fill="#EF4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-full w-full rounded-3xl" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Download, FileOutput } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

async function downloadPDF(entry: any) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text("SwiftPath AI - Supplier Risk Report", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);
  doc.text(`Scan Date: ${new Date(entry.timestamp).toLocaleString()}`, 14, 38);

  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  const avg = entry.summary?.averageRiskScore ?? 0;
  const critical = entry.summary?.criticalSuppliers ?? 0;
  const total = entry.summary?.supplierCount ?? 0;
  doc.text(`Total Suppliers: ${total}   Average Risk: ${avg}   Critical: ${critical}`, 14, 50);

  const suppliers = entry.suppliers ?? [];
  const tableRows = suppliers.map((supplier: any) => [
    supplier.supplierName ?? supplier.name ?? "-",
    supplier.country ?? "-",
    supplier.industry ?? "-",
    String(supplier.riskScore ?? "-"),
    supplier.riskLevel ?? "-",
    supplier.recommendation ?? "-"
  ]);

  autoTable(doc, {
    startY: 58,
    head: [["Supplier", "Country", "Industry", "Risk Score", "Risk Level", "Recommendation"]],
    body: tableRows,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: { 5: { cellWidth: 55 } }
  });

  doc.save(`risk_report_${new Date(entry.timestamp).toISOString().split("T")[0]}.pdf`);
}

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetch("/api/history")
      .then((response) => response.json())
      .then((data) => setHistory(Array.isArray(data) ? data : data.history ?? []))
      .catch(() => {});
  }, []);

  const reports = history.map((entry: any, index: number) => ({
    id: entry.id ?? `r-${index}`,
    name: `Supplier Risk Scan - ${new Date(entry.timestamp).toLocaleDateString()}`,
    dateRange: new Date(entry.timestamp).toLocaleString(),
    supplierCount: entry.summary?.supplierCount ?? 0,
    generatedAt: entry.timestamp,
    avgRisk: entry.summary?.averageRiskScore ?? 0,
    critical: entry.summary?.criticalSuppliers ?? 0,
    format: "PDF",
    summary: `Average risk: ${entry.summary?.averageRiskScore ?? 0}. Critical suppliers: ${entry.summary?.criticalSuppliers ?? 0}.`,
    entry
  }));

  const weeklyDigest =
    history.length > 0
      ? {
          headline: `Latest scan: avg risk ${history[0].summary?.averageRiskScore ?? 0}, ${history[0].summary?.criticalSuppliers ?? 0} critical suppliers.`,
          overview: `You have completed ${history.length} scan(s). Your most recent scan covered ${history[0].summary?.supplierCount ?? 0} suppliers.`,
          sections: [
            { title: "Most Recent Scan", description: new Date(history[0].timestamp).toLocaleString() },
            { title: "Critical Suppliers", description: `${history[0].summary?.criticalSuppliers ?? 0} suppliers scored 75+ risk in the latest scan.` },
            { title: "Recommended Action", description: "Review critical suppliers and run targeted rescans for updated intelligence." }
          ]
        }
      : {
          headline: "No scan data yet.",
          overview: "Run your first live scan from the Dashboard to generate reports.",
          sections: [] as Array<{ title: string; description: string }>
        };

  const weeklyAlertCounts = history
    .slice(0, 4)
    .map((entry: any, index: number) => ({
      week: `Scan ${index + 1}`,
      low: (entry.suppliers ?? []).filter((supplier: any) => supplier.riskScore < 35).length,
      medium: (entry.suppliers ?? []).filter((supplier: any) => supplier.riskScore >= 35 && supplier.riskScore < 60).length,
      high: (entry.suppliers ?? []).filter((supplier: any) => supplier.riskScore >= 60).length
    }))
    .reverse();

  const handleGenerateAndDownload = async () => {
    if (history.length === 0) {
      alert("No scan data yet. Run a live scan first.");
      return;
    }

    setGenerating("all");
    await downloadPDF(history[0]);
    setGenerating(null);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-eyebrow">Reporting</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Reports and Summaries</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Generate leadership-ready PDF exports with real scan data, review prior reports, and track portfolio risk over time.
          </p>
        </div>
        <Button onClick={handleGenerateAndDownload} disabled={generating === "all"}>
          <FileOutput className="h-4 w-4" />
          {generating === "all" ? "Generating..." : "Generate and Download Latest"}
        </Button>
      </section>

      {reports.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <FileOutput className="h-10 w-10 text-muted" />
            <p className="text-muted">No reports yet. Run a live scan from the Dashboard first.</p>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="border-white/10 bg-white/5">
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">{report.name}</p>
                      <Badge variant="secondary">{report.format}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted">{report.dateRange}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/85">{report.summary}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.22em] text-muted">
                      {report.supplierCount} suppliers | generated {formatDate(report.generatedAt)}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="shrink-0"
                    disabled={generating === report.id}
                    onClick={async () => {
                      setGenerating(report.id);
                      await downloadPDF(report.entry);
                      setGenerating(null);
                    }}
                  >
                    <Download className="h-4 w-4" />
                    {generating === report.id ? "Generating..." : "Download PDF"}
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
      )}

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <p className="section-eyebrow">Scan Alert Volume</p>
          <CardTitle>Alert counts by severity across scans</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] sm:h-[360px]">
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
                <Bar dataKey="low" name="Low" fill="#10B981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="medium" name="Medium" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="high" name="High" fill="#EF4444" radius={[8, 8, 0, 0]} />
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

"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, Radar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { topAtRiskSuppliers } from "@/lib/mock-data";
import { cn, riskBadgeClass, riskLevelLabel } from "@/lib/utils";

type ScanResponse = {
  modeUsed: "local" | "live";
  summary: {
    supplierCount: number;
    averageRiskScore: number;
    criticalSuppliers: number;
  };
  suppliers: Array<{
    supplierName: string;
    riskScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    recommendation: string;
  }>;
};

export function LiveScanCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [error, setError] = useState("");

  const scanPayload = useMemo(
    () => ({
      mode: "live" as const,
      suppliers: topAtRiskSuppliers.map((supplier) => ({
        supplier_name: supplier.name,
        country: supplier.country,
        industry: supplier.industry,
        category: supplier.category,
        annual_spend_usd: supplier.annualSpendUsd,
        criticality: supplier.criticality,
        on_time_delivery_pct: supplier.onTimeDeliveryPct,
        inventory_buffer_days: supplier.inventoryBufferDays,
        supplier_health: supplier.supplierHealth,
        single_source: supplier.singleSource,
        incident_note: supplier.riskSummary
      }))
    }),
    []
  );

  async function runScan() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(scanPayload)
      });
      const payload = (await response.json()) as ScanResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "SwiftPath could not run the scan.");
      }

      setResult(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "SwiftPath could not run the scan.");
    } finally {
      setIsLoading(false);
    }
  }

  const topSupplier = result?.suppliers?.[0];

  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">Live backend connected</Badge>
            {result ? (
              <Badge variant={result.modeUsed === "live" ? "success" : "warning"}>
                {result.modeUsed === "live" ? "Groq live research" : "Local fallback"}
              </Badge>
            ) : null}
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">Run a real AI scan on the highest-risk suppliers</h3>
          <p className="mt-2 text-sm leading-7 text-muted">
            This action calls the live `/api/analyze` pipeline, runs the multi-agent backend, and returns a fresh risk summary for the top suppliers in the portfolio.
          </p>

          {topSupplier ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-background/40 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold text-foreground">{topSupplier.supplierName}</p>
                <Badge className={cn("capitalize", riskBadgeClass(topSupplier.riskLevel))}>
                  {riskLevelLabel(topSupplier.riskLevel)}
                </Badge>
                <span className="font-mono text-sm text-foreground">{topSupplier.riskScore}/100</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">{topSupplier.recommendation}</p>
            </div>
          ) : null}

          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        </div>

        <div className="flex shrink-0 flex-col gap-3 xl:items-end">
          <Button onClick={runScan} disabled={isLoading} className="min-w-[220px]">
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
            {isLoading ? "Running scan..." : "Run Live AI Scan"}
          </Button>

          <div className="grid gap-2 text-right text-sm text-muted">
            <div className="flex items-center justify-between gap-6 xl:justify-end">
              <span>Suppliers in scan</span>
              <span className="font-mono text-foreground">{scanPayload.suppliers.length}</span>
            </div>
            {result ? (
              <>
                <div className="flex items-center justify-between gap-6 xl:justify-end">
                  <span>Average risk</span>
                  <span className="font-mono text-foreground">{result.summary.averageRiskScore}</span>
                </div>
                <div className="flex items-center justify-between gap-6 xl:justify-end">
                  <span>Critical suppliers</span>
                  <span className="font-mono text-foreground">{result.summary.criticalSuppliers}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-6 xl:justify-end">
                <span>Expected mode</span>
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Live if key exists
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


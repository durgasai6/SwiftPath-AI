"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleAlert,
  FileCheck,
  ShieldCheck,
  Workflow
} from "lucide-react";
import type { OpsSummary } from "@/types";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";

function statusBadge(status: OpsSummary["checks"][number]["status"]): "success" | "warning" | "danger" {
  if (status === "ready") return "success";
  if (status === "warning") return "warning";
  return "danger";
}

function stageLabel(stage: OpsSummary["deploymentStage"]) {
  if (stage === "ops-ready") return "Ops-ready";
  if (stage === "pilot-ready") return "Pilot-ready";
  return "Prototype";
}

export default function OpsPage() {
  const [summary, setSummary] = useState<OpsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ops/summary")
      .then((response) => response.json())
      .then((payload) => setSummary(payload))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-32 rounded-3xl" />
          ))}
        </section>
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/5">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Agentic ops review</Badge>
              <Badge variant={summary.deploymentStage === "ops-ready" ? "success" : summary.deploymentStage === "pilot-ready" ? "warning" : "secondary"}>
                {stageLabel(summary.deploymentStage)}
              </Badge>
              <Badge variant="secondary">{summary.modePreference === "live" ? "Live escalation configured" : "Fallback-safe local mode"}</Badge>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">Industrial MVP posture</h2>
            <p className="mt-3 text-sm leading-8 text-muted">
              This view translates the app into professor-ready operating language: portfolio ingest, multi-agent scoring,
              escalation, auditability, and deployment readiness in one place.
            </p>
          </div>

          <div className="rounded-[28px] border border-primary/20 bg-primary/10 px-6 py-5">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">Readiness score</p>
            <div className="mt-3 flex items-end gap-3">
              <span className="font-mono text-5xl font-semibold text-foreground">{summary.readinessScore}</span>
              <span className="pb-2 text-sm text-muted">/100</span>
            </div>
            <p className="mt-3 text-sm text-muted">
              {summary.latestScan.timestamp
                ? `Latest scan: ${formatDate(summary.latestScan.timestamp, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  })}`
                : "No scan recorded yet"}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Deployment Stage"
          value={stageLabel(summary.deploymentStage)}
          change={summary.modePreference === "live" ? "Live model path enabled" : "Fallback mode ready"}
          changeType="increase"
          icon={ShieldCheck}
          accentColor="success"
        />
        <StatCard
          title="Suppliers Covered"
          value={String(summary.portfolio.totalSuppliers)}
          change={`${summary.portfolio.countriesCovered} countries represented`}
          changeType="increase"
          icon={Workflow}
          accentColor="primary"
        />
        <StatCard
          title="High-Risk Queue"
          value={String(summary.portfolio.highRiskSuppliers)}
          change={`${summary.portfolio.singleSourceSuppliers} single-source suppliers`}
          changeType="increase"
          icon={BrainCircuit}
          accentColor="warning"
        />
        <StatCard
          title="Latest Scan"
          value={String(summary.latestScan.supplierCount)}
          change={summary.latestScan.modeUsed === "none" ? "Run first scan" : `${summary.latestScan.modeUsed} mode`}
          changeType="increase"
          icon={FileCheck}
          accentColor="danger"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">Readiness Checks</p>
            <CardTitle>Operational safeguards</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {summary.checks.map((check) => (
              <div key={check.id} className="rounded-3xl border border-white/10 bg-background/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-foreground">{check.title}</p>
                      <Badge variant={statusBadge(check.status)}>{check.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted">{check.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {check.status === "ready" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <CircleAlert className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground/85">{check.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">Orchestration</p>
            <CardTitle>How the agent loop behaves</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.orchestration.map((stage, index) => (
              <div key={stage.id} className="relative rounded-3xl border border-white/10 bg-background/40 p-4">
                {index < summary.orchestration.length - 1 ? (
                  <div className="absolute bottom-[-20px] left-7 top-full w-px bg-white/10" />
                ) : null}
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                      stage.status === "ready"
                        ? "border-success/30 bg-success/12 text-success"
                        : "border-warning/30 bg-warning/12 text-warning"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-foreground">{stage.title}</p>
                      <Badge variant={statusBadge(stage.status)}>{stage.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted">{stage.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-primary/20 bg-primary/10 p-4">
              <p className="font-semibold text-foreground">Why this feels industrial</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                The system does not stop at model output. It persists runs, keeps a fallback path, exposes health endpoints,
                supports report export, and keeps the portfolio state available for repeatable demos.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">Recommended Next Moves</p>
            <CardTitle>Presentation runbook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.recommendedActions.map((action) => (
              <div key={action} className="rounded-2xl border border-white/10 bg-background/40 px-4 py-3 text-sm text-foreground/90">
                {action}
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/dashboard">
                  Open Command Center
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard/reports">Open Reports</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">Deployment Surface</p>
            <CardTitle>MVP services and endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["/api/analyze", "Runs the multi-agent supplier scoring pipeline."],
              ["/api/ops/summary", "Aggregates readiness, portfolio, and orchestration metadata."],
              ["/api/health", "Exposes runtime health and deployment posture."],
              ["/api/history", "Returns the persisted scan audit trail."],
              ["/api/export", "Exports the portfolio for reporting workflows."]
            ].map(([path, description]) => (
              <div key={path} className="rounded-2xl border border-white/10 bg-background/40 px-4 py-3">
                <p className="font-mono text-sm text-foreground">{path}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

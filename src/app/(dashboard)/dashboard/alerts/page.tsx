"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BellRing, Clock3, ShieldCheck } from "lucide-react";
import type { AlertEntry } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { alerts } from "@/lib/mock-data";
import { alertBorderClass, cn, timeAgo } from "@/lib/utils";

const tabOptions = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "unresolved", label: "Unresolved" }
] as const;

function severityIcon(level: AlertEntry["severity"]) {
  switch (level) {
    case "critical":
      return AlertTriangle;
    case "warning":
      return Clock3;
    default:
      return BellRing;
  }
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabOptions)[number]["value"]>("all");

  const filteredAlerts = useMemo(() => {
    if (activeTab === "critical") {
      return alerts.filter((alert) => alert.severity === "critical");
    }
    if (activeTab === "unresolved") {
      return alerts.filter((alert) => !alert.resolved);
    }
    return alerts;
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-eyebrow">Alert Center</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Active Alerts</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Investigate emerging issues, mark resolved incidents, and keep the operating queue focused on what matters most.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {filteredAlerts.length ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const Icon = severityIcon(alert.severity);

            return (
              <Card key={alert.id} className={cn("border-l-4 border-white/10 bg-white/5", alertBorderClass(alert.severity))}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div
                        className={cn(
                          "mt-1 rounded-2xl p-3",
                          alert.severity === "critical"
                            ? "bg-danger/15 text-danger"
                            : alert.severity === "warning"
                            ? "bg-warning/15 text-warning"
                            : "bg-primary/15 text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="font-semibold text-foreground">
                            {alert.flag} {alert.supplierName}
                          </p>
                          <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "warning" ? "warning" : "default"}>
                            {alert.country}
                          </Badge>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-foreground">{alert.headline}</h3>
                        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-7 text-muted">{alert.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {alert.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 xl:items-end">
                      <span className="text-sm text-muted">{timeAgo(alert.timestamp)}</span>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm">
                          Mark Resolved
                        </Button>
                        <Button size="sm">Investigate</Button>
                        <Button variant="outline" size="sm">
                          Snooze
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="rounded-full bg-success/12 p-5 text-success">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">No alerts in this view</h3>
              <p className="mt-2 max-w-md text-sm leading-7 text-muted">
                SwiftPath does not have any matching alerts right now. Change the active tab or run a new scan to refresh the queue.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


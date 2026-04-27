"use client";

import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SupplierHeatmapData {
  region: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
  total: number;
  averageRisk: number;
}

interface RiskHeatmapProps {
  suppliers: Array<{
    id: string;
    name: string;
    country: string;
    locationLabel: string;
    riskScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
  }>;
}

const REGION_COLORS = {
  "Asia-Pacific": "#8B5CF6",
  "Americas": "#EC4899",
  "Europe": "#06B6D4",
  "Middle East & Africa": "#F59E0B"
};

const RISK_COLORS = {
  low: "#10B981",
  medium: "#3B82F6",
  high: "#F59E0B",
  critical: "#EF4444"
};

export function RiskHeatmapVisualization({ suppliers }: RiskHeatmapProps) {
  const heatmapData = useMemo<SupplierHeatmapData[]>(() => {
    const regions = new Map<string, { low: number; medium: number; high: number; critical: number; scores: number[] }>();

    suppliers.forEach((supplier) => {
      const region = supplier.locationLabel || "Unknown";
      if (!regions.has(region)) {
        regions.set(region, { low: 0, medium: 0, high: 0, critical: 0, scores: [] });
      }

      const data = regions.get(region)!;
      data.scores.push(supplier.riskScore);

      if (supplier.riskScore < 35) data.low++;
      else if (supplier.riskScore < 60) data.medium++;
      else if (supplier.riskScore < 75) data.high++;
      else data.critical++;
    });

    return Array.from(regions.entries()).map(([region, data]) => ({
      region,
      ...data,
      total: data.low + data.medium + data.high + data.critical,
      averageRisk: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
    }));
  }, [suppliers]);

  const overallRiskDistribution = useMemo(() => {
    const distribution = {
      low: suppliers.filter(s => s.riskScore < 35).length,
      medium: suppliers.filter(s => s.riskScore >= 35 && s.riskScore < 60).length,
      high: suppliers.filter(s => s.riskScore >= 60 && s.riskScore < 75).length,
      critical: suppliers.filter(s => s.riskScore >= 75).length
    };

    return [
      { name: "Low", value: distribution.low, fill: RISK_COLORS.low },
      { name: "Medium", value: distribution.medium, fill: RISK_COLORS.medium },
      { name: "High", value: distribution.high, fill: RISK_COLORS.high },
      { name: "Critical", value: distribution.critical, fill: RISK_COLORS.critical }
    ];
  }, [suppliers]);

  const getRiskColor = (score: number): string => {
    if (score < 35) return RISK_COLORS.low;
    if (score < 60) return RISK_COLORS.medium;
    if (score < 75) return RISK_COLORS.high;
    return RISK_COLORS.critical;
  };

  return (
    <div className="grid gap-6">
      {/* Risk Distribution by Region */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Distribution by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {heatmapData.map((data) => (
              <div key={data.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: (REGION_COLORS as Record<string, string>)[data.region] || "#9CA3AF" }}
                    />
                    <span className="font-medium">{data.region}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Avg Risk: {data.averageRisk}/100
                  </span>
                </div>

                {/* Stacked risk bar */}
                <div className="flex h-8 overflow-hidden rounded-lg border border-border bg-muted">
                  {data.low > 0 && (
                    <div
                      className="flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        width: `${(data.low / data.total) * 100}%`,
                        backgroundColor: RISK_COLORS.low
                      }}
                      title={`Low: ${data.low}`}
                    >
                      {data.low > 0 && data.low}
                    </div>
                  )}
                  {data.medium > 0 && (
                    <div
                      className="flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        width: `${(data.medium / data.total) * 100}%`,
                        backgroundColor: RISK_COLORS.medium
                      }}
                      title={`Medium: ${data.medium}`}
                    >
                      {data.medium > 0 && data.medium}
                    </div>
                  )}
                  {data.high > 0 && (
                    <div
                      className="flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        width: `${(data.high / data.total) * 100}%`,
                        backgroundColor: RISK_COLORS.high
                      }}
                      title={`High: ${data.high}`}
                    >
                      {data.high > 0 && data.high}
                    </div>
                  )}
                  {data.critical > 0 && (
                    <div
                      className="flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        width: `${(data.critical / data.total) * 100}%`,
                        backgroundColor: RISK_COLORS.critical
                      }}
                      title={`Critical: ${data.critical}`}
                    >
                      {data.critical > 0 && data.critical}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Low:</span> <span className="font-semibold">{data.low}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Medium:</span> <span className="font-semibold">{data.medium}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">High:</span> <span className="font-semibold">{data.high}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Critical:</span> <span className="font-semibold">{data.critical}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Overall Risk Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overallRiskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {overallRiskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value) => `${value} supplier(s)`}
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Country Risk Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Country Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {suppliers
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((supplier) => (
                <div key={supplier.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: getRiskColor(supplier.riskScore) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{supplier.name}</span>
                      <span className="text-sm font-semibold ml-2">{supplier.riskScore}/100</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{supplier.country}</span>
                      <span>•</span>
                      <span className="capitalize">{supplier.riskLevel}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

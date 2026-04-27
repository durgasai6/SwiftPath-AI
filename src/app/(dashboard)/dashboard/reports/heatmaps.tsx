"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { RiskHeatmapVisualization } from "@/components/risk-heatmap-advanced";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { suppliers as initialSuppliers } from "@/lib/mock-data";

export default function HeatmapsPage() {
  const [mounted, setMounted] = useState(false);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadReport = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/reports/download?type=summary");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `supplier_risk_report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/seed", { method: "POST" });
      if (response.ok) {
        // Refresh suppliers data
        setSuppliers([...initialSuppliers]);
      }
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const criticalCount = suppliers.filter(s => s.riskScore >= 75).length;
  const highRiskCount = suppliers.filter(s => s.riskScore >= 60 && s.riskScore < 75).length;
  const mediumRiskCount = suppliers.filter(s => s.riskScore >= 35 && s.riskScore < 60).length;
  const lowRiskCount = suppliers.filter(s => s.riskScore < 35).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risk Heatmaps & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive supplier risk visualization and geographic analysis
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadReport}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Suppliers requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{highRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Suppliers with elevated risk factors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medium Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{mediumRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Suppliers requiring monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{lowRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Stable, low-risk suppliers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Visualizations */}
      <RiskHeatmapVisualization suppliers={suppliers} />

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ Critical Priority</h4>
              <p className="text-sm text-red-800">
                {criticalCount > 0
                  ? `${criticalCount} supplier(s) have critical risk scores. Initiate immediate review and contingency planning for these sources.`
                  : "No critical suppliers at this time."}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">📊 Geographic Risk</h4>
              <p className="text-sm text-amber-800">
                Asia-Pacific region shows elevated geopolitical risk due to Taiwan strait tensions and China export controls. Diversify sourcing where possible.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">🌦️ Seasonal Factors</h4>
              <p className="text-sm text-blue-800">
                Indonesia and Vietnam logistics hubs facing monsoon season disruptions (2-3 weeks). Increase safety stock for critical SKUs.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ Opportunities</h4>
              <p className="text-sm text-green-800">
                {lowRiskCount} low-risk suppliers performing well. Consider increasing volumes with stable, compliant sources to reduce overall portfolio risk.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

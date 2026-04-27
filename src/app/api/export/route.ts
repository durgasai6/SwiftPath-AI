import { NextResponse } from "next/server";
import { sampleSuppliers, generateSupplierRiskHistory } from "@/lib/sample-suppliers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    if (format === "csv") {
      // Generate CSV export
      const headers = [
        "Supplier ID",
        "Supplier Name",
        "Country",
        "Industry",
        "Category",
        "Risk Score",
        "Risk Level",
        "Risk Trend",
        "Annual Spend USD",
        "On-Time Delivery %",
        "Critical",
        "Single Source",
        "Active Alerts",
        "Last Scanned"
      ];

      const rows = sampleSuppliers.map(supplier => [
        supplier.id,
        supplier.name,
        supplier.country,
        supplier.industry,
        supplier.category,
        supplier.riskScore,
        supplier.riskLevel,
        supplier.riskTrend,
        supplier.annualSpendUsd,
        supplier.onTimeDeliveryPct,
        supplier.criticality,
        supplier.singleSource ? "Yes" : "No",
        supplier.activeAlerts,
        supplier.lastScannedAt
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="suppliers_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // JSON export
    const data = {
      exportDate: new Date().toISOString(),
      totalSuppliers: sampleSuppliers.length,
      suppliers: sampleSuppliers.map(supplier => ({
        ...supplier,
        riskHistory: generateSupplierRiskHistory().find(h => h.supplierId === supplier.id)?.points || []
      }))
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to export data"
      },
      { status: 500 }
    );
  }
}

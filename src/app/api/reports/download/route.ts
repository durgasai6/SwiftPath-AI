import { NextResponse } from "next/server";
import { generateSupplierRiskPDF } from "@/lib/pdf-generator";
import { sampleSuppliers, generateDashboardRiskHistory } from "@/lib/sample-suppliers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type") || "summary";
    const supplierId = searchParams.get("supplierId");

    const riskDistribution = [
      { name: "Low", value: sampleSuppliers.filter(s => s.riskScore < 35).length, fill: "#10B981" },
      { name: "Medium", value: sampleSuppliers.filter(s => s.riskScore >= 35 && s.riskScore < 60).length, fill: "#3B82F6" },
      { name: "High", value: sampleSuppliers.filter(s => s.riskScore >= 60 && s.riskScore < 75).length, fill: "#F59E0B" },
      { name: "Critical", value: sampleSuppliers.filter(s => s.riskScore >= 75).length, fill: "#EF4444" }
    ];

    const averageRisk = Math.round(
      sampleSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / sampleSuppliers.length
    );

    let reportData = {
      title: "Supplier Risk Intelligence Report",
      generatedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      suppliers: sampleSuppliers,
      riskDistribution,
      averageRisk,
      criticalCount: sampleSuppliers.filter(s => s.riskScore >= 75).length,
      highRiskCount: sampleSuppliers.filter(s => s.riskScore >= 60 && s.riskScore < 75).length
    };

    // Filter by supplier if requested
    if (supplierId) {
      const supplier = sampleSuppliers.find(s => s.id === supplierId);
      if (supplier) {
        reportData = {
          ...reportData,
          title: `Supplier Deep Dive Report - ${supplier.name}`,
          suppliers: [supplier]
        };
      }
    }

    const doc = generateSupplierRiskPDF(reportData);
    const pdfBytes = doc.output("arraybuffer");

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="supplier_risk_report_${Date.now()}.pdf"`
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate PDF report"
      },
      { status: 500 }
    );
  }
}

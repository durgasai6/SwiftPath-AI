import { NextResponse } from "next/server";
import { appendHistory } from "@/lib/server/history-store";
import { sampleSuppliers } from "@/lib/sample-suppliers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Create a comprehensive analysis entry with all suppliers
    const analysisEntry = {
      suppliers: sampleSuppliers.map((supplier) => ({
        supplierId: supplier.id,
        supplierName: supplier.name,
        country: supplier.country,
        riskScore: supplier.riskScore,
        riskLevel: supplier.riskLevel,
        recommendation: supplier.riskSummary,
        category: supplier.category,
        industry: supplier.industry,
        annualSpendUsd: supplier.annualSpendUsd,
        criticality: supplier.criticality
      })),
      summary: {
        supplierCount: sampleSuppliers.length,
        averageRiskScore: Math.round(
          sampleSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / sampleSuppliers.length
        ),
        criticalSuppliers: sampleSuppliers.filter((s) => s.riskScore >= 75).length,
        highRiskSuppliers: sampleSuppliers.filter((s) => s.riskScore >= 60).length,
        lowRiskSuppliers: sampleSuppliers.filter((s) => s.riskScore < 35).length
      },
      agents: [
        "Geopolitical Risk Agent",
        "Financial Analysis Agent",
        "Weather & Climate Agent",
        "Compliance Agent",
        "Operational Intelligence Agent"
      ]
    };

    const entry = await appendHistory(analysisEntry);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      entry
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to seed database"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to seed the database with sample data"
  });
}

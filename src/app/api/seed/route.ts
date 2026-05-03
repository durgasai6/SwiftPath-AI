import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { toStoredSupplierRecord } from "@/lib/portfolio";
import { appendHistory } from "@/lib/server/history-store";
import { sampleSuppliers } from "@/lib/sample-suppliers";

export const runtime = "nodejs";

const SUPPLIERS_FILE = path.join(process.cwd(), "data", "suppliers.json");

export async function POST(request: Request) {
  try {
    await mkdir(path.dirname(SUPPLIERS_FILE), { recursive: true });
    await writeFile(
      SUPPLIERS_FILE,
      JSON.stringify(sampleSuppliers.map((supplier) => toStoredSupplierRecord(supplier)), null, 2),
      "utf8"
    );

    // Create a comprehensive analysis entry with all suppliers
    const analysisEntry = {
      generatedAt: new Date().toISOString(),
      modeUsed: "local" as const,
      suppliers: sampleSuppliers.map((supplier) => ({
        supplierName: supplier.name,
        country: supplier.country,
        category: supplier.category,
        industry: supplier.industry,
        riskScore: supplier.riskScore,
        riskLevel: supplier.riskLevel,
        recommendation: supplier.riskSummary,
        annual_spend_usd: supplier.annualSpendUsd,
        on_time_delivery_pct: supplier.onTimeDeliveryPct,
        inventory_buffer_days: supplier.inventoryBufferDays,
        supplier_health: supplier.supplierHealth,
        criticality: supplier.criticality,
        single_source: supplier.singleSource
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
      message: "Demo portfolio seeded successfully",
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

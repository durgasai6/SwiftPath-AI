import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

async function getHistoryData() {
  try {
    const content = await readFile(path.join(process.cwd(), "data", "analysis-history.json"), "utf8");
    return JSON.parse(content);
  } catch { return []; }
}

export async function GET() {
  try {
    const history = await getHistoryData();
    const latest = history[0];
    const suppliers = latest?.suppliers ?? [];

    // Build PDF as HTML then return — use jsPDF on client side instead
    // Return JSON summary that the client uses to generate PDF
    const summary = {
      title: "Supplier Risk Intelligence Report",
      generatedAt: new Date().toISOString(),
      totalSuppliers: suppliers.length,
      averageRisk: suppliers.length
        ? Math.round(suppliers.reduce((s: number, x: any) => s + (x.riskScore ?? 0), 0) / suppliers.length)
        : 0,
      criticalCount: suppliers.filter((s: any) => (s.riskScore ?? 0) >= 75).length,
      highCount: suppliers.filter((s: any) => (s.riskScore ?? 0) >= 60 && (s.riskScore ?? 0) < 75).length,
      suppliers: suppliers.slice(0, 20),
      scansCompleted: history.length
    };

    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
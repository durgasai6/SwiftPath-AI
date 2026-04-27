import { NextResponse } from "next/server";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "suppliers.json");
const HISTORY_FILE = path.join(process.cwd(), "data", "analysis-history.json");

async function getSuppliers() {
  try {
    const content = await readFile(FILE, "utf8");
    const db = JSON.parse(content);
    if (db.length > 0) return db;
  } catch {}
  // Fallback: use latest scan history
  try {
    const content = await readFile(HISTORY_FILE, "utf8");
    const history = JSON.parse(content);
    return history[0]?.suppliers ?? [];
  } catch {}
  return [];
}

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";
  const suppliers = await getSuppliers();

  if (format === "csv") {
    const headers = ["ID","Name","Country","Industry","Category","Risk Score","Risk Level","Annual Spend USD","On-Time Delivery %","Criticality","Single Source","Created At"];
    const rows = suppliers.map((s: any) => [
      s.id, s.supplier_name ?? s.name ?? s.supplierName,
      s.country, s.industry, s.category ?? "",
      s.riskScore ?? "", s.riskLevel ?? "",
      s.annual_spend_usd ?? s.annualSpendUsd ?? "",
      s.on_time_delivery_pct ?? s.onTimeDeliveryPct ?? "",
      s.criticality ?? "", s.single_source ?? "",
      s.createdAt ?? s.lastScannedAt ?? ""
    ]);
    const csv = [headers.join(","), ...rows.map((r: any[]) => r.map((c: any) => `"${c ?? ""}"`).join(","))].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="suppliers_${new Date().toISOString().split("T")[0]}.csv"`
      }
    });
  }

  return NextResponse.json({ exportDate: new Date().toISOString(), suppliers });
}
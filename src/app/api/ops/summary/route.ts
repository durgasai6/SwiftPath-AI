import { NextResponse } from "next/server";
import { buildOpsSummary } from "@/lib/server/ops-summary";

export const runtime = "nodejs";

export async function GET() {
  const summary = await buildOpsSummary();
  return NextResponse.json(summary);
}

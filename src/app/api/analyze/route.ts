import { NextResponse } from "next/server";
import { runSupplierIntelligence } from "@/lib/server/supplier-intelligence";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await runSupplierIntelligence(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "SwiftPath could not analyze the supplier payload."
      },
      { status: 400 }
    );
  }
}


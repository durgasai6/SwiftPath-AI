import { NextResponse } from "next/server";
import { buildOpsSummary } from "@/lib/server/ops-summary";

export async function GET() {
  const ops = await buildOpsSummary();

  return NextResponse.json({
    ok: true,
    service: "SwiftPath",
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    defaultModel: process.env.GROQ_MODEL || "groq/compound-mini",
    readinessScore: ops.readinessScore,
    deploymentStage: ops.deploymentStage,
    latestScan: ops.latestScan,
    generatedAt: new Date().toISOString()
  });
}


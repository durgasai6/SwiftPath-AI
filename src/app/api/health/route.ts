import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "SwiftPath",
    groqConfigured: Boolean(process.env.GROQ_API_KEY),
    defaultModel: process.env.GROQ_MODEL || "groq/compound-mini",
    generatedAt: new Date().toISOString()
  });
}


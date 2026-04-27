import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "suppliers.json");

async function readSuppliers() {
  await mkdir(path.dirname(FILE), { recursive: true });
  try {
    const content = await readFile(FILE, "utf8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeSuppliers(data: unknown[]) {
  await writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const suppliers = await readSuppliers();
  return NextResponse.json(suppliers);
}

export async function POST(req: Request) {
  const body = await req.json();
  const suppliers = await readSuppliers();
  const newSupplier = {
    id: `sup-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...body
  };
  suppliers.unshift(newSupplier);
  await writeSuppliers(suppliers);
  return NextResponse.json(newSupplier, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const suppliers = await readSuppliers();
  const filtered = suppliers.filter((s: any) => s.id !== id);
  await writeSuppliers(filtered);
  return NextResponse.json({ ok: true });
}
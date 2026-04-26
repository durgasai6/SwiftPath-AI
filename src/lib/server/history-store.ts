import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const HISTORY_FILE = path.join(process.cwd(), "data", "analysis-history.json");

async function ensureHistoryFile() {
  await mkdir(path.dirname(HISTORY_FILE), { recursive: true });

  try {
    await readFile(HISTORY_FILE, "utf8");
  } catch {
    await writeFile(HISTORY_FILE, "[]", "utf8");
  }
}

export async function listHistory(limit = 8) {
  await ensureHistoryFile();
  const content = await readFile(HISTORY_FILE, "utf8");
  const parsed = JSON.parse(content);
  const history = Array.isArray(parsed) ? parsed : [];
  return history.slice(0, limit);
}

export async function appendHistory(entry: Record<string, unknown>) {
  const history = await listHistory(50);
  const nextEntry = {
    id: `run-${Date.now()}`,
    ...entry
  };

  const nextHistory = [nextEntry, ...history].slice(0, 20);
  await writeFile(HISTORY_FILE, JSON.stringify(nextHistory, null, 2), "utf8");

  return nextEntry;
}


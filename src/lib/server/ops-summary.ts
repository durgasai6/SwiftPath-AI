import { readFile } from "node:fs/promises";
import path from "node:path";
import type { AnalysisHistoryEntry, DeploymentStage, OpsCheck, OpsSummary, Supplier } from "@/types";
import { sampleSuppliers } from "@/lib/sample-suppliers";
import { toSupplierModel, summarizeSuppliers } from "@/lib/portfolio";
import { listHistory } from "@/lib/server/history-store";

const SUPPLIERS_FILE = path.join(process.cwd(), "data", "suppliers.json");

async function readPortfolioFile() {
  try {
    const content = await readFile(SUPPLIERS_FILE, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function loadPortfolioSuppliers() {
  const records = await readPortfolioFile();

  if (records.length > 0) {
    return records.map((record, index) => toSupplierModel(record, index));
  }

  return sampleSuppliers;
}

function toStage(score: number): DeploymentStage {
  if (score >= 85) return "ops-ready";
  if (score >= 65) return "pilot-ready";
  return "prototype";
}

function scoreChecks(checks: OpsCheck[]) {
  const total = checks.reduce((sum, check) => {
    if (check.status === "ready") return sum + 1;
    if (check.status === "warning") return sum + 0.6;
    return sum + 0.25;
  }, 0);

  return Math.round((total / checks.length) * 100);
}

function uniqueCountries(suppliers: Supplier[]) {
  return new Set(suppliers.map((supplier) => supplier.country).filter(Boolean)).size;
}

export async function buildOpsSummary(): Promise<OpsSummary> {
  const history = (await listHistory(12)) as AnalysisHistoryEntry[];
  const portfolio = await loadPortfolioSuppliers();
  const latestScan = history[0];
  const modePreference = process.env.GROQ_API_KEY ? "live" : "local";
  const latestSupplierCount = latestScan?.summary?.supplierCount ?? 0;
  const portfolioMetrics = summarizeSuppliers(portfolio);

  const checks: OpsCheck[] = [
    {
      id: "portfolio",
      title: "Portfolio dataset",
      description: "Suppliers are available for scan orchestration.",
      status: portfolio.length > 0 ? "ready" : "warning",
      detail:
        portfolio.length > 0
          ? `${portfolio.length} suppliers are loaded into the current workspace.`
          : "No supplier portfolio is loaded yet."
    },
    {
      id: "live-model",
      title: "Live AI research",
      description: "High-risk suppliers can escalate into live reasoning.",
      status: process.env.GROQ_API_KEY ? "ready" : "warning",
      detail: process.env.GROQ_API_KEY
        ? `Configured for live reasoning with ${process.env.GROQ_MODEL || "default Groq model"}.`
        : "No live model key found. The system will use deterministic local scoring."
    },
    {
      id: "fallback",
      title: "Fail-safe fallback",
      description: "The platform can continue operating when live AI is unavailable.",
      status: "ready",
      detail: "Local heuristics, sanctions matching, and persistence remain available without a model key."
    },
    {
      id: "audit",
      title: "Audit trail",
      description: "Every run is written to durable analysis history.",
      status: history.length > 0 ? "ready" : "warning",
      detail:
        history.length > 0
          ? `${history.length} recent analysis runs are available for review and reporting.`
          : "No scan history has been created yet."
    },
    {
      id: "reporting",
      title: "Reporting layer",
      description: "Portfolio findings can be exported for stakeholder review.",
      status: "ready",
      detail: "PDF reports and CSV exports are available from the dashboard."
    },
    {
      id: "coverage",
      title: "Geographic coverage",
      description: "The sample portfolio spans multiple sourcing regions.",
      status: uniqueCountries(portfolio) >= 4 ? "ready" : "warning",
      detail: `${uniqueCountries(portfolio)} countries are represented in the current portfolio.`
    }
  ];

  const readinessScore = scoreChecks(checks);
  const deploymentStage = toStage(readinessScore);
  const recommendedActions: string[] = [];

  if (!process.env.GROQ_API_KEY) {
    recommendedActions.push("Add a live model API key to demonstrate web-backed escalation during the presentation.");
  }
  if (!history.length) {
    recommendedActions.push("Run one seeded scan before the demo so the dashboard, alerts, and reports open with populated history.");
  }
  if (portfolioMetrics.singleSourceSuppliers > 0) {
    recommendedActions.push(`Highlight the ${portfolioMetrics.singleSourceSuppliers} single-source suppliers as examples of proactive mitigation.`);
  }
  if (!recommendedActions.length) {
    recommendedActions.push("Focus the demo on the escalation path from portfolio ingest to report generation and next actions.");
  }

  return {
    generatedAt: new Date().toISOString(),
    readinessScore,
    deploymentStage,
    modePreference,
    latestScan: {
      timestamp: latestScan?.timestamp ?? null,
      supplierCount: latestSupplierCount,
      averageRiskScore: latestScan?.summary?.averageRiskScore ?? 0,
      criticalSuppliers: latestScan?.summary?.criticalSuppliers ?? 0,
      modeUsed: latestScan?.modeUsed ?? "none"
    },
    portfolio: {
      totalSuppliers: portfolioMetrics.totalSuppliers,
      highRiskSuppliers: portfolioMetrics.highRiskSuppliers,
      singleSourceSuppliers: portfolioMetrics.singleSourceSuppliers,
      countriesCovered: portfolioMetrics.countriesCovered
    },
    checks,
    orchestration: [
      {
        id: "ingest",
        title: "Portfolio ingest",
        description: `${portfolioMetrics.totalSuppliers} suppliers are available for scan planning and triage.`,
        status: portfolioMetrics.totalSuppliers > 0 ? "ready" : "warning"
      },
      {
        id: "triage",
        title: "Baseline scoring",
        description: "Every supplier receives deterministic multi-signal scoring before escalation.",
        status: "ready"
      },
      {
        id: "escalation",
        title: "Live escalation",
        description: process.env.GROQ_API_KEY
          ? "The highest-risk suppliers can be re-analyzed with live reasoning."
          : "The escalation path is coded, but the app is currently using its fallback mode.",
        status: process.env.GROQ_API_KEY ? "ready" : "warning"
      },
      {
        id: "decision",
        title: "Decision support",
        description: latestSupplierCount > 0
          ? `Latest run produced actions for ${latestSupplierCount} suppliers.`
          : "Run a scan to generate recommendations, reports, and alert queues.",
        status: latestSupplierCount > 0 ? "ready" : "warning"
      }
    ],
    recommendedActions
  };
}

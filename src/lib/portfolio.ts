import type {
  AnalysisHistorySupplier,
  FinancialHealth,
  Supplier,
  SupplierCoordinates,
  SupplierInput,
  TrendDirection
} from "@/types";
import { getInitials, toRiskLevel } from "@/lib/utils";

type SupplierRecord = Record<string, unknown> & Partial<AnalysisHistorySupplier>;
type SupplierRecordInput = AnalysisHistorySupplier | Record<string, unknown>;

const countryMetadata: Record<
  string,
  {
    code: string;
    region: string;
    coordinates: SupplierCoordinates;
  }
> = {
  bangladesh: { code: "BD", region: "Asia-Pacific", coordinates: { lat: 23.685, lon: 90.3563, x: 67, y: 45 } },
  brazil: { code: "BR", region: "Americas", coordinates: { lat: -14.235, lon: -51.9253, x: 29, y: 73 } },
  china: { code: "CN", region: "Asia-Pacific", coordinates: { lat: 35.8617, lon: 104.1954, x: 74, y: 35 } },
  germany: { code: "DE", region: "Europe", coordinates: { lat: 51.1657, lon: 10.4515, x: 47, y: 18 } },
  india: { code: "IN", region: "Asia-Pacific", coordinates: { lat: 20.5937, lon: 78.9629, x: 67, y: 48 } },
  indonesia: { code: "ID", region: "Asia-Pacific", coordinates: { lat: -0.7893, lon: 113.9213, x: 73, y: 56 } },
  japan: { code: "JP", region: "Asia-Pacific", coordinates: { lat: 36.2048, lon: 138.2529, x: 82, y: 30 } },
  malaysia: { code: "MY", region: "Asia-Pacific", coordinates: { lat: 4.2105, lon: 101.9758, x: 70, y: 54 } },
  mexico: { code: "MX", region: "Americas", coordinates: { lat: 23.6345, lon: -102.5528, x: 24, y: 58 } },
  philippines: { code: "PH", region: "Asia-Pacific", coordinates: { lat: 12.8797, lon: 121.774, x: 76, y: 48 } },
  poland: { code: "PL", region: "Europe", coordinates: { lat: 51.9194, lon: 19.1451, x: 49, y: 20 } },
  south_korea: { code: "KR", region: "Asia-Pacific", coordinates: { lat: 35.9078, lon: 127.7669, x: 79, y: 27 } },
  taiwan: { code: "TW", region: "Asia-Pacific", coordinates: { lat: 23.6978, lon: 120.9605, x: 78, y: 37 } },
  thailand: { code: "TH", region: "Asia-Pacific", coordinates: { lat: 15.87, lon: 100.9925, x: 71, y: 49 } },
  turkey: { code: "TR", region: "EMEA", coordinates: { lat: 38.9637, lon: 35.2433, x: 56, y: 27 } },
  united_kingdom: { code: "GB", region: "Europe", coordinates: { lat: 55.3781, lon: -3.436, x: 43, y: 14 } },
  usa: { code: "US", region: "Americas", coordinates: { lat: 37.0902, lon: -95.7129, x: 18, y: 33 } },
  united_states: { code: "US", region: "Americas", coordinates: { lat: 37.0902, lon: -95.7129, x: 18, y: 33 } },
  vietnam: { code: "VN", region: "Asia-Pacific", coordinates: { lat: 14.0583, lon: 108.2772, x: 73, y: 47 } }
};

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const normalized = String(value ?? "").replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "1", "y"].includes(normalized)) return true;
    if (["false", "no", "0", "n"].includes(normalized)) return false;
  }
  return fallback;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function normalizeSupplierHealth(value: unknown): "strong" | "stable" | "weak" {
  const normalized = asString(value).toLowerCase();

  if (normalized === "strong" || normalized === "good") return "strong";
  if (normalized === "weak" || normalized === "poor") return "weak";
  return "stable";
}

export function normalizeCriticality(value: unknown, riskScore = 45): "low" | "medium" | "high" | "critical" {
  const normalized = asString(value).toLowerCase();

  if (normalized === "low" || normalized === "medium" || normalized === "high" || normalized === "critical") {
    return normalized;
  }

  if (riskScore >= 75) return "critical";
  if (riskScore >= 60) return "high";
  if (riskScore >= 35) return "medium";
  return "low";
}

function normalizeTrend(value: unknown): TrendDirection {
  const normalized = asString(value).toLowerCase();
  if (normalized === "up" || normalized === "down" || normalized === "stable") {
    return normalized;
  }
  return "stable";
}

function normalizeFinancialHealth(value: unknown, riskScore: number, supplierHealth: Supplier["supplierHealth"]): FinancialHealth {
  const normalized = asString(value).toLowerCase();

  if (normalized === "up" || normalized === "good" || normalized === "stable") return "up";
  if (normalized === "down" || normalized === "poor" || normalized === "stressed") return "down";
  if (normalized === "neutral" || normalized === "average" || normalized === "watch") return "neutral";

  if (supplierHealth === "weak" || riskScore >= 70) return "down";
  if (supplierHealth === "strong" && riskScore < 45) return "up";
  return "neutral";
}

function buildFallbackCoordinates(index: number): SupplierCoordinates {
  const x = 20 + (index % 5) * 14;
  const y = 24 + (index % 4) * 11;

  return {
    lat: 0,
    lon: 0,
    x: Math.min(82, x),
    y: Math.min(72, y)
  };
}

function getCountryMeta(country: string, index: number) {
  const key = normalizeKey(country);
  return (
    countryMetadata[key] ?? {
      code: country.slice(0, 2).toUpperCase() || "NA",
      region: "Global Portfolio",
      coordinates: buildFallbackCoordinates(index)
    }
  );
}

function deriveTrendDelta(riskScore: number, trend: TrendDirection) {
  if (trend === "up") return Math.max(2, Math.round(riskScore / 10));
  if (trend === "down") return -Math.max(1, Math.round((100 - riskScore) / 20));
  return 0;
}

export function toSupplierModel(record: SupplierRecordInput, index: number): Supplier {
  const source = record as SupplierRecord;
  const name = asString(source.name ?? source.supplierName ?? source.supplier_name, `Supplier ${index + 1}`);
  const country = asString(source.country, "Unknown");
  const industry = asString(source.industry, asString(source.category, "General"));
  const category = asString(source.category, industry || "General");
  const riskScore = clamp(
    asNumber(source.riskScore ?? source.risk_score, Math.max(30, 42 + (index % 4) * 8))
  );
  const riskLevel = source.riskLevel && typeof source.riskLevel === "string"
    ? toRiskLevel(asNumber(source.riskScore ?? source.risk_score, riskScore))
    : toRiskLevel(riskScore);
  const supplierHealth = normalizeSupplierHealth(source.supplier_health ?? source.supplierHealth);
  const trend = normalizeTrend(source.riskTrend ?? source.trend);
  const meta = getCountryMeta(country, index);
  const onTimeDeliveryPct = clamp(
    asNumber(source.onTimeDeliveryPct ?? source.on_time_delivery_pct, riskScore >= 70 ? 84 : 94),
    40,
    100
  );
  const inventoryBufferDays = clamp(
    asNumber(source.inventoryBufferDays ?? source.inventory_buffer_days, riskScore >= 70 ? 8 : 16),
    0,
    60
  );

  return {
    id: asString(source.id, `portfolio-${index + 1}`),
    name,
    initials: getInitials(name) || "SP",
    country,
    countryCode: meta.code,
    flag: meta.code,
    city: asString(source.city, country),
    industry: industry || "General",
    category: category || "General",
    annualSpendUsd: asNumber(source.annualSpendUsd ?? source.annual_spend_usd, 0),
    riskScore,
    riskLevel,
    riskTrend: trend,
    trendDelta: asNumber(source.trendDelta, deriveTrendDelta(riskScore, trend)),
    newsSignals: clamp(asNumber(source.newsSignals, Math.max(1, Math.round(riskScore / 12))), 0, 20),
    financialHealth: normalizeFinancialHealth(source.financialHealth, riskScore, supplierHealth),
    lastScannedAt: asString(
      source.lastScannedAt ?? source.createdAt ?? source.generatedAt ?? source.timestamp,
      new Date().toISOString()
    ),
    criticality: normalizeCriticality(source.criticality, riskScore),
    singleSource: asBoolean(source.singleSource ?? source.single_source, riskScore >= 75),
    onTimeDeliveryPct,
    inventoryBufferDays,
    supplierHealth,
    activeAlerts: clamp(asNumber(source.activeAlerts, riskScore >= 75 ? 3 : riskScore >= 60 ? 1 : 0), 0, 12),
    riskSummary: asString(
      source.riskSummary ?? source.recommendation ?? source.explanation ?? source.incident_note,
      `${name} requires ${riskScore >= 70 ? "immediate" : "continued"} monitoring.`
    ),
    locationLabel: meta.region,
    coordinates: meta.coordinates
  };
}

export function toSupplierInput(supplier: Supplier): SupplierInput {
  return {
    supplier_name: supplier.name,
    country: supplier.country,
    industry: supplier.industry,
    category: supplier.category,
    annual_spend_usd: supplier.annualSpendUsd,
    criticality: supplier.criticality,
    on_time_delivery_pct: supplier.onTimeDeliveryPct,
    inventory_buffer_days: supplier.inventoryBufferDays,
    supplier_health: supplier.supplierHealth,
    single_source: supplier.singleSource,
    incident_note: supplier.riskSummary
  };
}

export function toStoredSupplierRecord(supplier: Supplier) {
  return {
    id: supplier.id,
    name: supplier.name,
    country: supplier.country,
    city: supplier.city,
    category: supplier.category,
    industry: supplier.industry,
    riskScore: supplier.riskScore,
    riskLevel: supplier.riskLevel,
    annualSpendUsd: supplier.annualSpendUsd,
    criticality: supplier.criticality,
    onTimeDeliveryPct: supplier.onTimeDeliveryPct,
    inventoryBufferDays: supplier.inventoryBufferDays,
    supplierHealth: supplier.supplierHealth,
    singleSource: supplier.singleSource,
    riskSummary: supplier.riskSummary,
    newsSignals: supplier.newsSignals,
    financialHealth: supplier.financialHealth,
    createdAt: new Date().toISOString()
  };
}

export function summarizeSuppliers(suppliers: Supplier[]) {
  const highRiskSuppliers = suppliers.filter((supplier) => supplier.riskScore >= 60).length;
  const singleSourceSuppliers = suppliers.filter((supplier) => supplier.singleSource).length;
  const countriesCovered = new Set(suppliers.map((supplier) => supplier.country).filter(Boolean)).size;

  return {
    totalSuppliers: suppliers.length,
    highRiskSuppliers,
    singleSourceSuppliers,
    countriesCovered
  };
}

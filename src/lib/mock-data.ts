import type {
  AgentLogEntry,
  AgentSummary,
  AlertEntry,
  DashboardRiskPoint,
  ReportEntry,
  Supplier,
  SupplierRiskHistory,
  WeeklyAlertCount,
  WeeklyDigest
} from "@/types";
import { getInitials, toRiskLevel } from "@/lib/utils";

const now = new Date("2026-04-26T10:30:00.000Z");

function isoMinutesAgo(minutes: number) {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
}

function isoDaysAgo(days: number) {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

const supplierSeed: Array<
  Omit<Supplier, "id" | "initials" | "riskLevel"> & {
    id: string;
  }
> = [
  {
    id: "supplier-1",
    name: "Zhonghao Electronics",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    city: "Shenzhen",
    industry: "Electronics",
    category: "Semiconductors",
    annualSpendUsd: 4_600_000,
    riskScore: 84,
    riskTrend: "up",
    trendDelta: 11,
    newsSignals: 18,
    financialHealth: "down",
    lastScannedAt: isoMinutesAgo(8),
    criticality: "critical",
    singleSource: true,
    onTimeDeliveryPct: 89,
    inventoryBufferDays: 10,
    supplierHealth: "weak",
    activeAlerts: 4,
    riskSummary:
      "Export control pressure and longer port dwell times are making lead-time commitments unreliable.",
    locationLabel: "Shenzhen, China",
    coordinates: { lat: 22.5431, lon: 114.0579, x: 78, y: 44 }
  },
  {
    id: "supplier-2",
    name: "Apex Garments Ltd",
    country: "Bangladesh",
    countryCode: "BD",
    flag: "🇧🇩",
    city: "Dhaka",
    industry: "Apparel",
    category: "Finished Goods",
    annualSpendUsd: 1_350_000,
    riskScore: 71,
    riskTrend: "up",
    trendDelta: 7,
    newsSignals: 11,
    financialHealth: "neutral",
    lastScannedAt: isoMinutesAgo(19),
    criticality: "high",
    singleSource: false,
    onTimeDeliveryPct: 91,
    inventoryBufferDays: 13,
    supplierHealth: "stable",
    activeAlerts: 3,
    riskSummary:
      "Labor unrest and monsoon-season infrastructure bottlenecks are increasing schedule variability.",
    locationLabel: "Dhaka, Bangladesh",
    coordinates: { lat: 23.8103, lon: 90.4125, x: 74, y: 47 }
  },
  {
    id: "supplier-3",
    name: "Formosa Precision Systems",
    country: "Taiwan",
    countryCode: "TW",
    flag: "🇹🇼",
    city: "Taichung",
    industry: "Electronics",
    category: "Advanced Components",
    annualSpendUsd: 5_200_000,
    riskScore: 79,
    riskTrend: "up",
    trendDelta: 9,
    newsSignals: 15,
    financialHealth: "up",
    lastScannedAt: isoMinutesAgo(6),
    criticality: "critical",
    singleSource: true,
    onTimeDeliveryPct: 94,
    inventoryBufferDays: 12,
    supplierHealth: "strong",
    activeAlerts: 4,
    riskSummary:
      "Regional geopolitical tension is the primary risk driver despite strong operational discipline.",
    locationLabel: "Taichung, Taiwan",
    coordinates: { lat: 24.1477, lon: 120.6736, x: 82, y: 44 }
  },
  {
    id: "supplier-4",
    name: "Lotus Circuit Systems",
    country: "Vietnam",
    countryCode: "VN",
    flag: "🇻🇳",
    city: "Ho Chi Minh City",
    industry: "Electronics",
    category: "Contract Manufacturing",
    annualSpendUsd: 2_950_000,
    riskScore: 63,
    riskTrend: "up",
    trendDelta: 5,
    newsSignals: 8,
    financialHealth: "neutral",
    lastScannedAt: isoMinutesAgo(12),
    criticality: "high",
    singleSource: false,
    onTimeDeliveryPct: 93,
    inventoryBufferDays: 16,
    supplierHealth: "stable",
    activeAlerts: 2,
    riskSummary:
      "Capacity tightening in electronics corridors is compressing buffers for peak-season orders.",
    locationLabel: "Ho Chi Minh City, Vietnam",
    coordinates: { lat: 10.8231, lon: 106.6297, x: 77, y: 55 }
  },
  {
    id: "supplier-5",
    name: "Banyan Textiles India",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    city: "Coimbatore",
    industry: "Textiles",
    category: "Yarn & Fabric",
    annualSpendUsd: 1_180_000,
    riskScore: 58,
    riskTrend: "stable",
    trendDelta: 1,
    newsSignals: 7,
    financialHealth: "up",
    lastScannedAt: isoMinutesAgo(25),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 95,
    inventoryBufferDays: 21,
    supplierHealth: "strong",
    activeAlerts: 1,
    riskSummary:
      "Weather-linked logistics swings are manageable, but raw material pricing remains volatile.",
    locationLabel: "Coimbatore, India",
    coordinates: { lat: 11.0168, lon: 76.9558, x: 69, y: 56 }
  },
  {
    id: "supplier-6",
    name: "Meridian Auto Components",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    city: "Monterrey",
    industry: "Automotive",
    category: "Tier 2 Parts",
    annualSpendUsd: 2_480_000,
    riskScore: 66,
    riskTrend: "up",
    trendDelta: 4,
    newsSignals: 9,
    financialHealth: "down",
    lastScannedAt: isoMinutesAgo(14),
    criticality: "high",
    singleSource: true,
    onTimeDeliveryPct: 90,
    inventoryBufferDays: 11,
    supplierHealth: "stable",
    activeAlerts: 3,
    riskSummary:
      "Border inspections and freight bottlenecks are amplifying risk for just-in-time deliveries.",
    locationLabel: "Monterrey, Mexico",
    coordinates: { lat: 25.6866, lon: -100.3161, x: 22, y: 42 }
  },
  {
    id: "supplier-7",
    name: "TechParts GmbH",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    city: "Stuttgart",
    industry: "Industrial Manufacturing",
    category: "Precision Parts",
    annualSpendUsd: 1_920_000,
    riskScore: 34,
    riskTrend: "down",
    trendDelta: -3,
    newsSignals: 4,
    financialHealth: "up",
    lastScannedAt: isoMinutesAgo(41),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 98,
    inventoryBufferDays: 25,
    supplierHealth: "strong",
    activeAlerts: 0,
    riskSummary:
      "Stable operations and stronger compliance posture keep this supplier within a low-watch range.",
    locationLabel: "Stuttgart, Germany",
    coordinates: { lat: 48.7758, lon: 9.1829, x: 50, y: 28 }
  },
  {
    id: "supplier-8",
    name: "Novo Agro Inputs",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    city: "Campinas",
    industry: "Chemicals",
    category: "Industrial Inputs",
    annualSpendUsd: 1_760_000,
    riskScore: 47,
    riskTrend: "stable",
    trendDelta: 2,
    newsSignals: 6,
    financialHealth: "neutral",
    lastScannedAt: isoMinutesAgo(32),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 94,
    inventoryBufferDays: 19,
    supplierHealth: "stable",
    activeAlerts: 1,
    riskSummary:
      "Flood-prone transport corridors are a recurring issue, though exposure is partially buffered.",
    locationLabel: "Campinas, Brazil",
    coordinates: { lat: -22.9099, lon: -47.0626, x: 31, y: 71 }
  },
  {
    id: "supplier-9",
    name: "Hanul Semicon",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    city: "Suwon",
    industry: "Electronics",
    category: "Chip Packaging",
    annualSpendUsd: 3_680_000,
    riskScore: 49,
    riskTrend: "down",
    trendDelta: -2,
    newsSignals: 5,
    financialHealth: "up",
    lastScannedAt: isoMinutesAgo(11),
    criticality: "high",
    singleSource: false,
    onTimeDeliveryPct: 97,
    inventoryBufferDays: 20,
    supplierHealth: "strong",
    activeAlerts: 1,
    riskSummary:
      "Operational execution is strong, though dependence on regional chip demand keeps volatility in view.",
    locationLabel: "Suwon, South Korea",
    coordinates: { lat: 37.2636, lon: 127.0286, x: 83, y: 39 }
  },
  {
    id: "supplier-10",
    name: "Pacific Molded Plastics",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    city: "Batam",
    industry: "Packaging",
    category: "Plastics",
    annualSpendUsd: 960_000,
    riskScore: 52,
    riskTrend: "up",
    trendDelta: 3,
    newsSignals: 5,
    financialHealth: "neutral",
    lastScannedAt: isoMinutesAgo(28),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 92,
    inventoryBufferDays: 14,
    supplierHealth: "stable",
    activeAlerts: 2,
    riskSummary:
      "Maritime congestion and seasonal weather patterns are the main disruptors for outbound reliability.",
    locationLabel: "Batam, Indonesia",
    coordinates: { lat: 1.0456, lon: 104.0305, x: 78, y: 59 }
  },
  {
    id: "supplier-11",
    name: "EastBridge Optics",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    city: "Suzhou",
    industry: "Optoelectronics",
    category: "Optical Assemblies",
    annualSpendUsd: 2_400_000,
    riskScore: 69,
    riskTrend: "up",
    trendDelta: 6,
    newsSignals: 10,
    financialHealth: "down",
    lastScannedAt: isoMinutesAgo(9),
    criticality: "high",
    singleSource: true,
    onTimeDeliveryPct: 88,
    inventoryBufferDays: 9,
    supplierHealth: "weak",
    activeAlerts: 3,
    riskSummary:
      "Margin pressure and shipping volatility are combining into a sharper near-term execution risk.",
    locationLabel: "Suzhou, China",
    coordinates: { lat: 31.2989, lon: 120.5853, x: 79, y: 40 }
  },
  {
    id: "supplier-12",
    name: "Delta Alloy Works",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    city: "Pune",
    industry: "Metals",
    category: "Fabrication",
    annualSpendUsd: 1_420_000,
    riskScore: 55,
    riskTrend: "stable",
    trendDelta: 0,
    newsSignals: 6,
    financialHealth: "neutral",
    lastScannedAt: isoMinutesAgo(37),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 93,
    inventoryBufferDays: 17,
    supplierHealth: "stable",
    activeAlerts: 1,
    riskSummary:
      "Power availability and commodity inputs remain the principal issues to watch over the next quarter.",
    locationLabel: "Pune, India",
    coordinates: { lat: 18.5204, lon: 73.8567, x: 68, y: 51 }
  },
  {
    id: "supplier-13",
    name: "RheinChem Logistics",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    city: "Frankfurt",
    industry: "Logistics",
    category: "Cold Chain",
    annualSpendUsd: 820_000,
    riskScore: 29,
    riskTrend: "down",
    trendDelta: -4,
    newsSignals: 3,
    financialHealth: "up",
    lastScannedAt: isoMinutesAgo(48),
    criticality: "low",
    singleSource: false,
    onTimeDeliveryPct: 99,
    inventoryBufferDays: 27,
    supplierHealth: "strong",
    activeAlerts: 0,
    riskSummary:
      "Redundant routes and low incident frequency keep this partner well inside the safe band.",
    locationLabel: "Frankfurt, Germany",
    coordinates: { lat: 50.1109, lon: 8.6821, x: 49, y: 27 }
  },
  {
    id: "supplier-14",
    name: "Azul Components Brasil",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    city: "Sao Paulo",
    industry: "Automotive",
    category: "Cable Systems",
    annualSpendUsd: 1_680_000,
    riskScore: 45,
    riskTrend: "up",
    trendDelta: 2,
    newsSignals: 4,
    financialHealth: "neutral",
    lastScannedAt: isoMinutesAgo(20),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 95,
    inventoryBufferDays: 18,
    supplierHealth: "stable",
    activeAlerts: 1,
    riskSummary:
      "Operationally steady, but domestic transport delays can still hit time-sensitive replenishment windows.",
    locationLabel: "Sao Paulo, Brazil",
    coordinates: { lat: -23.5505, lon: -46.6333, x: 31, y: 72 }
  },
  {
    id: "supplier-15",
    name: "Mekar Industrial Panels",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    city: "Surabaya",
    industry: "Industrial Equipment",
    category: "Subassemblies",
    annualSpendUsd: 1_040_000,
    riskScore: 50,
    riskTrend: "up",
    trendDelta: 4,
    newsSignals: 5,
    financialHealth: "neutral",
    lastScannedAt: isoMinutesAgo(22),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 92,
    inventoryBufferDays: 15,
    supplierHealth: "stable",
    activeAlerts: 2,
    riskSummary:
      "Port throughput and storm-season exposure are keeping this supplier in a monitored band.",
    locationLabel: "Surabaya, Indonesia",
    coordinates: { lat: -7.2575, lon: 112.7521, x: 79, y: 64 }
  }
];

export const suppliers: Supplier[] = supplierSeed.map((supplier) => ({
  ...supplier,
  initials: getInitials(supplier.name),
  riskLevel: toRiskLevel(supplier.riskScore)
}));

const wavePattern = [-4, -3, -2, 0, 2, 4, 3, 1, -1, -2];

function buildHistory(baseScore: number, supplierIndex: number): SupplierRiskHistory["points"] {
  return Array.from({ length: 30 }, (_, index) => {
    const date = isoDaysAgo(29 - index).slice(0, 10);
    const modulation = wavePattern[(index + supplierIndex) % wavePattern.length];
    const cycle = ((index + supplierIndex) % 6) - 2;
    const score = Math.max(16, Math.min(96, baseScore + modulation + cycle));
    const alerts = score >= 75 ? 3 : score >= 55 ? 2 : score >= 35 ? 1 : 0;

    return {
      date,
      score,
      alerts
    };
  });
}

export const supplierRiskHistory: SupplierRiskHistory[] = suppliers.map((supplier, index) => ({
  supplierId: supplier.id,
  points: buildHistory(supplier.riskScore, index)
}));

export const dashboardRiskHistory: DashboardRiskPoint[] = Array.from({ length: 30 }, (_, index) => {
  const date = supplierRiskHistory[0]?.points[index]?.date ?? isoDaysAgo(29 - index).slice(0, 10);
  const scores = supplierRiskHistory.map((history) => history.points[index]?.score ?? 0);
  const criticalAlerts = supplierRiskHistory.reduce(
    (total, history) => total + (history.points[index]?.alerts ?? 0),
    0
  );

  const averageRiskScore = Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);

  return {
    date,
    averageRiskScore,
    criticalAlerts,
    suppliersScanned: suppliers.length
  };
});

export const riskDistribution = [
  {
    name: "Low",
    value: suppliers.filter((supplier) => supplier.riskLevel === "low").length,
    fill: "#10B981"
  },
  {
    name: "Medium",
    value: suppliers.filter((supplier) => supplier.riskLevel === "medium").length,
    fill: "#3B82F6"
  },
  {
    name: "High",
    value: suppliers.filter((supplier) => supplier.riskLevel === "high").length,
    fill: "#F59E0B"
  },
  {
    name: "Critical",
    value: suppliers.filter((supplier) => supplier.riskLevel === "critical").length,
    fill: "#EF4444"
  }
];

export const agentSummaries: AgentSummary[] = [
  {
    id: "news-agent",
    name: "News Agent",
    status: "busy",
    lastRunAt: isoMinutesAgo(5),
    suppliersScanned: 15,
    alertsGenerated: 7
  },
  {
    id: "financial-agent",
    name: "Financial Agent",
    status: "healthy",
    lastRunAt: isoMinutesAgo(11),
    suppliersScanned: 15,
    alertsGenerated: 4
  },
  {
    id: "geo-agent",
    name: "Geo Agent",
    status: "degraded",
    lastRunAt: isoMinutesAgo(3),
    suppliersScanned: 15,
    alertsGenerated: 6
  },
  {
    id: "sentiment-agent",
    name: "Sentiment Agent",
    status: "healthy",
    lastRunAt: isoMinutesAgo(8),
    suppliersScanned: 15,
    alertsGenerated: 5
  }
];

export const agentLogEntries: AgentLogEntry[] = [
  {
    id: "log-1",
    status: "running",
    agentName: "Geo Agent",
    action: "Detected escalation in cross-strait shipping posture",
    supplierName: "Formosa Precision Systems",
    timestamp: isoMinutesAgo(2),
    durationMs: 842,
    result: "critical"
  },
  {
    id: "log-2",
    status: "processing",
    agentName: "News Agent",
    action: "Clustered 12 fresh articles into a port-congestion event",
    supplierName: "Zhonghao Electronics",
    timestamp: isoMinutesAgo(4),
    durationMs: 1260,
    result: "warning"
  },
  {
    id: "log-3",
    status: "complete",
    agentName: "Sentiment Agent",
    action: "Raised confidence on logistics strike coverage",
    supplierName: "Apex Garments Ltd",
    timestamp: isoMinutesAgo(7),
    durationMs: 905,
    result: "warning"
  },
  {
    id: "log-4",
    status: "alert",
    agentName: "Financial Agent",
    action: "Flagged balance-sheet stress from supplier credit commentary",
    supplierName: "EastBridge Optics",
    timestamp: isoMinutesAgo(9),
    durationMs: 1045,
    result: "critical"
  },
  {
    id: "log-5",
    status: "complete",
    agentName: "News Agent",
    action: "Closed duplicate weather disruption cluster",
    supplierName: "Novo Agro Inputs",
    timestamp: isoMinutesAgo(12),
    durationMs: 532,
    result: "success"
  },
  {
    id: "log-6",
    status: "running",
    agentName: "Geo Agent",
    action: "Scored sanctions adjacency across strategic suppliers",
    supplierName: "Meridian Auto Components",
    timestamp: isoMinutesAgo(14),
    durationMs: 1191,
    result: "warning"
  },
  {
    id: "log-7",
    status: "processing",
    agentName: "Sentiment Agent",
    action: "Refreshed headline sentiment baseline after a supplier earnings call",
    supplierName: "Hanul Semicon",
    timestamp: isoMinutesAgo(16),
    durationMs: 888,
    result: "success"
  },
  {
    id: "log-8",
    status: "alert",
    agentName: "Weather Agent",
    action: "Escalated rainfall and flood impact forecast on logistics corridor",
    supplierName: "Pacific Molded Plastics",
    timestamp: isoMinutesAgo(18),
    durationMs: 1540,
    result: "warning"
  },
  {
    id: "log-9",
    status: "complete",
    agentName: "Financial Agent",
    action: "Confirmed stable covenant position for strategic tier-two partner",
    supplierName: "TechParts GmbH",
    timestamp: isoMinutesAgo(21),
    durationMs: 640,
    result: "success"
  },
  {
    id: "log-10",
    status: "processing",
    agentName: "Geo Agent",
    action: "Updated shipping-lane exposure around South China Sea routes",
    supplierName: "Lotus Circuit Systems",
    timestamp: isoMinutesAgo(25),
    durationMs: 1124,
    result: "warning"
  },
  {
    id: "log-11",
    status: "running",
    agentName: "News Agent",
    action: "Matched labor protest coverage to supplier manufacturing district",
    supplierName: "Apex Garments Ltd",
    timestamp: isoMinutesAgo(29),
    durationMs: 1333,
    result: "warning"
  },
  {
    id: "log-12",
    status: "complete",
    agentName: "Sentiment Agent",
    action: "Lowered risk after improved service-level commentary",
    supplierName: "RheinChem Logistics",
    timestamp: isoMinutesAgo(34),
    durationMs: 720,
    result: "success"
  },
  {
    id: "log-13",
    status: "alert",
    agentName: "Financial Agent",
    action: "Escalated cash conversion concerns after supplier guidance cut",
    supplierName: "Zhonghao Electronics",
    timestamp: isoMinutesAgo(39),
    durationMs: 1572,
    result: "critical"
  },
  {
    id: "log-14",
    status: "processing",
    agentName: "Weather Agent",
    action: "Pulled fresh severe-weather window for inland trucking lanes",
    supplierName: "Banyan Textiles India",
    timestamp: isoMinutesAgo(44),
    durationMs: 804,
    result: "warning"
  },
  {
    id: "log-15",
    status: "complete",
    agentName: "Geo Agent",
    action: "Re-ranked country-level exposure after policy review",
    supplierName: "Azul Components Brasil",
    timestamp: isoMinutesAgo(49),
    durationMs: 910,
    result: "success"
  },
  {
    id: "log-16",
    status: "running",
    agentName: "News Agent",
    action: "Collecting updates on port throughput and customs delays",
    supplierName: "Meridian Auto Components",
    timestamp: isoMinutesAgo(53),
    durationMs: 1110,
    result: "warning"
  },
  {
    id: "log-17",
    status: "complete",
    agentName: "Financial Agent",
    action: "Marked supplier outlook unchanged after banking review",
    supplierName: "Delta Alloy Works",
    timestamp: isoMinutesAgo(61),
    durationMs: 642,
    result: "success"
  },
  {
    id: "log-18",
    status: "alert",
    agentName: "Weather Agent",
    action: "Generated flood-driven route diversion alert",
    supplierName: "Novo Agro Inputs",
    timestamp: isoMinutesAgo(67),
    durationMs: 1695,
    result: "warning"
  },
  {
    id: "log-19",
    status: "processing",
    agentName: "Sentiment Agent",
    action: "Consolidated adverse chatter across supplier subcontractors",
    supplierName: "Mekar Industrial Panels",
    timestamp: isoMinutesAgo(74),
    durationMs: 980,
    result: "warning"
  },
  {
    id: "log-20",
    status: "complete",
    agentName: "Geo Agent",
    action: "Validated calm shipping posture for European lanes",
    supplierName: "TechParts GmbH",
    timestamp: isoMinutesAgo(81),
    durationMs: 618,
    result: "success"
  }
];

export const alerts: AlertEntry[] = [
  {
    id: "alert-1",
    severity: "critical",
    riskType: "Geopolitical",
    supplierId: "supplier-3",
    supplierName: "Formosa Precision Systems",
    country: "Taiwan",
    flag: "🇹🇼",
    headline: "Military posture shift raises short-term disruption risk",
    description:
      "Carrier advisories and geopolitical monitoring both indicate a higher probability of shipping schedule changes over the next 72 hours.",
    tags: ["GDELT", "Geo", "Shipping"],
    timestamp: isoMinutesAgo(18),
    resolved: false
  },
  {
    id: "alert-2",
    severity: "warning",
    riskType: "Logistics",
    supplierId: "supplier-6",
    supplierName: "Meridian Auto Components",
    country: "Mexico",
    flag: "🇲🇽",
    headline: "Border inspection delays are stretching inbound lead times",
    description:
      "Average customs clearance time crossed the internal threshold for just-in-time programs with no additional inventory cover.",
    tags: ["Transport", "Border", "Customs"],
    timestamp: isoMinutesAgo(31),
    resolved: false
  },
  {
    id: "alert-3",
    severity: "warning",
    riskType: "Weather",
    supplierId: "supplier-8",
    supplierName: "Novo Agro Inputs",
    country: "Brazil",
    flag: "🇧🇷",
    headline: "Flooding near a key corridor may impact dispatch windows",
    description:
      "Heavy precipitation around the Campinas corridor is likely to slow heavy vehicle movement through primary routes this week.",
    tags: ["Weather", "Open-Meteo", "Road"],
    timestamp: isoMinutesAgo(42),
    resolved: false
  },
  {
    id: "alert-4",
    severity: "critical",
    riskType: "Financial",
    supplierId: "supplier-11",
    supplierName: "EastBridge Optics",
    country: "China",
    flag: "🇨🇳",
    headline: "Supplier credit stress triggered escalation",
    description:
      "Multiple signals from lender commentary and supplier margin pressure point to worsening liquidity resilience this quarter.",
    tags: ["Financial", "Credit", "Earnings"],
    timestamp: isoMinutesAgo(55),
    resolved: false
  },
  {
    id: "alert-5",
    severity: "info",
    riskType: "Sentiment",
    supplierId: "supplier-7",
    supplierName: "TechParts GmbH",
    country: "Germany",
    flag: "🇩🇪",
    headline: "Negative coverage cluster resolved after plant update",
    description:
      "A temporary news spike has normalized after the supplier confirmed no impact to output or service levels.",
    tags: ["Sentiment", "News"],
    timestamp: isoMinutesAgo(66),
    resolved: true
  },
  {
    id: "alert-6",
    severity: "warning",
    riskType: "Labor",
    supplierId: "supplier-2",
    supplierName: "Apex Garments Ltd",
    country: "Bangladesh",
    flag: "🇧🇩",
    headline: "Labor action watchlist expanded near core facility district",
    description:
      "Local reporting shows labor mobilization near garment clusters with a moderate probability of output slowdown if unresolved.",
    tags: ["Labor", "GDELT", "Local Press"],
    timestamp: isoMinutesAgo(79),
    resolved: false
  },
  {
    id: "alert-7",
    severity: "info",
    riskType: "Operational",
    supplierId: "supplier-5",
    supplierName: "Banyan Textiles India",
    country: "India",
    flag: "🇮🇳",
    headline: "Buffer stock keeps current weather exposure manageable",
    description:
      "The latest scan still shows elevated weather noise, but the supplier's existing buffer days prevent an immediate service concern.",
    tags: ["Buffer", "Weather"],
    timestamp: isoMinutesAgo(96),
    resolved: true
  },
  {
    id: "alert-8",
    severity: "warning",
    riskType: "Capacity",
    supplierId: "supplier-4",
    supplierName: "Lotus Circuit Systems",
    country: "Vietnam",
    flag: "🇻🇳",
    headline: "Capacity tightness detected across contract manufacturing hub",
    description:
      "Supplier and subcontractor references indicate that available surge capacity is narrowing faster than forecast.",
    tags: ["Capacity", "Manufacturing", "Demand"],
    timestamp: isoMinutesAgo(112),
    resolved: false
  },
  {
    id: "alert-9",
    severity: "critical",
    riskType: "Compliance",
    supplierId: "supplier-1",
    supplierName: "Zhonghao Electronics",
    country: "China",
    flag: "🇨🇳",
    headline: "Export-control exposure requires procurement review",
    description:
      "The latest AI-guided scan detected higher compliance sensitivity around product classes tied to this supplier's portfolio.",
    tags: ["Compliance", "Export Control", "AI Review"],
    timestamp: isoMinutesAgo(128),
    resolved: false
  },
  {
    id: "alert-10",
    severity: "info",
    riskType: "Performance",
    supplierId: "supplier-13",
    supplierName: "RheinChem Logistics",
    country: "Germany",
    flag: "🇩🇪",
    headline: "Service recovery completed across refrigerated lane",
    description:
      "Temperature-control excursions have returned to baseline and no further escalation is currently required.",
    tags: ["Cold Chain", "Performance"],
    timestamp: isoMinutesAgo(147),
    resolved: true
  }
];

export const reports: ReportEntry[] = [
  {
    id: "report-1",
    name: "Weekly Supplier Risk Digest",
    dateRange: "Apr 19 - Apr 25, 2026",
    supplierCount: 15,
    generatedAt: isoDaysAgo(1),
    format: "PDF",
    summary:
      "Cross-strait exposure and Mexico border delays drove the sharpest portfolio risk increases this week."
  },
  {
    id: "report-2",
    name: "Critical Supplier Escalation Pack",
    dateRange: "Apr 1 - Apr 25, 2026",
    supplierCount: 4,
    generatedAt: isoDaysAgo(4),
    format: "PDF",
    summary:
      "Executive-ready review of suppliers in the critical band, including mitigation status and spend exposure."
  },
  {
    id: "report-3",
    name: "Quarterly Country Exposure Snapshot",
    dateRange: "Jan 1 - Mar 31, 2026",
    supplierCount: 15,
    generatedAt: isoDaysAgo(10),
    format: "CSV",
    summary:
      "Country-level rollup of supplier concentration, alert density, and average risk score movement."
  },
  {
    id: "report-4",
    name: "Weather-Driven Logistics Variance",
    dateRange: "Apr 5 - Apr 25, 2026",
    supplierCount: 6,
    generatedAt: isoDaysAgo(14),
    format: "PDF",
    summary:
      "Focused report on suppliers whose logistics performance shifted materially due to weather and corridor disruptions."
  }
];

export const weeklyDigest: WeeklyDigest = {
  headline: "Portfolio pressure increased, but the risk is concentrated rather than broad-based.",
  overview:
    "SwiftPath detected a 6-point rise in the average risk score across the monitored portfolio, led primarily by East Asia electronics exposure and one strategic Mexican automotive supplier. Most European and diversified suppliers remained stable, which kept the overall alert load contained.",
  sections: [
    {
      title: "What changed",
      description:
        "Formosa Precision Systems and Zhonghao Electronics both moved further into the critical band after geopolitical and compliance signals worsened."
    },
    {
      title: "Where the portfolio is resilient",
      description:
        "German logistics and precision-part suppliers continued to operate within expected service levels, helping offset volatility in Asia."
    },
    {
      title: "What operations should do next",
      description:
        "Review contingency options for single-source electronics dependencies and increase visibility into border-sensitive automotive lanes."
    }
  ]
};

export const weeklyAlertCounts: WeeklyAlertCount[] = [
  { week: "Week 1", low: 5, medium: 8, high: 3 },
  { week: "Week 2", low: 4, medium: 10, high: 4 },
  { week: "Week 3", low: 6, medium: 9, high: 5 },
  { week: "Week 4", low: 4, medium: 11, high: 6 }
];

export const dashboardStats = {
  totalSuppliers: suppliers.length,
  highRiskSuppliers: suppliers.filter((supplier) => ["high", "critical"].includes(supplier.riskLevel)).length,
  criticalSuppliers: suppliers.filter((supplier) => supplier.riskLevel === "critical").length,
  alertsToday: alerts.filter((alert) => !alert.resolved).length,
  agentsRunning: agentSummaries.filter((agent) => agent.status === "busy" || agent.status === "healthy").length,
  averageRisk:
    Math.round(suppliers.reduce((sum, supplier) => sum + supplier.riskScore, 0) / suppliers.length),
  suppliersMonitoredLabel: "500+ Suppliers Monitored",
  earlyWarningLabel: "48hr Early Warning",
  accuracyLabel: "94% Accuracy",
  freeStartLabel: "Zero Cost to Start"
};

export const topAtRiskSuppliers = [...suppliers]
  .sort((left, right) => right.riskScore - left.riskScore)
  .slice(0, 5);


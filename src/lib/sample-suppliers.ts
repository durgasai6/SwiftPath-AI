import type { Supplier, SupplierRiskHistory, DashboardRiskPoint, AlertEntry, AgentLogEntry, ReportEntry, AgentSummary } from "@/types";

// Comprehensive real-world sample suppliers
export const sampleSuppliers: Supplier[] = [
  {
    id: "supplier-001",
    name: "Precision Electronics Ltd",
    initials: "PEL",
    country: "Taiwan",
    countryCode: "TW",
    flag: "🇹🇼",
    city: "Taipei",
    industry: "Electronics Manufacturing",
    category: "Semiconductors",
    annualSpendUsd: 12500000,
    riskScore: 78,
    riskLevel: "critical",
    riskTrend: "up",
    trendDelta: 12,
    newsSignals: 8,
    financialHealth: "down",
    lastScannedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    criticality: "critical",
    singleSource: true,
    onTimeDeliveryPct: 87,
    inventoryBufferDays: 8,
    supplierHealth: "weak",
    activeAlerts: 4,
    riskSummary: "Taiwan geopolitical risks elevated; supply chain concentration concern",
    locationLabel: "Asia-Pacific",
    coordinates: { lat: 25.0330, lon: 121.5654, x: 70, y: 30 }
  },
  {
    id: "supplier-002",
    name: "Shanghai Industrial Co.",
    initials: "SIC",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    city: "Shanghai",
    industry: "Manufacturing",
    category: "Components",
    annualSpendUsd: 8700000,
    riskScore: 85,
    riskLevel: "critical",
    riskTrend: "stable",
    trendDelta: 2,
    newsSignals: 15,
    financialHealth: "neutral",
    lastScannedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    criticality: "critical",
    singleSource: false,
    onTimeDeliveryPct: 79,
    inventoryBufferDays: 12,
    supplierHealth: "stable",
    activeAlerts: 6,
    riskSummary: "High geopolitical exposure; export control compliance concerns",
    locationLabel: "Asia-Pacific",
    coordinates: { lat: 31.2304, lon: 121.4737, x: 75, y: 35 }
  },
  {
    id: "supplier-003",
    name: "Global Supply Partners Inc.",
    initials: "GSP",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    city: "Mexico City",
    industry: "Logistics & Distribution",
    category: "Distribution",
    annualSpendUsd: 6200000,
    riskScore: 56,
    riskLevel: "high",
    riskTrend: "down",
    trendDelta: -5,
    newsSignals: 3,
    financialHealth: "up",
    lastScannedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    criticality: "high",
    singleSource: false,
    onTimeDeliveryPct: 92,
    inventoryBufferDays: 14,
    supplierHealth: "strong",
    activeAlerts: 2,
    riskSummary: "Improving operational metrics; geopolitical risk remains moderate",
    locationLabel: "Americas",
    coordinates: { lat: 19.4326, lon: -99.1332, x: 25, y: 60 }
  },
  {
    id: "supplier-004",
    name: "European Tech Solutions GmbH",
    initials: "ETS",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    city: "Munich",
    industry: "Technology",
    category: "Software & Systems",
    annualSpendUsd: 4500000,
    riskScore: 28,
    riskLevel: "low",
    riskTrend: "stable",
    trendDelta: 0,
    newsSignals: 1,
    financialHealth: "up",
    lastScannedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 98,
    inventoryBufferDays: 20,
    supplierHealth: "strong",
    activeAlerts: 0,
    riskSummary: "Stable operations with strong compliance track record",
    locationLabel: "Europe",
    coordinates: { lat: 48.1351, lon: 11.5820, x: 45, y: 15 }
  },
  {
    id: "supplier-005",
    name: "Bangalore Tech Manufacturing",
    initials: "BTM",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    city: "Bangalore",
    industry: "Electronics",
    category: "Assembly & Testing",
    annualSpendUsd: 5800000,
    riskScore: 62,
    riskLevel: "high",
    riskTrend: "up",
    trendDelta: 8,
    newsSignals: 5,
    financialHealth: "neutral",
    lastScannedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
    criticality: "high",
    singleSource: true,
    onTimeDeliveryPct: 85,
    inventoryBufferDays: 10,
    supplierHealth: "stable",
    activeAlerts: 3,
    riskSummary: "Single source dependency; weather and geopolitical risks emerging",
    locationLabel: "Asia-Pacific",
    coordinates: { lat: 12.9716, lon: 77.5946, x: 68, y: 50 }
  },
  {
    id: "supplier-006",
    name: "Vietnam Industrial Processing",
    initials: "VIP",
    country: "Vietnam",
    countryCode: "VN",
    flag: "🇻🇳",
    city: "Ho Chi Minh City",
    industry: "Manufacturing",
    category: "Raw Materials Processing",
    annualSpendUsd: 3200000,
    riskScore: 44,
    riskLevel: "medium",
    riskTrend: "stable",
    trendDelta: 1,
    newsSignals: 2,
    financialHealth: "up",
    lastScannedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 91,
    inventoryBufferDays: 15,
    supplierHealth: "stable",
    activeAlerts: 1,
    riskSummary: "Moderate operational and geopolitical risk; improving trends",
    locationLabel: "Asia-Pacific",
    coordinates: { lat: 10.7769, lon: 106.7009, x: 72, y: 48 }
  },
  {
    id: "supplier-007",
    name: "Brazilian Materials Corp.",
    initials: "BMC",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    city: "São Paulo",
    industry: "Raw Materials",
    category: "Agricultural Products",
    annualSpendUsd: 2900000,
    riskScore: 38,
    riskLevel: "medium",
    riskTrend: "down",
    trendDelta: -3,
    newsSignals: 2,
    financialHealth: "neutral",
    lastScannedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    criticality: "low",
    singleSource: false,
    onTimeDeliveryPct: 88,
    inventoryBufferDays: 18,
    supplierHealth: "strong",
    activeAlerts: 1,
    riskSummary: "Weather-related seasonal risks; operations improving",
    locationLabel: "Americas",
    coordinates: { lat: -23.5505, lon: -46.6333, x: 30, y: 70 }
  },
  {
    id: "supplier-008",
    name: "South Korean Precision",
    initials: "SKP",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    city: "Seoul",
    industry: "Electronics",
    category: "Semiconductors",
    annualSpendUsd: 7600000,
    riskScore: 42,
    riskLevel: "medium",
    riskTrend: "stable",
    trendDelta: -1,
    newsSignals: 2,
    financialHealth: "up",
    lastScannedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    criticality: "medium",
    singleSource: false,
    onTimeDeliveryPct: 96,
    inventoryBufferDays: 19,
    supplierHealth: "strong",
    activeAlerts: 0,
    riskSummary: "Stable supplier with good compliance and operational track record",
    locationLabel: "Asia-Pacific",
    coordinates: { lat: 37.5665, lon: 126.9780, x: 78, y: 25 }
  },
  {
    id: "supplier-009",
    name: "Indonesia Trade & Logistics",
    initials: "ITL",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    city: "Jakarta",
    industry: "Logistics",
    category: "Port & Shipping",
    annualSpendUsd: 2400000,
    riskScore: 71,
    riskLevel: "high",
    riskTrend: "up",
    trendDelta: 7,
    newsSignals: 4,
    financialHealth: "down",
    lastScannedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    criticality: "high",
    singleSource: true,
    onTimeDeliveryPct: 76,
    inventoryBufferDays: 9,
    supplierHealth: "weak",
    activeAlerts: 3,
    riskSummary: "Weather-related disruptions; single point of failure risk",
    locationLabel: "Asia-Pacific",
    coordinates: { lat: -6.2088, lon: 106.8456, x: 70, y: 55 }
  },
  {
    id: "supplier-010",
    name: "UK Supply Chain Ltd.",
    initials: "USC",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    city: "London",
    industry: "Trading",
    category: "Wholesale & Distribution",
    annualSpendUsd: 4100000,
    riskScore: 32,
    riskLevel: "low",
    riskTrend: "stable",
    trendDelta: 0,
    newsSignals: 0,
    financialHealth: "neutral",
    lastScannedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    criticality: "low",
    singleSource: false,
    onTimeDeliveryPct: 97,
    inventoryBufferDays: 21,
    supplierHealth: "strong",
    activeAlerts: 0,
    riskSummary: "Established logistics partner with reliable performance",
    locationLabel: "Europe",
    coordinates: { lat: 51.5074, lon: -0.1278, x: 48, y: 12 }
  }
];

// Sample risk history for each supplier (30 days)
export const generateSupplierRiskHistory = (): SupplierRiskHistory[] => {
  const today = new Date();
  return sampleSuppliers.map((supplier) => {
    const points = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic trending data
      const baseScore = supplier.riskScore;
      const trend = supplier.riskTrend === "up" ? 0.5 : supplier.riskTrend === "down" ? -0.3 : 0;
      const variation = (Math.random() - 0.5) * 8;
      const score = Math.max(0, Math.min(100, baseScore - (29 - i) * trend + variation));
      
      points.push({
        date: date.toISOString().split('T')[0],
        score: Math.round(score),
        alerts: Math.floor(Math.random() * 5)
      });
    }
    return {
      supplierId: supplier.id,
      points
    };
  });
};

// Sample dashboard risk history (30 days)
export const generateDashboardRiskHistory = (): DashboardRiskPoint[] => {
  const today = new Date();
  const points: DashboardRiskPoint[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const averageRisk = Math.round(
      sampleSuppliers.reduce((sum, s) => sum + s.riskScore, 0) / sampleSuppliers.length +
      (Math.random() - 0.5) * 4
    );
    const criticalCount = sampleSuppliers.filter(s => s.riskScore >= 75).length;
    const scanned = sampleSuppliers.length;
    
    points.push({
      date: date.toISOString().split('T')[0],
      averageRiskScore: averageRisk,
      criticalAlerts: criticalCount + Math.floor(Math.random() * 3),
      suppliersScanned: scanned
    });
  }
  
  return points;
};

// Sample alerts
export const sampleAlerts: AlertEntry[] = [
  {
    id: "alert-001",
    severity: "critical",
    riskType: "Geopolitical",
    supplierId: "supplier-001",
    supplierName: "Precision Electronics Ltd",
    country: "Taiwan",
    flag: "🇹🇼",
    headline: "Taiwan Strait Tensions Escalate",
    description: "Recent military exercises increase supply chain risk for electronics manufacturers.",
    tags: ["geopolitical", "taiwan", "critical"],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: "alert-002",
    severity: "critical",
    riskType: "Operational",
    supplierId: "supplier-002",
    supplierName: "Shanghai Industrial Co.",
    country: "China",
    flag: "🇨🇳",
    headline: "Export Control Compliance Alert",
    description: "New technology export restrictions affecting semiconductor supply.",
    tags: ["compliance", "export-control", "critical"],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: "alert-003",
    severity: "warning",
    riskType: "Weather",
    supplierId: "supplier-009",
    supplierName: "Indonesia Trade & Logistics",
    country: "Indonesia",
    flag: "🇮🇩",
    headline: "Monsoon Season Disruptions Expected",
    description: "Port congestion likely in next 2-3 weeks affecting shipment schedules.",
    tags: ["weather", "logistics", "seasonal"],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: "alert-004",
    severity: "warning",
    riskType: "Financial",
    supplierId: "supplier-005",
    supplierName: "Bangalore Tech Manufacturing",
    country: "India",
    flag: "🇮🇳",
    headline: "Currency Fluctuation Risk",
    description: "INR volatility increasing import costs by 8-12% annually.",
    tags: ["financial", "currency", "India"],
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: "alert-005",
    severity: "info",
    riskType: "Operational",
    supplierId: "supplier-003",
    supplierName: "Global Supply Partners Inc.",
    country: "Mexico",
    flag: "🇲🇽",
    headline: "On-Time Performance Improving",
    description: "Supplier has achieved 95%+ on-time delivery for last 30 days.",
    tags: ["positive", "operational"],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolved: true
  }
];

// Sample agent logs
export const sampleAgentLogs: AgentLogEntry[] = [
  {
    id: "log-001",
    status: "complete",
    agentName: "Geopolitical Risk Agent",
    action: "Analyzed Taiwan geopolitical exposure",
    supplierName: "Precision Electronics Ltd",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    durationMs: 2847,
    result: "critical"
  },
  {
    id: "log-002",
    status: "complete",
    agentName: "Financial Analysis Agent",
    action: "Evaluated currency and market volatility",
    supplierName: "Shanghai Industrial Co.",
    timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
    durationMs: 1923,
    result: "warning"
  },
  {
    id: "log-003",
    status: "complete",
    agentName: "Weather & Climate Agent",
    action: "Forecasted monsoon season impacts",
    supplierName: "Indonesia Trade & Logistics",
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    durationMs: 1456,
    result: "warning"
  },
  {
    id: "log-004",
    status: "complete",
    agentName: "Compliance Agent",
    action: "Verified sanctions and export controls",
    supplierName: "Bangalore Tech Manufacturing",
    timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
    durationMs: 2134,
    result: "success"
  },
  {
    id: "log-005",
    status: "complete",
    agentName: "Operational Intelligence Agent",
    action: "Assessed delivery performance and inventory",
    supplierName: "European Tech Solutions GmbH",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    durationMs: 987,
    result: "success"
  }
];

// Sample agent summaries
export const sampleAgentSummaries: AgentSummary[] = [
  {
    id: "agent-geo",
    name: "Geopolitical Risk Agent",
    status: "healthy",
    lastRunAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    suppliersScanned: 127,
    alertsGenerated: 52
  },
  {
    id: "agent-financial",
    name: "Financial Analysis Agent",
    status: "healthy",
    lastRunAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
    suppliersScanned: 134,
    alertsGenerated: 48
  },
  {
    id: "agent-weather",
    name: "Weather & Climate Agent",
    status: "healthy",
    lastRunAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    suppliersScanned: 128,
    alertsGenerated: 35
  },
  {
    id: "agent-compliance",
    name: "Compliance Agent",
    status: "healthy",
    lastRunAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
    suppliersScanned: 145,
    alertsGenerated: 38
  },
  {
    id: "agent-operational",
    name: "Operational Intelligence Agent",
    status: "healthy",
    lastRunAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    suppliersScanned: 156,
    alertsGenerated: 41
  }
];

// Sample reports
export const sampleReports: ReportEntry[] = [
  {
    id: "report-001",
    name: "Weekly Supplier Risk Summary",
    dateRange: "Apr 21-27, 2026",
    supplierCount: 10,
    generatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    format: "PDF",
    summary: "Analysis of 10 critical suppliers. 3 suppliers moved to critical risk. Geopolitical factors dominant."
  },
  {
    id: "report-002",
    name: "Critical Supplier Deep Dive",
    dateRange: "Apr 26, 2026",
    supplierCount: 2,
    generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    format: "PDF",
    summary: "Detailed analysis of Precision Electronics and Shanghai Industrial. Risk trending up."
  },
  {
    id: "report-003",
    name: "Monthly Compliance Report",
    dateRange: "March 2026",
    supplierCount: 10,
    generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    format: "PDF",
    summary: "Full compliance audit across all suppliers. 100% sanctions check completed."
  }
];

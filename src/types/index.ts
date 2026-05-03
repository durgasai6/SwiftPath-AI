export type RiskLevel = "low" | "medium" | "high" | "critical";
export type AlertSeverity = "info" | "warning" | "critical";
export type AgentStreamStatus = "running" | "processing" | "alert" | "complete";
export type AgentHealthStatus = "healthy" | "degraded" | "busy" | "idle";
export type FinancialHealth = "up" | "down" | "neutral";
export type TrendDirection = "up" | "down" | "stable";
export type AnalysisMode = "local" | "live";
export type OpsCheckStatus = "ready" | "warning" | "offline";
export type DeploymentStage = "prototype" | "pilot-ready" | "ops-ready";

export interface SupplierCoordinates {
  lat: number;
  lon: number;
  x: number;
  y: number;
}

export interface Supplier {
  id: string;
  name: string;
  initials: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  industry: string;
  category: string;
  annualSpendUsd: number;
  riskScore: number;
  riskLevel: RiskLevel;
  riskTrend: TrendDirection;
  trendDelta: number;
  newsSignals: number;
  financialHealth: FinancialHealth;
  lastScannedAt: string;
  criticality: "low" | "medium" | "high" | "critical";
  singleSource: boolean;
  onTimeDeliveryPct: number;
  inventoryBufferDays: number;
  supplierHealth: "strong" | "stable" | "weak";
  activeAlerts: number;
  riskSummary: string;
  locationLabel: string;
  coordinates: SupplierCoordinates;
}

export interface SupplierRiskPoint {
  date: string;
  score: number;
  alerts: number;
}

export interface SupplierRiskHistory {
  supplierId: string;
  points: SupplierRiskPoint[];
}

export interface DashboardRiskPoint {
  date: string;
  averageRiskScore: number;
  criticalAlerts: number;
  suppliersScanned: number;
}

export interface AgentLogEntry {
  id: string;
  status: AgentStreamStatus;
  agentName: string;
  action: string;
  supplierName: string;
  timestamp: string;
  durationMs: number;
  result: "success" | "warning" | "critical";
}

export interface AlertEntry {
  id: string;
  severity: AlertSeverity;
  riskType: string;
  supplierId: string;
  supplierName: string;
  country: string;
  flag: string;
  headline: string;
  description: string;
  tags: string[];
  timestamp: string;
  resolved: boolean;
}

export interface ReportEntry {
  id: string;
  name: string;
  dateRange: string;
  supplierCount: number;
  generatedAt: string;
  format: "PDF" | "CSV";
  summary: string;
}

export interface AgentSummary {
  id: string;
  name: string;
  status: AgentHealthStatus;
  lastRunAt: string;
  suppliersScanned: number;
  alertsGenerated: number;
}

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
}

export interface WeeklyDigestSection {
  title: string;
  description: string;
}

export interface WeeklyDigest {
  headline: string;
  overview: string;
  sections: WeeklyDigestSection[];
}

export interface WeeklyAlertCount {
  week: string;
  low: number;
  medium: number;
  high: number;
}

export interface SupplierInput {
  supplier_name: string;
  country: string;
  industry: string;
  category?: string;
  annual_spend_usd?: number | string;
  criticality?: "low" | "medium" | "high" | "critical";
  on_time_delivery_pct?: number | string;
  inventory_buffer_days?: number | string;
  supplier_health?: "strong" | "stable" | "weak";
  single_source?: boolean | string;
  incident_note?: string;
  stock_ticker?: string;
}

export interface SupplierIntelligenceBreakdown {
  news: number;
  weather: number;
  geopolitical: number;
  financial: number;
  operational: number;
  compliance: number;
}

export interface AgentCitation {
  title: string;
  url: string;
  source: string;
  note: string;
  publishedAt?: string;
}

export interface AgentOutput {
  id: string;
  name: string;
  score: number;
  summary: string;
  citations: AgentCitation[];
}

export interface SupplierIntelligence {
  id: string;
  supplierName: string;
  country: string;
  industry: string;
  riskScore: number;
  riskLevel: RiskLevel;
  explanation: string;
  likelyImpact: string;
  recommendation: string;
  nextActions: string[];
  breakdown: SupplierIntelligenceBreakdown;
  agents: AgentOutput[];
  citations: AgentCitation[];
  modeUsed: AnalysisMode;
  generatedAt: string;
}

export interface SupplierIntelligenceResponse {
  generatedAt: string;
  modeUsed: AnalysisMode;
  suppliers: SupplierIntelligence[];
}

export interface AnalysisRunSummary {
  supplierCount: number;
  averageRiskScore: number;
  criticalSuppliers: number;
  highRiskSuppliers?: number;
  citationsCollected?: number;
}

export interface AnalysisHistorySupplier {
  supplierName: string;
  country?: string;
  industry?: string;
  category?: string;
  riskScore: number;
  riskLevel?: RiskLevel;
  recommendation?: string;
  annual_spend_usd?: number;
  on_time_delivery_pct?: number;
  inventory_buffer_days?: number;
  supplier_health?: "strong" | "stable" | "weak";
  criticality?: "low" | "medium" | "high" | "critical";
  single_source?: boolean;
}

export interface AnalysisHistoryEntry {
  id: string;
  timestamp: string;
  generatedAt?: string;
  modeUsed?: AnalysisMode;
  summary: AnalysisRunSummary;
  suppliers: AnalysisHistorySupplier[];
}

export interface OpsCheck {
  id: string;
  title: string;
  description: string;
  status: OpsCheckStatus;
  detail: string;
}

export interface OpsStage {
  id: string;
  title: string;
  description: string;
  status: OpsCheckStatus;
}

export interface OpsSummary {
  generatedAt: string;
  readinessScore: number;
  deploymentStage: DeploymentStage;
  modePreference: AnalysisMode;
  latestScan: {
    timestamp: string | null;
    supplierCount: number;
    averageRiskScore: number;
    criticalSuppliers: number;
    modeUsed: AnalysisMode | "none";
  };
  portfolio: {
    totalSuppliers: number;
    highRiskSuppliers: number;
    singleSourceSuppliers: number;
    countriesCovered: number;
  };
  checks: OpsCheck[];
  orchestration: OpsStage[];
  recommendedActions: string[];
}


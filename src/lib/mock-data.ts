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

export const suppliers: Supplier[] = [];
export const supplierRiskHistory: SupplierRiskHistory[] = [];
export const dashboardRiskHistory: DashboardRiskPoint[] = [];
export const riskDistribution = [
  { name: "Low", value: 0, fill: "#10B981" },
  { name: "Medium", value: 0, fill: "#3B82F6" },
  { name: "High", value: 0, fill: "#F59E0B" },
  { name: "Critical", value: 0, fill: "#EF4444" }
];
export const agentSummaries: AgentSummary[] = [];
export const agentLogEntries: AgentLogEntry[] = [];
export const alerts: AlertEntry[] = [];
export const reports: ReportEntry[] = [];
export const weeklyDigest: WeeklyDigest = {
  headline: "No digest available yet.",
  overview: "Run a live scan to generate your first weekly digest.",
  sections: []
};
export const weeklyAlertCounts: WeeklyAlertCount[] = [];
export const dashboardStats = {
  totalSuppliers: 0,
  highRiskSuppliers: 0,
  criticalSuppliers: 0,
  alertsToday: 0,
  agentsRunning: 0,
  averageRisk: 0,
  suppliersMonitoredLabel: "Real-time monitoring",
  earlyWarningLabel: "48hr Early Warning",
  accuracyLabel: "94% Accuracy",
  freeStartLabel: "Zero Cost to Start"
};
export const topAtRiskSuppliers: Supplier[] = [];
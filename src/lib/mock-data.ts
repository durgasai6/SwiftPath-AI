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

import {
  sampleSuppliers as initialSuppliers,
  generateSupplierRiskHistory,
  generateDashboardRiskHistory,
  sampleAlerts as initialAlerts,
  sampleAgentLogs as initialAgentLogs,
  sampleAgentSummaries as initialAgentSummaries,
  sampleReports as initialReports
} from "@/lib/sample-suppliers";

// Initialize with real sample data
export const suppliers: Supplier[] = [...initialSuppliers];
export const supplierRiskHistory: SupplierRiskHistory[] = [...generateSupplierRiskHistory()];
export const dashboardRiskHistory: DashboardRiskPoint[] = [...generateDashboardRiskHistory()];

export const riskDistribution = [
  { 
    name: "Low", 
    value: suppliers.filter(s => s.riskScore < 35).length, 
    fill: "#10B981" 
  },
  { 
    name: "Medium", 
    value: suppliers.filter(s => s.riskScore >= 35 && s.riskScore < 60).length, 
    fill: "#3B82F6" 
  },
  { 
    name: "High", 
    value: suppliers.filter(s => s.riskScore >= 60 && s.riskScore < 75).length, 
    fill: "#F59E0B" 
  },
  { 
    name: "Critical", 
    value: suppliers.filter(s => s.riskScore >= 75).length, 
    fill: "#EF4444" 
  }
];

export const agentSummaries: AgentSummary[] = [...initialAgentSummaries];
export const agentLogEntries: AgentLogEntry[] = [...initialAgentLogs];
export const alerts: AlertEntry[] = [...initialAlerts];
export const reports: ReportEntry[] = [...initialReports];

export const weeklyDigest: WeeklyDigest = {
  headline: `Latest scan: ${suppliers.length} suppliers analyzed, avg risk ${Math.round(suppliers.reduce((sum, s) => sum + s.riskScore, 0) / suppliers.length)}`,
  overview: `Your supplier intelligence system is running optimally. ${suppliers.filter(s => s.riskScore >= 75).length} critical suppliers require immediate attention.`,
  sections: [
    {
      title: "Critical Risk Alert",
      description: `${suppliers.filter(s => s.riskScore >= 75).length} suppliers at critical risk level. Taiwan and China exposure elevated.`
    },
    {
      title: "Operational Alerts",
      description: "Indonesia logistics facing monsoon season disruptions. Weather-related delays expected 2-3 weeks."
    },
    {
      title: "Compliance Status",
      description: "100% of suppliers passed sanctions screening. Export control compliance at 98%."
    }
  ]
};

export const weeklyAlertCounts: WeeklyAlertCount[] = [
  { week: "Mon", low: 2, medium: 1, high: 0 },
  { week: "Tue", low: 3, medium: 1, high: 1 },
  { week: "Wed", low: 1, medium: 0, high: 1 },
  { week: "Thu", low: 4, medium: 2, high: 1 },
  { week: "Fri", low: 2, medium: 1, high: 1 },
  { week: "Sat", low: 1, medium: 0, high: 1 },
  { week: "Sun", low: 1, medium: 0, high: 0 }
];

export const dashboardStats = {
  totalSuppliers: suppliers.length,
  highRiskSuppliers: suppliers.filter(s => s.riskScore >= 60).length,
  criticalSuppliers: suppliers.filter(s => s.riskScore >= 75).length,
  alertsToday: alerts.filter(a => {
    const alertDate = new Date(a.timestamp);
    const today = new Date();
    return alertDate.toDateString() === today.toDateString() && !a.resolved;
  }).length || 4,
  agentsRunning: agentSummaries.filter(a => a.status === "healthy").length,
  averageRisk: Math.round(suppliers.reduce((sum, s) => sum + s.riskScore, 0) / suppliers.length),
  suppliersMonitoredLabel: "Real-time monitoring",
  earlyWarningLabel: "48hr Early Warning",
  accuracyLabel: "94% Accuracy",
  freeStartLabel: "Zero Cost to Start"
};

export const topAtRiskSuppliers: Supplier[] = [...suppliers]
  .sort((a, b) => b.riskScore - a.riskScore)
  .slice(0, 5);
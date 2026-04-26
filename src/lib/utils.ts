import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AlertSeverity, FinancialHealth, RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0
  }).format(value);
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options
  }).format(new Date(value));
}

export function timeAgo(value: string) {
  const now = Date.now();
  const then = new Date(value).getTime();
  const deltaInSeconds = Math.round((then - now) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1]
  ];

  for (const [unit, amount] of units) {
    if (Math.abs(deltaInSeconds) >= amount || unit === "second") {
      return formatter.format(Math.round(deltaInSeconds / amount), unit);
    }
  }

  return "just now";
}

export function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function toRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 55) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function riskLevelLabel(level: RiskLevel) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function riskBadgeClass(level: RiskLevel) {
  switch (level) {
    case "critical":
      return "bg-danger/15 text-danger ring-1 ring-danger/20 shadow-[0_0_24px_rgba(239,68,68,0.18)]";
    case "high":
      return "bg-warning/15 text-warning ring-1 ring-warning/20 shadow-[0_0_24px_rgba(245,158,11,0.14)]";
    case "medium":
      return "bg-primary/15 text-primary ring-1 ring-primary/20";
    default:
      return "bg-success/15 text-success ring-1 ring-success/20";
  }
}

export function alertBorderClass(level: AlertSeverity) {
  switch (level) {
    case "critical":
      return "border-l-danger";
    case "warning":
      return "border-l-warning";
    default:
      return "border-l-primary";
  }
}

export function financialHealthLabel(signal: FinancialHealth) {
  switch (signal) {
    case "up":
      return "Stable";
    case "down":
      return "Stressed";
    default:
      return "Watch";
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


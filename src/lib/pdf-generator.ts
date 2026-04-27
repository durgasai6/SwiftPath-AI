/**
 * PDF Report Generator for Supplier Risk Analysis
 * Generates comprehensive PDF reports with risk analysis, charts, and recommendations
 */

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import type { Supplier } from "@/types";

interface ReportData {
  title: string;
  generatedDate: string;
  suppliers: Supplier[];
  riskDistribution: { name: string; value: number; fill: string }[];
  averageRisk: number;
  criticalCount: number;
  highRiskCount: number;
}

export function generateSupplierRiskPDF(data: ReportData): jsPDF {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to check if we need a new page
  const checkNewPage = (spaceNeeded: number = 30) => {
    if (yPosition + spaceNeeded > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(data.title, 20, yPosition);
  yPosition += 15;

  // Report metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${data.generatedDate}`, 20, yPosition);
  doc.text(`Total Suppliers Analyzed: ${data.suppliers.length}`, 20, yPosition + 7);
  yPosition += 20;

  // Executive Summary Box
  doc.setDrawColor(50, 100, 200);
  doc.setLineWidth(0.5);
  doc.rect(20, yPosition - 5, pageWidth - 40, 35);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 25, yPosition + 2);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const summaryText = [
    `Average Risk Score: ${data.averageRisk}/100`,
    `Critical Risk Suppliers: ${data.criticalCount}`,
    `High Risk Suppliers: ${data.highRiskCount}`,
    `Compliant Suppliers: ${data.suppliers.filter(s => s.riskScore < 35).length}`
  ];

  summaryText.forEach((text, index) => {
    doc.text(text, 25, yPosition + 10 + index * 6);
  });
  yPosition += 50;

  // Risk Distribution Section
  checkNewPage(40);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Risk Distribution Overview", 20, yPosition);
  yPosition += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const colorMap: Record<string, [number, number, number]> = {
    "#10B981": [16, 185, 129],
    "#3B82F6": [59, 130, 246],
    "#F59E0B": [245, 158, 11],
    "#EF4444": [239, 68, 68]
  };
  
  data.riskDistribution.forEach((item, index) => {
    const xPos = 30 + index * 40;
    const color = colorMap[item.fill as keyof typeof colorMap] || [100, 100, 100];
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(xPos, yPosition, 20, 20, "F");
    doc.setTextColor(0, 0, 0);
    doc.text(`${item.name}`, xPos - 5, yPosition + 28);
    doc.text(`(${item.value})`, xPos - 2, yPosition + 35);
  });
  yPosition += 50;

  // Critical Suppliers Section
  checkNewPage(50);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Critical Risk Suppliers", 20, yPosition);
  yPosition += 10;

  const criticalSuppliers = data.suppliers
    .filter(s => s.riskScore >= 75)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  if (criticalSuppliers.length > 0) {
    const criticalTableData = criticalSuppliers.map(s => [
      s.name,
      s.country,
      s.category,
      `${s.riskScore}/100`,
      s.singleSource ? "Yes" : "No",
      `$${(s.annualSpendUsd / 1000000).toFixed(1)}M`
    ]);

    (doc as any).autoTable({
      head: [["Supplier", "Country", "Category", "Risk Score", "Single Source", "Annual Spend"]],
      body: criticalTableData,
      startY: yPosition,
      theme: "grid",
      margin: 20
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.text("No critical suppliers at this time.", 20, yPosition);
    yPosition += 15;
  }

  // High Risk Suppliers Section
  checkNewPage(50);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("High Risk Suppliers", 20, yPosition);
  yPosition += 10;

  const highRiskSuppliers = data.suppliers
    .filter(s => s.riskScore >= 60 && s.riskScore < 75)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  if (highRiskSuppliers.length > 0) {
    const highRiskTableData = highRiskSuppliers.map(s => [
      s.name,
      s.country,
      s.riskTrend === "up" ? "↑ Increasing" : s.riskTrend === "down" ? "↓ Decreasing" : "→ Stable",
      `${s.riskScore}/100`,
      s.riskSummary
    ]);

    (doc as any).autoTable({
      head: [["Supplier", "Country", "Trend", "Risk Score", "Summary"]],
      body: highRiskTableData,
      startY: yPosition,
      theme: "grid",
      margin: 20,
      columnWidth: 35
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Recommendations Section
  checkNewPage(60);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Recommended Actions", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const recommendations = [
    `1. Increase monitoring cadence for ${data.criticalCount} critical suppliers`,
    "2. Initiate alternate-source qualification for single-source dependencies",
    "3. Review geopolitical exposure in Taiwan and China tier-1 suppliers",
    "4. Implement 48-hour weather alert monitoring for logistics hubs",
    "5. Schedule compliance reviews for high-risk jurisdictions"
  ];

  recommendations.forEach(rec => {
    const lines = doc.splitTextToSize(rec, pageWidth - 40);
    (lines as string[]).forEach((line: string) => {
      checkNewPage(8);
      doc.text(line, 25, yPosition);
      yPosition += 7;
    });
  });

  // Footer
  yPosition = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("SwiftPath AI - Supplier Risk Intelligence", 20, yPosition);
  doc.text(`Page ${doc.internal.pages.length - 1}`, pageWidth - 30, yPosition);

  return doc;
}

export async function downloadSupplierRiskPDF(data: ReportData, filename: string = "supplier_risk_report.pdf") {
  const doc = generateSupplierRiskPDF(data);
  doc.save(filename);
}

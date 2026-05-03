"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Database, Download, RefreshCcw, Upload } from "lucide-react";
import type { Supplier } from "@/types";
import { RiskHeatmap } from "@/components/risk-heatmap";
import { SupplierTable } from "@/components/supplier-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { parseCsvText } from "@/lib/csv";
import { sampleSuppliers } from "@/lib/sample-suppliers";
import { toSupplierModel } from "@/lib/portfolio";

const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

function summaryValue(suppliers: Supplier[]) {
  return {
    total: suppliers.length,
    highRisk: suppliers.filter((supplier) => supplier.riskScore >= 60).length,
    singleSource: suppliers.filter((supplier) => supplier.singleSource).length,
    countries: new Set(suppliers.map((supplier) => supplier.country).filter(Boolean)).size
  };
}

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [dbSuppliers, setDbSuppliers] = useState<Supplier[]>([]);
  const [usingDemoPortfolio, setUsingDemoPortfolio] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadSuppliers() {
    setLoading(true);

    try {
      const response = await fetch("/api/suppliers");
      const payload = (await response.json()) as Array<Record<string, unknown>>;

      if (Array.isArray(payload) && payload.length > 0) {
        setDbSuppliers(payload.map((supplier, index) => toSupplierModel(supplier, index)));
        setUsingDemoPortfolio(false);
      } else {
        setDbSuppliers(sampleSuppliers);
        setUsingDemoPortfolio(true);
      }
    } catch {
      setDbSuppliers(sampleSuppliers);
      setUsingDemoPortfolio(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSuppliers();
  }, []);

  const portfolioSuppliers = dbSuppliers;

  const countries = useMemo(
    () => Array.from(new Set(portfolioSuppliers.map((supplier) => supplier.country))).sort(),
    [portfolioSuppliers]
  );

  const categories = useMemo(
    () => Array.from(new Set(portfolioSuppliers.map((supplier) => supplier.category))).sort(),
    [portfolioSuppliers]
  );

  const filteredSuppliers = useMemo(() => {
    return portfolioSuppliers.filter((supplier) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        supplier.name.toLowerCase().includes(query) ||
        supplier.country.toLowerCase().includes(query) ||
        supplier.category.toLowerCase().includes(query) ||
        supplier.industry.toLowerCase().includes(query);

      const matchesCountry = country === "all" || supplier.country === country;
      const matchesRisk = riskLevel === "all" || supplier.riskLevel === riskLevel;
      const matchesCategory = category === "all" || supplier.category === category;

      return matchesSearch && matchesCountry && matchesRisk && matchesCategory;
    });
  }, [portfolioSuppliers, search, country, riskLevel, category]);

  const summary = useMemo(() => summaryValue(portfolioSuppliers), [portfolioSuppliers]);

  async function handleExportCSV() {
    try {
      setActionBusy(true);
      const response = await fetch("/api/export?format=csv");

      if (!response.ok) {
        throw new Error("Export failed.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `suppliers_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setStatusMessage("Portfolio export downloaded.");
    } catch {
      setStatusMessage("SwiftPath could not export the portfolio.");
    } finally {
      setActionBusy(false);
    }
  }

  async function handleSeedPortfolio() {
    try {
      setActionBusy(true);
      const response = await fetch("/api/seed", { method: "POST" });

      if (!response.ok) {
        throw new Error("Seed failed.");
      }

      await loadSuppliers();
      setStatusMessage("Demo portfolio loaded into the workspace.");
    } catch {
      setStatusMessage("SwiftPath could not seed the demo portfolio.");
    } finally {
      setActionBusy(false);
    }
  }

  async function handleCsvUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setActionBusy(true);
      setStatusMessage("Importing suppliers...");
      const text = await file.text();
      const rows = parseCsvText(text);

      for (const row of rows) {
        const payload = {
          name: row.supplier_name || row.name || "Imported Supplier",
          country: row.country || "Unknown",
          category: row.category || row.industry || "General",
          industry: row.industry || row.category || "General",
          riskScore: row.risk_score || "45",
          riskLevel: row.risk_level || "medium",
          annualSpendUsd: row.annual_spend_usd || "0",
          onTimeDeliveryPct: row.on_time_delivery_pct || "94",
          criticality: row.criticality || "medium",
          supplierHealth: row.supplier_health || "stable",
          inventoryBufferDays: row.inventory_buffer_days || "16",
          singleSource: row.single_source === "true" || row.single_source === "yes",
          riskSummary: row.incident_note || "Imported from CSV portfolio."
        };

        const response = await fetch("/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Import failed.");
        }
      }

      await loadSuppliers();
      setStatusMessage(`Imported ${rows.length} suppliers from CSV.`);
    } catch {
      setStatusMessage("SwiftPath could not import that CSV file.");
    } finally {
      setActionBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-5">
            <p className="text-sm text-muted">Suppliers in workspace</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{summary.total}</p>
            <p className="mt-2 text-sm text-muted">Ready for portfolio-wide scan orchestration</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-5">
            <p className="text-sm text-muted">High-risk suppliers</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{summary.highRisk}</p>
            <p className="mt-2 text-sm text-muted">Currently scoring 60 or above</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-5">
            <p className="text-sm text-muted">Single-source exposure</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{summary.singleSource}</p>
            <p className="mt-2 text-sm text-muted">Priority candidates for contingency planning</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-5">
            <p className="text-sm text-muted">Countries covered</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">{summary.countries}</p>
            <p className="mt-2 text-sm text-muted">Cross-region sourcing visibility for the MVP</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Portfolio control</CardTitle>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Load the demo portfolio, import your own supplier CSV, or narrow the working set before running an agentic scan.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {usingDemoPortfolio ? <Badge variant="warning">Using demo portfolio</Badge> : <Badge variant="success">Workspace data</Badge>}
                <Badge variant="secondary">{summary.total} suppliers</Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={handleSeedPortfolio} disabled={actionBusy}>
                <Database className="h-4 w-4" />
                Load Demo Portfolio
              </Button>
              <Button variant="secondary" onClick={() => fileRef.current?.click()} disabled={actionBusy}>
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
              <Button variant="secondary" onClick={handleExportCSV} disabled={actionBusy}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => void loadSuppliers()} disabled={loading || actionBusy}>
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Button asChild variant="outline" type="button">
                <a href="/sample-suppliers.csv" download>
                  Download Sample CSV
                </a>
              </Button>
            </div>

            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleCsvUpload} />

            {statusMessage ? (
              <div className="rounded-2xl border border-white/10 bg-background/40 px-4 py-3 text-sm text-muted">
                {statusMessage}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search supplier, country, or category"
              />

              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {countries.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All risk levels</SelectItem>
                  {RISK_LEVELS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <RiskHeatmap suppliers={filteredSuppliers} />
      </section>

      <SupplierTable data={filteredSuppliers} isLoading={loading} />
    </div>
  );
}

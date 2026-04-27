"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Upload, UserPlus, X } from "lucide-react";
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
import { suppliers as sampleSuppliers } from "@/lib/mock-data";

const COUNTRIES = ["China","Taiwan","India","Vietnam","Bangladesh","Indonesia","Mexico","Germany","South Korea","Brazil","USA","Japan","Thailand","Malaysia","Philippines"];
const CATEGORIES = ["Electronics","Semiconductors","Raw Materials","Logistics","Packaging","Chemicals","Textiles","Automotive","Pharma","Food & Beverage"];
const RISK_LEVELS = ["low","medium","high","critical"];

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [csvMsg, setCsvMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", country: "China", category: "Electronics",
    riskLevel: "medium", riskScore: "40", industry: "",
    annualSpendUsd: "", onTimeDeliveryPct: "95",
    criticality: "medium", singleSource: false
  });

  useEffect(() => {
    fetch("/api/suppliers")
      .then(r => r.json())
      .then(data => setDbSuppliers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // ✅ FIXED HERE
const allSuppliers = useMemo(() => {
  const mapped = dbSuppliers.map((s: any): Supplier => ({
    id: s.id ?? crypto.randomUUID(),

    name: s.name ?? "Unknown Supplier",

    initials: (s.name ?? "US")
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),

    country: s.country ?? "Unknown",
    countryCode: (s.country ?? "UN").slice(0, 2).toUpperCase(),
    flag: "🏳️",
    city: s.city ?? "N/A",

    category: s.category ?? "General",
    industry: s.industry ?? s.category ?? "General",

    riskScore: Number(s.riskScore) || 40,
    riskLevel: s.riskLevel ?? "medium",

    annualSpendUsd: Number(s.annualSpendUsd) || 0,
    onTimeDeliveryPct: Number(s.onTimeDeliveryPct) || 95,

    criticality: s.criticality ?? "medium",
    singleSource: Boolean(s.singleSource),

    lastScannedAt: s.createdAt ?? new Date().toISOString(),

    // 🔥 REQUIRED EXTRA FIELDS (THIS FIXES YOUR ERROR)
    riskTrend: "stable",              // or "up" | "down"
    trendDelta: 0,                   // number change
    newsSignals: [],                 // array
    financialHealth: "average",      // or "good" | "poor"

    esgScore: 50,
    complianceScore: 50,
    geopoliticalRisk: 50,
    operationalRisk: 50,
    cyberRisk: 50,
    overallRisk: 50,

    // optional extras
    contactEmail: s.contactEmail ?? "",
    contactPhone: s.contactPhone ?? "",
    address: s.address ?? "",
    postalCode: s.postalCode ?? "",
    website: s.website ?? ""
  }));

  return [...mapped, ...sampleSuppliers];
}, [dbSuppliers]);

  const countries = useMemo(
    () => Array.from(new Set(allSuppliers.map(s => s.country))).sort(),
    [allSuppliers]
  );

  const categories = useMemo(
    () => Array.from(new Set(allSuppliers.map(s => s.category))).sort(),
    [allSuppliers]
  );

  const filteredSuppliers = useMemo(() => {
    return allSuppliers.filter(supplier => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.country.toLowerCase().includes(search.toLowerCase()) ||
        supplier.category.toLowerCase().includes(search.toLowerCase());

      const matchesCountry = country === "all" || supplier.country === country;
      const matchesRisk = riskLevel === "all" || supplier.riskLevel === riskLevel;
      const matchesCategory = category === "all" || supplier.category === category;

      return matchesSearch && matchesCountry && matchesRisk && matchesCategory;
    });
  }, [allSuppliers, search, country, riskLevel, category]);

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/export?format=csv");

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `suppliers_${new Date().toISOString().split("T")[0]}.csv`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!form.name.trim()) return alert("Supplier name is required.");

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const newSup = await res.json();
      setDbSuppliers(prev => [newSup, ...prev]);

      setShowModal(false);
      setForm({
        name: "", country: "China", category: "Electronics",
        riskLevel: "medium", riskScore: "40", industry: "",
        annualSpendUsd: "", onTimeDeliveryPct: "95",
        criticality: "medium", singleSource: false
      });
    } catch {
      alert("Failed to add supplier.");
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvMsg("Parsing...");
    const reader = new FileReader();

    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split("\n");

      const headers = lines[0]
        .split(",")
        .map(h => h.replace(/"/g, "").trim().toLowerCase());

      const rows = lines.slice(1);
      let added = 0;

      for (const row of rows) {
        const cols = row.split(",").map(c => c.replace(/"/g, "").trim());

        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = cols[i] ?? ""; });

        const supplier = {
          name: obj["name"] || `Supplier ${added + 1}`,
          country: obj["country"] || "Unknown",
          category: obj["category"] || "General",
          industry: obj["industry"] || "General",
          riskScore: obj["risk_score"] || "40",
          riskLevel: obj["risk_level"] || "medium",
          annualSpendUsd: obj["annual_spend_usd"] || "0",
          onTimeDeliveryPct: obj["on_time_delivery_pct"] || "95",
          criticality: obj["criticality"] || "medium",
          singleSource: obj["single_source"] === "true"
        };

        try {
          const res = await fetch("/api/suppliers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(supplier)
          });

          const s = await res.json();
          setDbSuppliers(prev => [s, ...prev]);
          added++;
        } catch {}
      }

      setCsvMsg(`✅ Imported ${added} suppliers`);
      setTimeout(() => setCsvMsg(""), 4000);
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle>Search and refine</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Input value={search} onChange={e => setSearch(e.target.value)} />

            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {countries.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {RISK_LEVELS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <RiskHeatmap suppliers={filteredSuppliers} />
      </section>

      <SupplierTable data={filteredSuppliers} />
    </div>
  );
}
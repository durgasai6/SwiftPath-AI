"use client";

import { useMemo, useState } from "react";
import { Upload, UserPlus } from "lucide-react";
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
import { suppliers } from "@/lib/mock-data";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");
  const [category, setCategory] = useState("all");

  const countries = useMemo(
    () => Array.from(new Set(suppliers.map((supplier) => supplier.country))).sort(),
    []
  );
  const categories = useMemo(
    () => Array.from(new Set(suppliers.map((supplier) => supplier.category))).sort(),
    []
  );

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.country.toLowerCase().includes(search.toLowerCase()) ||
        supplier.category.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = country === "all" || supplier.country === country;
      const matchesRisk = riskLevel === "all" || supplier.riskLevel === riskLevel;
      const matchesCategory = category === "all" || supplier.category === category;

      return matchesSearch && matchesCountry && matchesRisk && matchesCategory;
    });
  }, [category, country, riskLevel, search]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="section-eyebrow">Supplier Base</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">Supplier Directory</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            Search the full supplier portfolio, filter by risk posture, and trigger targeted rescans for exposed vendors.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            <Upload className="h-4 w-4" />
            CSV Upload
          </Button>
          <Button>
            <UserPlus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <p className="section-eyebrow">Filters</p>
            <CardTitle>Search and refine</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search supplier, country, category..."
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
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
          </CardContent>
        </Card>

        <RiskHeatmap suppliers={filteredSuppliers} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-5">
            <p className="section-eyebrow">Visible Suppliers</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-foreground">{filteredSuppliers.length}</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-5">
            <p className="section-eyebrow">Single Source</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-foreground">
              {filteredSuppliers.filter((supplier) => supplier.singleSource).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="section-eyebrow">Filtered Risk Mix</p>
              <p className="mt-3 font-mono text-3xl font-semibold text-foreground">
                {filteredSuppliers.filter((supplier) => supplier.riskLevel === "critical").length}
              </p>
            </div>
            <Badge variant="danger">Critical</Badge>
          </CardContent>
        </Card>
      </section>

      <SupplierTable data={filteredSuppliers} />
    </div>
  );
}


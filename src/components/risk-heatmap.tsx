import type { Supplier } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskHeatmapProps {
  suppliers: Supplier[];
  className?: string;
}

function pinColor(level: Supplier["riskLevel"]) {
  switch (level) {
    case "critical":
      return "bg-danger";
    case "high":
      return "bg-warning";
    case "medium":
      return "bg-primary";
    default:
      return "bg-success";
  }
}

export function RiskHeatmap({ suppliers, className }: RiskHeatmapProps) {
  return (
    <div className={cn("glass-card-light overflow-hidden p-5", className)}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow">Global Coverage</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Supplier Risk Heatmap</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success">Low</Badge>
          <Badge variant="default">Medium</Badge>
          <Badge variant="warning">High</Badge>
          <Badge variant="danger">Critical</Badge>
        </div>
      </div>

      <div className="relative h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(59,130,246,0.08),transparent)]">
        <svg viewBox="0 0 1000 520" className="absolute inset-0 h-full w-full opacity-60">
          <g fill="rgba(148,163,184,0.16)">
            <path d="M91 167c28-23 68-44 118-55 47-10 117-25 163-8 30 11 59 40 50 79-8 33-40 42-68 56-23 12-42 27-60 46-24 25-63 62-105 46-47-19-81-82-101-126-7-14-16-26-13-38 3-11 9-20 16-28Z" />
            <path d="M429 139c20-12 42-15 65-18 31-3 73-9 102 5 31 15 45 45 74 61 26 15 56 18 81 34 43 29 66 93 37 140-29 48-96 58-151 70-47 11-102 33-146 10-47-24-61-88-89-129-19-28-49-53-48-89 0-35 36-67 75-84Z" />
            <path d="M730 127c24-17 62-25 96-19 31 6 54 28 74 49 21 22 44 45 43 77-1 41-38 70-72 92-32 20-65 43-103 37-44-8-69-52-96-84-21-26-52-51-48-86 4-31 35-50 62-66 16-9 30-14 44-22Z" />
            <path d="M767 327c19-15 54-20 79-12 26 8 44 33 58 55 13 22 26 46 19 72-7 27-34 45-58 59-24 13-50 29-77 25-37-6-53-44-68-74-12-23-29-47-25-73 5-22 27-38 47-52 8-6 16-11 25-16Z" />
            <path d="M542 375c21-17 49-25 76-23 24 2 50 14 65 33 22 28 23 67 16 101-6 31-20 66-48 81-31 17-69 2-100-11-35-15-77-30-90-67-12-33 15-69 37-93 13-14 27-28 44-35Z" />
          </g>
        </svg>

        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${supplier.coordinates.x}%`,
              top: `${supplier.coordinates.y}%`
            }}
          >
            <div className="group relative flex flex-col items-center">
              <div
                className={cn(
                  "relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-background shadow-[0_0_0_6px_rgba(255,255,255,0.04)]",
                  pinColor(supplier.riskLevel)
                )}
              >
                <span className={cn("absolute inset-0 rounded-full opacity-40", pinColor(supplier.riskLevel), "animate-ping")} />
              </div>
              <div className="pointer-events-none absolute top-6 hidden min-w-[180px] rounded-2xl border border-white/10 bg-surface-strong p-3 text-left shadow-[0_20px_50px_rgba(2,6,23,0.25)] group-hover:block">
                <p className="text-sm font-semibold text-foreground">
                  {supplier.flag} {supplier.name}
                </p>
                <p className="mt-1 text-xs text-muted">{supplier.locationLabel}</p>
                <p className="mt-2 text-xs text-foreground/80">Risk score: {supplier.riskScore}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


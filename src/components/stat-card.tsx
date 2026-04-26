import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  accentColor: "primary" | "success" | "warning" | "danger";
  pulse?: boolean;
}

const accentClasses: Record<StatCardProps["accentColor"], string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-danger/12 text-danger"
};

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  accentColor,
  pulse = false
}: StatCardProps) {
  const ChangeIcon = changeType === "decrease" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card
      className={cn(
        "overflow-hidden border-white/10 bg-white/5",
        accentColor === "danger" && "risk-glow-critical",
        accentColor === "warning" && "risk-glow-warning"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{title}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="font-mono text-3xl font-semibold tracking-tight text-foreground">{value}</span>
              {pulse ? <span className={cn("pulse-dot text-danger", accentColor === "success" && "text-success")} /> : null}
            </div>
          </div>

          <div className={cn("rounded-2xl p-3", accentClasses[accentColor])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
          <ChangeIcon className="h-3.5 w-3.5" />
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}


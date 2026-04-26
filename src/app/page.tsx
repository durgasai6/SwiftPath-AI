import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Sparkles, TrendingUp, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardStats } from "@/lib/mock-data";

const features = [
  {
    title: "Multi-Agent AI Monitoring",
    description:
      "SwiftPath watches supplier risk across news, logistics, financial, geopolitical, and weather signals without waiting for a human analyst to stitch them together.",
    icon: Bot
  },
  {
    title: "Real-Time Risk Scoring",
    description:
      "Every supplier lands in one explainable risk band, so procurement teams know exactly where to focus before disruption turns into missed revenue.",
    icon: TrendingUp
  },
  {
    title: "Autonomous Recommendations",
    description:
      "Instead of vague warnings, SwiftPath recommends specific actions like alternate sourcing, inventory buffers, compliance review, or leadership escalation.",
    icon: ShieldCheck
  }
];

const steps = [
  {
    title: "Upload suppliers",
    description: "Bring in a CSV of strategic suppliers and let SwiftPath create a live portfolio map.",
    icon: UploadCloud
  },
  {
    title: "Agents scan signals",
    description: "Autonomous agents watch public and operational indicators in parallel, then score the risk profile.",
    icon: Bot
  },
  {
    title: "Get alerts",
    description: "Your team gets early warning, risk-ranked priorities, and mitigation steps inside one command center.",
    icon: Sparkles
  }
];

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="page-container pt-6">
        <div className="hero-surface relative overflow-hidden rounded-[40px] border border-white/10 px-6 py-12 shadow-[0_28px_80px_rgba(2,6,23,0.18)] sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_30%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">AI-powered supplier risk intelligence</Badge>
                <Badge variant="secondary">Zero cost to start</Badge>
              </div>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-gradient sm:text-6xl">
                Know Before It Breaks
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-slate-700 dark:text-slate-300">
                SwiftPath helps supply chain teams detect supplier risk early, prioritize the right disruptions, and act before operations feel the impact.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard">View Demo</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="border-white/10 bg-white/10 dark:bg-white/5">
                <CardContent className="p-6">
                  <p className="section-eyebrow">Live portfolio view</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                      <p className="text-sm text-muted">Average risk</p>
                      <p className="mt-2 font-mono text-3xl font-semibold text-foreground">{dashboardStats.averageRisk}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-danger/10 p-4 risk-glow-critical">
                      <p className="text-sm text-muted">Critical suppliers</p>
                      <p className="mt-2 font-mono text-3xl font-semibold text-foreground">{dashboardStats.criticalSuppliers}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-success/10 p-4">
                      <p className="text-sm text-muted">Agents running</p>
                      <p className="mt-2 font-mono text-3xl font-semibold text-foreground">{dashboardStats.agentsRunning}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-white/10 bg-white/10 dark:bg-white/5">
                  <CardContent className="p-5">
                    <p className="text-sm text-muted">Alert queue</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">Export-control exposure detected</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      SwiftPath surfaced a strategic supplier at elevated compliance risk before the next purchasing cycle.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-white/10 bg-white/10 dark:bg-white/5">
                  <CardContent className="p-5">
                    <p className="text-sm text-muted">Recommended move</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">Launch alternate-source review</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      The system recommended contingency action based on rising geopolitical and logistics pressure.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container">
        <div className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          {[
            dashboardStats.suppliersMonitoredLabel,
            dashboardStats.earlyWarningLabel,
            dashboardStats.accuracyLabel,
            dashboardStats.freeStartLabel
          ].map((stat) => (
            <div key={stat} className="rounded-3xl border border-white/10 bg-background/40 px-5 py-4 text-center text-sm font-semibold text-foreground">
              {stat}
            </div>
          ))}
        </div>
      </section>

      <section className="page-container">
        <div className="mb-6">
          <p className="section-eyebrow">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Built for the real supplier-risk workflow</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="border-white/10 bg-white/5">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-8 text-muted">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="page-container">
        <div className="rounded-[36px] border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="mb-8">
            <p className="section-eyebrow">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">From spreadsheet to action queue in three steps</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="relative rounded-3xl border border-white/10 bg-background/40 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-3 text-sm leading-8 text-muted">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="page-container pb-10">
        <div className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-semibold tracking-tight text-foreground">SwiftPath</p>
            <p className="mt-2 text-sm text-muted">AI-powered supplier risk intelligence for supply chains that cannot afford surprises.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/signup">Start Free</Link>
          </Button>
        </div>
      </footer>
    </main>
  );
}

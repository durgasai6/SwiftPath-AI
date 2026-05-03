import { ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

const floatingCards = [
  {
    title: "Critical supplier",
    value: "84",
    subtitle: "Zhonghao Electronics"
  },
  {
    title: "Agents active",
    value: "04",
    subtitle: "Scanning live signals"
  },
  {
    title: "Early warning",
    value: "48h",
    subtitle: "Average advance notice"
  }
];

export function AuthShowcase() {
  return (
    <div className="relative hidden overflow-hidden rounded-[32px] border border-white/10 hero-gradient p-8 lg:flex lg:min-h-[680px] lg:flex-col lg:justify-between lg:p-10 xl:min-h-[760px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.3),transparent_30%)]" />
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
          <Sparkles className="h-4 w-4 text-primary" />
          SwiftPath Intelligence
        </div>
        <h2 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-gradient">
          Know before it breaks, not after the shipment misses.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          SwiftPath turns fragmented supplier signals into one operating view for procurement, operations,
          and leadership teams.
        </p>
      </div>

      <div className="relative z-10 mt-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-[0_22px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-danger/15 p-3 text-danger">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Compliance Spike</p>
              <p className="text-xs text-slate-400">Export-control exposure detected</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-[0_22px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Portfolio risk score</span>
              <TrendingUp className="h-4 w-4 text-warning" />
            </div>
            <p className="mt-5 font-mono text-4xl font-semibold text-foreground">61</p>
            <p className="mt-2 text-sm text-slate-400">6 points higher than last week</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {floatingCards.slice(1).map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-[0_18px_50px_rgba(2,6,23,0.24)] backdrop-blur-xl"
              >
                <div>
                  <p className="text-sm text-slate-300">{card.title}</p>
                  <p className="mt-2 font-mono text-3xl font-semibold text-foreground">{card.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

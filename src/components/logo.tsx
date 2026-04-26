import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(59,130,246,0.3)]">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_58%)]" />
        <span className="relative text-lg font-semibold tracking-tight">S</span>
      </div>
      {!collapsed ? (
        <div className="space-y-0.5">
          <p className="text-base font-semibold tracking-tight text-foreground">SwiftPath</p>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Supplier Intelligence</p>
        </div>
      ) : null}
    </div>
  );
}


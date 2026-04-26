import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/15 text-primary ring-1 ring-primary/20",
        secondary: "bg-white/10 text-foreground ring-1 ring-white/10",
        outline: "border border-border text-foreground",
        success: "bg-success/15 text-success ring-1 ring-success/20",
        warning: "bg-warning/15 text-warning ring-1 ring-warning/20",
        danger: "bg-danger/15 text-danger ring-1 ring-danger/20"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

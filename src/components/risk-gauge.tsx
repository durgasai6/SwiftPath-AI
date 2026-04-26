"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: 54,
  md: 92,
  lg: 126
};

function getRiskColor(value: number) {
  if (value >= 67) return "#EF4444";
  if (value >= 34) return "#F59E0B";
  return "#10B981";
}

export function RiskGauge({ value, label = "Risk", size = "md", className }: RiskGaugeProps) {
  const [progress, setProgress] = useState(0);
  const dimension = sizeMap[size];
  const strokeWidth = size === "sm" ? 6 : 8;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;
  const color = useMemo(() => getRiskColor(value), [value]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProgress(value));
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(148,163,184,0.18)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${dimension / 2} ${dimension / 2})`}
            style={{ transition: "stroke-dashoffset 900ms ease, stroke 250ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-lg font-semibold text-foreground">{value}</span>
          {size !== "sm" ? <span className="text-[11px] uppercase tracking-[0.22em] text-muted">{label}</span> : null}
        </div>
      </div>
    </div>
  );
}


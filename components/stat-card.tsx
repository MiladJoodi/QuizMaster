"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  className?: string;
}

export function Metric({ label, value, hint, icon: Icon, className }: MetricProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-1.5 text-meta">
        {Icon && <Icon className="h-3 w-3" />}
        <span>{label}</span>
      </div>
      <p className="font-display text-3xl font-extrabold tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="text-xs font-bold text-muted-foreground">{hint}</p>}
    </div>
  );
}

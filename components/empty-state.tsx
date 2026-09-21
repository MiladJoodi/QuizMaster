"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-inset">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-1 font-display text-xl font-extrabold">{title}</h3>
      <p className="mb-6 max-w-sm text-sm font-semibold text-muted-foreground">
        {description}
      </p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

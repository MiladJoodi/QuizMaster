import type { CSSProperties } from "react";

export const chartColors = {
  primary: "var(--chart-1)",
  success: "var(--chart-2)",
  signal: "var(--chart-3)",
  secondary: "var(--chart-4)",
  muted: "var(--chart-5)",
} as const;

export const chartGridProps = {
  strokeDasharray: "0",
  stroke: "var(--border)",
  vertical: false,
};

export const chartAxisTick = {
  fill: "var(--muted-foreground)",
  fontSize: 11,
  fontFamily: "var(--font-outfit)",
};

export const chartTooltipStyle: CSSProperties = {
  backgroundColor: "var(--raised)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  fontFamily: "var(--font-outfit)",
  boxShadow: "none",
  padding: "8px 12px",
};

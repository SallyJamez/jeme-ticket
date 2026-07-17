import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down" | "flat";
  icon?: ReactNode;
  accent?: "brand" | "amber" | "red" | "blue" | "ink";
}

const accentMap = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700",
  ink: "bg-ink-100 text-ink-700",
};

export function StatCard({ label, value, delta, deltaDirection = "flat", icon, accent = "brand" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
        {icon && (
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accentMap[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
        {delta && (
          <span
            className={cn(
              "mb-0.5 text-xs font-semibold",
              deltaDirection === "up" && "text-brand-600",
              deltaDirection === "down" && "text-red-600",
              deltaDirection === "flat" && "text-ink-400"
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

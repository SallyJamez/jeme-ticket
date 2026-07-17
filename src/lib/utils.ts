import { clsx, type ClassValue } from "clsx";
import type { SlaState, TicketPriority, TicketStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export const slaStateStyles: Record<SlaState, { text: string; bg: string; dot: string }> = {
  "On Track": { text: "text-brand-700", bg: "bg-brand-50", dot: "bg-brand-600" },
  "At Risk": { text: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-500" },
  Breached: { text: "text-red-700", bg: "bg-red-50", dot: "bg-red-600" },
  Met: { text: "text-blue-700", bg: "bg-blue-50", dot: "bg-blue-600" },
};

export const priorityStyles: Record<TicketPriority, { text: string; bg: string }> = {
  Low: { text: "text-ink-600", bg: "bg-ink-100" },
  Medium: { text: "text-blue-700", bg: "bg-blue-50" },
  High: { text: "text-amber-700", bg: "bg-amber-50" },
  Critical: { text: "text-red-700", bg: "bg-red-50" },
};

export const statusStyles: Record<TicketStatus, { text: string; bg: string }> = {
  New: { text: "text-blue-700", bg: "bg-blue-50" },
  Open: { text: "text-ink-700", bg: "bg-ink-100" },
  "In Progress": { text: "text-brand-700", bg: "bg-brand-50" },
  "On Hold": { text: "text-amber-700", bg: "bg-amber-50" },
  Escalated: { text: "text-red-700", bg: "bg-red-50" },
  Resolved: { text: "text-blue-700", bg: "bg-blue-50" },
  Closed: { text: "text-ink-500", bg: "bg-ink-100" },
};

export function slaRingColor(pct: number) {
  if (pct >= 100) return "#dc2626";
  if (pct >= 80) return "#d97706";
  return "#16A34A";
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

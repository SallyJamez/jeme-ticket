/**
 * The Swagger spec only exposes these as bare integer enums with no string
 * labels (TicketCategory: 0-2, TicketPriority: 0-2, TicketStatus: 0-4).
 * The mapping below is an ASSUMPTION made to keep the UI usable — confirm
 * the real ordinal → label mapping with the backend team and adjust here
 * (this is the single source of truth, nothing else hardcodes these values).
 */

export const TICKET_CATEGORY_LABELS = ["Technical", "Billing", "General"] as const;
export type TicketCategoryLabel = (typeof TICKET_CATEGORY_LABELS)[number];

export const TICKET_PRIORITY_LABELS = ["Low", "Medium", "High"] as const;
export type TicketPriorityLabel = (typeof TICKET_PRIORITY_LABELS)[number];

export const TICKET_STATUS_LABELS = ["New", "Open", "In Progress", "Resolved", "Closed"] as const;
export type TicketStatusLabel = (typeof TICKET_STATUS_LABELS)[number];

export function categoryToLabel(value: number | undefined | null): TicketCategoryLabel {
  return TICKET_CATEGORY_LABELS[value ?? 0] ?? TICKET_CATEGORY_LABELS[0];
}
export function categoryFromLabel(label: string): number {
  const idx = TICKET_CATEGORY_LABELS.indexOf(label as TicketCategoryLabel);
  return idx === -1 ? 0 : idx;
}

export function priorityToLabel(value: number | undefined | null): TicketPriorityLabel {
  return TICKET_PRIORITY_LABELS[value ?? 0] ?? TICKET_PRIORITY_LABELS[0];
}
export function priorityFromLabel(label: string): number {
  const idx = TICKET_PRIORITY_LABELS.indexOf(label as TicketPriorityLabel);
  return idx === -1 ? 0 : idx;
}

export function statusToLabel(value: number | undefined | null): TicketStatusLabel {
  return TICKET_STATUS_LABELS[value ?? 0] ?? TICKET_STATUS_LABELS[0];
}
export function statusFromLabel(label: string): number {
  const idx = TICKET_STATUS_LABELS.indexOf(label as TicketStatusLabel);
  return idx === -1 ? 0 : idx;
}

export type AppRole = "SuperAdmin" | "Admin" | "Staff" | "Client";

export function normalizeRole(raw?: string | null): AppRole {
  const r = (raw ?? "").toLowerCase();
  if (r.includes("super")) return "SuperAdmin";
  if (r.includes("admin")) return "Admin";
  if (r.includes("staff") || r.includes("agent")) return "Staff";
  return "Client";
}

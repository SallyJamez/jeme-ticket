/**
 * The Swagger spec for this API documents request bodies in full but leaves
 * every response as a bare `200: OK` with no schema. The interfaces and
 * `normalize*` helpers below are best-effort shapes inferred from the DTO
 * names and field names used elsewhere in the spec (e.g. CreateTicketDto,
 * CreateStaffDto). They read several common alternate key names so the UI
 * degrades gracefully if the live response differs — but they should be
 * revisited once real response payloads are available.
 */

function pick<T = unknown>(obj: Record<string, unknown>, keys: string[], fallback?: T): T {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k] as T;
  }
  return fallback as T;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export function normalizePaged<T>(raw: unknown, mapItem: (x: unknown) => T): PagedResult<T> {
  if (Array.isArray(raw)) {
    return { items: raw.map(mapItem), totalCount: raw.length, pageNumber: 1, pageSize: raw.length || 10, totalPages: 1 };
  }
  const obj = (raw ?? {}) as Record<string, unknown>;
  const rawItems = pick<unknown[]>(obj, ["items", "data", "results", "records"], []) ?? [];
  const totalCount = pick<number>(obj, ["totalCount", "total", "count"], rawItems.length);
  const pageNumber = pick<number>(obj, ["pageNumber", "page"], 1);
  const pageSize = pick<number>(obj, ["pageSize", "perPage"], rawItems.length || 10);
  const totalPages = pick<number>(obj, ["totalPages"], Math.max(1, Math.ceil(totalCount / (pageSize || 1))));
  return { items: rawItems.map(mapItem), totalCount, pageNumber, pageSize, totalPages };
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  url?: string;
  uploadedAt?: string;
}

export function normalizeAttachment(raw: unknown): TicketAttachment {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(pick(o, ["id", "attachmentId"], "")),
    fileName: String(pick(o, ["fileName", "name", "originalFileName"], "attachment")),
    url: pick(o, ["url", "fileUrl", "path"], undefined),
    uploadedAt: pick(o, ["uploadedAt", "createdAt"], undefined),
  };
}

export interface TicketComment {
  id: string;
  message: string;
  isInternal: boolean;
  authorName?: string;
  createdAt?: string;
  attachments?: TicketAttachment[];
}

export function normalizeComment(raw: unknown): TicketComment {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(pick(o, ["id", "commentId"], "")),
    message: String(pick(o, ["message", "content", "text"], "")),
    isInternal: Boolean(pick(o, ["isInternal", "internal"], false)),
    authorName: pick(o, ["authorName", "userName", "createdByName", "staffName"], undefined),
    createdAt: pick(o, ["createdAt", "timestamp", "date"], undefined),
    attachments: Array.isArray(o["attachments"]) ? (o["attachments"] as unknown[]).map(normalizeAttachment) : [],
  };
}

export interface ApiTicket {
  id: string;
  title: string;
  description: string;
  category: number;
  priority: number;
  status: number;
  clientId?: string;
  clientName?: string;
  contactName?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  departmentName?: string;
  createdAt?: string;
  updatedAt?: string;
  csatRating?: number;
  csatComment?: string;
  comments: TicketComment[];
  attachments: TicketAttachment[];
  raw?: unknown;
}

export function normalizeTicket(raw: unknown): ApiTicket {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(pick(o, ["id", "ticketId"], "")),
    title: String(pick(o, ["title", "subject"], "(untitled)")),
    description: String(pick(o, ["description"], "")),
    category: Number(pick(o, ["category"], 0)),
    priority: Number(pick(o, ["priority"], 0)),
    status: Number(pick(o, ["status"], 0)),
    clientId: pick(o, ["clientId"], undefined),
    clientName: pick(o, ["clientName", "companyName", "client"], undefined),
    contactName: pick(o, ["contactName", "createdByName", "clientContactName"], undefined),
    assignedStaffId: pick(o, ["assignedStaffId", "assignedToId"], undefined),
    assignedStaffName: pick(o, ["assignedStaffName", "assignedTo", "assignedToName"], undefined),
    departmentName: pick(o, ["departmentName", "department"], undefined),
    createdAt: pick(o, ["createdAt", "dateCreated"], undefined),
    updatedAt: pick(o, ["updatedAt", "dateUpdated", "lastModified"], undefined),
    csatRating: pick(o, ["csatRating", "rating"], undefined),
    csatComment: pick(o, ["csatComment"], undefined),
    comments: Array.isArray(o["comments"]) ? (o["comments"] as unknown[]).map(normalizeComment) : [],
    attachments: Array.isArray(o["attachments"]) ? (o["attachments"] as unknown[]).map(normalizeAttachment) : [],
    raw,
  };
}

export interface ApiStaff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role?: string;
  isActive?: boolean;
  raw?: unknown;
}

export function normalizeStaff(raw: unknown): ApiStaff {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(pick(o, ["id", "staffId", "userId"], "")),
    firstName: String(pick(o, ["firstName"], "")),
    lastName: String(pick(o, ["lastName"], "")),
    email: String(pick(o, ["email"], "")),
    department: String(pick(o, ["department"], "")),
    role: pick(o, ["role"], undefined),
    isActive: pick(o, ["isActive", "active"], true),
    raw,
  };
}

export interface ApiClient {
  id: string;
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  raw?: unknown;
}

export function normalizeClient(raw: unknown): ApiClient {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(pick(o, ["id", "clientId"], "")),
    companyName: String(pick(o, ["companyName", "company"], "")),
    companyAddress: pick(o, ["companyAddress"], undefined),
    companyEmail: pick(o, ["companyEmail"], undefined),
    adminFirstName: pick(o, ["adminFirstName"], undefined),
    adminLastName: pick(o, ["adminLastName"], undefined),
    adminEmail: pick(o, ["adminEmail"], undefined),
    raw,
  };
}

export interface ApiAuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  ip?: string;
  raw?: unknown;
}

export function normalizeAuditLog(raw: unknown): ApiAuditLog {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(pick(o, ["id", "logId"], "")),
    user: String(pick(o, ["user", "userName", "actor"], "")),
    action: String(pick(o, ["action"], "")),
    entity: String(pick(o, ["entity", "entityName"], "")),
    oldValue: pick(o, ["oldValue"], undefined),
    newValue: pick(o, ["newValue"], undefined),
    timestamp: String(pick(o, ["timestamp", "createdAt", "date"], "")),
    ip: pick(o, ["ip", "ipAddress"], undefined),
    raw,
  };
}

export interface ListQuery {
  filterOn?: string;
  filterQuery?: string;
  sortBy?: string;
  isAscending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export function buildListParams(query: ListQuery = {}): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    pageNumber: query.pageNumber ?? 1,
    pageSize: query.pageSize ?? 10,
  };
  if (query.filterOn) params.filterOn = query.filterOn;
  if (query.filterQuery) params.filterQuery = query.filterQuery;
  if (query.sortBy) params.sortBy = query.sortBy;
  if (query.isAscending !== undefined) params.isAscending = query.isAscending;
  return params;
}

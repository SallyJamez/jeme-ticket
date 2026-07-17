export type TicketStatus =
  | "New"
  | "Open"
  | "In Progress"
  | "On Hold"
  | "Escalated"
  | "Resolved"
  | "Closed";

export type TicketPriority = "Low" | "Medium" | "High" | "Critical";

export type SlaState = "On Track" | "At Risk" | "Breached" | "Met";

export interface Department {
  id: string;
  name: string;
  lead: string;
  agents: number;
  openTickets: number;
  slaCompliance: number;
}

export interface Agent {
  id: string;
  name: string;
  initials: string;
  department: string;
  role: "Agent" | "Team Lead" | "Admin";
  activeTickets: number;
  resolvedThisMonth: number;
  csat: number;
  slaCompliance: number;
}

export interface Client {
  id: string;
  company: string;
  contact: string;
  email: string;
  tier: "Standard" | "Priority" | "Enterprise";
}

export interface TicketEvent {
  id: string;
  type: "comment" | "status" | "assignment" | "escalation" | "sla" | "attachment";
  actor: string;
  message: string;
  timestamp: string;
  internal?: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  client: string;
  contact: string;
  department: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  tatHoursTotal: number;
  tatHoursElapsed: number;
  slaState: SlaState;
  csat: number | null;
  escalationLevel: 0 | 1 | 2 | 3;
  events: TicketEvent[];
}

export interface KbArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  views: number;
  helpfulPct: number;
  updatedAt: string;
}

export interface Contract {
  id: string;
  client: string;
  plan: "Standard" | "Priority" | "Enterprise";
  startDate: string;
  endDate: string;
  ticketAllowance: number;
  ticketsUsed: number;
  responseTimeHrs: number;
  resolutionTimeHrs: number;
  status: "Active" | "Expiring Soon" | "Expired";
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
  ip: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  type: "sla" | "comment" | "assignment" | "system";
}

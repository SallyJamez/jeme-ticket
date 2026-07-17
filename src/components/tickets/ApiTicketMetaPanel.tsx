import type { ApiTicket } from "@/lib/api/types";
import { categoryToLabel } from "@/lib/api/enums";
import { formatDateTime } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

export function ApiTicketMetaPanel({ ticket }: { ticket: ApiTicket }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Client", value: ticket.clientName ?? "—" },
    { label: "Contact", value: ticket.contactName ?? "—" },
    { label: "Department", value: ticket.departmentName ?? "—" },
    { label: "Category", value: categoryToLabel(ticket.category) },
    { label: "Created", value: ticket.createdAt ? formatDateTime(ticket.createdAt) : "—" },
    { label: "Last updated", value: ticket.updatedAt ? formatDateTime(ticket.updatedAt) : "—" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Assigned to</p>
        {ticket.assignedStaffName ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={ticket.assignedStaffName} size="md" />
            <div>
              <p className="text-sm font-semibold text-ink-800">{ticket.assignedStaffName}</p>
              <p className="text-xs text-ink-400">{ticket.departmentName ?? ""}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-400">Unassigned</p>
        )}
      </div>

      <dl className="space-y-3 border-t border-ink-100 pt-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3 text-sm">
            <dt className="text-ink-400">{r.label}</dt>
            <dd className="text-right font-medium text-ink-800">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

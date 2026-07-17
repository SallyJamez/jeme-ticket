import type { Ticket } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

export function TicketMetaPanel({ ticket }: { ticket: Ticket }) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Client", value: ticket.client },
    { label: "Contact", value: ticket.contact },
    { label: "Department", value: ticket.department },
    { label: "Category", value: ticket.category },
    { label: "Created", value: formatDateTime(ticket.createdAt) },
    { label: "Due by", value: formatDateTime(ticket.dueAt) },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Assigned to</p>
        {ticket.assignedTo ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={ticket.assignedTo} size="md" />
            <div>
              <p className="text-sm font-semibold text-ink-800">{ticket.assignedTo}</p>
              <p className="text-xs text-ink-400">{ticket.department}</p>
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

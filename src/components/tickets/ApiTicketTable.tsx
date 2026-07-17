import Link from "next/link";
import type { ApiTicket } from "@/lib/api/types";
import { categoryToLabel, priorityToLabel, statusToLabel } from "@/lib/api/enums";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { priorityStyles, statusStyles, timeAgo } from "@/lib/utils";

interface ApiTicketTableProps {
  tickets: ApiTicket[];
  portal: "client" | "agent";
  showAssignee?: boolean;
  showClient?: boolean;
}

/**
 * Renders ApiTicket rows (real backend data). The mock <TicketTable /> is
 * still used nowhere once the real hooks are wired — kept only as reference
 * since it depends on SLA fields (tatHoursElapsed, slaState, etc.) the API
 * does not return.
 */
export function ApiTicketTable({ tickets, portal, showAssignee = false, showClient = false }: ApiTicketTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
            <th className="whitespace-nowrap px-4 py-3 font-medium">Ticket</th>
            {showClient && <th className="whitespace-nowrap px-4 py-3 font-medium">Client</th>}
            <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Priority</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Category</th>
            {showAssignee && <th className="whitespace-nowrap px-4 py-3 font-medium">Assigned to</th>}
            <th className="whitespace-nowrap px-4 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => {
            const status = statusToLabel(t.status);
            const priority = priorityToLabel(t.priority);
            return (
              <tr key={t.id} className="group border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                <td className="px-4 py-3.5">
                  <Link href={`/${portal}/tickets/${t.id}`} className="focus-ring block">
                    <span className="block font-mono text-xs text-ink-400">{t.id.slice(0, 8)}</span>
                    <span className="mt-0.5 block max-w-[280px] truncate font-medium text-ink-900 group-hover:text-brand-700">
                      {t.title}
                    </span>
                  </Link>
                </td>
                {showClient && (
                  <td className="whitespace-nowrap px-4 py-3.5 text-ink-600">{t.clientName ?? "—"}</td>
                )}
                <td className="whitespace-nowrap px-4 py-3.5">
                  <Badge className={`${statusStyles[status].bg} ${statusStyles[status].text}`}>{status}</Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <Badge className={`${priorityStyles[priority].bg} ${priorityStyles[priority].text}`}>
                    {priority}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-ink-500">{categoryToLabel(t.category)}</td>
                {showAssignee && (
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {t.assignedStaffName ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={t.assignedStaffName} size="sm" />
                        <span className="text-xs text-ink-600">{t.assignedStaffName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-400">Unassigned</span>
                    )}
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-ink-500">
                  {t.updatedAt ? timeAgo(t.updatedAt) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

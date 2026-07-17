import Link from "next/link";
import type { Ticket } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { SlaRing } from "@/components/ui/SlaRing";
import { Avatar } from "@/components/ui/Avatar";
import { priorityStyles, slaStateStyles, statusStyles, timeAgo } from "@/lib/utils";

interface TicketTableProps {
  tickets: Ticket[];
  portal: "client" | "staff";
  showAssignee?: boolean;
  showClient?: boolean;
}

export function TicketTable({ tickets, portal, showAssignee = false, showClient = false }: TicketTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
            <th className="whitespace-nowrap px-4 py-3 font-medium">Ticket</th>
            {showClient && <th className="whitespace-nowrap px-4 py-3 font-medium">Client</th>}
            <th className="whitespace-nowrap px-4 py-3 font-medium">Status</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">Priority</th>
            <th className="whitespace-nowrap px-4 py-3 font-medium">SLA</th>
            {showAssignee && <th className="whitespace-nowrap px-4 py-3 font-medium">Assigned to</th>}
            <th className="whitespace-nowrap px-4 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => {
            const pct = (t.tatHoursElapsed / t.tatHoursTotal) * 100;
            return (
              <tr key={t.id} className="group border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                <td className="px-4 py-3.5">
                  <Link href={`/${portal}/tickets/${t.id}`} className="focus-ring block">
                    <span className="block font-mono text-xs text-ink-400">{t.id}</span>
                    <span className="mt-0.5 block max-w-[280px] truncate font-medium text-ink-900 group-hover:text-brand-700">
                      {t.subject}
                    </span>
                  </Link>
                </td>
                {showClient && (
                  <td className="whitespace-nowrap px-4 py-3.5 text-ink-600">{t.client}</td>
                )}
                <td className="whitespace-nowrap px-4 py-3.5">
                  <Badge className={`${statusStyles[t.status].bg} ${statusStyles[t.status].text}`}>{t.status}</Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <Badge className={`${priorityStyles[t.priority].bg} ${priorityStyles[t.priority].text}`}>
                    {t.priority}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <SlaRing percentElapsed={pct} size={30} stroke={3.5} />
                    <span className={`text-xs font-medium ${slaStateStyles[t.slaState].text}`}>{t.slaState}</span>
                  </div>
                </td>
                {showAssignee && (
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {t.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={t.assignedTo} size="sm" />
                        <span className="text-xs text-ink-600">{t.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-400">Unassigned</span>
                    )}
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-ink-500">{timeAgo(t.updatedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

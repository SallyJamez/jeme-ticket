import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { TicketTable } from "@/components/tickets/TicketTable";
import { tickets } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { User, Users, Building2, ChevronRight } from "lucide-react";

const levels = [
  { level: 1, label: "Level 1", who: "Assigned agent", icon: User, threshold: "50% of TAT elapsed" },
  { level: 2, label: "Level 2", who: "Team lead", icon: Users, threshold: "80% of TAT elapsed" },
  { level: 3, label: "Level 3", who: "Department head / management", icon: Building2, threshold: "SLA breached" },
];

export default function EscalationsPage() {
  const escalated = tickets.filter((t) => t.escalationLevel > 0);

  return (
    <div>
      <PageHeader title="Escalation workflow" subtitle="Tickets that have breached escalation thresholds, routed by severity." />

      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {levels.map((l, i) => {
              const Icon = l.icon;
              const count = escalated.filter((t) => t.escalationLevel === l.level).length;
              return (
                <div key={l.level} className="flex flex-1 items-center gap-3">
                  <div className="flex flex-1 items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink-800">{l.label} · {l.who}</p>
                      <p className="text-xs text-ink-400">{l.threshold}</p>
                    </div>
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">{count}</span>
                  </div>
                  {i < levels.length - 1 && <ChevronRight size={16} className="hidden shrink-0 text-ink-300 sm:block" />}
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active escalations</CardTitle>
          <Badge className="bg-red-50 text-red-700">{escalated.length} tickets</Badge>
        </CardHeader>
        <CardBody className="pt-3">
          <TicketTable tickets={escalated} portal="staff" showAssignee showClient />
        </CardBody>
      </Card>
    </div>
  );
}

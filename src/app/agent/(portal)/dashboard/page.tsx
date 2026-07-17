import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketVolumeChart } from "@/components/charts/TicketVolumeChart";
import { Avatar } from "@/components/ui/Avatar";
import { tickets, agents } from "@/lib/mock-data";
import { Ticket, AlertTriangle, Star, ShieldCheck, ArrowRight } from "lucide-react";

export default function StaffDashboardPage() {
  const openTickets = tickets.filter((t) => !["Resolved", "Closed"].includes(t.status));
  const breached = tickets.filter((t) => t.slaState === "Breached" || t.slaState === "At Risk");
  const topAgents = [...agents].sort((a, b) => b.resolvedThisMonth - a.resolvedThisMonth).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Team dashboard"
        subtitle="Payments & Settlements · Ngozi Adeyemi, Team Lead"
        actions={
          <Link href="/staff/tickets" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
            Go to queue <ArrowRight size={14} />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open tickets" value={String(openTickets.length)} delta="+4 today" deltaDirection="down" icon={<Ticket size={16} />} accent="brand" />
        <StatCard label="At risk / breached" value={String(breached.length)} delta="needs attention" deltaDirection="down" icon={<AlertTriangle size={16} />} accent="red" />
        <StatCard label="Team CSAT" value="4.6 / 5" delta="+0.1" deltaDirection="up" icon={<Star size={16} />} accent="amber" />
        <StatCard label="SLA compliance" value="93%" delta="+2pts" deltaDirection="up" icon={<ShieldCheck size={16} />} accent="brand" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ticket volume — created vs resolved</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            <TicketVolumeChart />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top performing agents</CardTitle>
          </CardHeader>
          <CardBody className="space-y-1 pt-2">
            {topAgents.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg px-1 py-2 hover:bg-ink-50">
                <span className="w-4 text-center text-xs font-semibold text-ink-300">{i + 1}</span>
                <Avatar name={a.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-ink-800">{a.name}</p>
                  <p className="truncate text-xs text-ink-400">{a.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-700">{a.resolvedThisMonth}</p>
                  <p className="text-[10px] text-ink-400">resolved</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Needs attention — at risk &amp; breached</CardTitle>
          <Link href="/staff/escalations" className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
            View escalations <ArrowRight size={13} />
          </Link>
        </CardHeader>
        <CardBody className="pt-3">
          <TicketTable tickets={breached} portal="staff" showAssignee showClient />
        </CardBody>
      </Card>
    </div>
  );
}

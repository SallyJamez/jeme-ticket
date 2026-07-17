import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TicketTable } from "@/components/tickets/TicketTable";
import { tickets, contracts, kbArticles } from "@/lib/mock-data";
import { Plus, Ticket, Timer, Star, ShieldCheck, ArrowRight } from "lucide-react";

export default function ClientDashboardPage() {
  const myTickets = tickets.filter((t) => t.client === "Kelvin Tony");
  const openCount = myTickets.filter((t) => !["Resolved", "Closed"].includes(t.status)).length;
  const contract = contracts.find((c) => c.client === "Kelvin Tony");

  return (
    <div>
      <PageHeader
        title="Welcome Sally"
        subtitle="Here's what's happening across your support tickets today."
        actions={
          <Link href="/client/tickets/new">
            <Button icon={<Plus size={15} />}>New ticket</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open tickets" value={String(openCount)} delta="+1 this week" deltaDirection="up" icon={<Ticket size={16} />} accent="brand" />
        <StatCard label="Avg. resolution time" value="9.4 hrs" delta="-2.1 hrs" deltaDirection="up" icon={<Timer size={16} />} accent="blue" />
        <StatCard label="CSAT score" value="4.6 / 5" delta="+0.2" deltaDirection="up" icon={<Star size={16} />} accent="amber" />
        <StatCard label="SLA compliance" value="93%" delta="steady" deltaDirection="flat" icon={<ShieldCheck size={16} />} accent="brand" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent tickets</CardTitle>
            <Link href="/client/tickets" className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              View all <ArrowRight size={13} />
            </Link>
          </CardHeader>
          <CardBody className="pt-3">
            <TicketTable tickets={myTickets.slice(0, 5)} portal="client" />
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your service contract</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              {contract && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-900">{contract.plan} plan</span>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">{contract.status}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-ink-500">
                      <span>Ticket allowance used</span>
                      <span>{contract.ticketsUsed} / {contract.ticketAllowance}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full rounded-full bg-brand-600"
                        style={{ width: `${(contract.ticketsUsed / contract.ticketAllowance) * 100}%` }}
                      />
                    </div>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <dt className="text-ink-400">Response time</dt>
                      <dd className="font-semibold text-ink-800">{contract.responseTimeHrs}h</dd>
                    </div>
                    <div>
                      <dt className="text-ink-400">Resolution time</dt>
                      <dd className="font-semibold text-ink-800">{contract.resolutionTimeHrs}h</dd>
                    </div>
                  </dl>
                  <Link href="/client/contracts" className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
                    View contract details <ArrowRight size={13} />
                  </Link>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular help articles</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 pt-3">
              {kbArticles.slice(0, 3).map((a) => (
                <Link key={a.id} href="/client/knowledge-base" className="focus-ring block rounded-lg p-2 -mx-2 hover:bg-ink-50">
                  <p className="text-sm font-medium text-ink-800">{a.title}</p>
                  <p className="text-xs text-ink-400">{a.category} · {a.helpfulPct}% found helpful</p>
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

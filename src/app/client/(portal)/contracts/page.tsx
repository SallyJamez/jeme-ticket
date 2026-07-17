import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { contracts } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { CalendarClock, FileText, Timer, Gauge } from "lucide-react";

export default function ClientContractsPage() {
  const contract = contracts.find((c) => c.client === "Helder Bespoke")!;
  const usagePct = Math.round((contract.ticketsUsed / contract.ticketAllowance) * 100);

  return (
    <div>
      <PageHeader title="Contract & service management" subtitle="Your service level agreement and plan usage." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{contract.plan} plan</CardTitle>
            <Badge className={contract.status === "Active" ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"}>
              {contract.status}
            </Badge>
          </CardHeader>
          <CardBody className="pt-3">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <div className="rounded-xl bg-ink-50 p-3.5">
                <CalendarClock size={15} className="text-ink-400" />
                <p className="mt-2 text-xs text-ink-400">Start date</p>
                <p className="text-sm font-semibold text-ink-800">{formatDate(contract.startDate)}</p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3.5">
                <CalendarClock size={15} className="text-ink-400" />
                <p className="mt-2 text-xs text-ink-400">Renewal date</p>
                <p className="text-sm font-semibold text-ink-800">{formatDate(contract.endDate)}</p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3.5">
                <Timer size={15} className="text-ink-400" />
                <p className="mt-2 text-xs text-ink-400">Response time SLA</p>
                <p className="text-sm font-semibold text-ink-800">{contract.responseTimeHrs}h</p>
              </div>
              <div className="rounded-xl bg-ink-50 p-3.5">
                <Gauge size={15} className="text-ink-400" />
                <p className="mt-2 text-xs text-ink-400">Resolution time SLA</p>
                <p className="text-sm font-semibold text-ink-800">{contract.resolutionTimeHrs}h</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-ink-700">Ticket allowance used</span>
                <span className="text-ink-500">{contract.ticketsUsed} / {contract.ticketAllowance} ({usagePct}%)</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
                <div
                  className={`h-full rounded-full ${usagePct > 90 ? "bg-amber-500" : "bg-brand-600"}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              {usagePct > 90 && (
                <p className="mt-2 text-xs text-amber-600">
                  You&apos;re approaching your plan&apos;s ticket allowance. Consider upgrading before renewal.
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2.5 pt-3">
            {["Master Service Agreement.pdf", "SLA Addendum 2026.pdf", "Data Processing Agreement.pdf"].map((doc) => (
              <button key={doc} className="focus-ring flex w-full items-center gap-2.5 rounded-lg border border-ink-100 p-2.5 text-left text-xs font-medium text-ink-700 hover:bg-ink-50">
                <FileText size={14} className="text-ink-400" />
                {doc}
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Plan comparison</CardTitle>
        </CardHeader>
        <CardBody className="overflow-x-auto pt-3">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4 font-medium">Plan</th>
                <th className="py-2 pr-4 font-medium">Response time</th>
                <th className="py-2 pr-4 font-medium">Resolution time</th>
                <th className="py-2 pr-4 font-medium">Monthly tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              <tr>
                <td className="py-3 pr-4 text-ink-600">Standard</td>
                <td className="py-3 pr-4 text-ink-600">4h</td>
                <td className="py-3 pr-4 text-ink-600">72h</td>
                <td className="py-3 pr-4 text-ink-600">100</td>
              </tr>
              <tr className="bg-brand-50/40">
                <td className="py-3 pr-4 font-semibold text-brand-700">Priority (current)</td>
                <td className="py-3 pr-4 text-ink-600">2h</td>
                <td className="py-3 pr-4 text-ink-600">24h</td>
                <td className="py-3 pr-4 text-ink-600">200</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-ink-600">Enterprise</td>
                <td className="py-3 pr-4 text-ink-600">1h</td>
                <td className="py-3 pr-4 text-ink-600">8h</td>
                <td className="py-3 pr-4 text-ink-600">500</td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

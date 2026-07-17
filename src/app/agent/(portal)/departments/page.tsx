import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { departments } from "@/lib/mock-data";
import { ArrowRight, Building2, Users } from "lucide-react";

export default function DepartmentsPage() {
  return (
    <div>
      <PageHeader title="Departments" subtitle="SLA performance and queue load broken down by department." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => (
          <Card key={d.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Building2 size={16} />
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  d.slaCompliance >= 90 ? "bg-brand-50 text-brand-700" : d.slaCompliance >= 85 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                }`}
              >
                {d.slaCompliance}% SLA
              </span>
            </div>
            <h3 className="mt-3 font-display text-sm font-semibold text-ink-900">{d.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
              <Users size={12} /> Led by {d.lead}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-100 pt-3 text-xs">
              <div>
                <p className="text-ink-400">Agents</p>
                <p className="font-semibold text-ink-800">{d.agents}</p>
              </div>
              <div>
                <p className="text-ink-400">Open tickets</p>
                <p className="font-semibold text-ink-800">{d.openTickets}</p>
              </div>
            </div>
            <Link href="/staff/tickets" className="mt-4 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              View queue <ArrowRight size={13} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { TicketVolumeChart } from "@/components/charts/TicketVolumeChart";
import { SlaTrendChart } from "@/components/charts/SlaTrendChart";
import { DepartmentBarChart } from "@/components/charts/DepartmentBarChart";
import { CsatDonutChart } from "@/components/charts/CsatDonutChart";
import { Avatar } from "@/components/ui/Avatar";
import { agents, tickets } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { FileSpreadsheet, FileText, Ticket, ShieldCheck, Timer, Star, AlertTriangle } from "lucide-react";

const REPORT_TABS = [
  "Ticket Volume",
  "SLA Compliance",
  "Resolution Time",
  "Agent Performance",
  "Department Performance",
  "CSAT",
  "Breach Analysis",
] as const;

export default function ReportsPage() {
  const [tab, setTab] = useState<(typeof REPORT_TABS)[number]>("Ticket Volume");
  const breached = tickets.filter((t) => t.slaState === "Breached");

  return (
    <div>
      <PageHeader
        title="Reporting & analytics"
        subtitle="Custom date range reports across tickets, SLA, agents, and departments."
        actions={
          <>
            <Button variant="outline" size="sm" icon={<FileSpreadsheet size={14} />}>Export Excel</Button>
            <Button variant="outline" size="sm" icon={<FileText size={14} />}>Export PDF</Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardBody className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600">From</label>
            <Input type="date" defaultValue="2026-06-07" className="w-auto" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600">To</label>
            <Input type="date" defaultValue="2026-07-07" className="w-auto" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600">Department</label>
            <Select className="w-auto min-w-[180px]" defaultValue="All departments">
              <option>All departments</option>
              <option>Payments & Settlements</option>
              <option>Card Services</option>
              <option>Onboarding & KYC</option>
              <option>Technical Integration</option>
              <option>Billing & Disputes</option>
            </Select>
          </div>
          <Button size="sm">Apply range</Button>
        </CardBody>
      </Card>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-ink-200 pb-px">
        {REPORT_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "focus-ring -mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tickets this period" value="285" delta="+12%" deltaDirection="up" icon={<Ticket size={16} />} accent="brand" />
        <StatCard label="SLA compliance" value="92%" delta="+2pts" deltaDirection="up" icon={<ShieldCheck size={16} />} accent="brand" />
        <StatCard label="Avg. resolution time" value="11.2 hrs" delta="-1.4 hrs" deltaDirection="up" icon={<Timer size={16} />} accent="blue" />
        <StatCard label="CSAT" value="4.5 / 5" delta="+0.1" deltaDirection="up" icon={<Star size={16} />} accent="amber" />
      </div>

      <div className="mt-6">
        {tab === "Ticket Volume" && (
          <Card>
            <CardHeader><CardTitle>Ticket volume — created vs resolved</CardTitle></CardHeader>
            <CardBody className="pt-0"><TicketVolumeChart /></CardBody>
          </Card>
        )}

        {tab === "SLA Compliance" && (
          <Card>
            <CardHeader><CardTitle>SLA compliance trend</CardTitle></CardHeader>
            <CardBody className="pt-0"><SlaTrendChart /></CardBody>
          </Card>
        )}

        {tab === "Resolution Time" && (
          <Card>
            <CardHeader><CardTitle>Resolution time by department (avg hours)</CardTitle></CardHeader>
            <CardBody className="overflow-x-auto pt-3">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2 pr-4 font-medium">Department</th>
                    <th className="py-2 pr-4 font-medium">Avg. first response</th>
                    <th className="py-2 pr-4 font-medium">Avg. resolution</th>
                    <th className="py-2 pr-4 font-medium">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {[
                    ["Payments & Settlements", "1.2h", "6.4h", "8h"],
                    ["Card Services", "1.8h", "18.2h", "24h"],
                    ["Onboarding & KYC", "2.4h", "31.5h", "72h"],
                    ["Technical Integration", "3.1h", "40.8h", "48h"],
                    ["Billing & Disputes", "2.0h", "22.1h", "72h"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td key={i} className={cn("py-3 pr-4", i === 0 ? "font-medium text-ink-800" : "text-ink-600")}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        )}

        {tab === "Agent Performance" && (
          <Card>
            <CardHeader><CardTitle>Agent performance</CardTitle></CardHeader>
            <CardBody className="overflow-x-auto pt-3">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2 pr-4 font-medium">Agent</th>
                    <th className="py-2 pr-4 font-medium">Active</th>
                    <th className="py-2 pr-4 font-medium">Resolved</th>
                    <th className="py-2 pr-4 font-medium">CSAT</th>
                    <th className="py-2 pr-4 font-medium">SLA compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {agents.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={a.name} size="sm" />
                          <div>
                            <p className="font-medium text-ink-800">{a.name}</p>
                            <p className="text-xs text-ink-400">{a.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-ink-600">{a.activeTickets}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{a.resolvedThisMonth}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{a.csat.toFixed(1)}</td>
                      <td className="py-2.5 pr-4">
                        <span className={a.slaCompliance >= 90 ? "font-medium text-brand-700" : a.slaCompliance >= 85 ? "font-medium text-amber-700" : "font-medium text-red-700"}>
                          {a.slaCompliance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        )}

        {tab === "Department Performance" && (
          <Card>
            <CardHeader><CardTitle>SLA compliance by department</CardTitle></CardHeader>
            <CardBody className="pt-0"><DepartmentBarChart /></CardBody>
          </Card>
        )}

        {tab === "CSAT" && (
          <Card>
            <CardHeader><CardTitle>CSAT score distribution</CardTitle></CardHeader>
            <CardBody className="pt-3"><CsatDonutChart /></CardBody>
          </Card>
        )}

        {tab === "Breach Analysis" && (
          <Card>
            <CardHeader>
              <CardTitle>SLA breach analysis</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <AlertTriangle size={15} />
                {breached.length} tickets breached SLA in this period, concentrated in Technical Integration and Card Services.
              </div>
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2 pr-4 font-medium">Ticket</th>
                    <th className="py-2 pr-4 font-medium">Department</th>
                    <th className="py-2 pr-4 font-medium">Priority</th>
                    <th className="py-2 pr-4 font-medium">Overage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {breached.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2.5 pr-4 font-medium text-ink-800">{t.id}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{t.department}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{t.priority}</td>
                      <td className="py-2.5 pr-4 font-medium text-red-600">
                        +{(t.tatHoursElapsed - t.tatHoursTotal).toFixed(1)}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

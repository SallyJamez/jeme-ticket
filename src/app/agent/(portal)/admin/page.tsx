"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { InviteStaffModal } from "@/components/admin/InviteStaffModal";
import { EditStaffModal } from "@/components/admin/EditStaffModal";
import { AddClientModal } from "@/components/admin/AddClientModal";
import { useAdmin } from "@/hooks/useAdmin";
import { useAdminStore } from "@/store/useAdminStore";
import { cn } from "@/lib/utils";
import { Plus, Pencil, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";
import type { ApiStaff } from "@/lib/api/types";

const TABS = ["Users & Roles", "Clients", "SLA Policies", "Departments"] as const;

const slaPolicies = [
  { priority: "High", firstResponse: "2 hours", resolution: "24 hours" },
  { priority: "Medium", firstResponse: "4 hours", resolution: "48 hours" },
  { priority: "Low", firstResponse: "8 hours", resolution: "72 hours" },
];

const mockDepartments = [
  { id: "d1", name: "Payments & Settlements", lead: "—", agents: 0 },
  { id: "d2", name: "Card Services", lead: "—", agents: 0 },
  { id: "d3", name: "Technical Integration", lead: "—", agents: 0 },
];

function NoBackendNotice() {
  return (
    <span className="flex items-center gap-1.5 text-xs text-ink-400">
      <Info size={13} /> Preview only — no backend endpoint yet
    </span>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Users & Roles");
  const { listStaff, listClients } = useAdmin();
  const { staff, clients, isLoading } = useAdminStore();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editing, setEditing] = useState<ApiStaff | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);

  useEffect(() => {
    listStaff().catch(() => toast.error("Could not load staff."));
    listClients().catch(() => toast.error("Could not load clients."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHeader title="System administration" subtitle="Manage users, clients, roles, SLA policies, and departments." />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-ink-200 pb-px">
        {TABS.map((t) => (
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

      {tab === "Users & Roles" && (
        <Card>
          <CardHeader>
            <CardTitle>Staff accounts</CardTitle>
            <Button size="sm" icon={<Plus size={14} />} onClick={() => setInviteOpen(true)}>
              Invite user
            </Button>
          </CardHeader>
          <CardBody className="overflow-x-auto pt-3">
            {isLoading ? (
              <p className="py-6 text-center text-sm text-ink-400">Loading staff…</p>
            ) : staff.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-400">No staff yet. Invite your first team member.</p>
            ) : (
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Department</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {staff.map((a) => (
                    <tr key={a.id}>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={`${a.firstName} ${a.lastName}`} size="sm" />
                          <span className="font-medium text-ink-800">{a.firstName} {a.lastName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-ink-600">{a.department}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{a.email}</td>
                      <td className="py-2.5 pr-4">
                        <span className={cn(
                          "flex items-center gap-1.5 text-xs font-medium",
                          a.isActive === false ? "text-ink-400" : "text-brand-700"
                        )}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", a.isActive === false ? "bg-ink-300" : "bg-brand-600")} />
                          {a.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        <button
                          onClick={() => setEditing(a)}
                          className="focus-ring rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                        >
                          <Pencil size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      )}

      {tab === "Clients" && (
        <Card>
          <CardHeader>
            <CardTitle>Client companies</CardTitle>
            <Button size="sm" icon={<Plus size={14} />} onClick={() => setAddClientOpen(true)}>
              Add client
            </Button>
          </CardHeader>
          <CardBody className="overflow-x-auto pt-3">
            {isLoading ? (
              <p className="py-6 text-center text-sm text-ink-400">Loading clients…</p>
            ) : clients.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-400">No clients yet.</p>
            ) : (
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2 pr-4 font-medium">Company</th>
                    <th className="py-2 pr-4 font-medium">Address</th>
                    <th className="py-2 pr-4 font-medium">Company email</th>
                    <th className="py-2 pr-4 font-medium">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 pr-4 font-medium text-ink-800">{c.companyName}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{c.companyAddress}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{c.companyEmail}</td>
                      <td className="py-2.5 pr-4 text-ink-600">{c.adminFirstName} {c.adminLastName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      )}

      {tab === "SLA Policies" && (
        <Card>
          <CardHeader>
            <CardTitle>SLA / TAT policy by priority</CardTitle>
            <div className="flex items-center gap-3">
              <NoBackendNotice />
              <span className="flex items-center gap-1.5 text-xs text-ink-400">
                <ShieldCheck size={13} /> Changes are audit logged
              </span>
            </div>
          </CardHeader>
          <CardBody className="pt-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {slaPolicies.map((p) => (
                <div key={p.priority} className="rounded-xl border border-ink-100 p-4">
                  <p className="text-sm font-semibold text-ink-800">{p.priority}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-ink-400">First response</label>
                      <Input defaultValue={p.firstResponse} disabled />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-ink-400">Resolution</label>
                      <Input defaultValue={p.resolution} disabled />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {tab === "Departments" && (
        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
            <NoBackendNotice />
          </CardHeader>
          <CardBody className="overflow-x-auto pt-3">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-2 pr-4 font-medium">Department</th>
                  <th className="py-2 pr-4 font-medium">Lead</th>
                  <th className="py-2 pr-4 font-medium">Agents</th>
                  <th className="py-2 pr-4 font-medium">Default routing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {mockDepartments.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2.5 pr-4 font-medium text-ink-800">{d.name}</td>
                    <td className="py-2.5 pr-4 text-ink-600">{d.lead}</td>
                    <td className="py-2.5 pr-4 text-ink-600">
                      {staff.filter((s) => s.department === d.name).length}
                    </td>
                    <td className="py-2.5 pr-4">
                      <Select className="w-auto min-w-[160px]" defaultValue="Round robin" disabled>
                        <option>Round robin</option>
                        <option>Load balanced</option>
                        <option>Manual</option>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      <InviteStaffModal open={inviteOpen} onClose={() => setInviteOpen(false)} onCreated={() => listStaff()} />
      <EditStaffModal staff={editing} onClose={() => setEditing(null)} onUpdated={() => listStaff()} />
      <AddClientModal open={addClientOpen} onClose={() => setAddClientOpen(false)} onCreated={() => listClients()} />
    </div>
  );
}

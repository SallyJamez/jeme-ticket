"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAdmin } from "@/hooks/useAdmin";
import { useAdminStore } from "@/store/useAdminStore";
import { formatDateTime } from "@/lib/utils";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function AuditLogPage() {
  const { listAuditLogs } = useAdmin();
  const { auditLogs, auditTotalCount, isLoading } = useAdminStore();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      await listAuditLogs({
        pageNumber: page,
        pageSize: 20,
        filterQuery: query || undefined,
        filterOn: query ? "user" : undefined,
      });
    } catch {
      toast.error("Could not load audit logs.");
    }
  }, [listAuditLogs, page, query]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <PageHeader
        title="Audit trail"
        subtitle="Every create, update, delete, login, and configuration change, logged."
      />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <Input
              placeholder="Search by user"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
          <Button variant="outline" size="sm" onClick={load}>Search</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Entity</th>
                <th className="px-5 py-3 font-medium">Old value</th>
                <th className="px-5 py-3 font-medium">New value</th>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">IP address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-400">Loading…</td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-400">
                    No audit entries match your filters.
                  </td>
                </tr>
              ) : (
                auditLogs.map((e) => (
                  <tr key={e.id} className="hover:bg-ink-50/60">
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-ink-800">{e.user}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">{e.action}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-ink-600">{e.entity}</td>
                    <td className="max-w-[180px] truncate px-5 py-3 text-ink-500">{e.oldValue}</td>
                    <td className="max-w-[180px] truncate px-5 py-3 text-ink-500">{e.newValue}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-ink-500">
                      {e.timestamp ? formatDateTime(e.timestamp) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-ink-400">{e.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3 text-xs text-ink-400">
          <span>{auditTotalCount} total entries</span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="focus-ring rounded-md border border-ink-200 px-2.5 py-1 hover:bg-ink-50 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="rounded-md bg-brand-600 px-2.5 py-1 text-white">{page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="focus-ring rounded-md border border-ink-200 px-2.5 py-1 hover:bg-ink-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

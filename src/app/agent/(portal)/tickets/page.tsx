"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiTicketTable } from "@/components/tickets/ApiTicketTable";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, statusFromLabel, priorityFromLabel } from "@/lib/api/enums";
import { useAgentTickets } from "@/hooks/useAgentTickets";
import { useTicketStore } from "@/store/useTicketStore";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = ["All statuses", ...TICKET_STATUS_LABELS];
const PRIORITY_OPTIONS = ["All priorities", ...TICKET_PRIORITY_LABELS];
type View = "queue" | "mine" | "all";

export default function StaffTicketsPage() {
  const { listQueue, listMyAssigned, listAll } = useAgentTickets();
  const { tickets, totalCount, isLoading } = useTicketStore();
  const [view, setView] = useState<View>("queue");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [priority, setPriority] = useState("All priorities");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const fn = view === "queue" ? listQueue : view === "mine" ? listMyAssigned : listAll;
    try {
      await fn({ pageNumber: page, pageSize: 10, filterQuery: query || undefined, filterOn: query ? "title" : undefined });
    } catch {
      toast.error("Could not load tickets.");
    }
  }, [view, page, query, listQueue, listMyAssigned, listAll]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, page]);

  const filtered = tickets.filter((t) => {
    const matchesStatus = status === "All statuses" || t.status === statusFromLabel(status);
    const matchesPriority = priority === "All priorities" || t.priority === priorityFromLabel(priority);
    return matchesStatus && matchesPriority;
  });

  return (
    <div>
      <PageHeader title="Ticket queue" subtitle={`${totalCount} total tickets · ${filtered.length} shown`} />

      <div className="mb-4 inline-flex rounded-lg border border-ink-200 bg-white p-1">
        {([
          ["queue", "Unassigned queue"],
          ["mine", "My assigned"],
          ["all", "All tickets"],
        ] as [View, string][]).map(([v, label]) => (
          <button
            key={v}
            onClick={() => {
              setView(v);
              setPage(1);
            }}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              view === v ? "bg-brand-600 text-white" : "text-ink-500 hover:bg-ink-50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <Input
              placeholder="Search by subject"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
          <Select className="w-auto min-w-[140px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Select className="w-auto min-w-[140px]" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </Select>
          <Button variant="outline" size="sm" onClick={load}>Search</Button>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-ink-400">Loading tickets…</div>
        ) : filtered.length > 0 ? (
          <ApiTicketTable tickets={filtered} portal="agent" showAssignee showClient />
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-ink-700">No tickets match your filters</p>
            <p className="mt-1 text-xs text-ink-400">Try adjusting the status or priority filters, or switch views above.</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3 text-xs text-ink-400">
          <span>Showing {filtered.length} of {totalCount} tickets</span>
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

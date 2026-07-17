"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { ApiTicketTable } from "@/components/tickets/ApiTicketTable";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, statusFromLabel, priorityFromLabel } from "@/lib/api/enums";
import { useTickets } from "@/hooks/useTickets";
import { useTicketStore } from "@/store/useTicketStore";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = ["All statuses", ...TICKET_STATUS_LABELS];
const PRIORITY_OPTIONS = ["All priorities", ...TICKET_PRIORITY_LABELS];

export default function ClientTicketsPage() {
  const { listTickets } = useTickets();
  const { tickets, totalCount, isLoading } = useTicketStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [priority, setPriority] = useState("All priorities");

  const load = useCallback(async () => {
    try {
      await listTickets({
        pageNumber: 1,
        pageSize: 50,
        filterQuery: query || undefined,
        filterOn: query ? "title" : undefined,
      });
    } catch {
      toast.error("Could not load your tickets.");
    }
  }, [listTickets, query]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = tickets.filter((t) => {
    const matchesStatus = status === "All statuses" || t.status === statusFromLabel(status);
    const matchesPriority = priority === "All priorities" || t.priority === priorityFromLabel(priority);
    return matchesStatus && matchesPriority;
  });

  return (
    <div>
      <PageHeader
        title="Your tickets"
        subtitle={`${totalCount} total · ${filtered.length} shown`}
        actions={
          <Link href="/client/tickets/new">
            <Button icon={<Plus size={15} />}>New ticket</Button>
          </Link>
        }
      />

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
          <Select className="w-auto min-w-[150px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select className="w-auto min-w-[150px]" value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
          <Button variant="outline" size="sm" onClick={load}>
            Search
          </Button>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-ink-400">Loading tickets…</div>
        ) : filtered.length > 0 ? (
          <ApiTicketTable tickets={filtered} portal="client" />
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-ink-700">No tickets match your filters</p>
            <p className="mt-1 text-xs text-ink-400">Try clearing the search or adjusting the status and priority filters.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

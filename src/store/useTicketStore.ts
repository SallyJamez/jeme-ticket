import { create } from "zustand";
import type { ApiTicket } from "@/lib/api/types";

interface TicketFilters {
  query: string;
  status: string;
  priority: string;
  department: string;
  assignee: string;
  pageNumber: number;
  pageSize: number;
}

interface TicketState {
  tickets: ApiTicket[];
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filters: TicketFilters;
  selectedTicket: ApiTicket | null;

  setTickets: (tickets: ApiTicket[], totalCount: number, totalPages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<TicketFilters>) => void;
  resetFilters: () => void;
  setSelectedTicket: (ticket: ApiTicket | null) => void;
  upsertTicket: (ticket: ApiTicket) => void;
}

const defaultFilters: TicketFilters = {
  query: "",
  status: "All statuses",
  priority: "All priorities",
  department: "All departments",
  assignee: "All agents",
  pageNumber: 1,
  pageSize: 10,
};

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  totalCount: 0,
  totalPages: 1,
  isLoading: false,
  error: null,
  filters: defaultFilters,
  selectedTicket: null,

  setTickets: (tickets, totalCount, totalPages) => set({ tickets, totalCount, totalPages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (partial) => set((s) => ({ filters: { ...s.filters, ...partial } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedTicket: (selectedTicket) => set({ selectedTicket }),
  upsertTicket: (ticket) =>
    set((s) => ({
      tickets: s.tickets.some((t) => t.id === ticket.id)
        ? s.tickets.map((t) => (t.id === ticket.id ? ticket : t))
        : [ticket, ...s.tickets],
      selectedTicket: s.selectedTicket?.id === ticket.id ? ticket : s.selectedTicket,
    })),
}));

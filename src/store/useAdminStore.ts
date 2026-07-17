import { create } from "zustand";
import type { ApiStaff, ApiClient, ApiAuditLog } from "@/lib/api/types";

interface AdminState {
  staff: ApiStaff[];
  clients: ApiClient[];
  auditLogs: ApiAuditLog[];
  auditTotalCount: number;
  auditTotalPages: number;
  isLoading: boolean;
  error: string | null;

  setStaff: (staff: ApiStaff[]) => void;
  upsertStaff: (member: ApiStaff) => void;
  removeStaff: (id: string) => void;
  setClients: (clients: ApiClient[]) => void;
  upsertClient: (client: ApiClient) => void;
  setAuditLogs: (logs: ApiAuditLog[], totalCount: number, totalPages: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  staff: [],
  clients: [],
  auditLogs: [],
  auditTotalCount: 0,
  auditTotalPages: 1,
  isLoading: false,
  error: null,

  setStaff: (staff) => set({ staff }),
  upsertStaff: (member) =>
    set((s) => ({
      staff: s.staff.some((m) => m.id === member.id)
        ? s.staff.map((m) => (m.id === member.id ? member : m))
        : [member, ...s.staff],
    })),
  removeStaff: (id) => set((s) => ({ staff: s.staff.filter((m) => m.id !== id) })),
  setClients: (clients) => set({ clients }),
  upsertClient: (client) =>
    set((s) => ({
      clients: s.clients.some((c) => c.id === client.id)
        ? s.clients.map((c) => (c.id === client.id ? client : c))
        : [client, ...s.clients],
    })),
  setAuditLogs: (auditLogs, auditTotalCount, auditTotalPages) => set({ auditLogs, auditTotalCount, auditTotalPages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

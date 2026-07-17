"use client";

import { useCallback, useState } from "react";
import api, { ApiError } from "@/lib/api/axios";
import {
  normalizePaged,
  normalizeStaff,
  normalizeClient,
  normalizeAuditLog,
  buildListParams,
  type ApiStaff,
  type ApiClient,
  type ApiAuditLog,
  type ListQuery,
} from "@/lib/api/types";
import { useAdminStore } from "@/store/useAdminStore";
import type {
  CreateSuperAdminInput,
  CreateStaffInput,
  UpdateStaffInput,
  CreateClientInput,
} from "@/lib/validations/admin";

/**
 * Endpoints consumed here:
 *  POST   /api/Admin/superAdmin
 *  GET    /api/Admin/get-all-staff
 *  GET    /api/Admin/staff/{id}
 *  PUT    /api/Admin/staff/{id}
 *  DELETE /api/Admin/staff/{id}
 *  POST   /api/Admin/staff
 *  POST   /api/Admin/staff/{id}/resend-setup-email
 *  POST   /api/Admin/create-clients
 *  GET    /api/Admin/get-all-clients
 *  GET    /api/Admin/clients/{id}
 *  GET    /api/Admin/audit-logs
 *  GET    /api/Admin/audit-logs/{userId}
 */
export function useAdmin() {
  const { setStaff, upsertStaff, removeStaff, setClients, upsertClient, setAuditLogs, setLoading, setError } =
    useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSuperAdmin = useCallback(async (input: CreateSuperAdminInput) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/Admin/superAdmin", input);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const listStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/Admin/get-all-staff");
      const items = (Array.isArray(data) ? data : normalizePaged<ApiStaff>(data, normalizeStaff).items).map(
        normalizeStaff
      );
      setStaff(items);
      return items;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load staff.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setStaff, setLoading, setError]);

  const getStaff = useCallback(async (id: string) => {
    const { data } = await api.get(`/api/Admin/staff/${id}`);
    return normalizeStaff(data);
  }, []);

  const createStaff = useCallback(
    async (input: CreateStaffInput) => {
      setIsSubmitting(true);
      try {
        const { data } = await api.post("/api/Admin/staff", input);
        const staff = normalizeStaff(data ?? input);
        upsertStaff(staff);
        return staff;
      } finally {
        setIsSubmitting(false);
      }
    },
    [upsertStaff]
  );

  const updateStaff = useCallback(
    async (id: string, input: UpdateStaffInput) => {
      setIsSubmitting(true);
      try {
        const { data } = await api.put(`/api/Admin/staff/${id}`, input);
        const staff = normalizeStaff(data ?? { id, ...input });
        upsertStaff(staff);
        return staff;
      } finally {
        setIsSubmitting(false);
      }
    },
    [upsertStaff]
  );

  const deleteStaff = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      try {
        await api.delete(`/api/Admin/staff/${id}`);
        removeStaff(id);
      } finally {
        setIsSubmitting(false);
      }
    },
    [removeStaff]
  );

  const resendStaffSetupEmail = useCallback(async (id: string) => {
    await api.post(`/api/Admin/staff/${id}/resend-setup-email`);
  }, []);

  const listClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/Admin/get-all-clients");
      const items = (Array.isArray(data) ? data : normalizePaged<ApiClient>(data, normalizeClient).items).map(
        normalizeClient
      );
      setClients(items);
      return items;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load clients.");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [setClients, setLoading, setError]);

  const getClient = useCallback(async (id: string) => {
    const { data } = await api.get(`/api/Admin/clients/${id}`);
    return normalizeClient(data);
  }, []);

  const createClient = useCallback(
    async (input: CreateClientInput) => {
      setIsSubmitting(true);
      try {
        const { data } = await api.post("/api/Admin/create-clients", input);
        const client = normalizeClient(data ?? input);
        upsertClient(client);
        return client;
      } finally {
        setIsSubmitting(false);
      }
    },
    [upsertClient]
  );

  const listAuditLogs = useCallback(
    async (query: ListQuery = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/api/Admin/audit-logs", { params: buildListParams(query) });
        const paged = normalizePaged<ApiAuditLog>(data, normalizeAuditLog);
        setAuditLogs(paged.items, paged.totalCount, paged.totalPages);
        return paged;
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Could not load audit logs.");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setAuditLogs, setLoading, setError]
  );

  const listAuditLogsForUser = useCallback(
    async (userId: string, query: ListQuery = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/Admin/audit-logs/${userId}`, { params: buildListParams(query) });
        const paged = normalizePaged<ApiAuditLog>(data, normalizeAuditLog);
        setAuditLogs(paged.items, paged.totalCount, paged.totalPages);
        return paged;
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Could not load audit logs.");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setAuditLogs, setLoading, setError]
  );

  return {
    isSubmitting,
    createSuperAdmin,
    listStaff,
    getStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    resendStaffSetupEmail,
    listClients,
    getClient,
    createClient,
    listAuditLogs,
    listAuditLogsForUser,
  };
}

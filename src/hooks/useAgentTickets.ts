"use client";

import { useCallback, useState } from "react";
import api, { ApiError } from "@/lib/api/axios";
import {
  normalizePaged,
  normalizeTicket,
  buildListParams,
  type ApiTicket,
  type ListQuery,
} from "@/lib/api/types";
import { statusFromLabel } from "@/lib/api/enums";
import { useTicketStore } from "@/store/useTicketStore";
import type { AddCommentInput, UpdateStatusInput } from "@/lib/validations/ticket";

/**
 * Endpoints consumed here:
 *  GET   /api/Tickets            (all tickets — admin/overview view)
 *  GET   /api/Tickets/queue
 *  GET   /api/Tickets/my-assigned
 *  GET   /api/Tickets/{id}/staff
 *  PATCH /api/Tickets/{id}/claim
 *  PATCH /api/Tickets/{id}/status
 *  POST  /api/Tickets/{id}/comments/staff
 *  POST  /api/Tickets/{id}/comments/staff/{commentId}/attachments
 */
export function useAgentTickets() {
  const { setTickets, setLoading, setError, setSelectedTicket, upsertTicket } = useTicketStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runList = useCallback(
    async (path: string, query: ListQuery = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(path, { params: buildListParams(query) });
        const paged = normalizePaged<ApiTicket>(data, normalizeTicket);
        setTickets(paged.items, paged.totalCount, paged.totalPages);
        return paged;
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Could not load tickets.");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setTickets, setLoading, setError]
  );

  const listAll = useCallback((query?: ListQuery) => runList("/api/Tickets", query), [runList]);
  const listQueue = useCallback((query?: ListQuery) => runList("/api/Tickets/queue", query), [runList]);
  const listMyAssigned = useCallback((query?: ListQuery) => runList("/api/Tickets/my-assigned", query), [runList]);

  const getTicket = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/Tickets/${id}/staff`);
        const ticket = normalizeTicket(data);
        setSelectedTicket(ticket);
        return ticket;
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Could not load ticket.");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [setSelectedTicket, setLoading, setError]
  );

  const claimTicket = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      try {
        const { data } = await api.patch(`/api/Tickets/${id}/claim`);
        const ticket = normalizeTicket(data);
        upsertTicket(ticket);
        return ticket;
      } finally {
        setIsSubmitting(false);
      }
    },
    [upsertTicket]
  );

  const updateStatus = useCallback(
    async (id: string, input: UpdateStatusInput) => {
      setIsSubmitting(true);
      try {
        const { data } = await api.patch(`/api/Tickets/${id}/status`, { status: statusFromLabel(input.status) });
        const ticket = normalizeTicket(data);
        upsertTicket(ticket);
        return ticket;
      } finally {
        setIsSubmitting(false);
      }
    },
    [upsertTicket]
  );

  const addComment = useCallback(async (ticketId: string, input: AddCommentInput) => {
    const { data } = await api.post(`/api/Tickets/${ticketId}/comments/staff`, {
      message: input.message,
      isInternal: input.isInternal ?? false,
    });
    return data;
  }, []);

  const uploadCommentAttachment = useCallback(async (ticketId: string, commentId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post(`/api/Tickets/${ticketId}/comments/staff/${commentId}/attachments`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }, []);

  return {
    isSubmitting,
    listAll,
    listQueue,
    listMyAssigned,
    getTicket,
    claimTicket,
    updateStatus,
    addComment,
    uploadCommentAttachment,
  };
}

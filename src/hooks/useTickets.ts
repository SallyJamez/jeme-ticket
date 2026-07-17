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
import { categoryFromLabel, priorityFromLabel } from "@/lib/api/enums";
import { useTicketStore } from "@/store/useTicketStore";
import type { CreateTicketInput, AddCommentInput, AddCsatInput, RejectResolutionInput } from "@/lib/validations/ticket";

/**
 * Endpoints consumed here (see itemization in the final summary):
 *  POST /create-ticket
 *  GET  /get-tickets
 *  GET  /get-ticket/{id}/client
 *  POST /api/Tickets/{id}/attachments
 *  POST /api/Tickets/{id}/comments/client
 *  POST /api/Tickets/{id}/accept-resolution
 *  POST /api/Tickets/{id}/reject-resolution
 *  POST /api/Tickets/{id}/reopen
 *  POST /api/Tickets/{id}/csat
 */
export function useTickets() {
  const { setTickets, setLoading, setError, setSelectedTicket, upsertTicket, filters } = useTicketStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listTickets = useCallback(
    async (query: ListQuery = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/get-tickets", { params: buildListParams(query) });
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

  const getTicket = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/get-ticket/${id}/client`);
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

  const createTicket = useCallback(async (input: CreateTicketInput) => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/create-ticket", {
        title: input.title,
        description: input.description,
        category: categoryFromLabel(input.category),
        priority: priorityFromLabel(input.priority),
      });
      return normalizeTicket(data);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const uploadAttachment = useCallback(async (ticketId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post(`/api/Tickets/${ticketId}/attachments`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }, []);

  const addComment = useCallback(
    async (ticketId: string, input: AddCommentInput) => {
      const { data } = await api.post(`/api/Tickets/${ticketId}/comments/client`, {
        message: input.message,
        isInternal: input.isInternal ?? false,
      });
      return data;
    },
    []
  );

  const acceptResolution = useCallback(async (ticketId: string) => {
    const { data } = await api.post(`/api/Tickets/${ticketId}/accept-resolution`);
    return data;
  }, []);

  const rejectResolution = useCallback(async (ticketId: string, input: RejectResolutionInput) => {
    const { data } = await api.post(`/api/Tickets/${ticketId}/reject-resolution`, { reason: input.reason });
    return data;
  }, []);

  const reopenTicket = useCallback(async (ticketId: string) => {
    const { data } = await api.post(`/api/Tickets/${ticketId}/reopen`);
    return data;
  }, []);

  const addCsat = useCallback(async (ticketId: string, input: AddCsatInput) => {
    const { data } = await api.post(`/api/Tickets/${ticketId}/csat`, input);
    return data;
  }, []);

  return {
    filters,
    isSubmitting,
    listTickets,
    getTicket,
    createTicket,
    uploadAttachment,
    addComment,
    acceptResolution,
    rejectResolution,
    reopenTicket,
    addCsat,
    upsertTicket,
  };
}

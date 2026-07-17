"use client";

import { useCallback, useState } from "react";
import api from "@/lib/api/axios";
import type { CreateSubUserInput } from "@/lib/validations/admin";

/**
 * Endpoints consumed here:
 *  POST /api/Client/sub-users
 *  GET  /api/Client/sub-users
 *  POST /api/Client/{id}/resend-setup-email
 *  GET  /api/Client/profile
 */
export function useClientAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listSubUsers = useCallback(async () => {
    const { data } = await api.get("/api/Client/sub-users");
    return data;
  }, []);

  const createSubUser = useCallback(async (input: CreateSubUserInput) => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/api/Client/sub-users", input);
      return data;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resendSubUserSetupEmail = useCallback(async (id: string) => {
    await api.post(`/api/Client/${id}/resend-setup-email`);
  }, []);

  const getProfile = useCallback(async () => {
    const { data } = await api.get("/api/Client/profile");
    return data;
  }, []);

  return { isSubmitting, listSubUsers, createSubUser, resendSubUserSetupEmail, getProfile };
}

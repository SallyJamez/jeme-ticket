"use client";

import { useState, useCallback } from "react";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";
import { API_BASE_URL, ApiError } from "@/lib/api/axios";
import type { LoginInput, RequestResetInput, ResetPasswordInput } from "@/lib/validations/auth";

/**
 * Auth is handled by NextAuth (see src/auth.ts), which itself calls
 * POST /api/Auth/Login under the hood via the Credentials provider.
 * Password reset endpoints don't require a session, so they're called
 * directly with a bare axios instance (no auth header needed/available yet).
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (input: LoginInput, callbackUrl?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        userName: input.userName,
        password: input.password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid username or password.");
        return false;
      }
      if (callbackUrl) window.location.href = callbackUrl;
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (callbackUrl = "/") => {
    await signOut({ callbackUrl });
  }, []);

  // POST /api/Auth/generate-reset-token — body is the raw email string.
  const requestPasswordReset = useCallback(async (input: RequestResetInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/generate-reset-token`, JSON.stringify(input.email), {
        headers: { "Content-Type": "application/json" },
      });
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not send reset email. Try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // POST /api/Auth/ResetPassword
  const resetPassword = useCallback(async (input: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/api/Auth/ResetPassword`, {
        email: input.email,
        token: input.token,
        newPassword: input.newPassword,
      });
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not reset password. Check your token and try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, logout, requestPasswordReset, resetPassword, isLoading, error };
}

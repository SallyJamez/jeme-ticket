import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://jemesupport201.runasp.net";

export class ApiError extends Error {
  status?: number;
  data?: unknown;
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Shared axios instance used by every hook in src/hooks. All requests go
 * through this file so auth, base URL, and error handling stay in one place.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor: attach the NextAuth session's bearer token.
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = await getSession();
  const token = (session as unknown as { accessToken?: string } | null)?.accessToken;

  if (token) {
    config.headers = config.headers ?? ({} as InternalAxiosRequestConfig["headers"]);
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: normalize errors and sign the user out on 401.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<unknown>) => {
    const status = error.response?.status;
    const data = error.response?.data as Record<string, unknown> | string | undefined;

    const message =
      (typeof data === "string" ? data : undefined) ??
      (typeof data === "object" && data ? (data.message as string) ?? (data.title as string) : undefined) ??
      error.message ??
      "Something went wrong. Please try again.";

    if (status === 401 && typeof window !== "undefined") {
      await signOut({ redirect: true, callbackUrl: "/" });
    }

    return Promise.reject(new ApiError(message, status, data));
  }
);

export default api;

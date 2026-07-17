import { create } from "zustand";
import type { AppRole } from "@/lib/api/enums";

interface AuthState {
  userId: string | null;
  name: string | null;
  email: string | null;
  role: AppRole | null;
  department: string | null;
  setUser: (u: { userId: string; name?: string | null; email?: string | null; role: AppRole; department?: string | null }) => void;
  clear: () => void;
}

/**
 * Mirrors next-auth's session so deeply nested client components can read
 * the current user without each subscribing to useSession() individually.
 * Hydrated by <SessionSync /> in the root layout — next-auth remains the
 * source of truth for the token itself.
 */
export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  name: null,
  email: null,
  role: null,
  department: null,
  setUser: (u) =>
    set({
      userId: u.userId,
      name: u.name ?? null,
      email: u.email ?? null,
      role: u.role,
      department: u.department ?? null,
    }),
  clear: () => set({ userId: null, name: null, email: null, role: null, department: null }),
}));

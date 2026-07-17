"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

function SessionSync() {
  const { data: session, status } = useSession();
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        department: session.user.department,
      });
    } else if (status === "unauthenticated") {
      clear();
    }
  }, [status, session, setUser, clear]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
      <Toaster position="top-right" richColors closeButton />
    </SessionProvider>
  );
}

import type { DefaultSession } from "next-auth";
import type { AppRole } from "@/lib/api/enums";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: AppRole;
      department?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: AppRole;
    department?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role?: AppRole;
    department?: string;
    uid?: string;
  }
}

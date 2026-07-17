import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "@/lib/api/axios";
import { normalizeRole, type AppRole } from "@/lib/api/enums";

interface DecodedToken {
  [key: string]: unknown;
}

// .NET Identity tokens usually use these long claim-type URIs instead of
// short names, so we check both when reading claims off the decoded JWT.
const CLAIM_KEYS = {
  id: ["sub", "nameid", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
  email: ["email", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
  firstName: ["given_name", "firstName", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],
  lastName: ["family_name", "lastName", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"],
  role: ["role", "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  department: ["department"],
};

function extractClaim(decoded: DecodedToken, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = decoded[k];
    if (v !== undefined && v !== null) return Array.isArray(v) ? String(v[0]) : String(v);
  }
  return undefined;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/client",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userName = credentials?.userName as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!userName || !password) return null;

        const res = await axios.post(
          `${API_BASE_URL}/api/Auth/Login`,
          { userName, password },
          { validateStatus: () => true }
        );

        if (res.status < 200 || res.status >= 300) return null;

        const payload = res.data as unknown;
        const token: string | undefined =
          typeof payload === "string"
            ? payload
            : ((payload as Record<string, unknown>)?.token as string) ??
              ((payload as Record<string, unknown>)?.accessToken as string) ??
              ((payload as Record<string, unknown>)?.jwtToken as string);

        if (!token) return null;

        let decoded: DecodedToken = {};
        try {
          decoded = jwtDecode<DecodedToken>(token);
        } catch {
          decoded = {};
        }

        const payloadObj = (typeof payload === "object" && payload ? payload : {}) as Record<string, unknown>;
        const role: AppRole = normalizeRole(
          extractClaim(decoded, CLAIM_KEYS.role) ?? (payloadObj.role as string | undefined)
        );
        const firstName = extractClaim(decoded, CLAIM_KEYS.firstName) ?? (payloadObj.firstName as string);
        const lastName = extractClaim(decoded, CLAIM_KEYS.lastName) ?? (payloadObj.lastName as string);

        const user: User & { role: AppRole; department?: string; accessToken: string } = {
          id: extractClaim(decoded, CLAIM_KEYS.id) ?? (payloadObj.id as string) ?? userName,
          name: [firstName, lastName].filter(Boolean).join(" ") || userName,
          email: extractClaim(decoded, CLAIM_KEYS.email) ?? (payloadObj.email as string) ?? userName,
          role,
          department: extractClaim(decoded, CLAIM_KEYS.department) ?? (payloadObj.department as string),
          accessToken: token,
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as User & { role: AppRole; department?: string; accessToken: string };
        token.accessToken = u.accessToken;
        token.role = u.role;
        token.department = u.department;
        token.uid = u.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as AppRole;
        session.user.department = token.department as string | undefined;
      }
      return session;
    },
  },
});

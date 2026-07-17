import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { auth } from "@/auth";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userName = session?.user?.name ?? "Agent";
  const userRole = [session?.user?.role, session?.user?.department].filter(Boolean).join(" · ") || "Staff";

  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar portal="staff" portalLabel="Staff Portal" portalName={session?.user?.department ?? "Jeme Support"} />
      <div className="pl-64">
        <Topbar userName={userName} userRole={userRole} />
        <main className="mx-auto max-w-7xl px-8 py-7">{children}</main>
      </div>
    </div>
  );
}

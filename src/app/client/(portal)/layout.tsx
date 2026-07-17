import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { auth } from "@/auth";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userName = session?.user?.name ?? "Client";

  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar portal="client" portalLabel="Client Portal" portalName="Client Portal" />
      <div className="pl-64">
        <Topbar userName={userName} userRole="Client" />
        <main className="mx-auto max-w-7xl px-8 py-7">{children}</main>
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { notifications } from "@/lib/mock-data";
import { timeAgo, cn } from "@/lib/utils";
import { Timer, MessageSquare, UserPlus, Bell } from "lucide-react";

const iconMap = { sla: Timer, comment: MessageSquare, assignment: UserPlus, system: Bell };
const colorMap = {
  sla: "bg-amber-50 text-amber-600",
  comment: "bg-blue-50 text-blue-600",
  assignment: "bg-purple-50 text-purple-600",
  system: "bg-brand-50 text-brand-600",
};

export default function ClientNotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Updates on your tickets, SLA status, and account."
        actions={<Button variant="outline" size="sm">Mark all as read</Button>}
      />

      <Card>
        <ul className="divide-y divide-ink-100">
          {notifications.map((n) => {
            const Icon = iconMap[n.type];
            return (
              <li key={n.id} className={cn("flex items-start gap-3.5 p-4", !n.read && "bg-brand-50/30")}>
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", colorMap[n.type])}>
                  <Icon size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-ink-800">{n.title}</p>
                    <span className="whitespace-nowrap text-xs text-ink-400">{timeAgo(n.timestamp)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-500">{n.body}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

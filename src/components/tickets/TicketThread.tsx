import type { TicketEvent } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateTime } from "@/lib/utils";
import { MessageSquare, ArrowUpRight, UserPlus, Timer, Paperclip, RefreshCw } from "lucide-react";

const iconMap = {
  comment: MessageSquare,
  status: RefreshCw,
  assignment: UserPlus,
  escalation: ArrowUpRight,
  sla: Timer,
  attachment: Paperclip,
};

const colorMap = {
  comment: "bg-blue-50 text-blue-600",
  status: "bg-ink-100 text-ink-500",
  assignment: "bg-purple-50 text-purple-600",
  escalation: "bg-red-50 text-red-600",
  sla: "bg-amber-50 text-amber-600",
  attachment: "bg-ink-100 text-ink-500",
};

export function TicketThread({ events, showInternal = true }: { events: TicketEvent[]; showInternal?: boolean }) {
  const visible = showInternal ? events : events.filter((e) => !e.internal);

  return (
    <ol className="space-y-5">
      {visible.map((event) => {
        const Icon = iconMap[event.type];
        if (event.type === "comment") {
          return (
            <li key={event.id} className="flex gap-3">
              <Avatar name={event.actor} size="sm" />
              <div className="flex-1 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-800">{event.actor}</span>
                  <div className="flex items-center gap-2">
                    {event.internal && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                        Internal note
                      </span>
                    )}
                    <span className="text-[11px] text-ink-400">{formatDateTime(event.timestamp)}</span>
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-ink-700">{event.message}</p>
              </div>
            </li>
          );
        }
        return (
          <li key={event.id} className="flex items-start gap-3">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${colorMap[event.type]}`}>
              <Icon size={13} />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-xs text-ink-600">
                <span className="font-semibold text-ink-800">{event.actor}</span> {event.message}
              </p>
              <p className="text-[11px] text-ink-400">{formatDateTime(event.timestamp)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

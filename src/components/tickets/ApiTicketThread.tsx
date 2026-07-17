import type { TicketComment } from "@/lib/api/types";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateTime } from "@/lib/utils";

export function ApiTicketThread({ comments, showInternal = true }: { comments: TicketComment[]; showInternal?: boolean }) {
  const visible = showInternal ? comments : comments.filter((c) => !c.isInternal);

  if (visible.length === 0) {
    return <p className="py-6 text-center text-sm text-ink-400">No messages yet.</p>;
  }

  return (
    <ol className="space-y-5">
      {visible.map((c) => (
        <li key={c.id} className="flex gap-3">
          <Avatar name={c.authorName || "User"} size="sm" />
          <div className="flex-1 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-800">{c.authorName || "User"}</span>
              <div className="flex items-center gap-2">
                {c.isInternal && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                    Internal note
                  </span>
                )}
                {c.createdAt && <span className="text-[11px] text-ink-400">{formatDateTime(c.createdAt)}</span>}
              </div>
            </div>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-700">{c.message}</p>
            {c.attachments && c.attachments.length > 0 && (
              <ul className="mt-2 space-y-1">
                {c.attachments.map((a) => (
                  <li key={a.id} className="text-xs text-brand-700 underline">
                    {a.url ? (
                      <a href={a.url} target="_blank" rel="noreferrer">
                        {a.fileName}
                      </a>
                    ) : (
                      a.fileName
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

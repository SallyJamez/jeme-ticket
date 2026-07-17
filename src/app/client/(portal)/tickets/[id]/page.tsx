"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiTicketThread } from "@/components/tickets/ApiTicketThread";
import { ApiTicketMetaPanel } from "@/components/tickets/ApiTicketMetaPanel";
import { CsatWidget } from "@/components/tickets/CsatWidget";
import { priorityStyles, statusStyles } from "@/lib/utils";
import { priorityToLabel, statusToLabel } from "@/lib/api/enums";
import { useTickets } from "@/hooks/useTickets";
import { useTicketStore } from "@/store/useTicketStore";
import { ChevronLeft, Paperclip, Send } from "lucide-react";

export default function ClientTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getTicket, addComment, uploadAttachment, acceptResolution, rejectResolution, reopenTicket, addCsat } =
    useTickets();
  const { selectedTicket: ticket, setSelectedTicket } = useTicketStore();
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      await getTicket(id);
    } catch {
      toast.error("Could not load this ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    return () => setSelectedTicket(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="p-10 text-center text-sm text-ink-400">Loading ticket…</div>;
  if (!ticket) return <div className="p-10 text-center text-sm text-ink-400">Ticket not found.</div>;

  const status = statusToLabel(ticket.status);
  const priority = priorityToLabel(ticket.priority);
  const isResolved = status === "Resolved" || status === "Closed";

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await addComment(ticket.id, { message: reply, isInternal: false });
      setReply("");
      await load();
      toast.success("Reply sent.");
    } catch {
      toast.error("Could not send your reply.");
    } finally {
      setSending(false);
    }
  };

  const handleFile = async (file: File) => {
    try {
      await uploadAttachment(ticket.id, file);
      await load();
      toast.success("Attachment uploaded.");
    } catch {
      toast.error("Could not upload attachment.");
    }
  };

  return (
    <div>
      <Link href="/client/tickets" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ChevronLeft size={15} /> Back to tickets
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardBody>
              <p className="font-mono text-xs text-ink-400">{ticket.id}</p>
              <h1 className="mt-1 font-display text-xl font-bold text-ink-900">{ticket.title}</h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Badge className={`${statusStyles[status].bg} ${statusStyles[status].text}`}>{status}</Badge>
                <Badge className={`${priorityStyles[priority].bg} ${priorityStyles[priority].text}`}>{priority} priority</Badge>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">{ticket.description}</p>

              {status === "Resolved" && (
                <div className="mt-5 flex gap-2 border-t border-ink-100 pt-4">
                  <Button
                    size="sm"
                    onClick={async () => {
                      await acceptResolution(ticket.id);
                      await load();
                      toast.success("Resolution accepted.");
                    }}
                  >
                    Accept resolution
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const reason = window.prompt("Why are you rejecting this resolution?");
                      if (!reason) return;
                      await rejectResolution(ticket.id, { reason });
                      await load();
                      toast.success("Resolution rejected — ticket reopened for review.");
                    }}
                  >
                    Reject resolution
                  </Button>
                </div>
              )}
              {status === "Closed" && (
                <div className="mt-5 border-t border-ink-100 pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await reopenTicket(ticket.id);
                      await load();
                      toast.success("Ticket reopened.");
                    }}
                  >
                    Reopen ticket
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              <ApiTicketThread comments={ticket.comments} showInternal={false} />

              <div className="mt-6 border-t border-ink-100 pt-5">
                <Input
                  placeholder="Write a reply…"
                  className="mb-2"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendReply()}
                />
                <div className="flex items-center justify-between">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="focus-ring flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-50"
                  >
                    <Paperclip size={14} /> Attach file
                  </button>
                  <Button size="sm" icon={<Send size={14} />} disabled={sending} onClick={sendReply}>
                    {sending ? "Sending…" : "Send reply"}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {isResolved && (
            <Card>
              <CardHeader>
                <CardTitle>Resolution &amp; feedback</CardTitle>
              </CardHeader>
              <CardBody className="pt-3">
                <CsatWidget
                  existing={ticket.csatRating ?? null}
                  onSubmit={async (rating, comment) => {
                    await addCsat(ticket.id, { rating, comment: comment || undefined });
                    toast.success("Thanks for your feedback.");
                  }}
                />
              </CardBody>
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Ticket details</CardTitle>
          </CardHeader>
          <CardBody className="pt-3">
            <ApiTicketMetaPanel ticket={ticket} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

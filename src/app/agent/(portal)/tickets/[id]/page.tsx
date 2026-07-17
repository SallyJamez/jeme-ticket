"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { ApiTicketThread } from "@/components/tickets/ApiTicketThread";
import { ApiTicketMetaPanel } from "@/components/tickets/ApiTicketMetaPanel";
import { priorityStyles, statusStyles } from "@/lib/utils";
import { priorityToLabel, statusToLabel, TICKET_STATUS_LABELS, type TicketStatusLabel } from "@/lib/api/enums";
import { useAgentTickets } from "@/hooks/useAgentTickets";
import { useTicketStore } from "@/store/useTicketStore";
import { ChevronLeft, Paperclip, Send, UserCheck } from "lucide-react";

export default function StaffTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getTicket, claimTicket, updateStatus, addComment, uploadCommentAttachment, isSubmitting } = useAgentTickets();
  const { selectedTicket: ticket, setSelectedTicket } = useTicketStore();
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastCommentIdRef = useRef<string | null>(null);

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

  const sendReply = async (internal: boolean) => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await addComment(ticket.id, { message: reply, isInternal: internal });
      lastCommentIdRef.current = (res as { id?: string })?.id ?? null;
      setReply("");
      await load();
      toast.success(internal ? "Internal note added." : "Reply sent.");
    } catch {
      toast.error("Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!lastCommentIdRef.current) {
      toast.error("Send a message first, then attach a file to it.");
      return;
    }
    try {
      await uploadCommentAttachment(ticket.id, lastCommentIdRef.current, file);
      await load();
      toast.success("Attachment uploaded.");
    } catch {
      toast.error("Could not upload attachment.");
    }
  };

  return (
    <div>
      <Link href="/agent/tickets" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ChevronLeft size={15} /> Back to queue
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

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4">
                <Select
                  value={status}
                  disabled={isSubmitting}
                  onChange={async (e) => {
                    await updateStatus(ticket.id, { status: e.target.value as TicketStatusLabel });
                    toast.success("Status updated.");
                  }}
                  className="w-auto min-w-[140px]"
                >
                  {TICKET_STATUS_LABELS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
                {!ticket.assignedStaffName && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<UserCheck size={13} />}
                    disabled={isSubmitting}
                    onClick={async () => {
                      await claimTicket(ticket.id);
                      toast.success("Ticket claimed.");
                    }}
                  >
                    Claim ticket
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation &amp; internal notes</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              <ApiTicketThread comments={ticket.comments} showInternal />

              <div className="mt-6 border-t border-ink-100 pt-5">
                <Input
                  placeholder="Reply to client, or add an internal note…"
                  className="mb-2"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={sending} onClick={() => sendReply(true)}>
                      Add internal note
                    </Button>
                    <Button size="sm" icon={<Send size={14} />} disabled={sending} onClick={() => sendReply(false)}>
                      {sending ? "Sending…" : "Send reply"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket details</CardTitle>
            </CardHeader>
            <CardBody className="pt-3">
              <ApiTicketMetaPanel ticket={ticket} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

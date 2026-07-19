"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { ChevronLeft, Paperclip, X } from "lucide-react";
import { createTicketSchema, type CreateTicketInput } from "@/lib/validations/ticket";
import { TICKET_CATEGORY_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/api/enums";
import { useTickets } from "@/hooks/useTickets";

export default function NewTicketPage() {
  const router = useRouter();
  const { createTicket, uploadAttachment, isSubmitting } = useTickets();
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { category: TICKET_CATEGORY_LABELS[0], priority: TICKET_PRIORITY_LABELS[0] },
  });

  const onSubmit = async (values: CreateTicketInput) => {




    try {
      // const ticket = await createTicket(values);
      const attachments: string[] = [];
      for (const file of files) {
        try {
         const sub = await uploadAttachment(file.name, file);
         console.log(sub)
        } catch {
          toast.error(`Could not attach ${file.name}`);
        }
      }
      // toast.success("Ticket submitted.");
      // router.push(`/client/tickets/${ticket.id}`);
    } catch {
      toast.error("Could not submit ticket. Please try again.");
    }
  };

//  try {
//       const attachments: any = [];
//       for (const file of files) {
//         attachments.push(file);
//       }
//       const submitData = {
//         ...values,
//         attachments: attachments,
//       };

//       const ticket = await createTicket(submitData);

//       toast.success("Ticket submitted.");
//       // router.push(`/client/tickets}`);
//     } catch {
//       toast.error("Could not submit ticket. Please try again.");
//     }








  return (
    <div>
      <Link href="/client/tickets" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ChevronLeft size={15} /> Back to tickets
      </Link>
      <PageHeader title="Raise a new ticket" subtitle="Give us the details and we'll route it to the right team." />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardBody className="space-y-5">
              <div>
                <Label htmlFor="title">Subject</Label>
                <Input id="title" placeholder="Brief summary of the issue" {...register("title")} />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select id="category" {...register("category")}>
                  {TICKET_CATEGORY_LABELS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
                {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>}
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {TICKET_PRIORITY_LABELS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => field.onChange(p)}
                          className={
                            field.value === p
                              ? "focus-ring rounded-lg border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700"
                              : "focus-ring rounded-lg border border-ink-200 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50"
                          }
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                />
                {errors.priority && <p className="mt-1 text-xs text-red-600">{errors.priority.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="What happened? Include transaction references, timestamps, and any error messages."
                  {...register("description")}
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>

              <div>
                <Label>Attachments</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="focus-ring flex w-full items-center justify-center rounded-lg border border-dashed border-ink-300 bg-ink-50 px-4 py-8"
                >
                  <div className="text-center">
                    <Paperclip size={18} className="mx-auto text-ink-400" />
                    <p className="mt-2 text-xs font-medium text-ink-600">Click to browse files</p>
                    <p className="text-[11px] text-ink-400">Uploaded once the ticket is created</p>
                  </div>
                </button>
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-1.5 text-xs text-ink-600">
                        {f.name}
                        <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>
                          <X size={13} className="text-ink-400 hover:text-red-600" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-ink-100 pt-5">
                <Link href="/client/tickets">
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit ticket"}
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="font-display text-sm font-semibold text-ink-900">Before you submit</h3>
              <ul className="mt-3 space-y-3 text-xs text-ink-500">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  Include transaction or reference IDs so we can trace the issue faster.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  High priority is reserved for issues affecting live transactions or payouts.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  You&apos;ll get a confirmation email and can track progress from the Tickets tab.
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </form>
    </div>
  );
}

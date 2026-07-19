import { z } from "zod";
import { TICKET_CATEGORY_LABELS, TICKET_PRIORITY_LABELS, TICKET_STATUS_LABELS } from "@/lib/api/enums";

// Mirrors CreateTicketDto { title, description, category, priority, attachments? }
export const createTicketSchema = z.object({
  title: z.string().min(1, "Subject is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(TICKET_CATEGORY_LABELS, { message: "Select a category" }),
  priority: z.enum(TICKET_PRIORITY_LABELS, { message: "Select a priority" }),
 attachments: z.array(z.string()).optional()
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

// Mirrors AddTicketCommentDto { message, isInternal }
export const addCommentSchema = z.object({
  message: z.string().min(1, "Write a message before sending"),
  isInternal: z.boolean().optional().default(false),
});
export type AddCommentInput = z.infer<typeof addCommentSchema>;

// Mirrors AddCsatDto { rating (1-5), comment? }
export const addCsatSchema = z.object({
  rating: z.number().int().min(1, "Pick a rating").max(5),
  comment: z.string().max(500, "Keep feedback under 500 characters").optional(),
});
export type AddCsatInput = z.infer<typeof addCsatSchema>;

// Mirrors RejectedResolutionDto { reason }
export const rejectResolutionSchema = z.object({
  reason: z.string().min(1, "Tell us why you're rejecting this resolution").max(500),
});
export type RejectResolutionInput = z.infer<typeof rejectResolutionSchema>;

// Mirrors UpdateTicketStatusDto { status }
export const updateStatusSchema = z.object({
  status: z.enum(TICKET_STATUS_LABELS, { message: "Select a status" }),
});
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

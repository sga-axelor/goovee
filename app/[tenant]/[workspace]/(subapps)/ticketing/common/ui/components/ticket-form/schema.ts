import {i18n} from '@/lib/i18n';
import {z} from 'zod';

export const TicketFormSchema = z.object({
  subject: z
    .string({required_error: i18n.get('Subject is required')})
    .trim()
    .min(1, {message: i18n.get('Subject is required')}),
  category: z.string().optional(),
  priority: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateTicketSchema = TicketFormSchema.extend({
  id: z.string(),
  version: z.number(),
  subject: z.string().optional(),
  project: z.string(),
});

export const CreateTicketSchema = TicketFormSchema.extend({
  project: z.string(),
});
export const UpdateAssignTicketSchema = z.object({
  id: z.string(),
  version: z.number(),
});

export type TicketInfo = z.infer<typeof TicketFormSchema>;
export type CreateTicketInfo = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketInfo = z.infer<typeof UpdateTicketSchema>;
export type UpdateAssignTicket = z.infer<typeof UpdateAssignTicketSchema>;

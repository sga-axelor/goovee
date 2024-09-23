import {i18n} from '@/lib/i18n';
import {z} from 'zod';

export const TicketFormSchema = z.object({
  subject: z
    .string({required_error: i18n.get('Subject is required')})
    .trim()
    .min(1, {message: i18n.get('Subject is required')}),
  category: z.string({required_error: i18n.get('Category is required')}),
  priority: z.string({required_error: i18n.get('Priority is required')}),
  description: z.string().optional(),
  assignedTo: z.string({required_error: i18n.get('AssignedTo is required')}),
});

export const UpdateTicketSchema = z.object({
  id: z.string(),
  version: z.number(),
  category: z.string().optional(),
  priority: z.string().optional(),
  subject: z.string().optional(),
  status: z.string().optional(),
  assignment: z.number().optional(),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const CreateTicketSchema = TicketFormSchema.extend({
  project: z.string(),
});

export type TicketInfo = z.infer<typeof TicketFormSchema>;
export type CreateTicketInfo = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketInfo = z.infer<typeof UpdateTicketSchema>;

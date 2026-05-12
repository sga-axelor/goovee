import {z} from 'zod';
import {IdSchema, WorkspaceURLSchema} from '@/utils/validators';

export const FindDmsFilesSchema = z.object({
  search: z.string().optional(),
  workspaceURL: WorkspaceURLSchema,
});
export type FindDmsFilesInput = z.infer<typeof FindDmsFilesSchema>;

export const UploadSchema = z.object({
  workspaceURL: WorkspaceURLSchema,
  parent: IdSchema,
});
export type UploadInput = z.infer<typeof UploadSchema>;

export const CreateCategorySchema = z.object({
  workspaceURL: WorkspaceURLSchema,
  title: z
    .string({
      error: issue =>
        issue.input === undefined ? 'Title is required' : undefined,
    })
    .trim()
    .min(1, {error: 'Title is required'}),
  description: z.string().optional(),
  icon: z.string().optional(),
  parent: IdSchema,
  color: z.string().optional(),
});
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

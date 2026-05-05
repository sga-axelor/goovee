import {z} from 'zod';
import {WorkspaceURLSchema} from '@/utils/validators';

export const SearchEntriesSchema = z.object({
  workspaceURL: WorkspaceURLSchema,
  search: z.string().optional(),
});

export type SearchEntriesInput = z.infer<typeof SearchEntriesSchema>;

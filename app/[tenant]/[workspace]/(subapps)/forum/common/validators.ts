import {z} from 'zod';
import {IdSchema, WorkspaceURLSchema} from '@/utils/validators';

const WorkspaceURISchema = z.string().min(1);

export const PinGroupSchema = z.object({
  isPin: z.boolean(),
  id: IdSchema,
  groupID: IdSchema,
  workspaceURL: WorkspaceURLSchema,
  workspaceURI: WorkspaceURISchema,
});
export type PinGroupInput = z.infer<typeof PinGroupSchema>;

export const ExitGroupSchema = z.object({
  id: IdSchema,
  groupID: IdSchema,
  workspaceURL: WorkspaceURLSchema,
  workspaceURI: WorkspaceURISchema,
});
export type ExitGroupInput = z.infer<typeof ExitGroupSchema>;

export const JoinGroupSchema = z.object({
  groupID: IdSchema,
  userId: IdSchema,
  workspaceURL: WorkspaceURLSchema,
  workspaceURI: WorkspaceURISchema,
});
export type JoinGroupInput = z.infer<typeof JoinGroupSchema>;

export const AddGroupNotificationSchema = z.object({
  id: IdSchema,
  groupID: IdSchema,
  notificationType: z.string().min(1),
  workspaceURL: WorkspaceURLSchema,
  workspaceURI: WorkspaceURISchema,
});
export type AddGroupNotificationInput = z.infer<
  typeof AddGroupNotificationSchema
>;

export const GetSubscribersByGroupSchema = z.object({
  groupID: IdSchema,
  workspaceURL: WorkspaceURLSchema,
});
export type GetSubscribersByGroupInput = z.infer<
  typeof GetSubscribersByGroupSchema
>;

export const FindMediaSchema = z.object({
  id: IdSchema,
  workspaceURL: WorkspaceURLSchema,
  archived: z.boolean().optional(),
});
export type FindMediaInput = z.infer<typeof FindMediaSchema>;

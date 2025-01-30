// ---- CORE IMPORTS ---- //
import type {Tenant} from '@/lib/core/tenant';
import type {ID} from '@/types';
import type {ActionResponse} from '@/types/action';
import type {Cloned} from '@/types/util';

// ---- LOCAL IMPORTS ---- //
import type {MAIL_MESSAGE_TYPE} from '../constants';
import type {
  Comment,
  CommentData,
  FetchCommentsProps,
} from '../utils/validators';

export type {
  AttachmentFile,
  Comment,
  CommentAttachment,
  CommentData,
  CreateCommentProps,
  FetchCommentsProps,
  MailMessage,
  MailMessageFile,
  Partner,
  Picture,
  User,
} from '../utils/validators';

export type TrackingField = 'body' | 'publicBody';
export type CommentField = 'note' | 'body';

export type Track = {
  name: string;
  title: string;
  value: string;
  oldValue?: string;
};

export type TrackObject = {
  title?: string;
  tracks?: Track[];
};

export type CreateComment = (
  formData: FormData,
) => ActionResponse<Cloned<[Comment, Comment | undefined]>>;

export type AddCommentProps = {
  tenantId: Tenant['id'];
  userId: ID;
  recordId: ID;
  workspaceUserId: ID;
  modelName: string;
  subject: string;
  trackingField: TrackingField;
  commentField: CommentField;
  parentId?: ID;
  messageBody?: {
    title: string;
    tracks: Track[];
    tags: any[];
  };
  data?: CommentData;
  messageType?: MAIL_MESSAGE_TYPE;
  showRepliesInMainThread?: boolean;
};

export type FindCommentsData = {
  comments: Comment[];
  total: number;
  totalCommentThreadCount: number;
};

export type FindCommentsProps = {
  tenantId: Tenant['id'];
  recordId: ID;
  modelName: string;
  trackingField: TrackingField;
  commentField: CommentField;
  limit?: number;
  skip?: number;
  sort?: any;
  exclude?: ID[];
  showRepliesInMainThread?: boolean;
};

export type FetchComments = (
  props: FetchCommentsProps,
) => ActionResponse<Cloned<FindCommentsData>>;

export type CreateProps = {
  data: CommentData;
  parent?: ID;
};

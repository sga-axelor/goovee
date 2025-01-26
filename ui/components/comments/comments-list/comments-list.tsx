'use client';

// ---- CORE IMPORTS ---- //
import {type SUBAPP_CODES} from '@/constants';
import {type Tenant} from '@/tenant';
import type {ID} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {CommentListItem} from '../comments-list-item';

interface CommentsListProps {
  recordId: ID;
  comments: Array<{
    id: string;
  }>;
  usePopUpStyles?: boolean;
  showReactions?: boolean;
  subapp: SUBAPP_CODES;
  disabled?: boolean;
  sortBy: any;
  onSubmit?: (comment: any) => Promise<void>;
  tenantId: Tenant['id'];
}

export const CommentsList: React.FC<CommentsListProps> = ({
  recordId,
  comments,
  usePopUpStyles = false,
  showReactions = true,
  subapp,
  disabled = false,
  onSubmit,
  sortBy,
  tenantId,
}) => {
  return (
    <div
      className={`flex flex-col gap-2${usePopUpStyles ? ' h-full overflow-auto px-2' : ''}`}>
      {comments.map((comment: any) => (
        <CommentListItem
          key={comment.id}
          disabled={disabled}
          recordId={recordId}
          parentCommentId={comment.id}
          comment={comment}
          showReactions={showReactions}
          subapp={subapp}
          sortBy={sortBy}
          onSubmit={onSubmit}
          tenantId={tenantId}
        />
      ))}
    </div>
  );
};

export default CommentsList;

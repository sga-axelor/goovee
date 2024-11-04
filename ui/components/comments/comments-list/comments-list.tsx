'use client';

// ---- CORE IMPORTS ---- //
import {ModelType} from '@/types';
import {type Tenant} from '@/tenant';

// ---- LOCAL IMPORTS ---- //
import {CommentListItem} from '../comments-list-item';

interface CommentsListProps {
  record: any;
  comments: Array<{
    id: string;
  }>;
  usePopUpStyles?: boolean;
  showReactions?: boolean;
  modelType: ModelType;
  disabled?: boolean;
  sortBy: any;
  onSubmit?: (comment: any) => void;
  tenantId: Tenant['id'];
}

export const CommentsList: React.FC<CommentsListProps> = ({
  record,
  comments,
  usePopUpStyles = false,
  showReactions = true,
  modelType,
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
          record={record}
          parentCommentId={comment.id}
          comment={comment}
          showReactions={showReactions}
          modelType={modelType}
          sortBy={sortBy}
          onSubmit={onSubmit}
          tenantId={tenantId}
        />
      ))}
    </div>
  );
};

export default CommentsList;

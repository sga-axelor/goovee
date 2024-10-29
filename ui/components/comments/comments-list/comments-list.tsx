'use client';

// ---- CORE IMPORTS ---- //
import {ModelType} from '@/types';
import {CommentListItem} from '../comments-list-item';

interface CommentsListProps {
  record: any;
  comments: Array<{
    id: string;
  }>;
  usePopUpStyles?: boolean;
  showReactions?: boolean;
  modelType: ModelType;
  hasSubComments: boolean;
  disabled?: boolean;
  sortBy: any;
  onSubmit?: (comment: any) => void;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  record,
  comments,
  usePopUpStyles = false,
  showReactions = true,
  modelType,
  hasSubComments,
  disabled = false,
  onSubmit,
  sortBy,
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
          hasSubComments={hasSubComments}
          sortBy={sortBy}
          onSubmit={onSubmit}
        />
      ))}
    </div>
  );
};

export default CommentsList;

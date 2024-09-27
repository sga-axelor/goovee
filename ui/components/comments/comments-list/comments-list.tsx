'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
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
  totalCommentsCount: boolean;
  onSubmit?: (comment: any) => void;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  record,
  comments,
  usePopUpStyles = false,
  showReactions = true,
  modelType,
  totalCommentsCount,
  onSubmit,
}) => {
  return (
    <div
      className={`flex flex-col gap-4 ${usePopUpStyles ? 'h-full overflow-auto px-2' : ''}`}>
      {comments.map((comment: any) => (
        <CommentListItem
          key={comment.id}
          record={record}
          parentCommentId={comment.id}
          comment={comment}
          showReactions={showReactions}
          modelType={modelType}
          totalCommentsCount={totalCommentsCount}
          onSubmit={onSubmit}
        />
      ))}
    </div>
  );
};

export default CommentsList;

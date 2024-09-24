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
  loading?: boolean;
  fetching?: boolean;
  modelType: ModelType;
  onSubmit?: (comment: any) => void;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  record,
  comments,
  loading = false,
  fetching = false,
  usePopUpStyles = false,
  showReactions = true,
  modelType,
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
          onSubmit={onSubmit}
        />
      ))}
      {(loading || fetching) && (
        <p className="text-center text-sm">{i18n.get('Loading...')}</p>
      )}
    </div>
  );
};

export default CommentsList;

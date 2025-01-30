'use client';
import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {isCommentEnabled, Comments} from '@/comments';

// ---- LOCAL IMPORTS ---- //
import {useForum} from '@/subapps/forum/common/ui/context';
import {COMMENTS_PER_LOAD} from '@/subapps/forum/common/constants';
import {
  fetchComments,
  createComment,
} from '@/subapps/forum/common/action/action';

export const ThreadFooter = ({
  post,
  showCommentsByDefault,
  hideCloseComments = false,
  usePopUpStyles = false,
}: {
  post: any;
  showCommentsByDefault: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
}) => {
  const {isMember, workspace} = useForum();
  const disabled = useMemo(() => !isMember, [isMember]);

  const enableComment = isCommentEnabled({
    subapp: SUBAPP_CODES.forum,
    workspace,
  });

  return enableComment ? (
    <Comments
      recordId={post.id}
      subapp={SUBAPP_CODES.forum}
      showCommentsByDefault={showCommentsByDefault}
      hideCloseComments={hideCloseComments}
      usePopUpStyles={usePopUpStyles}
      disabled={disabled}
      inputContainerClassName={!usePopUpStyles ? 'px-4' : ''}
      limit={COMMENTS_PER_LOAD}
      trackingField="publicBody"
      commentField="note"
      fetchComments={fetchComments}
      createComment={createComment}
    />
  ) : (
    <div />
  );
};

export default ThreadFooter;

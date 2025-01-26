'use client';
import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {Comments} from '@/ui/components';
import {isCommentEnabled} from '@/utils/comment';

// ---- LOCAL IMPORTS ---- //
import {useForum} from '@/subapps/forum/common/ui/context';
import {COMMENTS_PER_LOAD} from '@/subapps/forum/common/constants';

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
      record={post}
      subapp={SUBAPP_CODES.forum}
      showCommentsByDefault={showCommentsByDefault}
      hideCloseComments={hideCloseComments}
      inputPosition="top"
      usePopUpStyles={usePopUpStyles}
      disabled={disabled}
      showReactions={false}
      inputContainerClassName={!usePopUpStyles ? 'px-4' : ''}
      limit={COMMENTS_PER_LOAD}
    />
  ) : (
    <div />
  );
};

export default ThreadFooter;

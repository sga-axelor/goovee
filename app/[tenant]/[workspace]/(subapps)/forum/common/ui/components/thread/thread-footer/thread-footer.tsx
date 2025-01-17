'use client';
import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {Comments} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {useForum} from '@/subapps/forum/common/ui/context';

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
  const {isMember} = useForum();
  const disabled = useMemo(() => !isMember, [isMember]);

  return (
    <Comments
      record={post}
      subapp={SUBAPP_CODES.forum}
      showCommentsByDefault={showCommentsByDefault}
      hideCloseComments={hideCloseComments}
      inputPosition="top"
      usePopUpStyles={usePopUpStyles}
      seeMore={true}
      disabled={disabled}
      showReactions={false}
      inputContainerClassName={!usePopUpStyles ? 'px-4' : ''}
    />
  );
};

export default ThreadFooter;

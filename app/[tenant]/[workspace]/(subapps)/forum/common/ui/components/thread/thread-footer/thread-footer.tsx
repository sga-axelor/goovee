'use client';
import {useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {ModelType} from '@/types';
import {Comments} from '@/ui/components';

export const ThreadFooter = ({
  post,
  showCommentsByDefault,
  hideCloseComments = false,
  usePopUpStyles = false,
  isMember,
}: {
  post: any;
  showCommentsByDefault: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
  isMember?: boolean;
}) => {
  const disabled = useMemo(() => !isMember, [isMember]);

  return (
    <Comments
      record={post}
      modelType={ModelType.forum}
      showCommentsByDefault={showCommentsByDefault}
      hideCloseComments={hideCloseComments}
      inputPosition="top"
      usePopUpStyles={usePopUpStyles}
      seeMore={true}
      disabled={disabled}
      showReactions={false}
    />
  );
};

export default ThreadFooter;

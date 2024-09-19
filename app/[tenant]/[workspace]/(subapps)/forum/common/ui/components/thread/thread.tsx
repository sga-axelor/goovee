'use client';

import {useState} from 'react';

// ---- LOCAL IMPORTS ---- //
import {
  ThreadBody,
  ThreadFooter,
  ThreadHeader,
} from '@/subapps/forum/common/ui/components';
import {Post} from '@/subapps/forum/common/types/forum';

export const Thread = ({
  post,
  showHeader = true,
  showCommentsByDefault = false,
  hideCloseComments = false,
  usePopUpStyles = false,
}: {
  post?: Post;
  showHeader?: boolean;
  showCommentsByDefault?: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
}) => {
  const {forumGroup, commentList}: any = post || {};

  return (
    <div className="bg-white rounded-lg flex flex-col gap-4">
      {showHeader && (
        <ThreadHeader title={forumGroup?.name} image={forumGroup?.image} />
      )}
      <ThreadBody post={post} usePopUpStyles={usePopUpStyles} />
      <ThreadFooter
        post={post}
        comments={commentList}
        usePopUpStyles={usePopUpStyles}
        hideCloseComments={hideCloseComments}
        showCommentsByDefault={showCommentsByDefault}
      />
    </div>
  );
};

export default Thread;

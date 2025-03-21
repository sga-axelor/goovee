'use client';

import {useEffect, useCallback} from 'react';
import {
  ThreadBody,
  ThreadFooter,
  ThreadHeader,
} from '@/subapps/forum/common/ui/components';
import type {Post} from '@/subapps/forum/common/types/forum';

interface ThreadProps {
  post?: Post;
  showHeader?: boolean;
  showCommentsByDefault?: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
}

export const Thread = ({
  post,
  showHeader = true,
  showCommentsByDefault = false,
  hideCloseComments = false,
  usePopUpStyles = false,
}: ThreadProps) => {
  const {forumGroup}: any = post || {};

  const scrollToPost = useCallback((postId: string) => {
    const element = document.getElementById(`post-${postId}`);
    if (element) {
      element.classList.add(
        'transition-colors',
        'duration-500',
        'ease-out',
        '!bg-success-light',
      );

      element.scrollIntoView({behavior: 'smooth', block: 'center'});

      setTimeout(() => {
        element.classList.remove('!bg-success-light');
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (post?.id) {
      const hash = window.location.hash.substring(1);
      if (hash === `post-${post.id}`) {
        scrollToPost(post.id);
      }
    }
  }, [post?.id, scrollToPost]);

  return (
    <div
      id={`post-${post?.id}`}
      className="bg-white rounded-lg flex flex-col gap-4 pt-4 pb-0 rounded-t-lg">
      {showHeader && (
        <ThreadHeader title={forumGroup?.name} image={forumGroup?.image} />
      )}
      <ThreadBody post={post} usePopUpStyles={usePopUpStyles} />
      <ThreadFooter
        post={post}
        usePopUpStyles={usePopUpStyles}
        hideCloseComments={hideCloseComments}
        showCommentsByDefault={showCommentsByDefault}
      />
    </div>
  );
};

export default Thread;

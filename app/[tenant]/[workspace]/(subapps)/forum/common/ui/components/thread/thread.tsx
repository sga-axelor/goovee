'use client';

import {useState} from 'react';

// ---- LOCAL IMPORTS ---- //
import {
  ThreadBody,
  ThreadFooter,
  ThreadHeader,
} from '@/subapps/forum/common/ui/components';

export const Thread = ({
  post,
  showHeader = true,
  showCommentsByDefault = false,
  hideCloseComments = false,
  usePopUpStyles = false,
}: {
  post?: any;
  showHeader?: boolean;
  showCommentsByDefault?: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
}) => {
  const {
    forumGroup,
    title,
    content,
    attachmentList,
    author,
    createdOn,
    commentList,
  } = post;

  const [showComments, setShowComments] = useState(
    showCommentsByDefault ?? false,
  );
  const toggleComments = () => {
    commentList.length >= 1 &&
      setShowComments(prevShowComments => !prevShowComments);
  };

  return (
    <div className="bg-white rounded-lg flex flex-col gap-4">
      {showHeader && (
        <ThreadHeader title={forumGroup.name} image={forumGroup.image} />
      )}
      <ThreadBody
        title={title}
        content={content}
        attachmentList={attachmentList}
        author={author}
        date={createdOn}
        comments={commentList}
        toggleComments={toggleComments}
      />
      <ThreadFooter
        comments={commentList}
        usePopUpStyles={usePopUpStyles}
        hideCloseComments={hideCloseComments}
        showComments={showComments}
        toggleComments={toggleComments}
      />
    </div>
  );
};

export default Thread;

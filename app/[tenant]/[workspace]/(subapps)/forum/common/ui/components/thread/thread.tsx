'use client';

import {useState} from 'react';

// ---- LOCAL IMPORTS ---- //
import {
  ThreadBody,
  ThreadFooter,
  ThreadHeader,
} from '@/subapps/forum/common/ui/components';

export const Thread = ({
  index,
  showHeader = true,
  showCommentsByDefault = false,
  hideCloseComments = false,
  usePopUpStyles = false,
}: {
  index?: any;
  showHeader?: boolean;
  showCommentsByDefault?: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
}) => {
  const [showComments, setShowComments] = useState(
    showCommentsByDefault ?? false,
  );
  const toggleComments = () => {
    setShowComments(prevShowComments => !prevShowComments);
  };

  return (
    <div className="bg-white rounded-lg flex flex-col gap-4">
      {showHeader && <ThreadHeader />}
      <ThreadBody index={index} toggleComments={toggleComments} />
      <ThreadFooter
        usePopUpStyles={usePopUpStyles}
        hideCloseComments={hideCloseComments}
        showComments={showComments}
        toggleComments={toggleComments}
      />
    </div>
  );
};

export default Thread;

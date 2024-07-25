'use client';

import {useState} from 'react';

// ---- LOCAL IMPORTS ---- //
import {
  ThreadBody,
  ThreadFooter,
  ThreadHeader,
} from '@/subapps/forum/common/ui/components';

export const Thread = ({index}: {index?: any}) => {
  const [showComments, setShowComments] = useState(false);
  const toggleComments = () => {
    setShowComments(prevShowComments => !prevShowComments);
  };

  return (
    <div className="bg-white rounded-lg flex flex-col gap-4">
      <ThreadHeader />
      <ThreadBody index={index} toggleComments={toggleComments} />
      <ThreadFooter
        showComments={showComments}
        toggleComments={toggleComments}
      />
    </div>
  );
};

export default Thread;

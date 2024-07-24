'use client';

// ---- LOCAL IMPORTS ---- //
import {
  ThreadBody,
  ThreadFooter,
  ThreadHeader,
} from '@/subapps/forum/common/ui/components';

export const Thread = () => {
  return (
    <div className="bg-white rounded-lg flex flex-col gap-4">
      <ThreadHeader />
      <ThreadBody />
      <ThreadFooter />
    </div>
  );
};

export default Thread;

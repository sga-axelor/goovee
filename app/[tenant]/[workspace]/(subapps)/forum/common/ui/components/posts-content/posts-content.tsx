'use client';

// ---- LOCAL IMPORTS ---- //
import {ThreadList} from '@/subapps/forum/common/ui/components';

export const PostsContent = () => {
  return (
    <div className="w-full mt-6">
      <ThreadList />
    </div>
  );
};

export default PostsContent;

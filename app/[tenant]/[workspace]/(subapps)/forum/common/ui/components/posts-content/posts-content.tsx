'use client';

// ---- LOCAL IMPORTS ---- //
import {ThreadList} from '@/subapps/forum/common/ui/components';

export const PostsContent = () => {
  return (
    <div className="my-6">
      <ThreadList />
    </div>
  );
};

export default PostsContent;

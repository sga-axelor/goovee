'use client';

// ---- LOCAL IMPORTS ---- //
import {ThreadList} from '@/subapps/forum/common/ui/components';

export const PostsContent = ({posts}: {posts: any}) => {
  return (
    <div className="w-full mt-6">
      <ThreadList posts={posts} />
    </div>
  );
};

export default PostsContent;

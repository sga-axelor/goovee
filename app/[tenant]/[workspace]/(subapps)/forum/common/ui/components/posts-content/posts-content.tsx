'use client';

// ---- LOCAL IMPORTS ---- //
import {ThreadList} from '@/subapps/forum/common/ui/components';
import {Post} from '@/subapps/forum/common/types/forum';

export const PostsContent = ({posts}: {posts: Post[]}) => {
  return (
    <div className="w-full mt-6">
      <ThreadList posts={posts} />
    </div>
  );
};

export default PostsContent;

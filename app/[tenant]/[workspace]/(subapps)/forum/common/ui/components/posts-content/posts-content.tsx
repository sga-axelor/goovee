'use client';

// ---- LOCAL IMPORTS ---- //
import {ThreadList} from '@/subapps/forum/common/ui/components';
import {Post} from '@/subapps/forum/common/types/forum';

export const PostsContent = ({
  posts,
  pageInfo,
}: {
  posts: Post[];
  pageInfo: any;
}) => {
  return (
    <div className="w-full mt-6">
      <ThreadList posts={posts} pageInfo={pageInfo} />
    </div>
  );
};

export default PostsContent;

'use client';
import React, {useEffect, useState} from 'react';
import {useInView} from 'react-intersection-observer';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';
import {DEFAULT_LIMIT} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {Thread} from '@/subapps/forum/common/ui/components';
import {fetchPosts} from '@/subapps/forum/common/action/action';
import {Post} from '@/subapps/forum/common/types/forum';

interface PageInfo {
  count: number;
}

interface InfiniteScrollProps {
  initialPosts: Post[];
  pageInfo: PageInfo;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  initialPosts,
  pageInfo,
}) => {
  const {count} = pageInfo;
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [ref, inView] = useInView();

  const {workspaceID} = useWorkspace();

  const {searchParams} = useSearchParams();
  const sort = searchParams.get('sort') || '';
  const limit = searchParams.get('limit') || DEFAULT_LIMIT;

  const loadMorePosts = async () => {
    if (posts.length >= count) {
      return;
    }
    setLoading(true);
    const nextPage = page + 1;
    try {
      const {posts: newPosts} = await fetchPosts({
        sort,
        limit: Number(limit),
        page: nextPage,
        workspaceID,
      });
      if (newPosts.length) {
        setPage(nextPage);
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (inView) {
        await loadMorePosts();
      }
    };

    fetchData();
  }, [inView, page]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  return (
    <>
      {posts.map(post => (
        <React.Fragment key={post.id}>
          <Thread post={post} />
        </React.Fragment>
      ))}

      {posts.length < count && (
        <div
          ref={ref}
          className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4">
          <p>{i18n.get('Loading')}...</p>
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;

'use client';
import React, {useEffect, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import {useParams} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {useSearchParams} from '@/ui/hooks';
import {DEFAULT_LIMIT} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useToast} from '@/ui/hooks';

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

  const {workspaceURL} = useWorkspace();
  const params = useParams();
  const {toast} = useToast();

  const {searchParams} = useSearchParams();
  const sort = searchParams.get('sort') || '';
  const limit = searchParams.get('limit') || DEFAULT_LIMIT;

  const loadMorePosts = async () => {
    if (posts.length >= count) return;

    setLoading(true);

    try {
      const nextPage = page + 1;
      const response = await fetchPosts({
        sort,
        limit: Number(limit),
        page: nextPage,
        workspaceURL,
      });

      if (response.error) {
        toast({
          variant: 'destructive',
          title: i18n.get(response.message || 'An error occurred'),
        });
        return;
      }

      if (response.posts?.length > 0) {
        setPage(nextPage);
        setPosts(prevPosts => [...prevPosts, ...response.posts]);
      }
    } catch (error) {
      console.error('Error occurred while loading posts:', error);
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
    setPage(1);
  }, [sort, limit]);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  useEffect(() => {
    setPage(1);
  }, [sort, limit]);

  return (
    <>
      {posts.map(post => (
        <React.Fragment key={post.id}>
          <Thread post={post} showHeader={params.id ? false : true} />
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

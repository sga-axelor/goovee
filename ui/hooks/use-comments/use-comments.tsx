'use client';

import {useState, useEffect, useCallback, useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {createComment, fetchComments} from '@/app/actions/comment';
import {DEFAULT_COMMENTS_LIMIT, DEFAULT_PAGE} from '@/constants';
import {CommentResponse, ID, ModelType} from '@/types';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useToast} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';

interface UseCommentsProps {
  sortBy: string;
  model: {id: ID};
  modelType: ModelType;
  seeMore?: boolean;
}

interface CommentFetchParams {
  page: number;
  sortBy: string;
}

interface HandleCommentParams {
  formData: any;
  values: any;
  parent?: number | null;
}

export function useComments({
  sortBy: sortByProp,
  model,
  modelType,
  seeMore,
}: UseCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [sortBy, setSortBy] = useState(sortByProp);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [totalCommentThreadCount, setTotalCommentThreadCount] = useState(0);
  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();

  const getComments = useCallback(
    async ({page, sortBy}: CommentFetchParams) => {
      setFetching(true);
      try {
        const response: any = await fetchComments({
          model: {id: model.id},
          type: modelType,
          sort: sortBy,
          limit: seeMore ? DEFAULT_COMMENTS_LIMIT : undefined,
          page,
          workspaceURL,
        });

        if (response.success) {
          const {data = [], total, totalCommentThreadCount} = response;

          setComments(prevComments =>
            page > 1 ? [...prevComments, ...data] : data,
          );
          setTotal(total || 0);
          setTotalCommentThreadCount(totalCommentThreadCount);
        } else {
          console.error('Response error:', response.error);
          toast({
            variant: 'destructive',
            title: i18n.get(
              response.error.message ||
                'An error occurred while fetching comments.',
            ),
          });
          throw new Error('Something went wrong!');
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        toast({
          variant: 'destructive',
          title: i18n.get(
            error.message || 'An error occurred while fetching comments.',
          ),
        });
      } finally {
        setFetching(false);
      }
    },
    [model.id, modelType, seeMore, workspaceURL, toast],
  );

  const handleRefresh = useCallback(async () => {
    await getComments({page, sortBy});
    setLoading(false);
  }, [getComments, page, sortBy]);

  const handleComment = useCallback(
    async ({formData, values, parent = null}: HandleCommentParams) => {
      try {
        const response: CommentResponse = await createComment({
          formData,
          values,
          workspaceURL,
          modelID: model.id,
          parentId: parent,
          type: modelType,
        });

        if (response.success) {
          handleRefresh();
          toast({
            variant: 'success',
            title: i18n.get('Comment created successfully.'),
          });
        } else {
          throw new Error(response.message || 'Error creating comment');
        }
      } catch (error: any) {
        console.error('Submission error:', error);
        toast({
          variant: 'destructive',
          title: i18n.get(error.message || 'An unexpected error occurred.'),
        });
      }
    },
    [workspaceURL, model.id, modelType, handleRefresh, toast],
  );

  useEffect(() => {
    setPage(DEFAULT_PAGE);
    setSortBy(sortByProp);
  }, [sortByProp]);

  useEffect(() => {
    getComments({page, sortBy}).finally(() => setLoading(false));
  }, [page, sortBy]);

  const hasMore = useMemo(() => comments.length < total, [comments, total]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage((prevPage: number) => prevPage + 1);
    }
  }, [hasMore]);

  return useMemo(
    () => ({
      comments,
      total,
      hasMore,
      fetching,
      loading,
      totalCommentThreadCount,
      getComments,
      loadMore,
      onCreate: handleComment,
      onRefresh: handleRefresh,
    }),
    [
      comments,
      total,
      hasMore,
      fetching,
      loading,
      totalCommentThreadCount,
      getComments,
      loadMore,
      handleComment,
      handleRefresh,
    ],
  );
}

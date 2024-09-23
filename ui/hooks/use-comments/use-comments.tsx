'use client';

import {useState, useEffect, useCallback, useMemo} from 'react';

// ---- CORE IMPORTS ---- //
import {fetchComments} from '@/app/actions/comment';
import {DEFAULT_COMMENTS_LIMIT, DEFAULT_PAGE} from '@/constants';
import {ID, ModelType} from '@/types';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export function useComments({
  sortBy: sortByProp,
  model,
  modelType,
}: {
  sortBy: string;
  model: {id: ID};
  modelType: ModelType;
}) {
  const [comments, setComments] = useState<any>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [sortBy, setSortBy] = useState(sortByProp);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);

  const {workspaceURL} = useWorkspace();

  const getComments = useCallback(
    async ({
      page,
      sortBy,
      disableAppend,
    }: {
      page: number;
      sortBy: string;
      disableAppend?: boolean;
    }) => {
      setFetching(true);

      try {
        const response: any = await fetchComments({
          model: {id: model.id},
          sort: sortBy,
          //TODO: add optional limit based on app
          limit: DEFAULT_COMMENTS_LIMIT,
          page,
          type: modelType,
          workspaceURL,
        });

        if (response.success) {
          const {data = []} = response;

          if (page > 1 && !disableAppend) {
            setComments((prevComments: any) => [...prevComments, ...data]);
          } else {
            setComments(data);
          }
          setTotal(data[0]?._count || 0);
          setFetching(false);

          return response;
        } else {
          setFetching(false);
          return {error: true, message: 'Something went wrong!'};
        }
        return response;
      } catch (error) {
        setFetching(false);
        return {
          error: true,
          message: 'An error occurred while fetching comments.',
        };
      }
    },
    [model, modelType, workspaceURL],
  );

  useEffect(() => {
    setPage(DEFAULT_PAGE);
    setSortBy(sortByProp);
  }, [sortByProp]);

  useEffect(() => {
    getComments({page, sortBy}).finally(() => {
      setLoading(false);
    });
  }, [page, sortBy]);

  const hasMore = useMemo(() => comments.length < total, [comments, total]);

  const loadMore = useCallback(() => {
    if (!hasMore) {
      return;
    }
    setPage(page => page + 1);
  }, [hasMore]);

  return useMemo(
    () => ({
      comments,
      total,
      hasMore,
      fetching,
      loading,
      getComments,
      loadMore,
    }),
    [comments, total, hasMore, fetching, loading, getComments, loadMore],
  );
}

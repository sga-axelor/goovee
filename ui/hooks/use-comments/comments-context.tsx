'usse client';

import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from 'react';

import {ModelType, ID} from '@/types';
import {DEFAULT_COMMENTS_LIMIT, DEFAULT_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {fetchComments} from '@/app/actions/comment';

const CommentContext = React.createContext({});

function CommentProvider({
  sortBy: sortByProp,
  model,
  modelType,
  children,
}: {
  sortBy: string;
  model: {id: ID};
  modelType: ModelType;
  children: React.ReactElement;
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
      // console.log('getcomments 1');
      setFetching(true);

      try {
        const response: any = await fetchComments({
          model: {id: model.id},
          sort: sortBy,
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
            // setComments((prevComments: any) => [...prevComments, ...data]);
          }
          setTotal(data[0]?._count || 0);
          setFetching(false);
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

  console.log('comments >>>', comments);

  useEffect(() => {
    console.log('sortByProp >>>', sortByProp);
    setPage(DEFAULT_PAGE);
    setSortBy(sortByProp);
  }, [sortByProp]);

  useEffect(() => {
    console.log('mounted');

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

  const value = useMemo(
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

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
}

export function useComments() {
  return useContext(CommentContext);
}

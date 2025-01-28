'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {createComment, fetchComments} from '@/app/actions/comment';
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/locale';
import {ID} from '@/types';
import {useToast} from '@/ui/hooks';

export type UseCommentsProps = {
  sortBy: string;
  recordId: ID;
  subapp: SUBAPP_CODES;
  limit?: number;
  newCommentOnTop?: boolean;
};

export type CreateProps = {
  formData: any;
  values: any;
  parent?: number | null;
};

export function useComments(props: UseCommentsProps) {
  const {sortBy, recordId, subapp, limit, newCommentOnTop} = props;
  const [comments, setComments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [totalCommentThreadCount, setTotalCommentThreadCount] = useState(0);
  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();

  const loadComments = useCallback(
    async (options?: {reset?: boolean; exclude?: string[]}) => {
      const {reset = true, exclude} = options || {};
      setFetching(true);
      try {
        const response = await fetchComments({
          recordId,
          subapp,
          sort: sortBy,
          limit,
          workspaceURL,
          exclude,
        });

        if (response.success) {
          const {data = [], total, totalCommentThreadCount} = response;

          setTotal((total || 0) + (exclude?.length || 0));
          setTotalCommentThreadCount(totalCommentThreadCount);
          setComments(prevComments =>
            reset ? data : [...prevComments, ...data],
          );
        }
      } catch (error: any) {
        console.error('Fetch error:', error);
        toast({
          variant: 'destructive',
          title: i18n.t(
            error.message || 'An error occurred while fetching comments.',
          ),
        });
      } finally {
        setFetching(false);
      }
    },
    [recordId, sortBy, subapp, toast, workspaceURL, limit],
  );

  const loadMore = useCallback(() => {
    if (fetching || creating) return;
    loadComments({reset: false, exclude: comments.map(c => c.id)});
  }, [loadComments, fetching, creating, comments]);

  const handleCreate = useCallback(
    async ({formData, values, parent = null}: CreateProps) => {
      setCreating(true);
      try {
        const response = await createComment(
          formData,
          JSON.stringify({
            values,
            workspaceURL,
            recordId,
            parentId: parent,
            subapp,
          }),
        );
        if (!response.success) {
          throw new Error(response.message || 'Error creating comment');
        }

        toast({
          variant: 'success',
          title: i18n.t('Comment created successfully.'),
        });

        const [comment, parentComment] = response.data;
        setComments(prevComments => {
          const replaced = replaceParent(prevComments, parentComment);
          if (parentComment && subapp === SUBAPP_CODES.forum) return replaced;
          if (newCommentOnTop) replaced.unshift(comment);
          else replaced.push(comment);
          return replaced;
        });
        setTotal(prevTotal =>
          parentComment && subapp === SUBAPP_CODES.forum
            ? prevTotal
            : prevTotal + 1,
        );
        setTotalCommentThreadCount(
          prevTotalCommentThreadCount => prevTotalCommentThreadCount + 1,
        );
      } catch (error: any) {
        console.error('Submission error:', error);
        toast({
          variant: 'destructive',
          title: i18n.t(error.message || 'An unexpected error occurred.'),
        });
      } finally {
        setCreating(false);
      }
    },
    [workspaceURL, recordId, subapp, toast, newCommentOnTop],
  );

  const hasMore = useMemo(() => comments.length < total, [comments, total]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return useMemo(
    () => ({
      comments,
      total,
      hasMore,
      loadMore,
      fetching,
      creating,
      totalCommentThreadCount,
      onCreate: handleCreate,
    }),
    [
      loadMore,
      comments,
      total,
      hasMore,
      fetching,
      creating,
      totalCommentThreadCount,
      handleCreate,
    ],
  );
}

function replaceParent(comments: {id: unknown}[], parent?: {id: unknown}) {
  if (!parent) return [...comments];
  return comments.map(c => (String(c.id) !== String(parent.id) ? c : parent));
}

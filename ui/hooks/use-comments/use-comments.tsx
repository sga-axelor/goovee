'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {createComment, fetchComments} from '@/app/actions/comment';
import {SORT_TYPE, SUBAPP_CODES} from '@/constants';
import {i18n} from '@/locale';
import type {Comment} from '@/orm/comment';
import {ID} from '@/types';
import type {Cloned} from '@/types/util';
import type {CommentData} from '@/ui/components/comments/comment-input/comments-input';
import {useToast} from '@/ui/hooks';
import {packIntoFormData} from '@/utils/formdata';

export type UseCommentsProps = {
  sortBy: SORT_TYPE;
  recordId: ID;
  subapp: SUBAPP_CODES;
  limit?: number;
  newCommentOnTop?: boolean;
};

export type CreateProps = {
  data: CommentData;
  parent?: ID;
};

export function useComments(props: UseCommentsProps) {
  const {sortBy, recordId, subapp, limit, newCommentOnTop} = props;
  const [comments, setComments] = useState<Cloned<Comment>[]>([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [totalCommentThreadCount, setTotalCommentThreadCount] = useState(0);
  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();

  const loadComments = useCallback(
    async (options?: {reset?: boolean; exclude?: ID[]}) => {
      const {reset = true, exclude} = options || {};
      setFetching(true);
      try {
        const {error, message, data} = await fetchComments({
          recordId,
          subapp,
          sort: sortBy,
          limit,
          workspaceURL,
          exclude,
        });

        if (error) {
          toast({variant: 'destructive', title: message});
          return;
        }
        const {comments, total, totalCommentThreadCount} = data;
        setTotal((total || 0) + (exclude?.length || 0));
        setTotalCommentThreadCount(totalCommentThreadCount);
        setComments(prevComments =>
          reset ? comments : [...prevComments, ...comments],
        );
      } catch (e) {
        toast({
          variant: 'destructive',
          title:
            e instanceof Error ? e.message : i18n.t('Failed to load comments.'),
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
    async ({data: commentData, parent}: CreateProps) => {
      setCreating(true);
      try {
        const formData = packIntoFormData({
          data: commentData,
          workspaceURL,
          recordId,
          parentId: parent,
          subapp,
        });

        const {error, message, data} = await createComment(formData);
        if (error) {
          toast({
            variant: 'destructive',
            title: i18n.t(message),
          });
          return;
        }

        const [comment, parentComment] = data;
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
        toast({
          variant: 'success',
          title: i18n.t('Comment created successfully.'),
        });
      } catch (e) {
        toast({
          variant: 'destructive',
          title:
            e instanceof Error
              ? e.message
              : i18n.t('An unexpected error occurred.'),
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

function replaceParent<T extends {id: ID}>(
  comments: T[],
  parent?: NoInfer<T>,
): T[] {
  if (!parent) return [...comments];
  return comments.map(c => (String(c.id) !== String(parent.id) ? c : parent));
}

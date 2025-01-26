'use client';

import React, {useCallback, useState} from 'react';
import {useSession} from 'next-auth/react';
import {
  MdAdd,
  MdClose,
  MdOutlineModeComment,
  MdOutlineThumbUp,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {useComments} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {
  CommentInput,
  CommentsList,
  DropdownToggle,
  Separator,
} from '@/ui/components';
import {i18n} from '@/locale';
import {
  COMMENT,
  COMMENTS,
  DISABLED_COMMENT_PLACEHOLDER,
  SORT_BY_OPTIONS,
  SORT_TYPE,
  type SUBAPP_CODES,
} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {CreateProps} from '@/ui/hooks/use-comments';
import type {ID} from '@/types';

interface CommentsProps {
  recordId: ID;
  subapp: SUBAPP_CODES;
  hideCommentsHeader?: boolean;
  hideCommentsFooter?: boolean;
  showCommentsByDefault?: boolean;
  showReactions?: boolean;
  inputPosition?: 'top' | 'bottom';
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
  showTopBorder?: boolean;
  sortByProp?: string;
  disabled?: boolean;
  hideSortBy?: boolean;
  inputContainerClassName?: string;
  limit?: number;
}

export function Comments({
  recordId,
  subapp,
  hideCommentsHeader = false,
  hideCommentsFooter = false,
  showCommentsByDefault,
  showReactions = true,
  inputPosition = 'bottom',
  limit,
  hideCloseComments = false,
  usePopUpStyles = false,
  showTopBorder = true,
  sortByProp,
  disabled = false,
  hideSortBy = false,
  inputContainerClassName = '',
}: CommentsProps) {
  const [showComments, setShowComments] = useState(showCommentsByDefault);
  const [sortBy, setSortBy] = useState(sortByProp || SORT_TYPE.new);

  const {comments, totalCommentThreadCount, loadMore, onCreate, hasMore} =
    useComments({
      recordId,
      subapp,
      sortBy,
      limit,
      newCommentOnTop: inputPosition === 'top',
    });
  const {data: session} = useSession();
  const isLoggedIn = !!session?.user?.id;
  const isDisabled = !isLoggedIn || disabled;

  const {tenant} = useWorkspace();

  const toggleComments = () => {
    if (comments.length > 0) {
      setShowComments(prev => !prev);
    }
  };

  const handleCreate = useCallback(
    async (props: CreateProps) => {
      await onCreate(props);
      setShowComments(true);
    },
    [onCreate],
  );

  const handleSortBy = useCallback((value: string) => {
    if (value) setSortBy(value);
  }, []);

  const showCommentInputOnTop = inputPosition === 'top';
  const showCommentInputOnBottom = !showCommentInputOnTop;

  const renderCommentInput = () => (
    <CommentInput
      disabled={isDisabled}
      className={`placeholder:text-sm placeholder:text-gray border ${!isDisabled ? 'bg-white' : 'bg-gray-light placeholder:text-gray-dark'}`}
      placeholderText={
        isLoggedIn ? i18n.t(COMMENT) : i18n.t(DISABLED_COMMENT_PLACEHOLDER)
      }
      onSubmit={handleCreate}
    />
  );

  return (
    <div className="flex flex-col">
      {!hideCommentsHeader && (
        <div className="flex justify-between px-4 pb-4">
          {/* TODO: Add reactions preview */}
          <div />
          <div
            className={`flex gap-2 items-center ${totalCommentThreadCount ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={toggleComments}>
            <MdOutlineModeComment className="w-6 h-6" />
            {totalCommentThreadCount > 0 && (
              <span className="text-sm">
                {totalCommentThreadCount}{' '}
                {totalCommentThreadCount > 1
                  ? i18n.t(COMMENTS.toLowerCase())
                  : i18n.t(COMMENT.toLowerCase())}
              </span>
            )}
          </div>
        </div>
      )}
      <div className={cn({'border-t': showTopBorder}, inputContainerClassName)}>
        {showCommentInputOnTop && (
          <div className="flex items-center gap-6 py-2">
            {showReactions && (
              <div
                className={`${!isDisabled ? 'cursor-pointer' : 'bg-gray-light text-gray-dark p-2 rounded-lg cursor-not-allowed'}`}>
                <MdOutlineThumbUp className="w-6 h-6" />
              </div>
            )}
            {renderCommentInput()}
          </div>
        )}
        {showComments && comments?.length ? (
          <div
            className={`border-t flex flex-col gap-4 ${usePopUpStyles ? 'py-4 px-4 md:px-0' : 'p-4'}`}>
            {!hideSortBy && (
              <div className="w-full flex gap-4 items-center">
                <DropdownToggle
                  title={i18n.t('Sort by')}
                  labelClassName="text-xs"
                  value={sortBy}
                  options={SORT_BY_OPTIONS}
                  onSelect={handleSortBy}
                  selectClassName="text-xs h-8"
                  valueClassName="text-xs"
                  optionClassName="text-xs"
                />
                <Separator style={{flexShrink: 1}} />
              </div>
            )}

            <CommentsList
              recordId={recordId}
              disabled={isDisabled}
              comments={comments}
              usePopUpStyles={usePopUpStyles}
              showReactions={showReactions}
              subapp={subapp}
              sortBy={sortBy}
              onSubmit={handleCreate}
              tenantId={tenant}
            />

            {!hideCommentsFooter && (
              <div
                className={`flex items-center ${hideCloseComments ? 'justify-end' : 'justify-between'}`}>
                {!hideCloseComments && (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={toggleComments}>
                    <MdClose className="w-4 h-4" />
                    <span className="text-xs font-semibold leading-[18px]">
                      {i18n.t('Close comments')}
                    </span>
                  </div>
                )}
                {hasMore && (
                  <div
                    className={`flex items-center gap-2 cursor-pointer`}
                    onClick={loadMore}>
                    <MdAdd className="w-4 h-4" />
                    <span className="text-xs font-semibold leading-[18px]">
                      {i18n.t('See more')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
        {showCommentInputOnBottom && renderCommentInput()}
      </div>
    </div>
  );
}

export default Comments;

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
import {
  CommentInput,
  CommentsList,
  DropdownToggle,
  Separator,
} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {
  COMMENT,
  COMMENTS,
  DISABLED_COMMENT_PLACEHOLDER,
  SORT_BY_OPTIONS,
  SORT_TYPE,
} from '@/constants';
import {ModelType} from '@/types';

interface CommentsProps {
  record: any;
  modelType: ModelType;
  hideCommentsHeader?: boolean;
  hideCommentsFooter?: boolean;
  showCommentsByDefault: boolean;
  showReactions?: boolean;
  inputPosition: 'top' | 'bottom';
  seeMore?: boolean;
  hideCloseComments?: boolean;
  usePopUpStyles?: boolean;
  showTopBorder?: boolean;
}

export function Comments({
  record,
  modelType,
  hideCommentsHeader = false,
  hideCommentsFooter = false,
  showCommentsByDefault,
  showReactions = true,
  inputPosition = 'bottom',
  seeMore,
  hideCloseComments = false,
  usePopUpStyles = false,
  showTopBorder = true,
}: CommentsProps) {
  const [showComments, setShowComments] = useState(showCommentsByDefault);
  const [sortBy, setSortBy] = useState(SORT_TYPE.new);
  const {comments, total, loading, fetching, loadMore, onCreate} = useComments({
    model: {id: record.id},
    modelType,
    sortBy,
    seeMore,
  });
  const {data: session} = useSession();
  const isLoggedIn = !!session?.user?.id;
  const dropdownSortOptions = SORT_BY_OPTIONS.slice(0, 2);

  const toggleComments = () => {
    if (comments.length > 0) {
      setShowComments(prev => !prev);
    }
  };

  const handleSortBy = useCallback((value: string) => {
    if (value) setSortBy(value);
  }, []);

  const showCommentInputOnTop = inputPosition === 'top';
  const showCommentInputOnBottom = !showCommentInputOnTop;

  const renderCommentInput = () => (
    <CommentInput
      disabled={!isLoggedIn}
      className={`placeholder:text-sm placeholder:text-palette-mediumGray disabled:placeholder:text-gray-700 border ${isLoggedIn ? 'bg-white' : 'bg-black/20'}`}
      placeholderText={
        isLoggedIn ? i18n.get(COMMENT) : i18n.get(DISABLED_COMMENT_PLACEHOLDER)
      }
      onSubmit={onCreate}
    />
  );

  return (
    <div className="flex flex-col">
      {!hideCommentsHeader && (
        <div className="flex justify-between px-4 pb-4">
          {/* TODO: Add reactions preview */}
          <div />
          <div
            className={`flex gap-2 items-center ${total ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={toggleComments}>
            <MdOutlineModeComment className="w-6 h-6" />
            {total > 0 && (
              <span className="text-sm">
                {total}{' '}
                {total > 1
                  ? i18n.get(COMMENTS.toLowerCase())
                  : i18n.get(COMMENT.toLowerCase())}
              </span>
            )}
          </div>
        </div>
      )}
      <div className={`${showTopBorder ? 'border-t' : ''}`}>
        {showCommentInputOnTop && (
          <div className="flex items-center gap-6 px-4 py-2">
            {showReactions && (
              <div
                className={`${isLoggedIn ? 'cursor-pointer' : 'bg-black/20 text-gray-700 p-2 rounded-lg cursor-not-allowed'}`}>
                <MdOutlineThumbUp className="w-6 h-6" />
              </div>
            )}
            {renderCommentInput()}
          </div>
        )}
        {showComments && (
          <div
            className={`border-t flex flex-col gap-4 ${usePopUpStyles ? 'py-4 px-4 md:px-0' : 'p-4'}`}>
            <div className="w-full flex gap-4 items-center">
              <div className="flex gap-2 text-base flex-shrink-0">
                <div>{i18n.get('Sort by')}:</div>
                <DropdownToggle
                  value={sortBy}
                  options={dropdownSortOptions}
                  handleDropdown={handleSortBy}
                />
              </div>
              <Separator style={{flexShrink: 1}} />
            </div>
            <CommentsList
              record={record}
              comments={comments}
              loading={loading}
              fetching={fetching}
              usePopUpStyles={usePopUpStyles}
              showReactions={showReactions}
              modelType={modelType}
              onSubmit={onCreate}
            />
            {loading && (
              <p className="text-center text-sm">{i18n.get('Loading...')}</p>
            )}
            {!hideCommentsFooter && (
              <div
                className={`flex items-center ${hideCloseComments ? 'justify-end' : 'justify-between'}`}>
                {!hideCloseComments && (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={toggleComments}>
                    <MdClose className="w-4 h-4" />
                    <span className="text-xs font-semibold leading-[18px]">
                      {i18n.get('Close comments')}
                    </span>
                  </div>
                )}
                <div
                  className={`flex items-center gap-2 ${comments.length >= total ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={loadMore}>
                  <MdAdd className="w-4 h-4" />
                  <span className="text-xs font-semibold leading-[18px]">
                    {i18n.get('See more')}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        {showCommentInputOnBottom && renderCommentInput()}
      </div>
    </div>
  );
}

export default Comments;

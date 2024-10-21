'use client';

import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {
  MdOutlineModeComment,
  MdOutlineThumbUp,
  MdFavoriteBorder,
  MdOutlineMoreHoriz,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdOutlineStraight,
  MdReply,
  MdOutlineSouth,
  MdNorth,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Avatar,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  CommentTracks,
  CommentAttachments,
  CommentInput,
  Separator,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/ui/components';
import {ModelType} from '@/types';
import {i18n} from '@/lib/i18n';
import {getImageURL} from '@/utils/image';
import {parseDate} from '@/utils/date';
import {
  COMMENT,
  COMMENTS,
  DATE_FORMATS,
  DISABLED_COMMENT_PLACEHOLDER,
  NOT_INTERESTED,
  REPORT,
  SORT_TYPE,
} from '@/constants';

import type {Comment} from '@/orm/comment';

interface CommentListItemProps {
  record: any;
  parentCommentId: string;
  comment: Comment;
  showReactions: boolean;
  modelType: ModelType;
  hasSubComments?: boolean;
  disabled: boolean;
  isTopLevel?: boolean;
  sortBy?: any;
  onSubmit?: (data: any) => void;
}

// NOTE: comments are not recursive,
// only the top level commment will have childComments, and parentComment,
// child comment will only have info that is needed to display the comment.
export const CommentListItem = ({
  record,
  parentCommentId,
  comment,
  showReactions,
  modelType,
  hasSubComments,
  disabled = false,
  isTopLevel = true,
  sortBy,
  onSubmit,
}: CommentListItemProps) => {
  const [showSubComments, setShowSubComments] = useState(
    hasSubComments || false,
  );
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [toggle, setToggle] = useState(false);

  const {
    createdOn,
    body,
    childMailMessages = [],
    id,
    mailMessageFileList = [],
    note = '',
    createdBy = {},
    parentMailMessage,
  } = comment || {};
  const {partner} = createdBy;
  const {title = '', tracks = []} = body ? JSON.parse(body) : {};

  const {data: session} = useSession();
  const isLoggedIn = Boolean(session?.user?.id);
  const isDisabled = !isLoggedIn || disabled;

  const scrollToComment = (id: string) => {
    const element = document.querySelector(`#comment-${id}`);
    if (element) {
      element.classList.add(
        'transition-colors',
        'duration-500',
        'ease-out',
        'bg-success-light',
      );
      element.scrollIntoView({behavior: 'smooth', block: 'center'});
      setTimeout(() => {
        element.classList.remove('bg-success-light');
      }, 1000);
    }
  };

  const toggleSubComments = () => {
    if (childMailMessages?.length > 0) setShowSubComments(prev => !prev);
  };

  const toggleCommentInput = () => setShowCommentInput(prev => !prev);

  const handleCommentSubmit = (data: any) => {
    if (onSubmit) {
      try {
        onSubmit({...data, parent: parentMailMessage?.id || parentCommentId});
      } catch (error) {
        console.error('Error submitting comment:', error);
      } finally {
        setShowCommentInput(false);
      }
    } else {
      console.warn('onSubmit is undefined.');
    }
  };

  const renderChildComments = () => {
    if (
      !showSubComments ||
      parentCommentId !== id ||
      !childMailMessages?.length
    )
      return null;
    return childMailMessages.map((childComment: any) => (
      <CommentListItem
        key={childComment.id}
        record={record}
        parentCommentId={parentCommentId}
        comment={childComment}
        showReactions={showReactions}
        modelType={modelType}
        isTopLevel={false}
        disabled={isDisabled}
        onSubmit={onSubmit}
      />
    ));
  };

  const renderAvatar = (pictureId: string) => (
    <Avatar className="rounded-full h-6 w-6">
      <AvatarImage src={getImageURL(pictureId) ?? '/images/no-image.png'} />
    </Avatar>
  );

  const renderParentMessage = () => {
    if (!parentMailMessage?.id) return null;

    const {
      createdBy: {partner},
    } = parentMailMessage;

    return (
      <div className="p-2 border-l-2 border-success bg-success-light rounded-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {renderAvatar(partner?.picture?.id)}
            <div className="font-semibold text-sm">
              {partner?.simpleFullName}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {toggle ? (
              <MdKeyboardArrowUp
                className="w-4 h-4 cursor-pointer"
                onClick={() => setToggle(false)}
              />
            ) : (
              <MdKeyboardArrowDown
                className="w-4 h-4 cursor-pointer"
                onClick={() => setToggle(true)}
              />
            )}
            {sortBy === SORT_TYPE.old ? (
              <MdNorth
                className="cursor-pointer"
                onClick={() => scrollToComment(parentMailMessage?.id)}
              />
            ) : (
              <MdOutlineSouth
                className="cursor-pointer"
                onClick={() => scrollToComment(parentMailMessage?.id)}
              />
            )}
          </div>
        </div>
        <div>
          <div
            className={`text-sm w-full font-normal ${toggle ? '' : 'line-clamp-1'}`}
            dangerouslySetInnerHTML={{__html: parentMailMessage.note}}
          />
        </div>
      </div>
    );
  };

  const renderReactions = () => (
    <div className="flex items-center gap-6 mt-1 mb-2">
      <div className="flex items-center rounded-lg border h-7">
        <div className="w-8 h-full px-2 py-1 border-r">
          <MdOutlineThumbUp className="cursor-pointer" />
        </div>
        <div className="flex items-center px-2 py-1">
          <MdOutlineThumbUp className="cursor-pointer" />
          <MdFavoriteBorder className="cursor-pointer" />
        </div>
      </div>
      <Separator orientation="vertical" className="h-6 bg-black" />
    </div>
  );

  if (!comment) return null;

  return (
    <div className="flex flex-col gap-1" key={id} id={`comment-${id}`}>
      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          {renderAvatar(partner?.picture?.id)}
          <div className="flex flex-col">
            <div className="font-semibold text-sm leading-[21px]">
              {partner?.simpleFullName}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-[10px] leading-3">
                    {parseDate(createdOn, DATE_FORMATS.full_date)}
                  </div>
                </TooltipTrigger>
                <TooltipContent align="start" className="px-4 py-1 text-[10px]">
                  {parseDate(createdOn, `MMMM Do YYYY, h:mm a`)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <MdOutlineMoreHoriz className="w-6 h-6 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="p-0 w-fit">
              <div className="flex flex-col gap-[10px] p-4 bg-white rounded-lg text-xs leading-[18px]">
                <div className="cursor-pointer">{i18n.get(REPORT)}</div>
                <div className="cursor-pointer">{i18n.get(NOT_INTERESTED)}</div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className={`${isTopLevel ? 'ml-3 pl-10' : 'pl-8'}`}>
        {tracks.length > 0 && <CommentTracks tracks={tracks} title={title} />}
        <CommentAttachments attachments={mailMessageFileList} />

        <div className="flex flex-col">
          {renderParentMessage()}
          <div
            className="text-sm w-full font-normal"
            dangerouslySetInnerHTML={{__html: note}}
          />
          <div className="flex items-center gap-6 mt-1 mb-2">
            {showReactions && renderReactions()}
            {note && (
              <div className="flex gap-6 items-center">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={toggleCommentInput}>
                  <MdReply className="w-4 h-4" />
                  <span className="text-[10px]">{i18n.get('Reply')}</span>
                </div>

                {parentCommentId === id && childMailMessages.length > 0 && (
                  <>
                    <Separator
                      orientation="vertical"
                      className="h-6 bg-black"
                    />
                    <div
                      className={`flex items-center gap-1 text-[10px] ${childMailMessages.length ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={toggleSubComments}>
                      <MdOutlineModeComment className="w-4 h-4 cursor-pointer" />
                      {childMailMessages.length}{' '}
                      {i18n.get(
                        childMailMessages.length > 1
                          ? COMMENTS.toLowerCase()
                          : COMMENT.toLowerCase(),
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {showCommentInput && (
            <div className="my-2">
              <CommentInput
                disabled={isDisabled}
                className={`placeholder:text-sm placeholder:text-gray border ${!isDisabled ? 'bg-white' : 'bg-gray-light placeholder:text-gray-dark'}`}
                placeholderText={
                  isLoggedIn
                    ? i18n.get(COMMENT)
                    : i18n.get(DISABLED_COMMENT_PLACEHOLDER)
                }
                onSubmit={handleCommentSubmit}
              />
            </div>
          )}
          {renderChildComments()}
        </div>
      </div>
    </div>
  );
};

export default CommentListItem;

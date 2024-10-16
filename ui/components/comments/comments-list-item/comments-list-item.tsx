'use client';

import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {
  MdOutlineModeComment,
  MdOutlineThumbUp,
  MdFavoriteBorder,
  MdOutlineMoreHoriz,
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
} from '@/constants';

interface Comment {
  id: string;
  createdOn: string;
  mailMessage?: {body?: string};
  childCommentList?: Comment[];
  commentFileList?: any[];
  note?: string;
  createdBy: {partner: {picture?: {id: string}; simpleFullName?: string}};
}

interface CommentListItemProps {
  record: any;
  parentCommentId: string;
  comment: Comment;
  showReactions: boolean;
  modelType: ModelType;
  hasSubComments?: boolean;
  disabled: boolean;
  isTopLevel?: boolean;
  onSubmit?: (data: any) => void;
}

export const CommentListItem = ({
  record,
  parentCommentId,
  comment,
  showReactions,
  modelType,
  hasSubComments,
  disabled = false,
  isTopLevel = true,
  onSubmit,
}: CommentListItemProps) => {
  const [showSubComments, setShowSubComments] = useState(
    hasSubComments || false,
  );
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);

  const {
    createdOn,
    mailMessage,
    childCommentList = [],
    id,
    commentFileList = [],
    note = '',
    createdBy: {partner},
  } = comment || {};

  const {body = ''} = mailMessage || {};
  const {title = '', tracks = []} = body ? JSON.parse(body) : {};

  const {data: session} = useSession();
  const isLoggedIn = Boolean(session?.user?.id);
  const isDisabled = !isLoggedIn || disabled;

  const handleSubCommentsToggle = () => {
    childCommentList?.length > 0 && setShowSubComments(prev => !prev);
  };

  const handleInputToggle = () => setShowCommentInput(prev => !prev);

  if (!comment) return null;

  const renderChildComments = () => {
    if (
      !showSubComments ||
      parentCommentId !== id ||
      !childCommentList?.length
    ) {
      return null;
    }

    return childCommentList.map(childComment => (
      <CommentListItem
        disabled={isDisabled}
        key={childComment.id}
        record={record}
        parentCommentId={parentCommentId}
        comment={childComment}
        showReactions={showReactions}
        modelType={modelType}
        isTopLevel={false}
        onSubmit={onSubmit}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="rounded-full h-6 w-6">
            <AvatarImage
              src={getImageURL(partner?.picture?.id) ?? '/images/no-image.png'}
            />
          </Avatar>
          <div>
            <div className="font-semibold text-sm">
              {partner?.simpleFullName}
            </div>
            <div className="text-[10px] leading-none">
              {parseDate(createdOn, DATE_FORMATS.full_date)}
            </div>
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
      <div
        className={`${isTopLevel ? 'border-l ml-3 pl-10 border-gray-light' : 'pl-8'}`}>
        {tracks?.length > 0 && <CommentTracks tracks={tracks} title={title} />}
        <CommentAttachments attachments={commentFileList} />

        <div className="flex flex-col">
          <div
            className="text-sm w-full font-normal line-clamp-2"
            dangerouslySetInnerHTML={{__html: note}}
          />
          <div className="flex justify-end items-center gap-6 mt-1 mb-2">
            {showReactions && (
              <>
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
              </>
            )}
            {note && (
              <div className="flex gap-6 items-center">
                <span
                  className="text-xs cursor-pointer"
                  onClick={handleInputToggle}>
                  {i18n.get('Reply')}
                </span>

                {parentCommentId === id && childCommentList.length > 0 && (
                  <>
                    <Separator
                      orientation="vertical"
                      className="h-6 bg-black"
                    />
                    <div
                      className={`flex items-center gap-1 text-[10px] ${childCommentList.length ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={handleSubCommentsToggle}>
                      <MdOutlineModeComment className="w-4 h-4 cursor-pointer" />
                      {childCommentList.length}{' '}
                      {i18n.get(
                        childCommentList.length > 1
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
                onSubmit={(data: any) => {
                  if (onSubmit) {
                    try {
                      onSubmit({...data, parent: parentCommentId});
                    } catch (error) {
                      console.error('Error submitting comment:', error);
                    } finally {
                      setShowCommentInput(false);
                    }
                  } else {
                    console.warn('onSubmit function not provided');
                    setShowCommentInput(false);
                  }
                }}
              />
            </div>
          )}
        </div>

        {renderChildComments()}
      </div>
    </div>
  );
};

export default CommentListItem;

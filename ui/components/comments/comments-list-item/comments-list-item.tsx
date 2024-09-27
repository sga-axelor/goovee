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
  totalCommentsCount?: boolean;
  disabled: boolean;
  onSubmit?: (data: any) => void;
}

export const CommentListItem = ({
  record,
  parentCommentId,
  comment,
  showReactions,
  modelType,
  totalCommentsCount,
  disabled = false,
  onSubmit,
}: CommentListItemProps) => {
  const [showSubComments, setShowSubComments] = useState(
    totalCommentsCount || false,
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
  } = comment;

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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Avatar className="rounded-full h-6 w-6">
            <AvatarImage
              src={getImageURL(partner?.picture?.id) ?? '/images/no-image.png'}
            />
          </Avatar>
          <span className="font-semibold text-base">
            {partner?.simpleFullName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs">
            {parseDate(createdOn, DATE_FORMATS.full_date)}
          </div>
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

      {tracks?.length > 0 && <CommentTracks tracks={tracks} title={title} />}
      <CommentAttachments attachments={commentFileList} />

      <div className="flex flex-col">
        <div className="text-sm">{note}</div>
        <div className="flex justify-end items-center gap-6 mt-1 mb-2">
          {showReactions && (
            <div className="flex rounded-lg border h-8">
              <MdOutlineThumbUp className="w-8 h-full cursor-pointer p-2 border-r" />
              <div className="flex p-2">
                <MdOutlineThumbUp className="cursor-pointer" />
                <MdFavoriteBorder className="cursor-pointer" />
              </div>
            </div>
          )}
          <div className={`flex gap-2 items-center`}>
            <MdOutlineModeComment
              className="w-4 h-4"
              onClick={handleInputToggle}
            />
            {parentCommentId === id && childCommentList.length > 0 && (
              <span
                className={`text-sm ${childCommentList.length ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={handleSubCommentsToggle}>
                {childCommentList.length}{' '}
                {i18n.get(
                  childCommentList.length > 1
                    ? COMMENTS.toLowerCase()
                    : COMMENT.toLowerCase(),
                )}
              </span>
            )}
          </div>
        </div>
        {showCommentInput && (
          <div className="my-2">
            <CommentInput
              disabled={isDisabled}
              className={`placeholder:text-sm placeholder:text-palette-mediumGray disabled:placeholder:text-gray-700 border ${!isDisabled ? 'bg-white' : 'bg-black/20'}`}
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

      {showSubComments &&
        parentCommentId === id &&
        childCommentList?.length > 0 && (
          <div className="ml-6 mt-2">
            {childCommentList.map(childComment => (
              <CommentListItem
                disabled={isDisabled}
                key={childComment.id}
                record={record}
                parentCommentId={parentCommentId}
                comment={childComment}
                showReactions={showReactions}
                modelType={modelType}
                onSubmit={onSubmit}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default CommentListItem;

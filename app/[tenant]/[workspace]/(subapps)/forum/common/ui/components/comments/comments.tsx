'use client';

import {
  MdClose,
  MdAdd,
  MdOutlineModeComment,
  MdOutlineThumbUp,
  MdFavoriteBorder,
  MdOutlineMoreHoriz,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Separator,
  Avatar,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';
import {i18n} from '@/lib/i18n';
import {parseDate} from '@/utils/date';
import {DATE_FORMATS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  NOT_INTERESTED,
  REPORT,
  THREAD_SORT_BY_OPTIONS,
} from '@/subapps/forum/common/constants';
import {DropdownToggle} from '@/subapps/forum/common/ui/components';

// ---- LOCAL IMPORTS ---- //
import {getImageURL} from '@/app/[tenant]/[workspace]/(subapps)/news/common/utils';

const Comment = ({comment}: {comment?: any}) => {
  if (!comment) return null;

  const {author, publicationDateTime, contentComment} = comment;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Avatar className="rounded-full h-6 w-6">
            <AvatarImage
              src={getImageURL(author?.id) ?? '/images/no-image.png'}
            />
          </Avatar>
          <span className="font-semibold text-base">{author?.name ?? ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs">
            {parseDate(publicationDateTime, DATE_FORMATS.full_date)}
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
      <div>
        <div className="text-sm">{contentComment}</div>
        <div className="flex justify-end items-center gap-6 mt-1">
          <div className="flex rounded-lg border h-8">
            <MdOutlineThumbUp className="w-8 h-full cursor-pointer p-2 border-r" />
            <div className="flex p-2">
              <MdOutlineThumbUp className=" cursor-pointer" />
              <MdFavoriteBorder className=" cursor-pointer" />
            </div>
          </div>
          <div>
            <MdOutlineModeComment className="w-4 h-4" />
          </div>
        </div>
      </div>
      {comment.childCommentList?.length > 0 &&
        comment.childCommentList.map((childComment: any) => (
          <div key={childComment.id} className="ml-6">
            <Comment comment={childComment} />
          </div>
        ))}
    </div>
  );
};

export const Comments = ({
  comments,
  hideCloseComments = false,
  usePopUpStyles = false,
  toggleComments,
}: {
  comments: any;
  usePopUpStyles?: boolean;
  hideCloseComments?: boolean;
  toggleComments: () => void;
}) => {
  return (
    <div
      className={`border-t flex flex-col gap-4 ${usePopUpStyles ? 'py-4 px-4 md:px-0' : 'p-4'}`}>
      <div className="w-full flex gap-4 items-center">
        <div className="flex gap-2 text-base flex-shrink-0">
          <div>{i18n.get('Sort by')}:</div>
          <DropdownToggle options={THREAD_SORT_BY_OPTIONS} />
        </div>
        <Separator
          style={{
            flexShrink: 1,
          }}
        />
      </div>
      <div
        className={`flex flex-col gap-4 ${usePopUpStyles ? 'h-full overflow-auto' : ''}`}>
        {comments.map((comment: any) => {
          return (
            <div key={comment.id} className={`flex flex-col gap-4`}>
              <Comment comment={comment} />
            </div>
          );
        })}
      </div>
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
        <div className="flex items-center gap-2 cursor-pointer">
          <MdAdd className="w-4 h-4" />
          <span className="text-xs font-semibold leading-[18px]">
            {i18n.get('See more')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comments;

'use client';
import {useState} from 'react';
import {MdOutlineMoreHoriz, MdOutlineModeComment} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Avatar,
  AvatarImage,
} from '@/ui/components';
import {getImageURL} from '@/utils/image';
import {DATE_FORMATS} from '@/constants';
import {parseDate} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {
  COMMENT,
  COMMENTS,
  NOT_INTERESTED,
  REPORT,
} from '@/subapps/forum/common/constants';
import {ImageGallery} from '@/subapps/forum/common/ui/components';
import {Post} from '@/subapps/forum/common/types/forum';

interface MetaFile {
  fileType: string;
}

interface Attachment {
  metaFile?: MetaFile;
}

export const ThreadBody = ({
  post,
  usePopUpStyles = false,
  toggleComments,
}: {
  post: Post;
  usePopUpStyles?: boolean;
  toggleComments: () => void;
}) => {
  const {title, content, attachmentList, author, createdOn, commentList} = post;

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const images =
    attachmentList?.filter((attachment: any) =>
      attachment?.metaFile?.fileType.startsWith('image'),
    ) || [];

  const commentsLength = commentList?.length;

  return (
    <>
      <div className="flex flex-col gap-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="rounded-full h-10 w-10">
              <AvatarImage src={getImageURL(author?.picture?.id)} />
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold">
                {author?.simpleFullName}
              </div>
              <div className="text-xs">
                {parseDate(createdOn, DATE_FORMATS.full_date)}
              </div>
            </div>
          </div>
          <div></div>
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
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold line-clamp-1">{title}</div>
          <div
            className={`text-sm line-clamp-${isExpanded ? 0 : 3}`}
            dangerouslySetInnerHTML={{
              __html: content || '',
            }}></div>
          <div className="flex justify-end">
            <div
              className="text-gray-500 cursor-pointer flex items-center gap-2 justify-end w-fit"
              onClick={toggleExpand}>
              <MdOutlineMoreHoriz className="w-4 h-4" />
              <span className="text-xs font-semibold">
                {!isExpanded ? i18n.get('See more') : i18n.get('See less')}
              </span>
            </div>
          </div>
        </div>
        {images?.length > 0 && !usePopUpStyles && (
          <ImageGallery post={post} images={images} />
        )}
        <div className="flex justify-between">
          <div></div>
          <div
            className={`flex gap-2 items-center ${commentsLength ? 'cursor-pointer' : 'cursor-default'} `}
            onClick={toggleComments}>
            <MdOutlineModeComment className="w-6 h-6" />
            <span className="text-sm">
              {commentsLength}{' '}
              {commentsLength > 1
                ? i18n.get(COMMENTS.toLowerCase())
                : i18n.get(COMMENT.toLowerCase())}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadBody;

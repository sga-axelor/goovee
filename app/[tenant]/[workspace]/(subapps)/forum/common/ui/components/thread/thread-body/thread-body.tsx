'use client';
import React, {useMemo, useState} from 'react';
import {MdOutlineMoreHoriz} from 'react-icons/md';

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
import {DATE_FORMATS, NOT_INTERESTED, REPORT} from '@/constants';
import {parseDate} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {
  FilePreviewer,
  ImageGallery,
} from '@/subapps/forum/common/ui/components';
import {
  SEE_MORE,
  SEE_LESS,
} from '@/subapps/forum/common/constants';
import  type {Post} from '@/subapps/forum/common/types/forum';
import {useTruncatedElement} from '@/subapps/forum/common/ui/hooks/use-truncatedElement';

interface MetaFile {
  fileType: string;
}

export const ThreadBody = ({
  post,
  usePopUpStyles = false,
}: {
  post?: Post;
  usePopUpStyles?: boolean;
}) => {
  const {title, content, attachmentList, author, createdOn}: any = post || {};

  const ref = React.useRef(null);
  const {isTruncated, isShowingMore, toggleIsShowingMore} = useTruncatedElement(
    {ref},
  );

  const {images, files} = useMemo(() => {
    return (
      attachmentList?.reduce(
        (acc: any, attachment: any) => {
          if (attachment?.metaFile?.fileType.startsWith('image')) {
            acc.images.push(attachment);
          } else {
            acc.files.push({
              id: attachment?.metaFile?.id,
              type: attachment?.metaFile?.fileType,
              name: attachment?.metaFile?.fileName,
            });
          }
          return acc;
        },
        {images: [], files: []},
      ) || {images: [], files: []}
    );
  }, [attachmentList]);

  return (
    <>
      <div className="flex flex-col gap-6 px-4 pt-4">
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
            ref={ref}
            className={`break-words text-xl ${!isShowingMore && 'line-clamp-3'} postContent`}
            dangerouslySetInnerHTML={{
              __html: content || '',
            }}></div>
          <div className="flex justify-end">
            <span className="text-xs font-semibold">
              {isTruncated && (
                <button
                  onClick={toggleIsShowingMore}
                  className="text-gray-500 cursor-pointer flex items-center gap-2 justify-end w-fit">
                  <MdOutlineMoreHoriz className="w-4 h-4" />
                  {isShowingMore ? i18n.get(SEE_LESS) : i18n.get(SEE_MORE)}
                </button>
              )}
            </span>
          </div>
        </div>
        {images?.length > 0 && !usePopUpStyles && (
          <ImageGallery post={post} images={images} />
        )}

        {files?.length > 0 &&
          !usePopUpStyles &&
          files.map((file: any) => (
            <React.Fragment key={file.id}>
              <FilePreviewer file={file} />
            </React.Fragment>
          ))}
      </div>
    </>
  );
};

export default ThreadBody;

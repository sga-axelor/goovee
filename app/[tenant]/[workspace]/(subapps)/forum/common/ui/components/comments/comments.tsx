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

// ---- LOCAL IMPORTS ---- //
import {
  NOT_INTERESTED,
  REPORT,
  THREAD_SORT_BY_OPTIONS,
} from '@/subapps/forum/common/constants';
import {DropdownToggle} from '@/subapps/forum/common/ui/components';

const Comment = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Avatar className="rounded-full h-6 w-6 bg-slate-400">
            {/* <AvatarImage src="/images/user.png" /> */}
          </Avatar>
          <span className="font-semibold text-base">Alfredo Keebler</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs">May 5th 2024</div>
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
        <div className="text-sm">
          Lorem ipsum dolor sit amet consectetur. Neque purus adipiscing sit
          consequat neque. Risus rhoncus tortor pellentesque mattis. Ac
          ullamcorper a pretium malesuada. Eu etiam suspendisse rutrum aliquet
          condimentum laoreet suspendisse. Dapibus eget vulputate nec nulla
          egestas cursus facilisis orci accumsan. Rhoncus aenean viverra
          condimentum facilisi in faucibus. Sed diam pellentesque tellus integer
          mattis libero. Dolor eget nunc egestas quam. Diam dignissim fames
          aliquam in amet. Tincidunt at sed nibh senectus facilisis. Feugiat
          tortor et turpis diam aliquam. Massa commodo malesuada eu lacus
          maecenas. Lacus semper cras diam lobortis tellus aliquam et nulla ac.
          Viverra tristique eget tellus volutpat.
        </div>
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
    </div>
  );
};

export const Comments = ({
  hideCloseComments = false,
  usePopUpStyles = false,
  toggleComments,
}: {
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
        {Array.from({length: 1}).map((_, index) => {
          return (
            <div className={`flex flex-col gap-4`}>
              <Comment />
              {index === 0 &&
                Array.from({length: 2}).map(() => {
                  return (
                    <div className="ml-6">
                      <Comment />
                    </div>
                  );
                })}
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

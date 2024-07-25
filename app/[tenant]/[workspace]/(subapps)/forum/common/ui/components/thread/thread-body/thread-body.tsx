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

// ---- LOCAL IMPORTS ---- //
import {
  COMMENTS,
  NOT_INTERESTED,
  REPORT,
} from '@/subapps/forum/common/constants';
import {ImageGallery} from '@/subapps/forum/common/ui/components';

export const ThreadBody = ({
  index,
  toggleComments,
}: {
  index?: any;
  toggleComments: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="flex flex-col gap-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="rounded-full h-10 w-10 bg-blue-200">
              {/* <AvatarImage src="/images/user.png" /> */}
            </Avatar>
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold">Calvin Nitzsche</div>
              <div className="text-xs">May 5th 2024</div>
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
          <div className="text-lg font-semibold line-clamp-1">
            Cross-platform 24/7 algorithm
          </div>
          <div className={`text-sm line-clamp-${isExpanded ? 0 : 3}`}>
            Lorem ipsum dolor sit amet consectetur. Neque purus adipiscing sit
            consequat neque. Risus rhoncus tortor pellentesque mattis. Ac
            ullamcorper a pretium malesuada. Eu etiam suspendisse rutrum aliquet
            condimentum laoreet suspendisse. Dapibus eget vulputate nec nulla
            egestas cursus facilisis orci accumsan. Rhoncus aenean viverra
            condimentum facilisi in faucibus. Sed diam pellentesque tellus
            integer mattis libero. Dolor eget nunc egestas quam. Diam dignissim
            fames aliquam in amet. Tincidunt at sed nibh senectus facilisis.
            Feugiat tortor et turpis diam aliquam. Massa commodo malesuada eu
            lacus maecenas. Lacus semper cras diam lobortis tellus aliquam et
            nulla ac. Viverra tristique eget tellus volutpat.
          </div>
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
        {index === 1 && <ImageGallery />}
        <div className="flex justify-between">
          <div></div>
          <div
            className="flex gap-2 items-center cursor-pointer"
            onClick={toggleComments}>
            <MdOutlineModeComment className="w-6 h-6" />
            <span className="text-sm">
              56 {i18n.get(COMMENTS.toLowerCase())}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadBody;

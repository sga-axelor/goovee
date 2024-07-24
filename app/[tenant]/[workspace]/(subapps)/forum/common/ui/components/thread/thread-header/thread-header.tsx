'use client';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';

// ---- LOCAL IMPORTS ---- //
import {GROUP_NAME} from '@/subapps/forum/common/constants';

export const ThreadHeader = () => {
  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <Avatar className="rounded-lg h-6 w-6 bg-red-400">
        {/* <AvatarImage src="/images/user.png" /> */}
      </Avatar>
      <p className="font-normal text-xs leading-[14px] line-clamp-1">
        {GROUP_NAME}
      </p>
    </div>
  );
};

export default ThreadHeader;

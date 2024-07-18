'use client';
import {
  MdOutlinePushPin,
  MdMoreVert,
  MdOutlineMarkChatRead,
  MdNotificationsNone,
  MdExitToApp,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarImage} from '@/ui/components/avatar';

// ---- LOCAL IMPORTS ---- //
import {Search} from '@/subapps/forum/common/ui/components';
import {
  GROUPS,
  GROUP_NAME,
  LEAVE_THIS_GROUP,
  MARK_AS_READ,
  MEMBER,
  NOTIFICATIONS,
  NOT_MEMBER,
  PIN,
} from '@/subapps/forum/common/constants';

const Content = () => {
  return (
    <div className="flex gap-5 px-[100px] py-6 w-full">
      <div className="w-1/4 flex flex-col gap-6 bg-white p-4 rounded-lg">
        <div>
          <h1 className="font-semibold text-xl leading-[30px]">{GROUPS}</h1>
        </div>
        <Search />
        <div>
          <h1 className="font-semibold text-base leading-6 mb-6">{MEMBER}</h1>
          <div className="flex flex-col gap-4">
            {Array.from({length: 6}).map((_, i) => (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="rounded-lg h-6 w-6 bg-red-400">
                      {/* <AvatarImage src="/images/user.png" /> */}
                    </Avatar>
                    <p className="font-normal text-sm leading-5">
                      {GROUP_NAME}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-1 bg-success/10 cursor-pointer rounded-sm leading-[15px]">
                      <span className="text-success text-[10px]">2</span>
                    </div>
                    {i % 2 === 0 && (
                      <MdOutlinePushPin className="cursor-pointer" />
                    )}
                    <MdMoreVert className="cursor-pointer" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-[10px] px-2">
                    <MdOutlineMarkChatRead className="w-4 h-4" />
                    <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                      {MARK_AS_READ}
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] px-2">
                    <MdOutlinePushPin className="w-4 h-4" />
                    <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                      {PIN}
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] px-2">
                    <MdNotificationsNone className="w-4 h-4" />
                    <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                      {NOTIFICATIONS}
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] px-2">
                    <MdExitToApp className="w-4 h-4" />
                    <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                      {LEAVE_THIS_GROUP}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="font-semibold text-base leading-6 mb-6">
            {NOT_MEMBER}
          </h1>
          <div className="flex flex-col gap-4">
            {Array.from({length: 3}).map((_, i) => (
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="rounded-lg h-6 w-6 bg-green-400">
                    {/* <AvatarImage src="/images/user.png" /> */}
                  </Avatar>
                  <p className="font-normal text-sm leading-5">{GROUP_NAME}</p>
                </div>
                <div className="flex items-center gap-2">
                  {false && (
                    <div className="px-1 bg-success/10 cursor-pointer rounded-sm leading-[15px]">
                      <span className="text-success text-[10px]">2</span>
                    </div>
                  )}
                  {false && <MdOutlinePushPin className="cursor-pointer" />}
                  <MdMoreVert className="cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <h1>Content</h1>
      </div>
    </div>
  );
};

export default Content;

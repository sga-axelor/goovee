'use client';

import {
  MdOutlinePushPin,
  MdMoreVert,
  MdOutlineMarkChatRead,
  MdNotificationsNone,
  MdExitToApp,
} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Avatar,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  GROUP_NAME,
  LEAVE_THIS_GROUP,
  MARK_AS_READ,
  NOTIFICATIONS,
  NOTIFICATIONS_OPTIONS,
  PIN,
} from '@/subapps/forum/common/constants';

export const GroupActionList = ({
  title,
  groups,
}: {
  title: string;
  groups: any;
}) => {
  return (
    <div>
      <h1 className="font-semibold text-base leading-6 mb-6">
        {i18n.get(title)}
      </h1>
      <div className="flex flex-col gap-4">
        {groups?.map((group: any) => (
          <Collapsible key={group.id}>
            <div className="w-full flex-shrink-0 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="rounded-lg h-6 w-6 bg-red-400">
                  {/* <AvatarImage src="/images/user.png" /> */}
                </Avatar>
                <p className="font-normal text-sm leading-5 line-clamp-1 cursor-pointer">
                  {group?.forumGroup?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-1 bg-success/10 cursor-pointer rounded-sm leading-[15px]">
                  <span className="text-success text-[10px]">2</span>
                </div>
                {group?.isPin && (
                  <MdOutlinePushPin className="cursor-pointer w-4 h-4" />
                )}
                <CollapsibleTrigger>
                  <MdMoreVert className="cursor-pointer" />
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent className="mt-2">
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

                <Popover>
                  <PopoverTrigger>
                    <div className="flex items-center gap-[10px] px-2">
                      <MdNotificationsNone className="w-4 h-4" />
                      <span className="w-full text-left text-xs leading-[18px] font-normal cursor-pointer">
                        {NOTIFICATIONS}
                      </span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent side="right" className="p-0 w-fit">
                    <div className="flex flex-col gap-[10px] p-4 bg-white rounded-lg text-xs leading-[18px]">
                      {NOTIFICATIONS_OPTIONS.map(option => (
                        <div key={option.id} className="cursor-pointer">
                          {i18n.get(option.title)}
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-[10px] px-2">
                  <MdExitToApp className="w-4 h-4" />
                  <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                    {LEAVE_THIS_GROUP}
                  </span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default GroupActionList;

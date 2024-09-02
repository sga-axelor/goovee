'use client';

import {useRouter} from 'next/navigation';
import {
  MdOutlinePushPin,
  MdMoreVert,
  MdOutlineMarkChatRead,
  MdNotificationsNone,
  MdExitToApp,
  MdOutlineGroupAdd,
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
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  ASK_TO_JOIN,
  LEAVE_THIS_GROUP,
  MARK_AS_READ,
  NOTIFICATIONS,
  NOTIFICATIONS_OPTIONS,
  PIN,
  REMOVE_PIN,
} from '@/subapps/forum/common/constants';
import {
  addNotificationsToGroup,
  pinGroup,
  exitGroup,
  joinGroup,
} from '@/subapps/forum/common/action/action';
import {getImageURL} from '@/app/[tenant]/[workspace]/(subapps)/news/common/utils';

export const GroupActionList = ({
  title,
  groups,
  isMember = true,
  userId = '',
  groupId,
}: {
  title: string;
  groups: any;
  isMember?: boolean;
  userId?: string;
  groupId?: string;
}) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handlePinGroup = async (isPin: boolean, group: any) => {
    await pinGroup({isPin: !isPin, group});
    router.push(`${workspaceURI}/forum`);
    router.refresh();
  };

  const handleExit = async (group: any) => {
    await exitGroup({group});
    router.push(`${workspaceURI}/forum`);
    router.refresh();
  };

  const handleJoinGroup = async (group: any, userId: string) => {
    await joinGroup({group, userId});
    router.push(`${workspaceURI}/forum`);
    router.refresh();
  };

  const handleNotifications = async (
    id: string,
    version: number,
    notificationType: string,
  ) => {
    await addNotificationsToGroup({id, version, notificationType});
    router.push(`${workspaceURI}/forum`);
  };

  const handlePath = (id: string) => {
    router.push(`${workspaceURI}/forum/group/${id}`, {scroll: false});
  };

  return (
    <div>
      <h1 className="font-semibold text-base leading-6 mb-6">
        {i18n.get(title)}
      </h1>
      <div className="flex flex-col gap-4">
        {groups?.map((group: any) => {
          const groupImageID = group?.forumGroup?.image?.id || group?.image?.id;
          const groupImage =
            getImageURL(groupImageID) || '/images/no-image.png';

          return (
            <Collapsible key={group?.id}>
              <div
                className={`w-full flex-shrink-0 flex justify-between items-center gap-2 py-1 rounded ${groupId && groupId === group?.forumGroup?.id ? 'bg-success-light' : ' '}`}>
                <div
                  onClick={() => handlePath(group?.forumGroup?.id || group?.id)}
                  className="flex items-center gap-2">
                  <Avatar className="rounded-lg h-6 w-6">
                    <AvatarImage src={groupImage} />
                  </Avatar>
                  <p className="font-normal text-sm leading-5 line-clamp-1 cursor-pointer">
                    {group?.forumGroup?.name || group?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {false && (
                    <div className="px-1 bg-success/10 cursor-pointer rounded-sm leading-[15px]">
                      <span className="text-success text-[10px]">2</span>
                    </div>
                  )}
                  {group?.isPin && (
                    <MdOutlinePushPin className="cursor-pointer w-4 h-4" />
                  )}
                  {userId && (
                    <CollapsibleTrigger>
                      <MdMoreVert className="cursor-pointer" />
                    </CollapsibleTrigger>
                  )}
                </div>
              </div>
              <CollapsibleContent className="mt-2">
                <div className="flex flex-col gap-2">
                  {isMember && (
                    <>
                      <div className="flex items-center gap-[10px] px-2">
                        <MdOutlineMarkChatRead className="w-4 h-4" />
                        <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                          {MARK_AS_READ}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-[10px] px-2"
                        onClick={() => handlePinGroup(group?.isPin, group)}>
                        <MdOutlinePushPin className="w-4 h-4" />
                        <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                          {!group?.isPin ? PIN : REMOVE_PIN}
                        </span>
                      </div>
                    </>
                  )}

                  {false && (
                    <Popover>
                      <PopoverTrigger>
                        <div className="flex items-center gap-[10px] px-2">
                          <MdNotificationsNone className="w-4 h-4" />
                          <span className="w-full text-left text-xs leading-[18px] font-normal cursor-pointer">
                            {NOTIFICATIONS}
                          </span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent side="right" className="p-0">
                        <div className="flex flex-col gap-[10px] py-4 bg-white rounded-lg text-xs leading-[18px]">
                          {NOTIFICATIONS_OPTIONS.map(option => (
                            <div
                              key={option.id}
                              className={`cursor-pointer px-4 ${option.value === group?.notificationSelect ? 'bg-success-light' : ''}`}
                              onClick={() =>
                                handleNotifications(
                                  group?.id,
                                  group?.verion,
                                  option.value,
                                )
                              }>
                              {i18n.get(option.title)}
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  {isMember ? (
                    <div
                      className="flex items-center gap-[10px] px-2"
                      onClick={() => handleExit(group)}>
                      <MdExitToApp className="w-4 h-4" />
                      <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                        {LEAVE_THIS_GROUP}
                      </span>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-[10px] px-2"
                      onClick={() => handleJoinGroup(group, userId)}>
                      <MdOutlineGroupAdd className="w-4 h-4" />
                      <span className="w-full text-xs leading-[18px] font-normal cursor-pointer">
                        {ASK_TO_JOIN}
                      </span>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default GroupActionList;

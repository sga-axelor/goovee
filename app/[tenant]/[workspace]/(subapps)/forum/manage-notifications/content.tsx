'use client';

import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';
import {ORDER_BY} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  GROUP_SORT_BY,
  GROUPS,
  MANAGE_NOTIFICATIONS,
  MENU,
  NOTIFICATIONS_OPTIONS,
  SORT_BY,
} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/constants';
import {
  GroupNotification,
  NavMenu,
  Search,
} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {findGroups} from '@/subapps/forum/common/action/action';
import {Group} from '@/subapps/forum/common/types/forum';
import {useEffect, useState} from 'react';

const Content = ({userId}: {userId: string}) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const [memberGroups, setMemberGroup] = useState<Group[]>([]);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(ORDER_BY.ASC);

  const handleMenuClick = (link: string) => {
    router.push(`${workspaceURI}/forum/${link}`);
  };
  const isLoggedIn = userId;

  useEffect(() => {
    isLoggedIn &&
      findGroups({
        id: userId,
        isMember: true,
        searchKey,
        orderBy: {
          forumGroup: {
            name: sortBy,
          },
        },
      }).then(setMemberGroup);
  }, [searchKey, sortBy]);

  const handleSearchKeyChange = (value: string) => {
    setSearchKey(value);
  };

  return (
    <>
      <div className="hidden lg:block">
        <NavMenu items={MENU} onClick={handleMenuClick} />
      </div>
      <section className="py-6 px-4 lg:px-[100px] w-full rounded-sm">
        <div>
          <h2 className="font-semibold text-xl mb-6">
            {i18n.get(MANAGE_NOTIFICATIONS)}
          </h2>
          <div className="grid grid-cols-[2fr_1fr] gap-4 h-fit items-end">
            <div>
              <Search onChange={handleSearchKeyChange} />
            </div>
            <div>
              <span className="pl-2 mb-3 text-muted-foreground">
                {i18n.get(SORT_BY)}:
                <div>
                  <Select onValueChange={value => setSortBy(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="A-Z" />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUP_SORT_BY.map(item => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          className="text-muted-foreground">
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 py-4 mt-8 rounded-md">
          <div className="grid grid-cols-[1fr_4fr]  ">
            <h2 className="text-xl font-semibold">{i18n.get(GROUPS)}</h2>
            <div className="grid grid-cols-4 text-center text-sm font-normal">
              {NOTIFICATIONS_OPTIONS.map(item => (
                <span key={item.id}>{item.title}</span>
              ))}
            </div>
          </div>
          <div className="my-4">
            {memberGroups.map(item => (
              <GroupNotification key={item.id} group={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Content;

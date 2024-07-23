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

// ---- LOCAL IMPORTS ---- //
import {
  GROUP_SORT_BY,
  MENU,
  NOTIFICATIONS_OPTION,
} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/constants';
import {
  Search,
  GroupNotification,
  NavMenu,
} from '@/app/[tenant]/[workspace]/(subapps)/forum/common/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

const Content = () => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleMenuClick = (link: string) => {
    router.push(`${workspaceURI}/forum/${link}`);
  };

  return (
    <>
      <div className="hidden lg:block">
        <NavMenu items={MENU} onClick={handleMenuClick} />
      </div>
      <section className="py-6 px-4 lg:px-[100px] w-full rounded-sm">
        <div>
          <h2 className="font-semibold text-xl mb-6">
            {i18n.get('Manage notifications')}
          </h2>
          <div className="grid grid-cols-[2fr_1fr] gap-4 h-fit items-end">
            <div>
              <Search />
            </div>
            <div>
              <span className="pl-2 mb-3 text-muted-foreground">
                {i18n.get('Sort By')}:
                <div>
                  <Select>
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
            <h2 className="text-xl font-semibold">{i18n.get('Groups')}</h2>
            <div className="grid grid-cols-4 text-center text-sm font-normal">
              {NOTIFICATIONS_OPTION.map(item => (
                <span key={item.id}>{item.title}</span>
              ))}
            </div>
          </div>
          <div className="my-4">
            <GroupNotification />
            <GroupNotification />
            <GroupNotification />
            <GroupNotification />
            <GroupNotification />
            <GroupNotification />
            <GroupNotification />
          </div>
        </div>
      </section>
    </>
  );
};

export default Content;

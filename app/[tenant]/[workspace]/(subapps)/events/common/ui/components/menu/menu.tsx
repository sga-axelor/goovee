'use client';

import {usePathname, useRouter} from 'next/navigation';
import {MdNotificationsNone} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Avatar, AvatarFallback, AvatarImage} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  MobileSidebar,
  CategoriesSidebar,
} from '@/subapps/events/common/ui/components';

export const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {workspaceURI} = useWorkspace();

  const toggleNotification = () => {
    if (pathname.includes('notifications')) {
      router.back();
    } else {
      router.push(`${workspaceURI}/notifications`);
    }
  };
  return (
    <nav className="bg-white z-50 fixed w-screen left-0 bottom-0 lg:hidden dark:bg-primary h-[4.5rem] px-8 pt-4 pb-6">
      <div className="max-w-screen-xs flex items-center justify-between mx-auto">
        <MobileSidebar />
        <CategoriesSidebar />
        <MdNotificationsNone
          className="cursor-pointer w-6 h-6"
          onClick={() => toggleNotification()}
        />
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src="/temp/user.png" />
          <AvatarFallback>GV</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

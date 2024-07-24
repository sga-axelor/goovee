'use client';

import {useCallback, useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {MdApps, MdNotificationsNone} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Sheet, SheetContent} from '@/ui/components/sheet/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import Icons from '@/utils/Icons';
import {SUBAPP_PAGE} from '@/constants';
import {Account} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

function MobileSidebar({subapps, workspaces}: any) {
  const pathname = usePathname();
  const {data: session} = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;

  const {workspaceURI, workspaceURL} = useWorkspace();
  const router = useRouter();

  const redirect = (value: any) => {
    router.push(value);
  };

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <>
      <MdApps onClick={openSidebar} className="cursor-pointer h-6 w-6" />
      <Sheet open={open} onOpenChange={closeSidebar}>
        <SheetContent side="left" className="bg-white divide-y divide-grey-1">
          {user && Boolean(workspaces?.length) && (
            <Select defaultValue={workspaceURL} onValueChange={redirect}>
              <SelectTrigger className="grow max-w-100 overflow-hidden px-6 py-2 mt-4 bg-none! h-[auto]">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace: any) => (
                  <SelectItem key={workspace.url} value={workspace.url}>
                    {workspace.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {subapps
            ?.filter((app: any) => app.installed && app.showInMySpace)
            .sort(
              (app1: any, app2: any) =>
                app1.orderForMySpaceMenu - app2.orderForMySpaceMenu,
            )
            .reverse()
            ?.map(({code, name, icon, color, background}: any) => {
              const page = SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || '';
              return (
                <Link
                  key={code}
                  href={`${workspaceURI}/${code}${page}`}
                  className="no-underline">
                  <div
                    className="flex items-center pt-8 px-6 py-2 font-normal gap-x-4"
                    key={code}>
                    <Icons
                      name={icon || 'app'}
                      className="h-6 w-6"
                      style={{color}}
                    />
                    <p className="max-w-full whitespace-nowrap text-main-black">
                      {name}
                    </p>
                  </div>
                </Link>
              );
            })}
        </SheetContent>
      </Sheet>
    </>
  );
}

export function MobileMenu({subapps, workspaces}: any) {
  const router = useRouter();
  const redirect = () => router.push('/notifications');

  return (
    <nav className="flex items-center w-screen fixed left-0 bottom-0 h-[72px] bg-white z-50 lg:hidden dark:bg-secondary px-8 pt-4 pb-6">
      <div className="flex items-center justify-between w-full">
        <MobileSidebar subapps={subapps} workspaces={workspaces} />
        {/** Render Subapp Menu using Portal */}
        <div id="subapp-menu" className="hidden" />
        <MdNotificationsNone
          className="cursor-pointer h-6 w-6"
          onClick={redirect}
        />
        <Account />
      </div>
    </nav>
  );
}

export default MobileMenu;

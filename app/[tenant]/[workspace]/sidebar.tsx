'use client';

import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {MdApps} from 'react-icons/md';
import {useSession} from 'next-auth/react';
import {cn} from '@/utils/css';
import Icons from '@/utils/Icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {SUBAPP_PAGE} from '@/constants';
import {useWorkspace} from './workspace-context';

export function Sidebar({
  subapps,
  workspaces,
}: {
  subapps: any;
  workspaces?: any;
}) {
  const {data: session} = useSession();
  const [collapsed, setCollapsed] = useState(true);
  const {workspaceURI, workspaceURL} = useWorkspace();

  const router = useRouter();

  const toggle = () => setCollapsed(c => !c);

  const redirect = (value: any) => {
    router.push(value);
  };

  if (!session?.user?.id) {
    return null;
  }

  return (
    <div
      className={cn(
        'hidden lg:block sticky left-0 top-0 h-full min-h-screen transition-all bg-secondary text-secondary-foreground w-60 py-3 px-6 shrink-0',
        {'w-14 py-3 px-4': collapsed},
      )}>
      <div className="flex items-center gap-4 mb-10">
        <MdApps
          className="h-6 w-6 cursor-pointer shrink-0"
          role="button"
          onClick={toggle}
        />
        {Boolean(workspaces?.length) && !collapsed && (
          <Select defaultValue={workspaceURL} onValueChange={redirect}>
            <SelectTrigger className="grow max-w-100 overflow-hidden p-0 border-0 bg-none! h-[auto]">
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
      </div>
      <div className="flex flex-col gap-6">
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
                <div className="flex gap-4 items-center" key={code}>
                  <Icons
                    name={icon || 'app'}
                    className="h-6 w-6"
                    style={{color}}
                  />
                  <p
                    className={`${
                      collapsed ? 'hidden' : 'block'
                    } whitespace-nowrap overflow-hidden duration-500`}>
                    {name}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

export default Sidebar;

'use client';

import {Fragment} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';
import {MdNotificationsNone} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Account,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/ui/components';
import {SUBAPP_CODES, SUBAPP_PAGE} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {Icon} from '@/ui/components';
import {PortalWorkspace} from '@/types';
import {useNavigationVisibility} from '@/ui/hooks';
import {useResponsive} from '@/ui/hooks';
import Cart from '@/app/[tenant]/[workspace]/cart';

function Logo() {
  const {workspaceURI, tenant} = useWorkspace();

  return (
    <Link
      href={`/?workspaceURI=${encodeURIComponent(workspaceURI || '')}&tenant=${encodeURIComponent(tenant || '')}`}>
      <Image
        src="/images/logo.png"
        alt="Axelor Logo"
        width={100}
        height={50}
        className="h-8 mr-4"
        style={{width: 'auto', height: 'auto'}}
      />
    </Link>
  );
}

function Notification() {
  const {workspaceURI} = useWorkspace();

  return (
    <Link href={`${workspaceURI}/notifications`} className="inline-flex">
      <MdNotificationsNone className="cursor-pointer text-foreground text-2xl" />
    </Link>
  );
}

export default function Header({
  subapps,
  isTopNavigation = false,
  workspaces,
}: {
  subapps: any;
  isTopNavigation?: boolean;
  workspaces?: PortalWorkspace[];
}) {
  const router = useRouter();
  const {data: session} = useSession();
  const user = session?.user;

  const {workspaceURI, workspaceURL, tenant} = useWorkspace();
  const {visible, loading} = useNavigationVisibility();
  const res: any = useResponsive();
  const isLarge = ['lg', 'xl', 'xxl'].some(x => res[x]);

  const redirect = (value: any) => router.push(value);

  const showTopNavigation = subapps?.length
    ? user
      ? isTopNavigation
      : (visible ?? true)
    : false;

  const shopSubapp = subapps?.find(
    (app: any) => app.code === SUBAPP_CODES.shop,
  );

  const shouldDisplayIcons = visible && !loading;
  const showCart = shopSubapp?.installed && shouldDisplayIcons;

  return (
    <>
      <div className="min-h-16 bg-background text-foreground px-6 py-2 flex items-center border-b border-border border-solid">
        <Logo />

        <div className="grow" />
        {isLarge && (
          <div className="flex items-center gap-8">
            {shouldDisplayIcons &&
              subapps
                .filter((app: any) => app.installed && app.showInTopMenu)
                .sort(
                  (app1: any, app2: any) =>
                    app1.orderForTopMenu - app2.orderForTopMenu,
                )
                .reverse()
                .map(({name, icon, code, color}: any) => {
                  const page =
                    SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || '';
                  return (
                    <Link key={code} href={`${workspaceURI}/${code}${page}`}>
                      {icon ? (
                        <Icon name={icon} className="h-6 w-6" style={{color}} />
                      ) : (
                        <p className="font-medium">{name}</p>
                      )}
                    </Link>
                  );
                })}
            {false && <Notification />}
            {showCart && <Cart />}
            <Account baseURL={workspaceURI} tenant={tenant} />
          </div>
        )}
      </div>

      {showTopNavigation && !loading ? (
        <div className="bg-background text-foreground px-6 py-4 hidden lg:flex items-center justify-between border-b border-border border-solid max-w-full gap-10">
          <div>
            {Boolean(workspaces?.length) && user && (
              <Select defaultValue={workspaceURL} onValueChange={redirect}>
                <SelectTrigger className="grow max-w-100 overflow-hidden p-0 border-0 bg-none! h-[auto]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces?.map(workspace => (
                    <SelectItem key={workspace.url} value={workspace.url}>
                      {workspace.name || workspace.url}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex gap-10 w-100 max-w-full overflow-x-auto">
            {subapps
              ?.filter((app: any) => app.installed)
              .sort(
                (app1: any, app2: any) =>
                  app1.orderForTopMenu - app2.orderForTopMenu,
              )
              .reverse()
              .map(({code, name}: any, i: any) => {
                const page =
                  SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || '';
                return (
                  <Fragment key={code}>
                    {i !== 0 && (
                      <Separator
                        className="bg-black w-[2px] shrink-0 h-auto"
                        orientation="vertical"
                      />
                    )}
                    <Link href={`${workspaceURI}/${code}${page}`}>
                      <div key={code} className="font-medium">
                        {name}
                      </div>
                    </Link>
                  </Fragment>
                );
              })}
          </div>
        </div>
      ) : null}
    </>
  );
}

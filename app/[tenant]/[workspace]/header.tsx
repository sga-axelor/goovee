'use client';

import {Fragment} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';
import {MdNotificationsNone, MdOutlineShoppingCart} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Account,
  Separator,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/ui/components';
import {SUBAPP_PAGE} from '@/constants';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import Icons from '@/utils/Icons';

// ---- LOCAL IMPORTS ---- //
import styles from './styles.module.scss';

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

function Cart() {
  const {cart} = useCart();
  const {workspaceURI} = useWorkspace();
  const count = cart?.items?.reduce(
    (count: number, i: any) => count + Number(i.quantity),
    0,
  );

  return (
    <Link href={`${workspaceURI}/shop/cart`} className="flex relative">
      <MdOutlineShoppingCart className="cursor-pointer text-foreground text-2xl" />
      {count ? (
        <Badge className={`${styles.badge} rounded bg-primary`}>{count}</Badge>
      ) : null}
    </Link>
  );
}

export default function Header({
  subapps,
  hideTopNavigation,
  workspaces,
}: {
  subapps: any;
  hideTopNavigation?: boolean;
  workspaces?: any;
}) {
  const router = useRouter();
  const {data: session} = useSession();
  const user = session?.user;

  const {workspaceURI, workspaceURL, tenant} = useWorkspace();

  const redirect = (value: any) => {
    router.push(value);
  };

  let showTopNavigation = false;

  if (subapps?.length) {
    if (user) {
      showTopNavigation = !hideTopNavigation;
    } else {
      showTopNavigation = true;
    }
  }

  return (
    <>
      <div className="bg-background text-foreground px-6 py-2 flex items-center border-b border-border border-solid">
        <Logo />

        <div className="grow" />
        <div className="flex items-center gap-8">
          {subapps
            .filter((app: any) => app.installed && app.showInTopMenu)
            .sort(
              (app1: any, app2: any) =>
                app1.orderForTopMenu - app2.orderForTopMenu,
            )
            .reverse()
            .map(({name, icon, code, color}: any) => {
              const page = SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || '';
              return (
                <Link key={code} href={`${workspaceURI}/${code}${page}`}>
                  {icon ? (
                    <Icons name={icon} className="h-6 w-6" style={{color}} />
                  ) : (
                    <p className="font-medium">{name}</p>
                  )}
                </Link>
              );
            })}
          <Notification />
          <Cart />
          <Account baseURL={workspaceURI} tenant={tenant} />
        </div>
      </div>
      {showTopNavigation ? (
        <div className="bg-background text-foreground px-6 py-4 hidden lg:flex items-center justify-between border-b border-border border-solid max-w-full gap-10">
          <div>
            {Boolean(workspaces?.length) && user && (
              <Select defaultValue={workspaceURL} onValueChange={redirect}>
                <SelectTrigger className="grow max-w-100 overflow-hidden p-0 border-0 bg-none! h-[auto]">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace: any) => (
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
              .map(({code, name, icon, color, background}: any, i: any) => {
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

'use client';
import Link from 'next/link';
import {Badge} from '@ui/components/badge';
import {MdOutlineShoppingCart} from 'react-icons/md';
import {MdNotificationsNone} from 'react-icons/md';
// ---- CORE IMPORTS ---- //
import {Account} from '@ui/components/index';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {SUBAPP_PAGE} from '@/constants';
// ---- LOCAL IMPORTS ---- //
import styles from './styles.module.scss';
import {useWorkspace} from './workspace-context';
import Image from 'next/image';

function Logo() {
  const {workspaceURI} = useWorkspace();
  return (
    <Link href={`/?workspaceURI=${workspaceURI}`}>
      <Image
        src="/images/logo.png"
        alt="Axelor Logo"
        width={100}
        height={50}
        className="h-8 mr-4"
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
        <Badge className={`${styles.badge} rounded bg-black`}>{count}</Badge>
      ) : null}
    </Link>
  );
}

export default function Header({subapps}: {subapps: any}) {
  const {workspaceURI} = useWorkspace();
  return (
    <div className="bg-background px-6 py-2 flex items-center">
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
          .map(({name, icon, code}: any) => {
            const page = SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || '';
            return (
              <Link key={code} href={`${workspaceURI}/${code}${page}`}>
                <div className="inline-block" title={name}>
                  {icon ? null : <p className="mb-0">{name}</p>}
                </div>
              </Link>
            );
          })}
        <Notification />
        <Cart />
        <Account baseURL={workspaceURI} />
      </div>
    </div>
  );
}

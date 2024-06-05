'use client';

import Link from 'next/link';
import {Badge, Box} from '@axelor/ui';
import {MaterialIcon, MaterialIconProps} from '@axelor/ui/icons/material-icon';

// ---- CORE IMPORTS ---- //
import {Account} from '@/ui/components';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {SUBAPP_PAGE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import styles from './styles.module.scss';
import {useWorkspace} from './workspace-context';

function BadgeIcon({
  count,
  ...props
}: MaterialIconProps & {
  count?: number;
}) {
  return (
    <Box as="span" d="flex" position="relative">
      <MaterialIcon {...props} className="text-foreground" />
      {count ? (
        <Badge rounded bg="black" className={styles.badge}>
          {count}
        </Badge>
      ) : null}
    </Box>
  );
}

function Logo() {
  const {workspaceURI} = useWorkspace();
  return (
    <Link href={`/?workspaceURI=${workspaceURI}`}>
      <Box
        as="img"
        src="/images/logo.png"
        alt="Axelor Logo"
        className="h-8 mr-4"
      />
    </Link>
  );
}

function Notification() {
  const {workspaceURI} = useWorkspace();

  return (
    <Link href={`${workspaceURI}/notifications`} className="inline-flex">
      <MaterialIcon
        icon="notifications"
        className="cursor-pointer text-foreground"
      />
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
    <Link href={`${workspaceURI}/shop/cart`} className="inline-flex">
      <Box
        as={BadgeIcon}
        count={count}
        icon="shopping_cart"
        className="cursor-pointer text-foreground"
      />
    </Link>
  );
}

export default function Header({subapps}: {subapps: any}) {
  const {workspaceURI} = useWorkspace();

  return (
    <Box className="bg-background px-6 py-2 flex items-center">
      <Logo />
      <Box flexGrow={1} />
      <Box className="flex items-center gap-8">
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
                <Box d="inline-block" title={name}>
                  {icon ? (
                    <MaterialIcon
                      icon={icon as any}
                      className="cursor-pointer text-foreground"
                    />
                  ) : (
                    <Box as="p" mb={0}>
                      {name}
                    </Box>
                  )}
                </Box>
              </Link>
            );
          })}
        <Notification />
        <Cart />
        <Account baseURL={workspaceURI} />
      </Box>
    </Box>
  );
}

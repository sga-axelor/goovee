"use client";

import Link from "next/link";
import { Badge, Box } from "@axelor/ui";
import {
  MaterialIcon,
  MaterialIconProps,
} from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { Account } from "@/ui/components";
import { useCart } from "@/app/[tenant]/[workspace]/cart-context";
import { SUBAPP_PAGE } from "@/constants";

// ---- LOCAL IMPORTS ---- //
import styles from "./styles.module.scss";
import { useWorkspace } from "./workspace-context";

function BadgeIcon({
  count,
  ...props
}: MaterialIconProps & {
  count?: number;
}) {
  return (
    <Box as="span" d="flex" position="relative">
      <MaterialIcon {...props} />
      {count ? (
        <Badge rounded bg="black" className={styles.badge}>
          {count}
        </Badge>
      ) : null}
    </Box>
  );
}

function Logo() {
  const { workspaceURI } = useWorkspace();
  return (
    <Link href={`/?workspaceURI=${workspaceURI}`}>
      <Box
        as="img"
        src="/images/logo.png"
        alt="Axelor Logo"
        height="40"
        me={3}
      />
    </Link>
  );
}

function Notification() {
  const { workspaceURI } = useWorkspace();

  return (
    <Link href={`${workspaceURI}/notifications`}>
      <Box d="inline-block">
        <MaterialIcon icon="notifications" className="pointer" />
      </Box>
    </Link>
  );
}

function Cart() {
  const { cart } = useCart();
  const { workspaceURI } = useWorkspace();

  const count = cart?.items?.reduce(
    (count: number, i: any) => count + Number(i.quantity),
    0
  );

  return (
    <Link href={`${workspaceURI}/shop/cart`}>
      <Box d="inline-block">
        <Box
          as={BadgeIcon}
          count={count}
          icon="shopping_cart"
          className="pointer"
        />
      </Box>
    </Link>
  );
}

export default function Header({ subapps }: { subapps: any }) {
  const { workspaceURI } = useWorkspace();

  return (
    <Box shadow d="flex" alignItems="center" bg="white" p={3} px={5}>
      <Logo />
      <Box flexGrow={1} />
      <Box d="flex" alignItems="center" gap="1rem">
        {subapps
          .filter((app: any) => app.installed && app.showInTopMenu)
          .sort(
            (app1: any, app2: any) =>
              app1.orderForTopMenu - app2.orderForTopMenu
          )
          .reverse()
          .map(({ name, icon, code }: any) => {
            const page = SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || "";
            return (
              <Link key={code} href={`${workspaceURI}/${code}${page}`}>
                <Box d="inline-block" title={name}>
                  {icon ? (
                    <MaterialIcon icon={icon as any} className="pointer" />
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

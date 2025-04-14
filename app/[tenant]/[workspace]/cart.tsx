'use client';

import Link from 'next/link';
import {MdOutlineShoppingCart} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import styles from './styles.module.scss';

export default function Cart() {
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

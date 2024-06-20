'use client';

import {useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {Button} from '@ui/components/button';
// ---- CORE IMPORTS ---- //
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import type {PortalWorkspace} from '@/types';
// ---- LOCAL IMPORTS ---- //
import {requestQuotation} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/actions/cart';
export default function Content({workspace}: {workspace: PortalWorkspace}) {
  const {clearCart, cart} = useCart();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  useEffect(() => {
    const request = async () => {
      const $cart = await requestQuotation({cart, workspace});
      if (!$cart) {
        alert('Error creating quotation. Try again.');
        router.replace(`${workspaceURI}/shop/cart`);
      } else {
        clearCart();
      }
    };

    request();
  }, [cart, clearCart, router, workspace, workspaceURI]);

  return (
    <div className="shadow bg-card text-card-foreground rounded-lg p-12">
      <h4 className="text-success">{i18n.get('Quotation Requested')}</h4>
      <Link href={`${workspaceURI}/shop`}>
        <Button className="rounded-full mt-4">
          {i18n.get('Continue Shopping')}
        </Button>
      </Link>
    </div>
  );
}

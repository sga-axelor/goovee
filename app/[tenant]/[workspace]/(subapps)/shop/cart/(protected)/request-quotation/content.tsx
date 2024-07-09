'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {MdOutlineRefresh} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {useToast} from '@/ui/hooks';
import type {PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {requestQuotation} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/actions/cart';
import {Dialog, DialogContent, DialogTitle} from '@/ui/components';

export default function Content({
  workspace,
  quotationSubapp,
}: {
  workspace: PortalWorkspace;
  quotationSubapp?: boolean;
}) {
  const {clearCart, cart} = useCart();
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {toast} = useToast();

  useEffect(() => {
    const request = async () => {
      const res = await requestQuotation({cart, workspace});

      if (res?.data) {
        toast({
          variant: 'success',
          title: i18n.get('Quotation requested successfully'),
        });

        clearCart();

        if (quotationSubapp) {
          router.replace(`${workspaceURI}/quotations/${res.data}`);
        } else {
          router.replace(`${workspaceURI}/shop`);
        }
      } else {
        toast({
          variant: 'destructive',
          title: i18n.get('Error requesting quotation, try again !'),
        });
        router.replace(`${workspaceURI}/shop/cart`);
      }
    };

    request();
  }, []);

  return (
    <>
      <Dialog open>
        <DialogTitle></DialogTitle>
        <DialogContent className="w-40 flex items-center justify-center">
          <MdOutlineRefresh className="h-6 w-6 animate-spin" />
        </DialogContent>
      </Dialog>
    </>
  );
}

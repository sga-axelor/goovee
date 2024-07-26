'use server';

import axios from 'axios';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {clone} from '@/utils';
import {computeTotal} from '@/utils/cart';
import type {PortalWorkspace, Product, User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findProduct as $findProduct} from '@/app/[tenant]/[workspace]/(subapps)/shop/common/orm/product';

export async function findProduct({
  id,
  workspace,
  user,
}: {
  id: Product['id'];
  workspace?: PortalWorkspace;
  user?: User;
}) {
  return await $findProduct({
    id,
    workspace,
    user,
  }).then(clone);
}

export async function requestQuotation({
  cart,
  workspace,
}: {
  cart: any;
  workspace: PortalWorkspace;
}) {
  const aos = process.env.NEXT_PUBLIC_AOS_URL;

  if (!aos) return null;

  if (!cart?.items?.length) return null;

  const ws = `${aos}/ws/portal/orders/quotation`;

  const session = await getSession();
  const user = session?.user;

  if (!(session && workspace && workspace.config)) return null;

  try {
    const computedProducts = await Promise.all(
      cart.items.map((i: any) => findProduct({id: i.product, workspace, user})),
    );

    const $cart = {
      ...cart,
      items: [
        ...cart?.items?.map((i: any) => ({
          ...i,
          computedProduct: computedProducts.find(
            cp => Number(cp?.product?.id) === Number(i.product),
          ),
        })),
      ],
    };

    const {total} = computeTotal({cart: $cart, workspace});

    let partnerId, contactId;

    if (user) {
      const {id, isContact, mainPartnerId} = user;
      if (isContact && mainPartnerId) {
        partnerId = mainPartnerId;
        contactId = id;
      } else {
        partnerId = id;
      }
    }

    const payload = {
      partnerId,
      contactId,
      shipping: 0,
      total,
      inAti: workspace?.config?.mainPrice === 'ati',
      items: $cart.items.map((i: any) => {
        const {computedProduct, note, quantity} = i;
        if (!computedProduct) return null;
        const {product, price} = computedProduct;
        return {
          productId: product?.id,
          note: note || '',
          quantity,
          price: price?.ati,
        };
      }),
    };

    const res = await axios.post(ws, payload, {
      auth: {
        username: process.env.BASIC_AUTH_USERNAME as string,
        password: process.env.BASIC_AUTH_PASSWORD as string,
      },
    });

    if (res?.data?.status === -1) {
      return null;
    }

    return res?.data;
  } catch (err) {
    return null;
  }
}

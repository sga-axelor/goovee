'use server';

import axios from 'axios';
import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {clone} from '@/utils';
import {computeTotal} from '@/utils/cart';
import {TENANT_HEADER} from '@/middleware';
import {manager} from '@/tenant';
import type {ID, PortalWorkspace, Product, User} from '@/types';

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
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return null;
  }

  return await $findProduct({
    id,
    workspace,
    user,
    tenantId,
  }).then(clone);
}

export async function requestQuotation({
  cart,
  workspace,
}: {
  cart: any;
  workspace: PortalWorkspace;
}) {
  return requestOrder({
    cart,
    workspace,
    type: 'quotation',
  });
}

export async function requestOrder({
  cart,
  workspace,
  type = 'order',
}: {
  cart: any;
  workspace: PortalWorkspace;
  type?: 'quotation' | 'order';
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return null;
  }

  if (!cart?.items?.length) return null;

  const tenant = await manager.getTenant(tenantId);

  if (!tenant?.config?.aos?.url) return null;

  const {aos} = tenant.config;

  const ws = `${aos.url}/ws/portal/orders/${type}`;

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
        username: aos.auth.username,
        password: aos.auth.password,
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

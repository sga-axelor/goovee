import axios from 'axios';
import type {Cloned} from '@/types/util';

// ---- CORE IMPORTS ---- //
import {MAIN_PRICE} from '@/constants';
import {t} from '@/locale/server';
import type {Tenant} from '@/tenant';
import type {Client} from '@/goovee/.generated/client';
import {PortalWorkspace} from '@/orm/workspace';
import {computeTotal} from '@/utils/cart';
import {calculateAdvanceAmount} from '@/utils/payment';

// ---- LOCAL IMPORTS ---- //
import {findProduct} from '@/subapps/shop/common/orm/product';

export const formatNumber = (n: any) => n;

export async function createOrder({
  cart,
  workspace,
  user,
  client,
  config,
  paymentModeId,
}: {
  cart: any;
  workspace: PortalWorkspace | Cloned<PortalWorkspace>;
  user: NonNullable<any>;
  client: Client;
  config: Tenant['config'];
  paymentModeId?: string;
}) {
  const {aos} = config;
  const ws = `${aos.url}/ws/portal/orders/order`;

  const computedProducts = await Promise.all(
    cart.items.map((i: any) =>
      findProduct({id: i.product, workspace, user, client}),
    ),
  );

  const $cart = {
    ...cart,
    items: cart.items.map((i: any) => ({
      ...i,
      computedProduct: computedProducts.find(
        cp => Number(cp?.product?.id) === Number(i.product),
      ),
    })),
  };

  const {total} = computeTotal({cart: $cart, workspace, formatNumber});

  const {id, isContact, mainPartnerId} = user;
  const partnerId = isContact && mainPartnerId ? mainPartnerId : id;
  const contactId = isContact && mainPartnerId ? id : undefined;

  const {invoicingAddress, deliveryAddress} = cart;
  const payInAdvance = workspace.config?.payInAdvance;
  const advancePaymentPercentage = workspace.config?.advancePaymentPercentage;

  const paidAmount =
    payInAdvance && Number(advancePaymentPercentage) > 0
      ? calculateAdvanceAmount({
          amount: Number(total),
          percentage: Number(advancePaymentPercentage),
          payInAdvance,
        }).toString()
      : Number(total).toString();

  const isAtiPricing = workspace?.config?.mainPrice === MAIN_PRICE.ATI;

  const payload = {
    partnerId,
    contactId,
    shipping: 0,
    total,
    inAti: isAtiPricing,
    items: $cart.items.map((i: any) => {
      const {computedProduct, note, quantity} = i;
      if (!computedProduct) return null;
      const {product, price} = computedProduct;
      return {
        productId: product?.id,
        note: note || '',
        quantity,
        price: isAtiPricing ? price?.ati : price?.wt,
      };
    }),
    workspaceId: workspace.id,
    invocingPartnerAddressId: invoicingAddress,
    deliveryPartnerAddressId: deliveryAddress,
    paidAmount,
    paymentModeId,
  };

  const res = await axios.post(ws, payload, {
    auth: {username: aos.auth.username, password: aos.auth.password},
  });

  if (res?.data?.status === -1) {
    throw new Error(
      res?.data?.message
        ? await t(res.data.message)
        : await t('Order creation failed. Please try again.'),
    );
  }

  return res?.data;
}

export function computeExpectedAmount({
  total,
  workspace,
}: {
  total: number | string;
  workspace: PortalWorkspace | Cloned<PortalWorkspace>;
}): string {
  const payInAdvance = workspace.config?.payInAdvance;
  const advancePaymentPercentage = workspace.config?.advancePaymentPercentage;

  if (
    payInAdvance &&
    advancePaymentPercentage &&
    Number(advancePaymentPercentage) > 0
  ) {
    return calculateAdvanceAmount({
      amount: Number(total),
      percentage: Number(advancePaymentPercentage),
      payInAdvance,
    }).toString();
  }

  return total.toString();
}

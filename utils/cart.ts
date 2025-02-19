// ---- CORE IMPORTS ---- //

import {scale} from '@/utils';
import {
  DEFAULT_CURRENCY_CODE,
  DEFAULT_CURRENCY_SCALE,
  DEFAULT_CURRENCY_SYMBOL,
} from '@/constants';
import type {
  Cart,
  ComputedProduct,
  PortalAppConfig,
  PortalWorkspace,
} from '@/types';
import {formatNumber} from '@/locale/formatters';

export function computeTotal({
  cart,
  workspace,
}: {
  cart: Cart;
  workspace?: PortalWorkspace;
}) {
  let mainPrice: PortalAppConfig['mainPrice'] = 'at';

  if (workspace?.config?.mainPrice) {
    mainPrice = workspace?.config?.mainPrice;
  }

  let {subtotal, tax} = cart?.items?.reduce(
    (acc, i) => {
      const {computedProduct, quantity} = i as unknown as {
        computedProduct: ComputedProduct;
        quantity: string | number;
      };

      if (!computedProduct) return acc;

      const {
        price,
        scale: {currency: currencyScale},
      } = computedProduct;
      const {ati = 0, wt = 0} = price;
      const tax = Number(ati) - Number(wt);

      acc.tax += Number(scale(Number(tax) * Number(quantity), currencyScale));
      acc.subtotal += Number(
        scale(Number(wt) * Number(quantity), currencyScale),
      );

      return acc;
    },
    {
      subtotal: 0,
      tax: 0,
    } as {subtotal: number; tax: number},
  );

  const firstItem = (cart?.items?.[0] as any)?.computedProduct;

  const {
    scale: {currency: currencyScale},
    currency: {symbol, code},
  } = firstItem || {
    scale: {
      currency: DEFAULT_CURRENCY_SCALE,
    },
    currency: {
      code: DEFAULT_CURRENCY_CODE,
      symbol: DEFAULT_CURRENCY_SYMBOL,
    },
  };

  let total = scale(
    mainPrice === 'wt' ? subtotal : subtotal + tax,
    currencyScale,
  );

  return {
    total,
    displayTotal: `${formatNumber(total, {scale: currencyScale, currency: symbol, type: 'DECIMAL'})} ${mainPrice.toUpperCase()}`,
    scale: {
      currency: currencyScale,
    },
    currency: {
      symbol,
      code,
    },
  };
}

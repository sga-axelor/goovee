import axios from 'axios';

// ---- CORE IMPORTS ---- //
import type {Product, PortalWorkspace, User} from '@/types';
import {manager, type Tenant} from '@/tenant';

type WSProduct = {
  productId: number;
  prices: [{type: 'WT'; price: string}, {type: 'ATI'; price: string}];
  currency: {currencyId: number; code: string; name: string; symbol: string};
  unit: {name: string; labelToPrinting: string};
  errorMessage?: never;
};

type WSError = {
  productId: number;
  errorMessage: string;
  prices?: never;
  currency?: never;
  unit?: never;
};
type WSObject = WSProduct | WSError;

export async function findProductsFromWS({
  workspace,
  user,
  productList,
  tenantId,
}: {
  workspace: PortalWorkspace;
  user?: User;
  productList: Array<{productId: Product['id']}>;
  tenantId: Tenant['id'];
}): Promise<WSObject[]> {
  if (!workspace?.config?.company?.id && user && productList && tenantId) {
    return [];
  }

  const tenant = await manager.getTenant(tenantId);

  if (!tenant?.config?.aos?.url) {
    return [];
  }

  const {aos} = tenant.config;

  const ws = `${aos.url}/ws/aos/product/price`;

  try {
    const res = await axios
      .post(
        ws,
        {
          productList,
          partnerId: user?.id,
          companyId: workspace?.config?.company?.id,
        },
        {
          auth: {
            username: aos.auth.username,
            password: aos.auth.password,
          },
        },
      )
      .then(({data}) => data);

    if (res?.data?.status === -1) {
      return [];
    }

    return res?.object || [];
  } catch (err) {
    return [];
  }
}

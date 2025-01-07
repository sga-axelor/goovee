// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {
  DEFAULT_CURRENCY_SCALE,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_PAGE,
} from '@/constants';
import {getFormattedValue, getPageInfo, getSkipInfo, scale} from '@/utils';
import {formatDate, formatNumber} from '@/locale/server/formatters';
import type {Partner, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {ORDER_STATUS} from '@/subapps/orders/common/constants/orders';
import type {Order} from '@/subapps/orders/common/types/orders';

const fetchOrders = async ({
  archived = false,
  params = {},
  tenantId,
  workspaceURL,
}: {
  archived?: boolean;
  params?: {
    where?: object & {
      clientPartner?: {
        id: Partner['id'];
      };
    };
    limit?: string | number;
    page?: string | number;
  };
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
}) => {
  const {page = DEFAULT_PAGE, limit, where = {}} = params;
  const {id: clientPartnerId} = where.clientPartner || {};

  if (!(clientPartnerId && tenantId && workspaceURL)) return null;

  const client = await manager.getClient(tenantId);

  const whereClause: any = {
    ...where,
    portalWorkspace: {
      url: workspaceURL,
    },
  };

  if (archived) {
    whereClause.OR = [
      {
        archived: {
          eq: true,
        },
      },
      {
        statusSelect: {
          eq: ORDER_STATUS.CLOSED,
        },
      },
    ];
  } else {
    whereClause.template = false;
    whereClause.statusSelect = ORDER_STATUS.CONFIRMED;
  }
  const skip = getSkipInfo(limit, page);

  const $orders = await client.aOSOrder
    .find({
      where: whereClause,
      take: limit as any,
      ...(skip ? {skip: skip as any} : {}),
      select: {
        saleOrderSeq: true,
        statusSelect: true,
        deliveryState: true,
        createdOn: true,
        inTaxTotal: true,
        exTaxTotal: true,
        currency: true,
      },
    })
    .catch((err: any) => {
      return [];
    });

  const orders: any = [];

  for (const order of $orders) {
    const {inTaxTotal, exTaxTotal, currency} = order;
    const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
    const unit = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

    const $order = {
      ...order,
      createdOn: await formatDate(order?.createdOn!),
      exTaxTotal: await formatNumber(exTaxTotal, {
        scale: unit,
        currency: currencySymbol,
      }),
      inTaxTotal: await formatNumber(inTaxTotal, {
        scale: unit,
        currency: currencySymbol,
      }),
    };

    orders.push($order);
  }

  const pageInfo = getPageInfo({
    count: orders?.[0]?._count,
    page,
    limit,
  });

  return {
    orders,
    pageInfo,
  };
};

export async function findOngoingOrders({
  params,
  tenantId,
  workspaceURL,
}: {
  params?: any;
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
}): Promise<any> {
  return await fetchOrders({
    params,
    tenantId,
    workspaceURL,
  });
}

export async function findArchivedOrders({
  params,
  tenantId,
  workspaceURL,
}: {
  params?: {
    where?: object & {
      partner?: {
        id: Partner['id'];
      };
    };
    limit?: string | number;
    page?: string | number;
  };
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
}): Promise<any> {
  return await fetchOrders({
    archived: true,
    params,
    tenantId,
    workspaceURL,
  });
}

export async function findOrder({
  id,
  tenantId,
  workspaceURL,
  params,
  archived,
}: {
  id: Order['id'];
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
  params?: any;
  archived?: boolean;
}) {
  if (!(tenantId && workspaceURL)) return null;

  const client = await manager.getClient(tenantId);

  const whereClause = {
    id,
    ...params?.where,
    portalWorkspace: {
      url: workspaceURL,
    },
  };

  if (archived) {
    whereClause.OR = [
      {
        archived: {
          eq: true,
        },
      },
      {
        statusSelect: {
          eq: ORDER_STATUS.CLOSED,
        },
      },
    ];
  } else {
    whereClause.template = false;
    whereClause.statusSelect = ORDER_STATUS.CONFIRMED;
  }

  const order: any = await client.aOSOrder.findOne({
    where: whereClause,
    select: {
      saleOrderSeq: true,
      inTaxTotal: true,
      exTaxTotal: true,
      createdOn: true,
      statusSelect: true,
      deliveryState: true,
      shipmentMode: {
        name: true,
      },
      clientPartner: {
        fullName: true,
      },
      company: {
        name: true,
      },
      mainInvoicingAddress: {
        zip: true,
        addressl4: true,
        addressl6: true,
        country: {
          name: true,
        },
      },
      deliveryAddress: {
        zip: true,
        addressl4: true,
        addressl6: true,
        country: {
          name: true,
        },
      },
      saleOrderLineList: {
        select: {
          productName: true,
          qty: true,
          unit: {
            name: true,
          },
          price: true,
          exTaxTotal: true,
          discountAmount: true,
          inTaxTotal: true,
          product: {
            picture: {
              id: true,
            },
          },
          taxLineSet: {
            select: {
              name: true,
              value: true,
            },
          },
        },
      },
      currency: {
        code: true,
        numberOfDecimals: true,
        symbol: true,
      },
    },
  });

  if (!order) {
    return null;
  }

  const {currency, exTaxTotal, inTaxTotal, saleOrderLineList} = order;
  const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
  const scale = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

  const sumOfDiscounts = saleOrderLineList.reduce(
    (total: number, {discountAmount}: any) => {
      return total + parseFloat(discountAmount);
    },
    0,
  );
  const totalDiscount =
    sumOfDiscounts === 0
      ? 0
      : ((100 * sumOfDiscounts) / (sumOfDiscounts + +exTaxTotal)).toFixed(
          currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE,
        );

  const $saleOrderLineList: any = [];

  for (const list of saleOrderLineList || []) {
    const line = {
      ...list,
      qty: await formatNumber(list.qty, {scale}),
      price: await formatNumber(list.price, {
        scale,
        currency: currencySymbol,
      }),
      exTaxTotal: await formatNumber(list.exTaxTotal, {
        scale,
        currency: currencySymbol,
      }),
      discountAmount: await formatNumber(list.discountAmount, scale),
      inTaxTotal: await formatNumber(list.inTaxTotal, {
        scale,
        currency: currencySymbol,
      }),
    };
    $saleOrderLineList.push(line);
  }

  return {
    ...order,
    createdOn: await formatDate(order?.createdOn!),
    exTaxTotal: await formatNumber(exTaxTotal, {
      scale,
      currency: currencySymbol,
    }),
    inTaxTotal: await formatNumber(inTaxTotal, {
      scale,
      currency: currencySymbol,
    }),
    saleOrderLineList: $saleOrderLineList,
    totalDiscount,
  };
}

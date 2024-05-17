// ---- CORE IMPORTS ---- //
import { client } from "@/globals";
import { DEFAULT_CURRENCY_SCALE, DEFAULT_CURRENCY_SYMBOL } from "@/constants";
import type { Partner } from "@/types";
import { getFormattedValue, getPageInfo, getSkipInfo, scale } from "@/utils";

// ---- LOCAL IMPORTS ---- //
import { ORDER_STATUS } from "@/subapps/orders/common/constants/orders";
import type { Order } from "@/subapps/orders/common/types/orders";

const fetchOrders = async ({
  partnerId,
  archived = false,
  page,
  limit,
  skip,
  where,
}: {
  partnerId?: Partner["id"];
  archived?: boolean;
  limit?: string | number;
  page?: string | number;
  skip?: boolean | number;
  where?: any;
}) => {
  if (!partnerId) return null;

  const c = await client;

  const whereClause: any = {
    ...where,
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

  const $orders = await c.aOSOrder
    .find({
      where: whereClause,
      take: limit,
      ...(skip ? { skip } : {}),
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

  const orders = $orders.map((order: any) => {
    const { inTaxTotal, exTaxTotal, currency } = order;
    const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
    const unit = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;
    return {
      ...order,
      exTaxTotal: getFormattedValue(exTaxTotal, unit, currencySymbol),
      inTaxTotal: getFormattedValue(inTaxTotal, unit, currencySymbol),
    };
  });

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
  partnerId,
  where,
  page = 1,
  limit,
}: {
  partnerId?: string | number;
  page?: string | number;
  limit?: string | number;
  where?: any;
}): Promise<any> {
  const skip = getSkipInfo(limit, page);

  return await fetchOrders({ partnerId, page, limit, skip, where });
}

export async function findArchivedOrders({
  partnerId,
  page = 1,
  limit,
  where,
}: {
  partnerId?: string | number;
  page?: string | number;
  limit?: string | number;
  where?: any;
}): Promise<any> {
  const skip = getSkipInfo(limit, page);

  return await fetchOrders({
    partnerId,
    archived: true,
    page,
    limit,
    skip,
    where,
  });
}

export async function findOrder(id: Order["id"]) {
  const c = await client;
  const order = await c.aOSOrder.findOne({
    where: {
      id,
    },
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
        addressl7country: {
          name: true,
        },
      },
      deliveryAddress: {
        zip: true,
        addressl4: true,
        addressl6: true,
        addressl7country: {
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
          taxLine: {
            name: true,
            value: true,
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

  const { currency, exTaxTotal, inTaxTotal, saleOrderLineList } = order;
  const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
  const unit = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

  const sumOfDiscounts = saleOrderLineList.reduce(
    (total: number, { discountAmount }: any) => {
      return total + parseFloat(discountAmount);
    },
    0
  );
  const totalDiscount =
    sumOfDiscounts === 0
      ? 0
      : ((100 * sumOfDiscounts) / (sumOfDiscounts + +exTaxTotal)).toFixed(
          currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE
        );

  return {
    ...order,
    exTaxTotal: getFormattedValue(exTaxTotal, unit, currencySymbol),
    inTaxTotal: getFormattedValue(inTaxTotal, unit, currencySymbol),
    saleOrderLineList: saleOrderLineList.map((list: any) => {
      return {
        ...list,
        qty: getFormattedValue(list.qty, unit, currencySymbol),
        price: getFormattedValue(list.price, unit, currencySymbol),
        exTaxTotal: getFormattedValue(list.exTaxTotal, unit, currencySymbol),
        discountAmount: scale(list.discountAmount, unit),
        inTaxTotal: getFormattedValue(list.inTaxTotal, unit, currencySymbol),
      };
    }),
    totalDiscount,
  };
}

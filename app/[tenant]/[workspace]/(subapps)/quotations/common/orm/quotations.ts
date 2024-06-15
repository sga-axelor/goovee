// ---- CORE IMPORTS ---- //
import {client} from '@/globals';
import {DEFAULT_CURRENCY_SCALE, DEFAULT_CURRENCY_SYMBOL} from '@/constants';
import {getFormattedValue, getPageInfo, getSkipInfo, scale} from '@/utils';
import type {ID} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';

export const RELATED_MODELS = {
  SALE_ORDER_MODEL: 'com.axelor.apps.sale.db.SaleOrder',
};

export const fetchQuotations = async ({
  page,
  limit,
  partnerId,
  where,
}: {
  archived?: boolean;
  limit?: string | number;
  page?: string | number;
  partnerId?: ID;
  where?: any;
}) => {
  const c = await client;
  const skip = getSkipInfo(limit, page);

  const whereClause: any = {
    template: false,
    ...where,
    OR: [
      {
        statusSelect: {
          lt: 3,
        },
      },
      {
        statusSelect: {
          eq: QUOTATION_STATUS.CANCELED_QUOTATION,
        },
      },
    ],
  };

  const quotations = await c.aOSOrder
    .find({
      where: whereClause,
      take: limit,
      ...(skip ? {skip} : {}),
      select: {
        saleOrderSeq: true,
        statusSelect: true,
        deliveryState: true,
        createdOn: true,
        externalReference: true,
      },
    })
    .catch((err: any) => {
      return [];
    });

  const pageInfo = getPageInfo({
    count: quotations?.[0]?._count,
    page,
    limit,
  });
  if (!partnerId) return {quotations: [], pageInfo};

  return {
    quotations,
    pageInfo,
  };
};

export async function findQuotation(id: any) {
  const c = await client;

  const quotation = await c.aOSOrder.findOne({
    where: {
      id,
    },
    select: {
      saleOrderSeq: true,
      endOfValidityDate: true,
      exTaxTotal: true,
      statusSelect: true,
      inTaxTotal: true,
      mainInvoicingAddress: {
        zip: true,
        addressl4: true,
        addressl6: true,
        addressl7country: {
          name: true,
        },
      },
      clientPartner: {
        fullName: true,
      },
      company: {
        name: true,
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
          taxLine: {
            name: true,
            value: true,
          },
          discountAmount: true,
          inTaxTotal: true,
        },
      },
      currency: {
        code: true,
        numberOfDecimals: true,
        symbol: true,
      },
    },
  });
  const {currency, saleOrderLineList, exTaxTotal, inTaxTotal} = quotation;
  const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
  const unit = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

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

  return {
    ...quotation,
    exTaxTotal: getFormattedValue(exTaxTotal, unit, currencySymbol),
    inTaxTotal: getFormattedValue(inTaxTotal, unit, currencySymbol),
    saleOrderLineList: saleOrderLineList.map((list: any) => {
      return {
        ...list,
        qty: scale(list.qty, unit),
        price: getFormattedValue(list.price, unit, currencySymbol),
        exTaxTotal: getFormattedValue(list.exTaxTotal, unit, currencySymbol),
        discountAmount: scale(list.discountAmount, unit),
        inTaxTotal: getFormattedValue(list.inTaxTotal, unit, currencySymbol),
      };
    }),
    totalDiscount,
  };
}

export async function getComments(id: string | number) {
  const c = await client;

  const comments = await c.aOSMailMessage.find({
    where: {
      relatedId: id,
      relatedModel: RELATED_MODELS.SALE_ORDER_MODEL as string,
    },
    select: {
      subject: true,
      body: true,
      type: true,
      createdOn: true,
      updatedOn: true,
      author: true,
    },
  });

  const $comments = comments
    ?.map((comment: any) => {
      let body;
      try {
        body = JSON.parse(comment.body);
      } catch (error) {
        body = comment.body;
      }
      return {
        ...comment,
        body: body,
      };
    })
    ?.sort((a: any, b: any) => {
      return parseInt(b.id) - parseInt(a.id);
    });

  return $comments;
}

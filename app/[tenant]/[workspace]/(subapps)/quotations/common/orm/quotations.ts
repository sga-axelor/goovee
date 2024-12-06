// ---- CORE IMPORTS ---- //
import {type Tenant} from '@/tenant';
import {
  DEFAULT_CURRENCY_SCALE,
  DEFAULT_CURRENCY_SYMBOL,
  ORDER_BY,
} from '@/constants';
import {getFormattedValue, getPageInfo, getSkipInfo, scale} from '@/utils';
import type {ID, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {QUOTATION_STATUS} from '@/subapps/quotations/common/constants/quotations';
import {manager} from '@/tenant';
import {RELATED_MODELS} from '@/constants/models';

export const fetchQuotations = async ({
  page,
  limit,
  where,
  tenantId,
  workspaceURL,
}: {
  archived?: boolean;
  limit?: string | number;
  page?: string | number;
  where?: any;
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
}) => {
  if (!(tenantId && workspaceURL)) return {quotations: [], pageInfo: {}};

  const client = await manager.getClient(tenantId);
  const skip = getSkipInfo(limit, page);

  const whereClause: any = {
    template: false,
    ...where,
    OR: [
      {
        statusSelect: {
          lt: QUOTATION_STATUS.CONFIRMED,
        },
      },
      {
        statusSelect: {
          eq: QUOTATION_STATUS.CANCELED_QUOTATION,
        },
      },
    ],
    portalWorkspace: {
      url: workspaceURL,
    },
  };

  const quotations = await client.aOSOrder
    .find({
      where: whereClause,
      take: limit as any,
      ...(skip ? {skip} : {}),
      orderBy: {createdOn: ORDER_BY.DESC} as any,
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

  return {
    quotations,
    pageInfo,
  };
};

export async function findQuotation({
  id,
  tenantId,
  params,
  workspaceURL,
}: {
  id: any;
  tenantId: Tenant['id'];
  params?: any;
  workspaceURL: PortalWorkspace['url'];
}) {
  if (!(tenantId && workspaceURL)) return null;

  const client = await manager.getClient(tenantId);

  const quotation: any = await client.aOSOrder.findOne({
    where: {
      id,
      ...params?.where,
      portalWorkspace: {
        url: workspaceURL,
      },
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
        country: {
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
          taxLineSet: {
            select: {name: true, value: true},
          },
          discountAmount: true,
          inTaxTotal: true,
          product: {
            picture: {
              id: true,
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

  if (!quotation) {
    return null;
  }

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
    displayExTaxTotal: getFormattedValue(exTaxTotal, unit, currencySymbol),
    displayInTaxTotal: getFormattedValue(inTaxTotal, unit, currencySymbol),
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

// TODO: remove this getComments()
export async function getComments({
  id,
  tenantId,
}: {
  id: ID;
  tenantId: Tenant['id'];
}) {
  if (!tenantId) return [];

  const client = await manager.getClient(tenantId);

  const comments = await client.aOSMailMessage.find({
    where: {
      relatedId: id as any,
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

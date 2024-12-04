// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {
  DEFAULT_CURRENCY_SCALE,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_PAGE,
} from '@/constants';
import {
  clone,
  getFormattedValue,
  getPageInfo,
  getSkipInfo,
  scale,
} from '@/utils';
import type {Partner, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {Invoice} from '@/subapps/invoices/common/types/invoices';
import {
  INVOICE,
  INVOICE_CATEGORY,
} from '@/subapps/invoices/common/constants/invoices';

const fetchInvoices = async ({
  params,
  type,
  tenantId,
  workspaceURL,
  page,
  limit,
}: {
  params?: {
    where: object & {
      partner: {
        id: Partner['id'];
      };
    };
  };
  type?: string;
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
  limit?: string | number;
  page?: string | number;
}) => {
  const {id: partnerId} = params?.where?.partner || {};

  if (!(partnerId && tenantId && workspaceURL)) return null;

  const client = await manager.getClient(tenantId);

  const whereClause: any = {
    ...params?.where,
    portalWorkspace: {
      url: workspaceURL,
    },
  };

  if (type === INVOICE.ARCHIVED) {
    whereClause.archived = true;
    whereClause.operationTypeSelect = INVOICE_CATEGORY.SALE_INVOICE;
  } else {
    whereClause.amountRemaining = {
      ne: 0,
    };
  }
  const skip = getSkipInfo(limit, page);

  const $invoices = await client.aOSInvoice
    .find({
      where: whereClause,
      take: limit as any,
      ...(skip ? {skip: skip as any} : {}),
      select: {
        invoiceId: true,
        dueDate: true,
        invoiceDate: true,
        exTaxTotal: true,
        inTaxTotal: true,
        amountRemaining: true,
        currency: {
          code: true,
          numberOfDecimals: true,
          symbol: true,
        },
      },
    })
    .then(clone);

  const invoices = ($invoices || []).map((invoice: any) => {
    const {currency, exTaxTotal, inTaxTotal} = invoice;
    const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
    const unit = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;
    return {
      ...invoice,
      exTaxTotal: getFormattedValue(exTaxTotal, unit, currencySymbol),
      inTaxTotal: getFormattedValue(inTaxTotal, unit, currencySymbol),
    };
  });

  const pageInfo = getPageInfo({
    count: invoices?.[0]?._count,
    page,
    limit,
  });
  return {invoices, pageInfo};
};

export const findUnpaidInvoices = async ({
  params,
  tenantId,
  workspaceURL,
  page = DEFAULT_PAGE,
  limit,
}: {
  params?: any;
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
  page?: string | number;
  limit?: string | number;
}) => {
  return await fetchInvoices({params, tenantId, workspaceURL, page, limit});
};

export const findArchivedInvoices = async ({
  params,
  tenantId,
  workspaceURL,
  page = DEFAULT_PAGE,
  limit,
}: {
  params?: any;
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
  page?: string | number;
  limit?: string | number;
}) => {
  return await fetchInvoices({
    params,
    type: INVOICE.ARCHIVED,
    tenantId,
    workspaceURL,
    page,
    limit,
  });
};

export const findInvoice = async ({
  id,
  params,
  tenantId,
  workspaceURL,
}: {
  id: Invoice['id'];
  params?: any;
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
}) => {
  if (!(tenantId && workspaceURL)) return null;

  const client = await manager.getClient(tenantId);

  const invoice: any = await client.aOSInvoice
    .findOne({
      where: {
        id,
        ...params?.where,
        portalWorkspace: {
          url: workspaceURL,
        },
      },
      select: {
        invoiceId: true,
        invoiceDate: true,
        dueDate: true,
        exTaxTotal: true,
        inTaxTotal: true,
        amountRemaining: true,
        note: true,
        invoiceLineList: {
          select: {
            productName: true,
            qty: true,
            price: true,
            exTaxTotal: true,
            discountAmount: true,
          },
        },
        taxTotal: true,
        company: {
          name: true,
          address: {
            zip: true,
            addressl2: true,
            addressl4: true,
            addressl6: true,
            country: {
              name: true,
            },
          },
          partner: {
            fixedPhone: true,
          },
        },
        partner: {
          simpleFullName: true,
          fixedPhone: true,
          mainAddress: {
            zip: true,
            addressl2: true,
            addressl4: true,
            addressl6: true,
            country: {
              name: true,
            },
          },
        },
        paymentCondition: {
          name: true,
        },
        currency: {
          code: true,
          numberOfDecimals: true,
          symbol: true,
        },
      },
    })
    .then(clone);

  if (!invoice) {
    return null;
  }

  const {
    currency,
    exTaxTotal,
    inTaxTotal,
    amountRemaining,
    taxTotal,
    invoiceLineList,
  } = invoice;
  const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
  const unit = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

  return {
    ...invoice,
    exTaxTotal: getFormattedValue(exTaxTotal, unit, currencySymbol),
    inTaxTotal: getFormattedValue(inTaxTotal, unit, currencySymbol),
    amountRemaining: {
      value: scale(amountRemaining, unit),
      symbol: currencySymbol,
    },
    taxTotal: getFormattedValue(taxTotal, unit, currencySymbol),
    invoiceLineList: invoiceLineList.map((list: any) => {
      return {
        ...list,
        exTaxTotal: getFormattedValue(list.exTaxTotal, unit, currencySymbol),
        price: getFormattedValue(list.price, unit, currencySymbol),
        qty: getFormattedValue(list.qty, unit, currencySymbol),
      };
    }),
  };
};

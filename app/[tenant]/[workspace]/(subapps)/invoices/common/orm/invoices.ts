// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {
  DEFAULT_CURRENCY_SCALE,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_PAGE,
} from '@/constants';
import {clone, getPageInfo, getSkipInfo} from '@/utils';
import {formatDate, formatNumber} from '@/locale/server/formatters';
import type {Partner, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {Invoice} from '@/subapps/invoices/common/types/invoices';
import {
  INVOICE,
  INVOICE_CATEGORY,
  INVOICE_STATUS,
} from '@/subapps/invoices/common/constants/invoices';

const fetchInvoices = async ({
  params = {},
  type,
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
  type?: string;
  tenantId: Tenant['id'];
  workspaceURL: PortalWorkspace['url'];
}) => {
  const {page = DEFAULT_PAGE, limit, where = {}} = params;
  const {id: partnerId} = where.partner || {};

  if (!(partnerId && tenantId && workspaceURL)) return null;

  const client = await manager.getClient(tenantId);

  const whereClause: any = {
    ...params?.where,
    OR: [
      {
        portalWorkspace: {
          url: workspaceURL,
        },
      },
      {saleOrder: {portalWorkspace: {url: workspaceURL}}},
      ...(type === INVOICE.ARCHIVED
        ? [{archived: true}, {amountRemaining: {eq: 0}}]
        : []),
    ],
    ...(type === INVOICE.ARCHIVED
      ? {
          operationTypeSelect: INVOICE_CATEGORY.SALE_INVOICE,
        }
      : {
          amountRemaining: {ne: 0},
        }),
    statusSelect: {eq: INVOICE_STATUS.VENTILATED},
  };

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

  const invoices: any = [];

  for (const invoice of $invoices) {
    const {
      currency,
      exTaxTotal,
      inTaxTotal,
      dueDate,
      invoiceDate,
      amountRemaining,
    } = invoice;
    const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
    const scale = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;
    const isUnpaid = Number(amountRemaining) !== 0;
    const $invoice = {
      ...invoice,
      isUnpaid,
      dueDate: await formatDate(dueDate!),
      invoiceDate: await formatDate(invoiceDate!),
      exTaxTotal: await formatNumber(exTaxTotal, {
        scale,
        currency: currencySymbol,
        type: 'DECIMAL',
      }),
      inTaxTotal: await formatNumber(inTaxTotal, {
        scale,
        currency: currencySymbol,
        type: 'DECIMAL',
      }),
    };

    invoices.push($invoice);
  }

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
}) => {
  return await fetchInvoices({params, tenantId, workspaceURL});
};

export const findArchivedInvoices = async ({
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
}) => {
  return await fetchInvoices({
    params,
    type: INVOICE.ARCHIVED,
    tenantId,
    workspaceURL,
  });
};

export const findInvoice = async ({
  id,
  params,
  tenantId,
  workspaceURL,
}: {
  id: Invoice['id'];
  params?: {
    where?: object & {
      partner?: {
        id: Partner['id'];
      };
    };
  };
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
        invoicePaymentList: {
          select: {
            paymentDate: true,
            amount: true,
          },
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
    dueDate,
    invoiceDate,
    invoicePaymentList,
  } = invoice;
  const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
  const scale = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;

  const $invoiceLineList: any = [];
  for (const list of invoiceLineList) {
    const line = {
      ...list,
      exTaxTotal: await formatNumber(list?.exTaxTotal, {
        scale,
        currency: currencySymbol,
        type: 'DECIMAL',
      }),
      price: await formatNumber(list?.price, {
        scale,
        currency: currencySymbol,
        type: 'DECIMAL',
      }),
      qty: await formatNumber(list.qty, {scale}),
    };
    $invoiceLineList.push(line);
  }

  const $invoicePaymentList: any = [];
  for (const list of invoicePaymentList || []) {
    const line = {
      ...list,
      amount: await formatNumber(list.amount, {
        scale,
        currency: currencySymbol,
        type: 'DECIMAL',
      }),
    };
    $invoicePaymentList.push(line);
  }

  return {
    ...invoice,
    dueDate: await formatDate(dueDate!),
    invoiceDate: await formatDate(invoiceDate!),
    exTaxTotal: await formatNumber(exTaxTotal, {
      scale,
      currency: currencySymbol,
      type: 'DECIMAL',
    }),
    inTaxTotal: await formatNumber(inTaxTotal, {
      scale,
      currency: currencySymbol,
      type: 'DECIMAL',
    }),
    amountRemaining: {
      value: amountRemaining,
      symbol: currencySymbol,
      formattedValue: await formatNumber(amountRemaining, {
        scale,
        currency: currencySymbol,
        type: 'DECIMAL',
      }),
    },
    taxTotal: await formatNumber(taxTotal, {
      scale,
      currency: currencySymbol,
      type: 'DECIMAL',
    }),
    invoiceLineList: $invoiceLineList,
    invoicePaymentList: $invoicePaymentList,
    isUnpaid: Number(invoice.amountRemaining) !== 0,
  };
};

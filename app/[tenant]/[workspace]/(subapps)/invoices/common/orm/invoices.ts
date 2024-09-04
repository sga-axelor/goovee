// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {DEFAULT_CURRENCY_SCALE, DEFAULT_CURRENCY_SYMBOL} from '@/constants';
import {getFormattedValue, scale} from '@/utils';
import type {ID, Partner} from '@/types';

// ---- LOCAL IMPORTS ---- //
import type {Invoice} from '@/subapps/invoices/common/types/invoices';

const fetchInvoices = async ({
  where,
  type,
  tenantId,
}: {
  where: {
    partner: {
      id: Partner['id'];
    };
  };
  type?: string;
  tenantId: ID;
}) => {
  const {id: partnerId} = where?.partner;

  if (!(partnerId && tenantId)) return null;

  const client = await getClient(tenantId);

  const whereClause: any = {
    ...where,
  };

  if (type === 'archived') {
    whereClause.archived = true;
    whereClause.operationTypeSelect = 3;
  } else {
    whereClause.amountRemaining = {ne: 0};
  }

  const $invoices = await client.aOSInvoice.find({
    where: whereClause,
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
  });

  const invoices = $invoices.map((invoice: any) => {
    const {currency, exTaxTotal, inTaxTotal} = invoice;
    const currencySymbol = currency.symbol || DEFAULT_CURRENCY_SYMBOL;
    const unit = currency.numberOfDecimals || DEFAULT_CURRENCY_SCALE;
    return {
      ...invoice,
      exTaxTotal: getFormattedValue(exTaxTotal, unit, currencySymbol),
      inTaxTotal: getFormattedValue(inTaxTotal, unit, currencySymbol),
    };
  });
  return invoices;
};

export const findUnpaidInvoices = async ({
  where,
  tenantId,
}: {
  where: any;
  tenantId: ID;
}) => {
  return await fetchInvoices({where, tenantId});
};

export const findArchivedInvoices = async ({
  where,
  tenantId,
}: {
  where: any;
  tenantId: ID;
}) => {
  return await fetchInvoices({where, type: 'archived', tenantId});
};

export const findInvoice = async ({
  id,
  params,
  tenantId,
}: {
  id: Invoice['id'];
  params?: any;
  tenantId: ID;
}) => {
  if (!tenantId) return null;

  const client = await getClient(tenantId);

  const invoice: any = await client.aOSInvoice.findOne({
    where: {
      id,
      ...params?.where,
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
  });

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

// ---- CORE IMPORTS ---- //
import type {Partner} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  INVOICE,
  INVOICE_CATEGORY,
  INVOICE_STATUS,
} from '@/subapps/invoices/common/constants/invoices';

export function extractAmount(
  amount: string | number | null | undefined,
): number {
  if (amount === null || amount === undefined) return 0;
  const amountStr = String(amount);
  const numericValue = parseFloat(amountStr.replace(/[^0-9.-]+/g, ''));

  return isNaN(numericValue) ? 0 : numericValue;
}

export function buildWhereClause({
  params,
  workspaceURL,
  type,
}: {
  params?: {where?: object & {partner?: {id: Partner['id']}}};
  workspaceURL: string;
  type?: string;
}) {
  const workspaceConditions = {
    OR: [
      {portalWorkspace: {url: workspaceURL}},
      {saleOrder: {portalWorkspace: {url: workspaceURL}}},
    ],
  };

  return {
    ...params?.where,
    statusSelect: {eq: INVOICE_STATUS.VENTILATED},
    operationTypeSelect: INVOICE_CATEGORY.SALE_INVOICE,
    // ARCHIVED FILTER
    OR: [{archived: false}, {archived: null}],
    AND: [
      workspaceConditions,
      type
        ? type === INVOICE.PAID
          ? {amountRemaining: {eq: 0}}
          : {amountRemaining: {ne: 0}}
        : false,
    ].filter(Boolean),
  };
}

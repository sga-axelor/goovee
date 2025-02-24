// ---- LOCAL IMPORTS ---- //

import {
  INVOICE,
  INVOICE_CATEGORY,
  INVOICE_STATUS,
} from '@/subapps/invoices/common/constants/invoices';

export function extractAmount(amount: string | number): number {
  const amountStr = String(amount);
  const numericValue = parseFloat(amountStr.replace(/[^0-9.-]+/g, ''));

  return isNaN(numericValue) ? 0 : numericValue;
}

export function buildWhereClause({
  params,
  workspaceURL,
  type,
}: {
  params: any;
  workspaceURL: string;
  type?: string;
}) {
  const workspaceConditions: any = {
    OR: [
      {portalWorkspace: {url: workspaceURL}},
      {saleOrder: {portalWorkspace: {url: workspaceURL}}},
    ],
  };

  const archivedCondition = {
    OR: [{archived: true}, {amountRemaining: {eq: 0}}],
    operationTypeSelect: INVOICE_CATEGORY.SALE_INVOICE,
  };

  const isArchived = type === INVOICE.ARCHIVED;

  let whereClause: any = {
    ...params?.where,
    statusSelect: {eq: INVOICE_STATUS.VENTILATED},
  };

  whereClause.AND = [
    ...(whereClause.AND || []),
    workspaceConditions,
    isArchived
      ? archivedCondition
      : {
          OR: [{archived: false}, {archived: null}],
        },
  ];

  if (!isArchived) {
    whereClause.amountRemaining = {ne: 0};
  }

  return whereClause;
}

// ---- LOCAL IMPORTS ---- //
import {
  INVOICE_TYPE,
  INVOICE_STATUS,
} from '@/subapps/invoices/common/constants/invoices';

export function getStatus(value: string | number): {
  status: string;
  variant: 'success' | 'destructive';
} {
  if (Number(value) !== INVOICE_STATUS.UNPAID) {
    return {
      status: INVOICE_TYPE.UNPAID,
      variant: 'destructive',
    };
  } else {
    return {
      status: INVOICE_TYPE.PAID,
      variant: 'success',
    };
  }
}

export function extractAmount(amount: string | number): number {
  const amountStr = String(amount);
  const numericValue = parseFloat(amountStr.replace(/[^0-9.-]+/g, ''));

  return isNaN(numericValue) ? 0 : numericValue;
}

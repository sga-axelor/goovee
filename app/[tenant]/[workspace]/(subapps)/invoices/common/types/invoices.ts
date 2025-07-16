// ---- CORE IMPORTS ---- //
import {ID, PortalWorkspace} from '@/types';

export type Invoice = {
  id: ID;
  invoiceId: string;
  invoiceDate: string;
  inTaxTotal: string;
  exTaxTotal: number | string;
  taxTotal: string;
  invoicePaymentList?: any[];
  amountRemaining: {value: string; symbol: string; formattedValue: string};
  currency: {
    id: string | number;
    symbol: string;
  };
  isUnpaid: boolean;
  dueDate: string;
};

export type InvoiceProps = {
  invoice: any;
  invoiceType: string;
};

export type TotalProps = {
  invoice: Invoice;
  isUnpaid?: boolean;
  workspace?: PortalWorkspace;
  invoiceType: string;
};

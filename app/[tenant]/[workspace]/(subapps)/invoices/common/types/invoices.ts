// ---- CORE IMPORTS ---- //
import {ID} from '@/types';

export type Invoice = {
  id: ID;
  invoiceId: string;
  invoiceDate: string;
};

export type InvoiceProps = {
  invoice: any;
  isUnpaid: boolean;
};

export type TotalProps = {
  inTaxTotal: string;
  exTaxTotal: number | string;
  invoiceLineList: [];
  numberOfDecimals: number;
  allowInvoicePayment?:boolean;
};

export type InvoiceTable = {
  invoiceLineList: [];
  exTaxTotal: string;
  amountRemaining: {value: 'string'; symbol: 'string'};
  inTaxTotal: string;
  taxTotal: string;
};

export type TableHeaderProps = {
  columns: string[];
};

export type TableBodyProps = {
  invoiceLineList: [];
};

export type TableFooterProps = {
  exTaxTotal: string;
  inTaxTotal: string;
  amountRemaining: {value: 'string'; symbol: 'string'};
  taxTotal: string;
  sumOfDiscounts: number;
};

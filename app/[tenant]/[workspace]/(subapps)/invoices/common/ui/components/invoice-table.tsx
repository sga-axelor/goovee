'use client';
import React from 'react';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {
  InvoiceTable as Invoice_Table,
  TableBodyProps,
  TableFooterProps,
  TableHeaderProps,
} from '@/subapps/invoices/common/types/invoices';
import {INVOICE_COLUMNS} from '@/subapps/invoices/common/constants/invoices';

function TableHeader({columns}: TableHeaderProps) {
  return (
    <>
      {columns.map((column, i) => (
        <div
          key={i}
          className={`${i === 0 ? 'text-left' : 'text-right'} header mb-4 uppercase !text-main-purple font-bold`}>
          {column}
        </div>
      ))}
    </>
  );
}

function TableBody({invoiceLineList}: TableBodyProps) {
  return invoiceLineList.map(({productName, price, qty, exTaxTotal}, index) => {
    const showBottomBorder = index !== invoiceLineList.length - 1;
    return (
      <React.Fragment key={index}>
        <div className={`${showBottomBorder ? 'border-b' : ''} py-2`}>
          <p className="mb-0">{productName}</p>
        </div>
        <div
          className={`${showBottomBorder ? 'border-b' : ''} py-2 text-right`}>
          <p className="mb-0">{price}</p>
        </div>
        <div
          className={`${showBottomBorder ? 'border-b' : ''} py-2 text-right`}>
          <p className="mb-0">{qty}</p>
        </div>
        <div
          className={`${showBottomBorder ? 'border-b' : ''} py-2 text-right`}>
          <p className="mb-0">{exTaxTotal}</p>
        </div>
      </React.Fragment>
    );
  });
}

function TableFooter({
  exTaxTotal,
  inTaxTotal,
  taxTotal,
  amountRemaining,
  sumOfDiscounts,
}: TableFooterProps) {
  return (
    <>
      {/* Row 4 */}
      <div></div>
      <div className="border-b py-2 text-right">
        <p className="mb-0">{i18n.get('Subtotal')}</p>
        <p className="mb-0">{i18n.get('Discount')}</p>
        <p className="mb-0">{i18n.get('Tax')}</p>
      </div>
      <div className="border-b py-2 text-right">
        <p className="mb-0">{exTaxTotal}</p>
        <p className="mb-0">{sumOfDiscounts}</p>
        <p className="mb-0">{taxTotal}</p>
      </div>
      {/* Row 5 */}
      <div></div>
      <div className="!border-b-[0.1875rem] border-solid !border-main-purple py-2 text-right">
        <p className="mb-0">{i18n.get('Total')}</p>
        <p className="mb-0">{i18n.get('Deposit Requested')}</p>
      </div>
      <div className="!border-b-[0.1875rem] border-solid !border-main-purple py-2 text-right">
        <p className="mb-0">{inTaxTotal}</p>
        <p className="mb-0">
          {amountRemaining.value} {amountRemaining.symbol}
        </p>
      </div>
      {/* Row 6 */}
      <div></div>
      <h6 className="text-base text-right py-2 font-bold">
        {i18n.get('Deposit Due')}
      </h6>
      <h6 className="text-base text-right py-2 font-bold">
        {amountRemaining.value} {amountRemaining.symbol}
      </h6>
    </>
  );
}

export function InvoiceTable({
  invoiceLineList,
  exTaxTotal,
  inTaxTotal,
  amountRemaining,
  taxTotal,
}: Invoice_Table) {
  const sumOfDiscounts = invoiceLineList.reduce((total, {discountAmount}) => {
    return total + parseFloat(discountAmount);
  }, 0);

  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] leading-5 mb-6">
        <TableHeader columns={INVOICE_COLUMNS} />
        <TableBody invoiceLineList={invoiceLineList} />
      </div>
      <div className="grid grid-cols-[2fr_1fr_1fr] leading-5">
        <TableFooter
          exTaxTotal={exTaxTotal}
          inTaxTotal={inTaxTotal}
          taxTotal={taxTotal}
          amountRemaining={amountRemaining}
          sumOfDiscounts={sumOfDiscounts}
        />
      </div>
    </>
  );
}
export default InvoiceTable;

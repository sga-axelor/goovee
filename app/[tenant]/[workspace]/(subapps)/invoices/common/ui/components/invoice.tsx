'use client';

import React from 'react';
import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Button, Separator} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {InvoiceProps} from '@/subapps/invoices/common/types/invoices';
import {InvoiceContent} from '.';

export function Invoice({invoice, isUnpaid}: InvoiceProps) {
  return (
    <>
      <div
        className={`${isUnpaid ? 'md:basis-9/12' : 'md:basis-full'} flex flex-col basis-full bg-card text-card-foreground px-6 py-4 gap-4 rounded-lg`}>
        <h4 className="text-xl font-medium mb-0">{i18n.get('Invoice')}</h4>
        <Separator />
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-3 rounded-full">
            <MdOutlineFileDownload className="text-2xl" />{' '}
            {i18n.get('Download Invoice')}
          </Button>
        </div>
        <div
          className="rounded-lg !border"
          style={{borderColor: 'red !important'}}>
          <InvoiceContent invoice={invoice} />
        </div>
      </div>
    </>
  );
}
export default Invoice;

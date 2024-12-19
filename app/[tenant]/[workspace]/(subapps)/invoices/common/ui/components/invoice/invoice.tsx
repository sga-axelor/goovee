'use client';

import React, {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Loader, Separator} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {InvoiceProps} from '@/subapps/invoices/common/types/invoices';
import {PdfViewer} from '@/subapps/invoices/common/ui/components';
import {getPDF} from '@/subapps/invoices/common/actions';
import {UNABLE_TO_FIND_INVOICE} from '@/subapps/invoices/common/constants/invoices';

export function Invoice({invoice, isUnpaid}: InvoiceProps) {
  const {id} = invoice;
  const [file, setFile] = useState<Blob | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const {workspaceURL} = useWorkspace();

  useEffect(() => {
    const getFile = async () => {
      const data = await getPDF({id, workspaceURL});
      if (data) {
        const arrayBuffer = new Uint8Array(data);
        const blob = new Blob([arrayBuffer], {type: 'application/pdf'});
        setFile(blob);
        setIsError(false);
      } else {
        setIsError(true);
      }
    };
    getFile();
  }, [id, workspaceURL]);

  return (
    <>
      <div
        className={`${isUnpaid ? 'md:basis-9/12' : 'md:basis-full'} flex flex-col basis-full bg-card text-card-foreground px-6 py-4 gap-4 rounded-lg`}>
        <h4 className="text-xl font-medium mb-0">{i18n.get('Invoice')}</h4>
        <Separator />
        {file ? (
          <PdfViewer file={file} id={id} />
        ) : isError ? (
          <p>{i18n.get(UNABLE_TO_FIND_INVOICE)}</p>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
export default Invoice;

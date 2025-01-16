'use client';

import React, {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {DocViewer, Loader, Separator} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useToast} from '@/ui/hooks';
import {INVOICE_ENTITY_TYPE, RELATED_MODELS, SUBAPP_CODES} from '@/constants';
import {getFile} from '@/app/actions/file';

// ---- LOCAL IMPORTS ---- //
import {InvoiceProps} from '@/subapps/invoices/common/types/invoices';
import {UNABLE_TO_FIND_INVOICE} from '@/subapps/invoices/common/constants/invoices';

export function Invoice({invoice, isUnpaid}: InvoiceProps) {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();

  useEffect(() => {
    if (!invoice?.id || !workspaceURL) return;

    const fetchFile = async () => {
      setLoading(true);
      try {
        const result = await getFile({
          id: invoice.id,
          workspaceURL,
          subapp: SUBAPP_CODES.invoices,
          modelName: RELATED_MODELS.INVOICE,
          type: INVOICE_ENTITY_TYPE.INVOICE,
        });

        if (result?.error || !result?.data) {
          toast({
            variant: 'destructive',
            description: i18n.t(
              result?.message ??
                'Something went wrong while fetching the file!',
            ),
          });
        } else {
          setFile(result.data);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: i18n.t('An unexpected error occurred!'),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [invoice?.id, workspaceURL, toast]);

  return (
    <div
      className={`${
        isUnpaid ? 'md:basis-9/12' : 'md:basis-full'
      } flex flex-col basis-full bg-card text-card-foreground px-6 py-4 gap-4 rounded-lg`}>
      <h4 className="text-xl font-medium mb-0">{i18n.get('Invoice')}</h4>
      <Separator />
      {loading ? (
        <Loader />
      ) : file ? (
        <DocViewer record={file} />
      ) : (
        <p>{i18n.t(UNABLE_TO_FIND_INVOICE)}</p>
      )}
    </div>
  );
}

export default Invoice;

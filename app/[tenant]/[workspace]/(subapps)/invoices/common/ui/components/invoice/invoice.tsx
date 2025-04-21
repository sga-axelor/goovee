'use client';

// ---- CORE IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/locale';
import {DocViewer, Separator} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {InvoiceProps} from '@/subapps/invoices/common/types/invoices';

export function Invoice({invoice, invoiceType}: InvoiceProps) {
  const {workspaceURI} = useWorkspace();

  return (
    <div
      className={`flex flex-col basis-full bg-card text-card-foreground px-6 py-4 gap-4 rounded-lg`}>
      <h4 className="text-xl font-medium mb-0">{i18n.t('Invoice')}</h4>
      <Separator />
      <DocViewer
        documents={[
          {
            uri: `${workspaceURI}/${SUBAPP_CODES.invoices}/api/invoice/${invoiceType}/${invoice.id}`,
          },
        ]}
      />
    </div>
  );
}

export default Invoice;

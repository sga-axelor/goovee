'use client';

import React, {useEffect, useMemo} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {type PortalWorkspace} from '@/types';
import {Container, NavView, TableList} from '@/ui/components';
import {i18n} from '@/locale';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useSortBy, useToast} from '@/ui/hooks';
import {SUBAPP_CODES, URL_PARAMS} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  ITEMS,
  HEADING,
  INVOICE,
} from '@/subapps/invoices/common/constants/invoices';
import {
  AlertToast,
  UnpaidColumns,
} from '@/subapps/invoices/common/ui/components';

export default function Content({
  invoices = [],
  pageInfo,
  workspace,
}: {
  invoices: [];
  pageInfo?: any;
  workspace: PortalWorkspace;
}) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {toast} = useToast();

  const [sortedInvoices, sortOrder, toggleSortOrder] = useSortBy(invoices);

  const handleTabChange = (e: any) => {
    router.push(`${e.href}`);
  };

  const handleClick = (invoice: any) =>
    router.push(
      `${workspaceURI}/${SUBAPP_CODES.invoices}/${INVOICE.UNPAID}/${invoice.id}`,
    );

  const hasUpcomingInvoices = useMemo(() => {
    return invoices?.some(
      ({amountRemaining}: {amountRemaining: any}) =>
        parseInt(amountRemaining.value) !== 0,
    );
  }, [invoices]);

  const config = workspace?.config;

  const allowOnlinePayment = config?.allowOnlinePaymentForEcommerce;
  const canPayInvoice = config?.canPayInvoice;
  const paymentOptionSet = config?.paymentOptionSet;

  const allowInvoicePayment =
    allowOnlinePayment &&
    canPayInvoice !== 'no' &&
    Boolean(paymentOptionSet?.length);

  const unpaidColumns = useMemo(
    () => UnpaidColumns(allowInvoicePayment),
    [allowInvoicePayment],
  );

  return (
    <>
      <Container title={i18n.t('Invoices')}>
        <AlertToast show={hasUpcomingInvoices} title={HEADING} variant="info" />
        <NavView items={ITEMS} activeTab="1" onTabChange={handleTabChange}>
          <div className="flex flex-col gap-4">
            <TableList
              columns={unpaidColumns}
              rows={sortedInvoices}
              sort={sortOrder}
              onSort={toggleSortOrder}
              onRowClick={handleClick}
              pageInfo={pageInfo}
              pageParamKey={URL_PARAMS.page}
            />
          </div>
        </NavView>
      </Container>
    </>
  );
}

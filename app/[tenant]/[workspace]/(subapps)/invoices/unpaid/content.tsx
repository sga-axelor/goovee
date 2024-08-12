'use client';

import React, {useMemo} from 'react';
import {usePathname, useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {PaymentOption, type PortalWorkspace} from '@/types';
import {Container, NavView, StyledAlert} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {
  UNPAID_INVOICE_COLUMNS,
  ITEMS,
  HEADING,
} from '@/subapps/invoices/common/constants/invoices';
import {Card, UnpaidTable} from '@/subapps/invoices/common/ui/components';

export default function Content({
  invoices = [],
  workspace,
}: {
  invoices: [];
  pageInfo?: any;
  workspace: PortalWorkspace;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = () => {
    router.push(`archived`);
  };

  const handleClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

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

  return (
    <>
      <Container title={i18n.get('Invoices')}>
        <StyledAlert
          show={hasUpcomingInvoices}
          variant="purple"
          heading={HEADING}
        />
        <NavView items={ITEMS} activeTab="1" onTabChange={handleTabChange}>
          <div className="hidden md:block">
            <UnpaidTable
              columns={UNPAID_INVOICE_COLUMNS}
              rows={invoices}
              handleRowClick={handleClick}
              allowInvoicePayment={allowInvoicePayment}
            />
          </div>
          <div className="md:hidden block">
            <Card invoices={invoices} handleRowClick={handleClick} />
          </div>
        </NavView>
      </Container>
    </>
  );
}

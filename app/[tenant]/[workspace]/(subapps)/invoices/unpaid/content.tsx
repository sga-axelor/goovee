'use client';
import React, {useMemo} from 'react';
import {usePathname, useRouter} from 'next/navigation';
// ---- CORE IMPORTS ---- //
import {Container, NavView, Toast} from '@ui/components/index';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {
  UNPAID_INVOICE_COLUMNS,
  ITEMS,
  HEADING,
} from '@/subapps/invoices/common/constants/invoices';
import {Card, UnpaidTable} from '@/subapps/invoices/common/ui/components';

type ContentProps = {
  invoices: [];
  pageInfo?: any;
};

export default function Content({invoices = []}: ContentProps) {
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

  return (
    <>
      <Container title={i18n.get('Invoices')}>
        <Toast show={hasUpcomingInvoices} variant="warning" heading={HEADING} />
        <NavView items={ITEMS} activeTab="1" onTabChange={handleTabChange}>
          <div className="hidden md:block">
            <UnpaidTable
              columns={UNPAID_INVOICE_COLUMNS}
              rows={invoices}
              handleRowClick={handleClick}
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

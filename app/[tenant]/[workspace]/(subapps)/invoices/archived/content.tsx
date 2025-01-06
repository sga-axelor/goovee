'use client';
import React from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Container, NavView, TableList} from '@/ui/components';
import {i18n} from '@/locale';
import {SUBAPP_CODES, SUBAPP_PAGE, URL_PARAMS} from '@/constants';
import {useSortBy} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {ITEMS} from '@/subapps/invoices/common/constants/invoices';
import {Columns} from '@/subapps/invoices/common/ui/components';

export default function Content({
  invoices = [],
  pageInfo,
}: {
  invoices: [];
  pageInfo?: any;
}) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const [sortedInvoices, sortOrder, toggleSortOrder] = useSortBy(invoices);

  const handleTabChange = (e: any) => {
    router.push(`${e.href}`);
  };

  const handleClick = (invoice: any) =>
    router.push(
      `${workspaceURI}/${SUBAPP_CODES.invoices}/${SUBAPP_PAGE.archived}/${invoice.id}`,
    );

  return (
    <>
      <Container title={i18n.t('Invoices')}>
        <NavView items={ITEMS} activeTab="2" onTabChange={handleTabChange}>
          <div className="flex flex-col gap-4">
            <TableList
              columns={Columns}
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

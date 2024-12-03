'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Container, NavView, TableList} from '@/ui/components';
import {i18n} from '@/i18n';
import {useSortBy} from '@/ui/hooks';
import {SUBAPP_CODES, SUBAPP_PAGE, URL_PARAMS} from '@/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {ITEMS} from '@/subapps/orders/common/constants/orders';
import {OrderColumns} from '@/subapps/orders/common/ui/components';

type ContentProps = {
  orders: [];
  pageInfo?: any;
};

const Content = ({orders, pageInfo}: ContentProps) => {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const [sortedOrders, ordersSortOrder, toggleOrdersSortOrder] =
    useSortBy(orders);

  const handleTabChange = (e: any) => {
    router.push(`${e.href}`);
  };
  const handleClick = (order: any) =>
    router.push(
      `${workspaceURI}/${SUBAPP_CODES.orders}/${SUBAPP_PAGE.orders.ongoing}/${order.id}`,
    );

  return (
    <>
      <Container title={i18n.get('Orders')}>
        <NavView items={ITEMS} activeTab="1" onTabChange={handleTabChange}>
          <div className="flex flex-col gap-4">
            <TableList
              columns={OrderColumns}
              rows={sortedOrders}
              sort={ordersSortOrder}
              onSort={toggleOrdersSortOrder}
              onRowClick={handleClick}
              pageInfo={pageInfo}
              pageParamKey={URL_PARAMS.page}
            />
          </div>
        </NavView>
      </Container>
    </>
  );
};
export default Content;

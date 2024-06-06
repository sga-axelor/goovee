'use client';

import React from 'react';
import {Box} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils';
import {Tag} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/orders/common/utils/orders';

export const Card = ({
  orders,
  handleRowClick,
}: {
  orders: [];
  handleRowClick: (id: string) => void;
}) => {
  return (
    <>
      {orders?.map((order: any, i: number) => {
        const {status, variant} = getStatus(
          order.statusSelect,
          order.deliveryState,
        );
        return (
          <Box
            key={i}
            rounded
            bg="white"
            px={3}
            py={4}
            d="flex"
            flexDirection="column"
            gap="1rem"
            border
            style={{borderColor: '#E6E7E7 !important', cursor: 'pointer'}}
            onClick={() => handleRowClick(order.id)}>
            <Box
              d="flex"
              alignItems="center"
              justifyContent="space-between"
              style={{fontWeight: 'bold'}}>
              <Box>{i18n.get('Order number')}</Box>
              <Box>{order.saleOrderSeq}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box style={{fontWeight: 'bold'}}>{i18n.get('Status')}</Box>
              <Box>
                <Tag variant={variant}>{status}</Tag>
              </Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box style={{fontWeight: 'bold'}}>{i18n.get('Created on')}</Box>
              <Box>{parseDate(order.createdOn)}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box style={{fontWeight: 'bold'}}>{i18n.get('Total WT')}</Box>
              <Box> {order.exTaxTotal}</Box>
            </Box>
            <Box d="flex" alignItems="center" justifyContent="space-between">
              <Box style={{fontWeight: 'bold'}}>{i18n.get('Total ATI')}</Box>
              <Box style={{fontSize: 18, fontWeight: 'bold'}}>
                {order.inTaxTotal}
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default Card;

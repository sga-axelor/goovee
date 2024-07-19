'use client';
import React from 'react';
import {TableCell, TableRow} from '@ui/components/table';
// ---- CORE IMPORTS ---- //
import {StyledTable, Tag} from '@ui/components/index';
import {parseDate} from '@/utils/date';
import type {Item} from '@/types';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {getStatus} from '@/subapps/orders/common/utils/orders';
import styles from './styles.module.scss';
export const OrdersTable = ({
  columns,
  orders,
  handleRowClick,
}: {
  columns: Item[];
  orders: [];
  handleRowClick: (id: string) => void;
}) => {
  return (
    <div>
      <StyledTable columns={columns}>
        {orders?.map((order: any, index: number) => {
          const {status, variant} = getStatus(
            order.statusSelect,
            order.deliveryState,
          );

          return (
            <TableRow
              className={styles['table-row']}
              key={index}
              onClick={() => handleRowClick(order.id)}>
              <TableCell
                className={`${styles['table-cell']} !text-sm font-semibold`}>
                {order.saleOrderSeq}
              </TableCell>
              <TableCell className={styles['table-cell']}>
                <Tag variant={variant}>{status}</Tag>
              </TableCell>
              <TableCell className={styles['table-cell']}>
                {parseDate(order.createdOn)}
              </TableCell>
              <TableCell className={styles['table-cell']}>
                {order.exTaxTotal}
              </TableCell>
              <TableCell
                className={`${styles['table-cell']} !text-sm font-semibold`}>
                {order.inTaxTotal}
              </TableCell>
            </TableRow>
          );
        })}
      </StyledTable>
    </div>
  );
};
export default OrdersTable;

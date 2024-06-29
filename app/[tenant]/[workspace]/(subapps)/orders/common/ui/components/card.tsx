'use client';
import React from 'react';
// ---- CORE IMPORTS ---- //
import {parseDate} from '@/utils';
import {Tag} from '@ui/components/index';
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
          <div
            key={i}
            className="rounded border border-solid !border-border bg-card px-4 py-6 flex flex-col gap-4 !cursor-pointer mb-3"
            onClick={() => handleRowClick(order.id)}>
            <div className="flex items-center justify-between font-bold">
              <h6>{i18n.get('Order number')}</h6>
              <h6>{order.saleOrderSeq}</h6>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="font-bold">{i18n.get('Status')}</h6>
              <p>
                <Tag variant={variant}>{status}</Tag>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="font-bold">{i18n.get('Created on')}</h6>
              <p>{parseDate(order.createdOn)}</p>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="font-bold">{i18n.get('Total WT')}</h6>
              <p> {order.exTaxTotal}</p>
            </div>
            <div className="flex items-center justify-between">
              <h6 className="font-bold">{i18n.get('Total ATI')}</h6>
              <h5 className="text-lg font-bold mb-0">{order.inTaxTotal}</h5>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default Card;

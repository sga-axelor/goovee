'use client';

import React from 'react';
import {MdOutlineFileDownload} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Separator, Button, Tag} from '@/ui/components';
import {i18n} from '@/locale';

// ---- LOCAL IMPORTS ---- //
import {ORDER_TYPE} from '@/subapps/orders/common/constants/orders';

export const Informations = ({
  createdOn,
  shipmentMode,
  status,
  variant,
  onDownload,
}: any) => {
  const showShippingLink = [ORDER_TYPE.SHIPPED, ORDER_TYPE.DELIVERED].includes(
    status,
  );
  return (
    <>
      <div className="bg-card text-card-foreground flex md:block flex-col rounded-lg p-4 md:p-6">
        <h4 className="text-xl font-medium mb-0">{i18n.t('Informations')}</h4>
        <Separator className="my-1" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <h5 className="text-lg font-semibold mb-0">{i18n.t('Status')}:</h5>
            <Tag variant={variant}>{i18n.t(status)}</Tag>
            <div></div>
          </div>
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold mb-0 pr-1">
              {i18n.t('Created on')}:
            </h5>
            <p>{createdOn}</p>
          </div>
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold mb-0 pr-1">
              {i18n.t('Shipping method')}:
            </h5>
            <p>{shipmentMode?.name}</p>
          </div>
          {showShippingLink && (
            <div className="flex items-center gap-2">
              <p className="underline text-palette-blue-dark">
                {i18n.t('Shipping link to follow the delivery path')}
              </p>
            </div>
          )}
          <div className="flex">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-3 rounded-full !font-medium basis-full md:basis-0"
              onClick={onDownload}>
              <MdOutlineFileDownload className="text-2xl" />{' '}
              {i18n.t('Download invoice')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Informations;

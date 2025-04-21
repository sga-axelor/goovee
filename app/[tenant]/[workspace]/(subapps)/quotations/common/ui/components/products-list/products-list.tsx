'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';
import {
  TableCell,
  TableRow,
  StyledTable,
  Separator,
  Avatar,
  AvatarImage,
} from '@/ui/components';
import {getProductImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import {ProductCard} from '../product-card/product-card';
import {
  PRODUCT_COLUMNS,
  PRODUCT_CARD_COLUMNS,
} from '@/subapps/quotations/common/constants/quotations';
import type {Product} from '@/subapps/quotations/common/types/quotations';

type Props = {
  saleOrderLineList: Product[];
  tenant: any;
  hideDiscount: boolean;
};

export const ProductsList = ({
  saleOrderLineList,
  tenant,
  hideDiscount: hideDiscountColumn,
}: Props) => {
  const getProductImage = (product: any) => {
    return getProductImageURL(product?.picture?.id, tenant, {noimage: true});
  };

  const visibleColumns = hideDiscountColumn
    ? PRODUCT_COLUMNS.filter(col => col.key !== 'discountAmount')
    : PRODUCT_COLUMNS;

  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">{i18n.t('Products')}</h4>
        <Separator />
        <div className="hidden lg:block">
          <StyledTable
            headStyle="bg-foreground !text-background !rounded-none whitespace-nowrap"
            columns={visibleColumns}>
            {!saleOrderLineList?.length ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="text-center">
                  {i18n.t('No records available')}
                </TableCell>
              </TableRow>
            ) : (
              saleOrderLineList?.map((saleOrder: any) => {
                return (
                  <TableRow key={saleOrder.id} className="text-base">
                    <TableCell className="ps-6">
                      <div className="flex gap-2">
                        <Avatar className="rounded-sm h-6 w-6">
                          <AvatarImage
                            src={getProductImage(saleOrder.product)}
                          />
                        </Avatar>
                        <p className="font-medium mb-0">
                          {saleOrder.productName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap" align="right">
                      {saleOrder.qty}
                    </TableCell>
                    <TableCell>{saleOrder?.unit?.name}</TableCell>
                    <TableCell className="whitespace-nowrap" align="right">
                      {saleOrder.priceDiscounted}
                    </TableCell>
                    <TableCell className="whitespace-nowrap" align="right">
                      {saleOrder.exTaxTotal}
                    </TableCell>
                    <TableCell className="whitespace-nowrap" align="right">
                      {saleOrder?.taxLineSet[0]?.value}%
                    </TableCell>
                    {!hideDiscountColumn && (
                      <TableCell className="whitespace-nowrap" align="right">
                        {saleOrder.discountAmount}%
                      </TableCell>
                    )}
                    <TableCell
                      className="font-semibold whitespace-nowrap"
                      align="right">
                      {saleOrder.inTaxTotal}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </StyledTable>
        </div>
        <div className="block lg:hidden">
          <StyledTable
            headStyle="bg-foreground !text-background !rounded-none whitespace-nowrap"
            columns={PRODUCT_CARD_COLUMNS}>
            {!saleOrderLineList?.length ? (
              <TableRow>
                <TableCell
                  colSpan={PRODUCT_CARD_COLUMNS.length}
                  className="text-center">
                  {i18n.t('No records available')}
                </TableCell>
              </TableRow>
            ) : (
              saleOrderLineList?.map((saleOrder: any) => (
                <ProductCard
                  key={saleOrder.id}
                  saleOrder={saleOrder}
                  tenant={tenant}
                />
              ))
            )}
          </StyledTable>
        </div>
      </div>
    </>
  );
};
export default ProductsList;

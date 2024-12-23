'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {
  Separator,
  TableCell,
  TableRow,
  StyledTable,
  Avatar,
  AvatarImage,
} from '@/ui/components';
import {i18n} from '@/i18n';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import {ProductCard} from './product-card';
import {
  PRODUCT_COLUMNS,
  PRODUCT_CARD_COLUMNS,
} from '@/subapps/orders/common/constants/orders';

export const Products = ({saleOrderLineList, tenant}: any) => {
  const getProductImage = (product: any) => {
    return getImageURL(product?.picture?.id, tenant, {noimage: true});
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">{i18n.get('Products')}</h4>
        <Separator />
        <div className="hidden lg:block">
          <StyledTable
            headStyle="bg-foreground !text-background !rounded-none !px-4"
            columns={PRODUCT_COLUMNS}>
            {saleOrderLineList.length !== 0 ? (
              <TableRow>
                <TableCell
                  colSpan={PRODUCT_COLUMNS.length}
                  className="text-center">
                  {i18n.get('No records available')}
                </TableCell>
              </TableRow>
            ) : (
              saleOrderLineList.map((saleOrder: any) => {
                return (
                  <TableRow key={saleOrder.id} className="text-base">
                    <div className="flex items-center gap-2">
                      <Avatar className="rounded-sm h-6 w-6">
                        <AvatarImage src={getProductImage(saleOrder.product)} />
                      </Avatar>
                      <p className="font-semibold mb-0">
                        {saleOrder.productName}
                      </p>
                    </div>
                    <TableCell>{saleOrder.qty}</TableCell>
                    <TableCell>{saleOrder?.unit?.name}</TableCell>
                    <TableCell>{saleOrder.price}</TableCell>
                    <TableCell>{saleOrder.exTaxTotal}</TableCell>
                    <TableCell>{saleOrder?.taxLineSet[0]?.value}%</TableCell>
                    <TableCell>{saleOrder.discountAmount}%</TableCell>
                    <TableCell>{saleOrder.inTaxTotal}</TableCell>
                  </TableRow>
                );
              })
            )}
          </StyledTable>
        </div>
        <div className="block lg:hidden">
          <StyledTable
            headStyle="bg-foreground !text-background !rounded-none !text-sm !px-4"
            columns={PRODUCT_CARD_COLUMNS}>
            {saleOrderLineList.length !== 0 ? (
              <TableRow>
                <TableCell
                  colSpan={PRODUCT_CARD_COLUMNS.length}
                  className="text-center">
                  {i18n.get('No records available')}
                </TableCell>
              </TableRow>
            ) : (
              saleOrderLineList.map((saleOrder: any) => {
                return (
                  <ProductCard
                    key={saleOrder.id}
                    saleOrder={saleOrder}
                    tenant={tenant}
                  />
                );
              })
            )}
          </StyledTable>
        </div>
      </div>
    </>
  );
};
export default Products;

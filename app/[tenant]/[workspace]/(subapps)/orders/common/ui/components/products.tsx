'use client';

import React from 'react';

// ---- CORE IMPORTS ---- //
import {Separator, TableCell, TableRow, StyledTable} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {ProductCard} from './product-card';
import {
  PRODUCT_COLUMNS,
  PRODUCT_CARD_COLUMNS,
} from '@/subapps/orders/common/constants/orders';

export const Products = ({saleOrderLineList}: any) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">{i18n.get('Products')}</h4>
        <Separator />
        <div className="hidden lg:block">
          <StyledTable
            headStyle="bg-foreground !text-background !rounded-none !text-sm !px-4"
            columns={PRODUCT_COLUMNS}>
            {saleOrderLineList.map((product: any) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product?.unit?.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.exTaxTotal}</TableCell>
                  <TableCell>{product?.taxLineSet[0]?.value}%</TableCell>
                  <TableCell>{product.discountAmount}%</TableCell>
                  <TableCell>{product.inTaxTotal}</TableCell>
                </TableRow>
              );
            })}
          </StyledTable>
        </div>
        <div className="block lg:hidden">
          <StyledTable
            headStyle="bg-foreground !text-background !rounded-none !text-sm !px-4"
            columns={PRODUCT_CARD_COLUMNS}>
            {saleOrderLineList?.map((product: any) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </StyledTable>
        </div>
      </div>
    </>
  );
};
export default Products;

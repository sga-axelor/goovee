'use client';
import React from 'react';
import {Separator} from '@ui/components/separator';
import {TableCell, TableRow} from '@ui/components/table';
// ---- CORE IMPORTS ---- //
import {StyledTable} from '@ui/components/index';
import {i18n} from '@/lib/i18n';
// ---- LOCAL IMPORTS ---- //
import {ProductCard} from './product-card';
import {
  PRODUCT_COLUMNS,
  PRODUCT_CARD_COLUMNS,
} from '@/subapps/orders/common/constants/orders';
import styles from './styles.module.scss';
export const Products = ({saleOrderLineList}: any) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium mb-0">{i18n.get('Products')}</h4>
        <Separator />
        <div className="hidden lg:block">
          <StyledTable
            headStyle="bg-primary !text-background !rounded-none !text-sm !px-4"
            columns={PRODUCT_COLUMNS}>
            {saleOrderLineList.map((product: any) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product?.unit?.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.exTaxTotal}</TableCell>
                  <TableCell>{product?.taxLine?.value}%</TableCell>
                  <TableCell>{product.discountAmount}%</TableCell>
                  <TableCell>{product.inTaxTotal}</TableCell>
                </TableRow>
              );
            })}
          </StyledTable>
        </div>
        <div className="block lg:hidden">
          <StyledTable
            headStyle="bg-primary !text-background !rounded-none !text-sm !px-4"
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

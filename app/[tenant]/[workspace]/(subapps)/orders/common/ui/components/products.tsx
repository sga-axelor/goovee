'use client';

import React from 'react';
import {Box, Divider, TableCell, TableRow} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {StyledTable} from '@/ui/components';
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
      <Box d="flex" flexDirection="column" gap="1rem">
        <Box as="h2">{i18n.get('Products')}</Box>
        <Divider />
        <Box d={{base: 'none', lg: 'block'}}>
          <StyledTable columns={PRODUCT_COLUMNS}>
            {saleOrderLineList.map((product: any) => {
              return (
                <TableRow key={product.id}>
                  <TableCell className={styles['table-cell']}>
                    {product.productName}
                  </TableCell>
                  <TableCell className={styles['table-cell']}>
                    {product.qty}
                  </TableCell>
                  <TableCell className={styles['table-cell']}>
                    {product?.unit?.name}
                  </TableCell>
                  <TableCell className={styles['table-cell']}>
                    {product.price}
                  </TableCell>
                  <TableCell className={styles['table-cell']}>
                    {product.exTaxTotal}
                  </TableCell>
                  <TableCell className={styles['table-cell']}>
                    {product?.taxLine?.value}%
                  </TableCell>
                  <TableCell className={styles['table-cell']}>
                    {product.discountAmount}%
                  </TableCell>
                  <TableCell className={styles['table-cell']}>
                    {product.inTaxTotal}
                  </TableCell>
                </TableRow>
              );
            })}
          </StyledTable>
        </Box>
        <Box d={{base: 'block', lg: 'none'}}>
          <StyledTable columns={PRODUCT_CARD_COLUMNS}>
            {saleOrderLineList?.map((product: any) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </StyledTable>
        </Box>
      </Box>
    </>
  );
};

export default Products;

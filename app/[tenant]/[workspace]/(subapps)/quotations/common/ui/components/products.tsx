'use client';

import React from 'react';
import {Box, Divider, Image, TableCell, TableRow} from '@axelor/ui';

// ---- CORE IMPORTS ---- //
import {StyledTable} from '@/ui/components';
import {i18n} from '@/lib/i18n';

// ---- LOCAL IMPORTS ---- //
import {ProductCard} from './product-card';
import {
  PRODUCT_COLUMNS,
  PRODUCT_CARD_COLUMNS,
} from '@/subapps/quotations/common/constants/quotations';
import type {Product} from '@/subapps/quotations/common/types/quotations';
import styles from './styles.module.scss';

type Props = {
  saleOrderLineList: Product[];
};

export const Products = ({saleOrderLineList}: Props) => {
  return (
    <>
      <Box d="flex" flexDirection="column" gap="1rem">
        <Box as="h2">{i18n.get('Products')}</Box>
        <Divider />
        <Box d={{base: 'none', lg: 'block'}}>
          <StyledTable columns={PRODUCT_COLUMNS}>
            {saleOrderLineList?.map((product: any) => {
              return (
                <TableRow key={product.id}>
                  <TableCell py={3} px={4}>
                    <Box as="div" d="flex">
                      <Box d="flex" alignItems="center">
                        <Image
                          src=""
                          alt="product"
                          className={styles['product-image']}
                        />
                      </Box>
                      <Box d="flex" alignItems="center">
                        {product.productName}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell py={3} px={4}>
                    {product.qty}
                  </TableCell>
                  <TableCell py={3} px={4}>
                    {product?.unit?.name}
                  </TableCell>
                  <TableCell py={3} px={4}>
                    {product.price}
                  </TableCell>
                  <TableCell py={3} px={4}>
                    {product.exTaxTotal}
                  </TableCell>
                  <TableCell py={3} px={4}>
                    {product?.taxLine?.value}%
                  </TableCell>
                  <TableCell py={3} px={4}>
                    {product.discountAmount}%
                  </TableCell>
                  <TableCell py={3} px={4}>
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

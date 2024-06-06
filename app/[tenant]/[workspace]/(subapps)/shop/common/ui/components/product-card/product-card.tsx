'use client';

import React from 'react';
import {Box} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';
import {Button} from '@/components/ui/button';
// ---- CORE IMPORTS ---- //
import {BackgroundImage} from '@/ui/components';
import {getImageURL} from '@/utils/product';
import {i18n} from '@/lib/i18n';
import type {ComputedProduct, Product} from '@/types';

export type ProductCardProps = {
  product: ComputedProduct;
  quantity?: string | number;
  onAdd: (product: ComputedProduct) => Promise<void>;
  onClick: (product: Product) => void;
  displayPrices?: boolean;
};

export function ProductCard({
  product: computedProduct,
  quantity = 0,
  onAdd,
  onClick,
  displayPrices,
}: ProductCardProps) {
  const {product, price} = computedProduct;
  const {displayTwoPrices, displayPrimary, displaySecondary} = price;

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAdd(computedProduct);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick && onClick(product);
  };

  return (
    <Box className="flex flex-col justify-start cursor-pointer rounded-2xl min-h-[410px] bg-background text-primary">
      <Box onClick={handleClick}>
        <BackgroundImage
          src={getImageURL(product.images?.[0])}
          className="rounded-t-lg bg-cover relative h-[232px]">
          {Boolean(quantity) && (
            <Box
              border
              shadow="lg"
              position="absolute"
              bg="white"
              p={3}
              rounded="circle"
              style={{
                height: 60,
                width: 60,
                bottom: '1rem',
                right: '1rem',
              }}
              d="flex"
              alignItems="center"
              justifyContent="center">
              <Box as="p" mb={0} fontSize={5}>
                <b>{quantity}</b>
              </Box>
            </Box>
          )}
        </BackgroundImage>
        <Box className="py-4 px-6">
          <Box as="h5" className="text-base font-medium mt-0 mb-0">
            {i18n.getValueAttribute(product.name)}
          </Box>
          {displayPrices && (
            <>
              <Box as="h5" className="text-base font-semibold mt-2 mb-0">
                {displayPrimary}
              </Box>
              {displayTwoPrices && (
                <Box as="span" className="text-xs font-medium mt-0 mb-0">
                  {displaySecondary}
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
      <Box className="flex items-start justify-between p-6 pt-0">
        <Box
          as="span"
          className="text-xs font-medium mt-0 mb-0 text-destructive">
          Only 6 left
        </Box>
        <Button
          onClick={handleAdd}
          className="bg-primary rounded-full h-12 w-12">
          <Box d="flex">
            <MaterialIcon
              className="text-primary-foreground"
              icon="add_shopping_cart"
            />
          </Box>
        </Button>
      </Box>
    </Box>
  );
}

export default ProductCard;

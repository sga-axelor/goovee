'use client';

import React from 'react';
import {MdAddShoppingCart} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {BackgroundImage, Button} from '@/ui/components';
import {getProductImageURL} from '@/utils/files';
import {i18n} from '@/locale';
import {cn} from '@/utils/css';
import {useToast} from '@/ui/hooks';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {ComputedProduct, ID, Product} from '@/types';

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
  const {product, price, errorMessage} = computedProduct;
  const {displayTwoPrices, displayPrimary, displaySecondary} = price;
  const {toast} = useToast();
  const {tenant} = useWorkspace();

  const {outOfStockConfig} = product;
  const isOutOfStock = outOfStockConfig?.outOfStock;
  const showMessage = outOfStockConfig?.showMessage;
  const canBuy = outOfStockConfig?.canBuy;

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAdd(computedProduct);
    toast({
      title: i18n.t('Added to cart'),
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick && onClick(product);
  };

  return (
    <div
      className={cn(
        'flex flex-col justify-start cursor-pointer rounded-2xl bg-card text-card-foreground',
        {
          'min-h-[25.625rem]': displayPrices,
        },
      )}>
      <div onClick={handleClick}>
        <BackgroundImage
          className="rounded-t-lg bg-cover relative h-[14.5rem]"
          src={getProductImageURL(product.images?.[0] as ID, tenant)}>
          {Boolean(quantity) ? (
            <div className="border shadow-lg absolute bg-card p-4 rounded-full flex items-center justify-center w-[3.75rem] h-[3.75rem] bottom-4 right-4">
              <p className="mb-0 text-xl font-bold">{quantity}</p>
            </div>
          ) : (
            ''
          )}
        </BackgroundImage>
        <div className="py-4 px-6">
          <h5 className="font-medium line-clamp-1">
            {i18n.tattr(product.name)}
          </h5>
          {displayPrices && (
            <>
              <h5 className="font-semibold mt-2">{displayPrimary}</h5>
              {displayTwoPrices && (
                <span className="text-xs font-medium">{displaySecondary}</span>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-start justify-between p-6 pt-0">
        <div>
          {showMessage && isOutOfStock && (
            <p className="text-xs font-bold mt-0 mb-0 text-destructive">
              {i18n.t('Out of stock')}
            </p>
          )}
          {errorMessage && (
            <p className="text-xs font-bold mt-0 mb-0 text-destructive">
              {i18n.t('Price may be incorrect')}
            </p>
          )}
        </div>
        {canBuy && (
          <Button
            onClick={handleAdd}
            className="rounded-full h-12 w-12 p-2 ml-auto">
            <MdAddShoppingCart className="text-2xl" />
          </Button>
        )}
      </div>
    </div>
  );
}
export default ProductCard;

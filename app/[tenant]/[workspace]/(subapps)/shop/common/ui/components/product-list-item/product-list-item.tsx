'use client';
import React from 'react';
import {MdAddShoppingCart} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button, BackgroundImage} from '@/ui/components';
import {cn} from '@/utils/css';
import {getImageURL} from '@/utils/files';
import {useResponsive} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {ComputedProduct, ID, Product} from '@/types';

export type ProductListItemProps = {
  product: ComputedProduct;
  quantity?: string | number;
  onAdd: (product: ComputedProduct) => Promise<void>;
  onClick: (product: Product) => void;
  displayPrices?: boolean;
};

export function ProductListItem({
  product: computedProduct,
  quantity = 0,
  onAdd,
  onClick,
  displayPrices,
}: ProductListItemProps) {
  const {product, price} = computedProduct;
  const {displayTwoPrices, displayPrimary, displaySecondary} = price;
  const {tenant} = useWorkspace();

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAdd(computedProduct);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick && onClick(product);
  };

  const res: any = useResponsive();
  const large = ['md', 'lg', 'xl', 'xxl'].some(x => res[x]);

  return (
    <div className="cursor-pointer rounded-2xl grid grid-cols-1 md:grid-cols-[14.875rem_1fr] gap-6 w-full bg-card text-card-foreground">
      <BackgroundImage
        className="rounded-l-lg relative bg-cover md:w-[14.875rem] w-[5rem] md:h-[14.6875rem] h-[5rem]"
        src={getImageURL(product.images?.[0] as ID, tenant)}>
        {Boolean(quantity) && (
          <div className="border shadow-lg absolute bottom-4 right-4 bg-card p-1 md:p-4 rounded-full flex items-center justify-center w-[1.875rem] md:w-[3.75rem] h-[1.875rem] md:h-[3.75rem]">
            <p className="mb-0 text-sm md:text-xl">{quantity}</p>
          </div>
        )}
      </BackgroundImage>
      <div className="p-6 pl-6 md:pl-0 flex flex-col justify-between">
        <div onClick={handleClick}>
          <>
            <div className="flex-col md:flex-row flex justify-between mb-6">
              <div>
                <p className="font-medium mb-2 md:mb-0">
                  {i18n.getValueAttribute(product.name)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {displayPrices && (
                  <>
                    <h4 className="text-xl font-semibold mb-0">
                      {displayPrimary}
                    </h4>
                    {displayTwoPrices && (
                      <p className="text-sm font-medium mt-2 mb-0">
                        {displaySecondary}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            <p
              className={cn('text-xs mb-4 md:mb-0', {'line-clamp-3': !large})}
              dangerouslySetInnerHTML={{
                __html: product.description || '',
              }}></p>
          </>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAdd}
            className="flex gap-2 items-center rounded-full w-12 md:w-auto h-12 md:h-auto">
            <div className="inline-flex">
              <MdAddShoppingCart className="text-2xl" />
            </div>
            {large && (
              <p className="text-sm font-medium mb-0 text-primary-foreground">
                {i18n.get('Add to cart')}
              </p>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ProductListItem;

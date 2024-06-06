"use client";

import React from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { Button } from "@ui/components/button";
// ---- CORE IMPORTS ---- //
import { BackgroundImage } from "@/ui/components";
import { getImageURL } from "@/utils/product";
import { i18n } from "@/lib/i18n";
import type { ComputedProduct, Product } from "@/types";
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
  const { product, price } = computedProduct;
  const { displayTwoPrices, displayPrimary, displaySecondary } = price;
  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAdd(computedProduct);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick && onClick(product);
  };

  return (
    <div className="flex flex-col justify-start cursor-pointer rounded-2xl min-h-[410px] bg-background text-primary">
      <div onClick={handleClick}>
        <BackgroundImage
          className="rounded-t-lg bg-cover relative h-[232px]"
          src={getImageURL(product.images?.[0])}
        >
          {Boolean(quantity) && (
            <div className="border shadow-lg absolute bg-white p-4 rounded-full flex items-center justify-center w-[60px] h-[60px] bottom-4 right-4">
              <p className="mb-0 text-xl font-bold">{quantity}</p>
            </div>
          )}
        </BackgroundImage>
        <div className="py-4 px-6">
          <h5 className="text-base font-medium mt-0 mb-0">
            {i18n.getValueAttribute(product.name)}
          </h5>
          {displayPrices && (
            <>
              <h5 className="text-base font-semibold mt-2 mb-0">
                {displayPrimary}
              </h5>
              {displayTwoPrices && (
                <span className="text-xs font-medium mt-0 mb-0">
                  {displaySecondary}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-start justify-between p-6 pt-0">
        <span className="text-xs font-medium mt-0 mb-0 text-destructive">
          Only 6 left
        </span>
        <Button
          onClick={handleAdd}
          className="bg-primary rounded-full h-12 w-12 p-2"
        >
          <MdAddShoppingCart className="text-primary-foreground text-2xl" />
        </Button>
      </div>
    </div>
  );
}
export default ProductCard;
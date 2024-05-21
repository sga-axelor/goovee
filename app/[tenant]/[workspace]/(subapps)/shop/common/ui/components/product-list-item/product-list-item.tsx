"use client";

import React from "react";

import { Box } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";
import { Button } from "@/components/ui/button"
// ---- CORE IMPORTS ---- //
import { BackgroundImage } from "@/ui/components";
import { getImageURL } from "@/utils/product";
import { useResponsive } from "@/ui/hooks";
import { i18n } from "@/lib/i18n";
import type { ComputedProduct, Product } from "@/types";

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
  const { product, price } = computedProduct;
  const { displayTwoPrices, displayPrimary, displaySecondary } = price;

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAdd(computedProduct);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick && onClick(product);
  };

  const res: any = useResponsive();
  const large = ["md", "lg", "xl", "xxl"].some((x) => res[x]);

  const clamp = (window as any)?.$clamp;

  return (
    <Box
      className="cursor-pointer rounded-2xl grid grid-cols-[238px_1fr] gap-6 w-full bg-background text-primary"
    >
      <BackgroundImage
        position="relative"
        height={large ? 235 : 80}
        width={large ? 238 : 80}
        src={getImageURL(product.images?.[0])}
        border
      >
        {Boolean(quantity) && (
          <Box
            border
            shadow="lg"
            position="absolute"
            bg="white"
            p={3}
            rounded="circle"
            style={{
              height: large ? 60 : 20,
              width: large ? 60 : 20,
              bottom: "1rem",
              right: "1rem",
            }}
            d="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box as="p" mb={0} fontSize={5}>
              <b>{quantity}</b>
            </Box>
          </Box>
        )}
      </BackgroundImage>
      <Box className="p-6 pl-0 flex flex-col justify-between">
        <Box onClick={handleClick}>
          <>
            <Box className="flex justify-between mb-6">
              <Box>
                <Box as={large ? "h5" : "p"} className="text-base font-medium mb-0">
                  {i18n.getValueAttribute(product.name)}
                </Box>
              </Box>
              <Box flexShrink={0} textAlign="end">
                {displayPrices && (
                  <>
                    <Box as={large ? "h4" : "p"} className="text-xl font-semibold mb-0">
                    {displayPrimary}
                    </Box>
                    {displayTwoPrices && (
                      <Box as={large ? "h6" : "small"} className="text-sm font-medium mt-2 mb-0">
                        {displaySecondary}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
            <Box
              as="p"
              className="text-xs mb-0"
              dangerouslySetInnerHTML={{
                __html: product.description || "",
              }}
              ref={(clampee: any) => {
                !large && clampee && clamp?.(clampee, { clamp: 3 });
              }}
            ></Box>
          </>
        </Box>
        <Box className="flex justify-end">
          <Button
            onClick={handleAdd}
            className="flex bg-primary gap-4 items-center"
          >
            <Box className="inline-flex">
              <MaterialIcon icon="add_shopping_cart" className="text-primary-foreground" />
            </Box>
            {large && (
              <Box as="p" className="text-sm font-medium mb-0 text-primary-foreground">
                {i18n.get("Add to cart")}
              </Box>
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductListItem;

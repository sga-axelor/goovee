"use client";

import React from "react";
import { Box, Button } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

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
    <Box
      d="flex"
      flexDirection="column"
      justifyContent="space-between"
      p={3}
      shadow="lg"
      bg="white"
      className="pointer"
      style={{ borderRadius: "1rem", minHeight: 500 }}
    >
      <Box onClick={handleClick}>
        <BackgroundImage
          position="relative"
          height={260}
          src={getImageURL(product.images?.[0])}
          style={{ backgroundSize: "cover" }}
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
                height: 60,
                width: 60,
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
        <Box as="h5" mb={0} mt={3}>
          {i18n.getValueAttribute(product.name)}
        </Box>
        {displayPrices && (
          <>
            <Box as="h4" mt={3} mb={0}>
              <b>{displayPrimary}</b>
            </Box>
            {displayTwoPrices && (
              <Box as="h6" mt={2} mb={0}>
                <b>{displaySecondary}</b>
              </Box>
            )}
          </>
        )}
      </Box>
      <Box d="flex" alignItems="center" justifyContent="flex-end" pb={4} pe={2}>
        <Button
          p={3}
          variant="primary"
          rounded="circle"
          size="sm"
          onClick={handleAdd}
        >
          <Box d="flex">
            <MaterialIcon icon="add_shopping_cart" />
          </Box>
        </Button>
      </Box>
    </Box>
  );
}

export default ProductCard;

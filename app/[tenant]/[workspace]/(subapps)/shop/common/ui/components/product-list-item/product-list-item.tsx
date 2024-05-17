"use client";

import React from "react";

import { Box, Button } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

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
      shadow="lg"
      bg="white"
      d="grid"
      gridTemplateColumns="auto 1fr"
      gap="1rem"
      p={3}
      w={100}
      className="pointer"
      style={{ borderRadius: "1rem" }}
    >
      <BackgroundImage
        position="relative"
        height={large ? 260 : 80}
        width={large ? 260 : 80}
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
      <Box d="flex" flexDirection="column" justifyContent="space-between">
        <Box onClick={handleClick}>
          <>
            <Box d="flex" justifyContent="space-between" mb={2} gap="0.5rem">
              <Box>
                <Box as={large ? "h5" : "p"} mb={0} fontWeight="bold">
                  {i18n.getValueAttribute(product.name)}
                </Box>
              </Box>
              <Box flexShrink={0} textAlign="end">
                {displayPrices && (
                  <>
                    <Box as={large ? "h4" : "p"} mb={0}>
                      <b>{displayPrimary}</b>
                    </Box>
                    {displayTwoPrices && (
                      <Box as={large ? "h6" : "small"} mt={2} mb={0}>
                        <b>{displaySecondary}</b>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
            <Box
              as="p"
              fontSize={6}
              dangerouslySetInnerHTML={{
                __html: product.description || "",
              }}
              ref={(clampee: any) => {
                !large && clampee && clamp?.(clampee, { clamp: 3 });
              }}
            ></Box>
          </>
        </Box>
        <Box textAlign="end">
          <Button
            gap="1rem"
            p={3}
            variant="primary"
            rounded="pill"
            onClick={handleAdd}
            d="inline-flex"
            alignItems="center"
            size="sm"
          >
            <Box d="inline-flex">
              <MaterialIcon icon="add_shopping_cart" />
            </Box>
            {large && (
              <Box as="p" d="inline-block" mb={0} fontSize={6}>
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

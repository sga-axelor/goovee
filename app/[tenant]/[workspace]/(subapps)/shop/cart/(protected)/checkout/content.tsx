"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Divider, Input } from "@axelor/ui";

// ---- CORE IMPORTS ---- //
import { BackgroundImage } from "@/ui/components";
import { useCart } from "@/app/[tenant]/[workspace]/cart-context";
import { scale } from "@/utils";
import { computeTotal } from "@/utils/cart";
import { getImageURL } from "@/utils/product";
import { i18n } from "@/lib/i18n";
import type { PortalWorkspace } from "@/types";

// ---- LOCAL IMPORTS ---- //
import { findProduct } from "@/app/[tenant]/[workspace]/(subapps)/shop/common/actions/cart";
import styles from "./content.module.scss";

const SHIPPING_TYPE = {
  REGULAR: "regular",
  FAST: "fast",
};

const SHIPPING_TYPE_COST = {
  [SHIPPING_TYPE.REGULAR]: 2,
  [SHIPPING_TYPE.FAST]: 5,
};

function Summary({ cart }: any) {
  return (
    <Box bg="white" p={3} rounded={2}>
      <Title text={i18n.get("Summary")} />
      <Box pt={3} d="flex" flexDirection="column" gap="1rem">
        {cart.items.map(
          ({
            computedProduct: { product, price } = {},
            quantity,
            note,
          }: any = {}) => (
            <Box d="flex" key={product?.id} gap="1rem">
              <BackgroundImage
                src={getImageURL(product?.images?.[0])}
                height={100}
                width={100}
                rounded={2}
              />
              <Box>
                <Title
                  as="h6"
                  text={i18n.getValueAttribute(product?.name)}
                ></Title>
                {note && (
                  <Box>
                    {i18n.get("Note")} : {note}
                  </Box>
                )}
                <Box d="flex" alignItems="center" gap="1rem">
                  <Box as="p">{i18n.get("Quantity")}</Box>
                  <Box as="p" px={3} border rounded>
                    {quantity}
                  </Box>
                </Box>
                <Title as="h5" text={price?.displayPrimary}></Title>
              </Box>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}

function Total({ cart, shippingType, workspace }: any) {
  const {
    total,
    displayTotal,
    scale: { currency: currencyScale },
    currency: { symbol: currencySymbol },
  } = computeTotal({ cart, workspace });

  const shipping = Number(
    scale(SHIPPING_TYPE_COST[shippingType], currencyScale)
  ) as number;

  const totalWithShipping = Number(total) + Number(shipping);

  return (
    <Box bg="white" p={3} rounded={2}>
      <Title text="Total" />
      <Divider my={3} />
      <Box d="flex" justifyContent="space-between">
        <Box as="p" m={0}>
          {i18n.get("Products")}:
        </Box>
        <Box>
          <Box textAlign="end" as="p" m={0}>
            {displayTotal}
          </Box>
        </Box>
      </Box>
      <Box d="flex" alignItems="center" justifyContent="space-between" mt={3}>
        <Box as="p" m={0}>
          {i18n.get("Shipping")}:
        </Box>
        <Box>
          <Box fontSize={5} as="p" m={0}>
            {`${shipping} ${currencySymbol}`}
          </Box>
        </Box>
      </Box>
      <Divider my={3} />
      <Box d="flex" alignItems="center" justifyContent="space-between">
        <Box as="p" m={0}>
          {i18n.get("Total price")}:
        </Box>
        <Box>
          <Box fontSize={4} as="p" fontWeight="bold" m={0}>
            {`${totalWithShipping} ${currencySymbol}`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Contact() {
  return (
    <Box bg="white" p={3} rounded={2}>
      <Title text={i18n.get("Contact")} />
      <Divider my={2} />
      <Box p={3} rounded={2} border>
        <Title as="h4" text={i18n.get("Invoicing and delivery address")} />
        <Button variant="primary" rounded="pill" size="lg">
          {i18n.get("Create an address")}
        </Button>
      </Box>
    </Box>
  );
}

function Shipping({ value, onChange }: { value: string; onChange: any }) {
  return (
    <Box bg="white" p={3} rounded={2}>
      <Title text={i18n.get("Shipping Method")} />
      <Divider my={2} />
      <Box border rounded={2} d="flex" p={2} gap={8} alignItems="center">
        <Input
          m={0}
          type="radio"
          name="shipping"
          value={SHIPPING_TYPE.REGULAR}
          checked={value === SHIPPING_TYPE.REGULAR}
          className={styles.radio}
          onChange={onChange}
        />
        <Title as="h5" m={0} text={i18n.get("Regular Shipping")} />
        <Title
          as="p"
          m={0}
          text={`5-10 ${i18n.get("Business Days")}`}
          color="muted"
        />
        <Box flexGrow={1} />
        <Title as="p" m={0} text="2.00 €" />
      </Box>
      <Box mt={2} border rounded={2} d="flex" p={2} gap={8} alignItems="center">
        <Input
          m={0}
          type="radio"
          name="shipping"
          value={SHIPPING_TYPE.FAST}
          checked={value === SHIPPING_TYPE.FAST}
          className={styles.radio}
          onChange={onChange}
        />
        <Title as="h5" m={0} text={i18n.get("Fast Shipping")} />
        <Title
          as="p"
          m={0}
          text={`2-3 ${i18n.get("Business Days")}`}
          color="muted"
        />
        <Box flexGrow={1} />
        <Title as="p" m={0} text="5.00 €" />
      </Box>
    </Box>
  );
}

function Title({ text, ...rest }: { text: string } & any) {
  return (
    <Box as="h3" fontWeight="bold" {...rest}>
      {text}
    </Box>
  );
}

export default function Content({ workspace }: { workspace: PortalWorkspace }) {
  const [shippingType, setShippingType] = useState<string>(
    SHIPPING_TYPE.REGULAR
  );
  const { cart } = useCart();
  const [computedProducts, setComputedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleChangeShippingType = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingType(event.target.value);
  };

  useEffect(() => {
    const init = async () => {
      if (!computedProducts?.length && cart) {
        await Promise.all(cart.items.map((i: any) => findProduct(i.product)))
          .then((computedProducts) => {
            setComputedProducts(computedProducts);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };
    init();
  }, [cart, computedProducts]);

  const $cart = useMemo(
    () => ({
      ...cart,
      items: [
        ...cart?.items?.map((i: any) => ({
          ...i,
          computedProduct: computedProducts.find(
            (cp) => Number(cp?.product?.id) === Number(i.product)
          ),
        })),
      ],
    }),
    [cart, computedProducts]
  );

  if (loading) {
    return <p>{i18n.get("Loading")}...</p>;
  }

  return (
    <>
      <Box as="h2" mb={3} fontWeight="bold">
        {i18n.get("Confirm Cart")}
      </Box>
      <Box
        d="grid"
        gridTemplateColumns={{ base: "1fr", md: "2fr 1fr" }}
        gap="1rem"
      >
        <Box>
          <Box d="flex" flexDirection="column" gap="1rem">
            <Contact />
            <Shipping
              value={shippingType}
              onChange={handleChangeShippingType}
            />
            <Button rounded="pill" variant="primary" size="lg">
              {i18n.get("Continue to payment")}
            </Button>
          </Box>
        </Box>
        <Box>
          <Box d="flex" flexDirection="column" gap="1rem">
            <Summary cart={$cart} />
            <Total
              cart={$cart}
              shippingType={shippingType}
              workspace={workspace}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}

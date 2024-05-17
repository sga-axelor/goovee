"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Box, Button, Divider, InputLabel, useClassNames } from "@axelor/ui";
import { MaterialIcon } from "@axelor/ui/icons/material-icon";

// ---- CORE IMPORTS ---- //
import { BackgroundImage, Quantity } from "@/ui/components";
import { useQuantity } from "@/ui/hooks";
import { useCart } from "@/app/[tenant]/[workspace]/cart-context";
import { computeTotal } from "@/utils/cart";
import { getImageURL } from "@/utils/product";
import { useWorkspace } from "@/app/[tenant]/[workspace]/workspace-context";
import { i18n } from "@/lib/i18n";
import type { Cart, Product, PortalWorkspace } from "@/types";

// ---- LOCAL IMPORTS ---- //
import { findProduct } from "@/app/[tenant]/[workspace]/(subapps)/shop/common/actions/cart";

function CartItem({ item, disabled, handleRemove, displayPrices }: any) {
  const [updating, setUpdating] = useState(false);
  const { updateQuantity, getProductNote, setProductNote } = useCart();
  const { workspaceURI } = useWorkspace();
  const [note, setNote] = useState("");

  if (!item.computedProduct) return null;

  const { product, price } = item.computedProduct;

  const { quantity, increment, decrement } = useQuantity({
    initialValue: Number(item.quantity),
  });

  const handleUpdateQuantity = useCallback(
    async ({
      productId,
      quantity,
    }: {
      productId: Product["id"];
      quantity: number;
    }) => {
      setUpdating(true);
      await updateQuantity({ productId, quantity });
      setUpdating(false);
    },
    []
  );

  useEffect(() => {
    if (Number(quantity) !== Number(item.quantity)) {
      handleUpdateQuantity({
        productId: item.computedProduct.product.id,
        quantity,
      });
    }
  }, [quantity, item, handleUpdateQuantity]);

  const handleChangeNote = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setNote(value);
    await setProductNote(product.id, value);
  };

  useEffect(() => {
    (async () => {
      if (!product) return;
      const note = await getProductNote(product.id);
      setNote(note);
    })();
  }, [product]);

  const cs = useClassNames();

  return (
    <Box
      key={item.id}
      d="flex"
      alignItems="center"
      gap={8}
      bg="white"
      p={3}
      rounded={2}
    >
      <BackgroundImage
        rounded={2}
        height={200}
        width={200}
        src={getImageURL(product?.images?.[0])}
      />
      <Box d="flex" flexDirection="column" h={100} py={2}>
        <Link
          href={`${workspaceURI}/shop/product/${encodeURIComponent(
            product.name
          )}-${product.id}`}
        >
          <Box as="h4">{i18n.getValueAttribute(product.name)}</Box>
        </Link>
        {product.allowCustomNote && (
          <Box>
            <InputLabel color="secondary">{i18n.get("Note")}</InputLabel>
            <textarea
              className={cs("form-control")}
              value={note}
              onChange={handleChangeNote}
            />
          </Box>
        )}
        <Box flexGrow={1} />
        <Box as="p" mb={1} fontSize={5}>
          {i18n.get("Quantity")}
        </Box>
        <Quantity
          value={quantity}
          disabled={updating}
          onIncrement={increment}
          onDecrement={decrement}
        />
      </Box>
      <Box flexGrow={1} />
      <Box d="flex" flexDirection="column" h={100} py={2}>
        <Box as="p" fontSize={4} fontWeight="bold">
          {displayPrices && price.displayPrimary}
        </Box>
        <Box flexGrow={1} />
        <Button
          color="danger"
          disabled={disabled || updating}
          onClick={handleRemove(product)}
        >
          <Box as={MaterialIcon} verticalAlign="middle" icon="delete" />
        </Button>
      </Box>
    </Box>
  );
}

function CartItems({
  cart,
  disabled,
  onRemove,
  workspace,
}: {
  cart: Cart;
  disabled?: boolean;
  onRemove: (product: Product) => Promise<void>;
  workspace?: PortalWorkspace;
}) {
  const handleRemove =
    (product: Product) => (event: React.MouseEvent<HTMLElement>) => {
      onRemove(product);
    };

  return (
    <Box d="flex" flexDirection="column" gap={4}>
      {cart?.items?.map((item: any) => (
        <CartItem
          key={item?.computedProduct?.product?.id}
          item={item}
          disabled={disabled}
          handleRemove={handleRemove}
          displayPrices={workspace?.config?.displayPrices}
        />
      ))}
    </Box>
  );
}

function CartSummary({
  cart,
  onRequestQuotation,
  hideRequestQuotation,
  hideCheckout,
  workspace,
}: {
  cart: Cart;
  onRequestQuotation: any;
  hideRequestQuotation?: boolean;
  hideCheckout?: boolean;
  workspace?: PortalWorkspace;
}) {
  const pathname = usePathname();

  const noitem = !cart?.items?.length;
  const { displayTotal } = computeTotal({ cart, workspace });

  const { workspaceURI } = useWorkspace();
  const { data: session } = useSession();

  const authenticated = session?.user?.id;

  return (
    <Box p={3} bg="white" rounded={2}>
      {workspace?.config?.displayPrices && (
        <>
          <Box as="p" fontSize={3} fontWeight="bold">
            {i18n.get("Total")}
          </Box>
          <Divider mb={2} />
          <Box d="flex" justifyContent="space-between">
            <Box as="p" fontSize={5}>
              {i18n.get("Products")}
            </Box>
            <Box as="p" fontSize={5} fontWeight="bold">
              {displayTotal}
            </Box>
          </Box>
          <Box d="flex" justifyContent="space-between">
            <Box as="p" fontSize={5} mb={0}>
              {i18n.get("Shipping")}
            </Box>
            <Box as="p" fontSize={5} mb={0} fontWeight="bold">
              {i18n.get("To be determined")}
            </Box>
          </Box>
          <Divider mt={2} mb={2} />
          <Box d="flex" justifyContent="space-between" mt={3} mb={3}>
            <Box as="p" fontSize={4} mb={0}>
              <b>{i18n.get("Total Price")}</b>
            </Box>
            <Box as="p" fontSize={4} mb={0} fontWeight="bold">
              {displayTotal}
            </Box>
          </Box>
        </>
      )}
      {authenticated ? (
        <>
          {!hideCheckout && (
            <Link href={`${workspaceURI}/shop/cart/checkout`}>
              <Button
                d="block"
                variant="primary"
                size="lg"
                mb={2}
                w={100}
                disabled={noitem}
              >
                {i18n.get("Checkout")}
              </Button>
            </Link>
          )}
          {!hideRequestQuotation && (
            <Button
              d="block"
              variant="primary"
              outline
              mb={2}
              size="lg"
              w={100}
              disabled={noitem}
              onClick={onRequestQuotation}
            >
              {i18n.get("Request Quotation")}
            </Button>
          )}
        </>
      ) : (
        <Link
          href={`/auth/login?callbackurl=${encodeURIComponent(
            pathname
          )}&workspaceURI=${encodeURIComponent(workspaceURI)}`}
        >
          <Button d="block" variant="primary" mb={2} size="lg" w={100}>
            {i18n.get("Login for checkout")}
          </Button>
        </Link>
      )}

      <hr />
      <Box d="flex" alignItems="center">
        <MaterialIcon icon="chevron_left" />
        <Button>
          <Link href={`${workspaceURI}/shop`}>
            <Box as="p" mb={0}>
              {i18n.get("Continue Shopping")}
            </Box>
          </Link>
        </Button>
      </Box>
    </Box>
  );
}

export default function Content({
  workspace,
}: {
  workspace?: PortalWorkspace;
}) {
  const { cart, removeItem } = useCart();
  const { workspaceURI } = useWorkspace();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [computedProducts, setComputedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRemove = async (product: Product) => {
    if (window?.confirm(`Do you want to remove ${product?.name}`)) {
      setUpdating(true);
      await removeItem(product.id);
      setUpdating(false);
    }
  };

  const handleRequestQuotation = async () => {
    if (window.confirm("Do you want to request quotation")) {
      router.replace(`${workspaceURI}/shop/cart/request-quotation`);
    }
  };

  useEffect(() => {
    const init = async () => {
      const computedProductIDs = computedProducts
        .map((cp) => cp?.product?.id)
        .filter(Boolean);
      const cartItemIDs = cart?.items?.map((i: any) => i.product);

      const diff = cartItemIDs.filter(
        (id: string) => !computedProductIDs.includes(id)
      );

      if (diff.length) {
        await Promise.all(
          cart.items.map((i: any) => findProduct({ id: i.product, workspace }))
        )
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
      <Box as="h2" mb={3}>
        <b>{i18n.get("Cart")}</b>
      </Box>
      <Box
        d="grid"
        gridTemplateColumns={{ base: "1fr", md: "2fr 1fr" }}
        gap="1rem"
      >
        {cart?.items?.length ? (
          <CartItems
            cart={$cart}
            onRemove={handleRemove}
            disabled={updating}
            workspace={workspace}
          />
        ) : (
          <Box as="p" fontSize={5} fontWeight="bold">
            {i18n.get("Your cart is empty.")}
          </Box>
        )}
        <CartSummary
          cart={$cart}
          onRequestQuotation={handleRequestQuotation}
          workspace={workspace}
          hideRequestQuotation={!workspace?.config?.requestQuotation}
          hideCheckout={!workspace?.config?.confirmOrder}
        />
      </Box>
    </>
  );
}

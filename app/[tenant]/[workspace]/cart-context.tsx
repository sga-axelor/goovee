"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";

// ---- CORE IMPORTS ---- //
import { PREFIX_CART_KEY } from "@/constants";
import { getitem, setitem } from "@/lib/storage";
import type { Product } from "@/types";
import { useWorkspace } from "./workspace-context";

const CartContext = React.createContext<any>({});

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { workspaceURI } = useWorkspace();

  const CART_KEY = PREFIX_CART_KEY + workspaceURI;

  const clearCart = async () => {
    setCart({
      items: [],
    });
  };

  const getProductQuantity = async (productId: Product["id"]) => {
    return (
      cart?.items.find((i: any) => Number(i?.product) === Number(productId))
        ?.quantity || 0
    );
  };

  const getProductNote = async (productId: Product["id"]) => {
    return (
      cart?.items.find((i: any) => Number(i?.product) === Number(productId))
        ?.note || ""
    );
  };

  const setProductNote = async (productId: Product["id"], note: string) => {
    setCart((cart: any) => {
      return {
        ...cart,
        items: cart.items.map((i: any) => {
          if (Number(i.product) === Number(productId)) {
            i.note = note;
          }

          return i;
        }),
      };
    });
  };

  const addItem = async ({
    productId,
    quantity,
  }: {
    productId: Product["id"];
    quantity: string | number;
  }) => {
    const existing = await getProductQuantity(productId);

    if (!existing) {
      setCart((cart: any) => ({
        ...cart,
        items: [
          ...cart?.items,
          {
            product: productId,
            quantity,
          },
        ],
      }));
    } else {
      await incrementQuantity({ productId, quantity });
    }
  };

  const incrementQuantity = async ({
    productId,
    quantity,
  }: {
    productId: Product["id"];
    quantity: string | number;
  }) => {
    const existing = await getProductQuantity(productId);

    if (!existing) {
      return await addItem({ productId, quantity });
    }

    setCart((cart: any) => {
      return {
        ...cart,
        items: cart.items.map((i: any) => {
          if (Number(i.product) === Number(productId)) {
            i.quantity = Number(i.quantity) + Number(quantity);
          }

          return i;
        }),
      };
    });
  };

  const decrementQuantity = async ({
    productId,
    quantity,
  }: {
    productId: Product["id"];
    quantity: string | number;
  }) => {
    const existing = await getProductQuantity(productId);

    if (existing) {
      setCart((cart: any) => {
        return {
          ...cart,
          items: cart.items.map((i: any) => {
            if (Number(i.product) === Number(productId)) {
              i.quantity = Number(i.quantity) - Number(quantity);
            }

            return i;
          }),
        };
      });
    }
  };

  const updateQuantity = async ({
    productId,
    quantity,
  }: {
    productId: Product["id"];
    quantity: string | number;
  }) => {
    const existing = await getProductQuantity(productId);

    if (!existing) {
      return await addItem({ productId, quantity });
    }

    setCart((cart: any) => {
      return {
        ...cart,
        items: cart.items.map((i: any) => {
          if (Number(i.product) === Number(productId)) {
            i.quantity = Number(quantity);
          }

          return i;
        }),
      };
    });
  };

  const removeItem = async (productId: Product["id"]) => {
    const existing = await getProductQuantity(productId);

    if (existing) {
      setCart((cart: any) => {
        return {
          ...cart,
          items: cart.items.filter(
            (i: any) => Number(i.product) !== Number(productId)
          ),
        };
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        let cart = await getitem(CART_KEY);

        if (!cart) {
          cart = { items: [] };
        }

        setCart(cart);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [workspaceURI]);

  useEffect(() => {
    const updateCart = async () => {
      await setitem(CART_KEY, cart);
    };
    updateCart();
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      addItem,
      getProductQuantity,
      incrementQuantity,
      updateQuantity,
      removeItem,
      clearCart,
      getProductNote,
      setProductNote,
    }),
    [
      cart,
      addItem,
      getProductQuantity,
      incrementQuantity,
      updateQuantity,
      removeItem,
      clearCart,
      getProductNote,
      setProductNote,
    ]
  );

  if (loading) {
    return null;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

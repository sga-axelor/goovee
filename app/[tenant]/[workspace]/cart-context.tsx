'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// ---- CORE IMPORTS ---- //
import {PREFIX_CART_KEY} from '@/constants';
import {getitem, setitem} from '@/lib/storage';
import type {Product} from '@/types';
import {useWorkspace} from './workspace-context';

const CartContext = React.createContext<any>({});

export default function CartContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const {workspaceURI} = useWorkspace();

  const CART_KEY = useMemo(
    () => PREFIX_CART_KEY + workspaceURI,
    [workspaceURI],
  );

  const clearCart = useCallback(async () => {
    setCart({
      items: [],
    });
  }, []);

  const getProductQuantity = useCallback(
    async (productId: Product['id']) => {
      return (
        cart?.items.find((i: any) => Number(i?.product) === Number(productId))
          ?.quantity || 0
      );
    },
    [cart?.items],
  );

  const getProductNote = useCallback(
    async (productId: Product['id']) => {
      return (
        cart?.items.find((i: any) => Number(i?.product) === Number(productId))
          ?.note || ''
      );
    },
    [cart?.items],
  );

  const setProductNote = useCallback(
    async (productId: Product['id'], note: string) => {
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
    },
    [],
  );

  const addItem = useCallback(
    async ({
      productId,
      quantity,
    }: {
      productId: Product['id'];
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
        setCart((cart: any) => ({
          ...cart,
          items: cart.items.map((i: any) => {
            if (Number(i.product) === Number(productId)) {
              i.quantity = Number(i.quantity) + Number(quantity);
            }

            return i;
          }),
        }));
      }
    },
    [getProductQuantity],
  );

  const decrementQuantity = useCallback(
    async ({
      productId,
      quantity,
    }: {
      productId: Product['id'];
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
    },
    [getProductQuantity],
  );

  const updateQuantity = useCallback(
    async ({
      productId,
      quantity,
    }: {
      productId: Product['id'];
      quantity: string | number;
    }) => {
      const existing = await getProductQuantity(productId);

      if (!existing) {
        return await addItem({productId, quantity});
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
    },
    [addItem, getProductQuantity],
  );

  const removeItem = useCallback(
    async (productId: Product['id']) => {
      const existing = await getProductQuantity(productId);

      if (existing) {
        setCart((cart: any) => {
          return {
            ...cart,
            items: cart.items.filter(
              (i: any) => Number(i.product) !== Number(productId),
            ),
          };
        });
      }
    },
    [getProductQuantity],
  );

  useEffect(() => {
    const init = async () => {
      try {
        let cart = await getitem(CART_KEY);

        if (!cart) {
          cart = {items: []};
        }

        setCart(cart);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [CART_KEY, workspaceURI]);

  useEffect(() => {
    const updateCart = async () => {
      await setitem(CART_KEY, cart);
    };

    updateCart();
  }, [CART_KEY, cart]);

  const value = useMemo(
    () => ({
      cart,
      addItem,
      getProductQuantity,
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
      updateQuantity,
      removeItem,
      clearCart,
      getProductNote,
      setProductNote,
    ],
  );

  if (loading) {
    return null;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

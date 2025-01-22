'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {MdOutlineShoppingBasket} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Quantity,
  ThumbsCarousel,
  Label,
  Button,
  Breadcrumbs,
} from '@/ui/components';
import {useQuantity, useToast} from '@/ui/hooks';
import {i18n} from '@/locale';
import {getImageURL} from '@/utils/files';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import type {ComputedProduct, PortalWorkspace} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {Categories} from '..';
import {ProductMetaFieldView} from '../product-meta-field-view';

export function ProductView({
  product: computedProduct,
  workspace,
  breadcrumbs,
  categories,
  metaFields,
}: {
  categories?: any;
  product: ComputedProduct;
  workspace?: PortalWorkspace;
  breadcrumbs: any;
  metaFields: any;
}) {
  const router = useRouter();
  const {workspaceURI, tenant} = useWorkspace();
  const {product, price, errorMessage} = computedProduct;
  const [updating, setUpdating] = useState(false);
  const {quantity, increment, decrement, setQuantity} = useQuantity();
  const {updateQuantity, getProductQuantity, getProductNote, setProductNote} =
    useCart();
  const [cartQuantity, setCartQuantity] = useState(0);
  const [note, setNote] = useState('');
  const {toast} = useToast();

  const {outOfStockConfig} = product;
  const isOutOfStock = outOfStockConfig?.outOfStock;
  const showMessage = outOfStockConfig?.showMessage;
  const canBuy = outOfStockConfig?.canBuy;

  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (quantity < 1) {
      toast({
        variant: 'destructive',
        description: i18n.t('Enter valid quantity'),
      });
      return;
    }
    setUpdating(true);
    setCartQuantity(quantity);
    await updateQuantity({productId: product.id, quantity});
    toast({title: i18n.t('Added to cart')});
    setUpdating(false);
  };

  const handleChangeNote = async (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const {value} = event.target;
    setNote(value);
    await setProductNote(product.id, value);
  };
  const handleCategoryClick = (category: any) => {
    router.push(
      `${workspaceURI}/shop/category/${category.name}-${category.id}`,
    );
  };

  useEffect(() => {
    (async () => {
      if (!product) return;
      const quantity = await getProductQuantity(product.id);
      setCartQuantity(quantity);
      setQuantity(quantity || 1);
      const note = await getProductNote(product.id);
      setNote(note);
    })();
  }, [getProductNote, getProductQuantity, product, setQuantity]);

  return (
    <div>
      <Categories items={categories} onClick={handleCategoryClick} />
      <div className="container py-2">
        <div className="my-10">
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            onClick={handleCategoryClick}
          />
        </div>
        <div className="grid md:grid-cols-[36%_1fr] grid-cols-1 gap-5">
          <div className="overflow-hidden rounded-lg">
            <ThumbsCarousel
              images={product.images?.map(i => ({
                id: i as string,
                url: getImageURL(i, tenant) as string,
              }))}
            />
          </div>
          <div className="rounded-lg border bg-card text-card-foreground p-4">
            <div className="flex flex-col gap-2 mb-6">
              <p className="text-xl font-semibold">
                {i18n.tattr(product.name)}
              </p>
              {showMessage && isOutOfStock && (
                <p className="text-base font-semibold mt-0 mb-0 text-destructive">
                  {i18n.t('Out of stock')}
                </p>
              )}
              {errorMessage && (
                <p className="text-base font-semibold mt-0 mb-0 text-destructive">
                  {i18n.t('Price may be incorrect')}
                </p>
              )}
            </div>
            {workspace?.config?.displayPrices && (
              <>
                {price.displayTwoPrices && (
                  <p className="text-xl font-semibold mb-2">
                    {price.displaySecondary}
                  </p>
                )}
                <p className="text-sm">{price.displayPrimary}</p>
              </>
            )}
            <ProductMetaFieldView
              productAttrs={product.productAttrs}
              fields={metaFields}
            />
            <span className="font-medium">{i18n.t('Product description')}</span>
            <p
              className="text-sm mb-0"
              dangerouslySetInnerHTML={{
                __html: product.description || '',
              }}></p>
            {Boolean(cartQuantity) && product.allowCustomNote && (
              <div>
                <Label>{i18n.t('Note')}</Label>
                <textarea
                  className="border rounded-lg"
                  value={note}
                  onChange={handleChangeNote}
                />
              </div>
            )}
            <div className="mt-4">
              <Quantity
                value={quantity}
                onIncrement={increment}
                onDecrement={decrement}
                onChange={newValue => setQuantity(Number(newValue))}
                disabled={updating}
              />
            </div>
            {canBuy && (
              <Button
                onClick={handleAddToCart}
                className="w-full rounded-full mt-4">
                <div className="flex items-center justify-center gap-2">
                  <MdOutlineShoppingBasket className="text-2xl" />
                  <span className="text-sm font-medium mb-0">
                    {i18n.t('Add to Cart')}
                  </span>
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductView;

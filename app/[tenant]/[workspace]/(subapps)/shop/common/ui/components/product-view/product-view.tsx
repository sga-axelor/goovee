'use client';

import React, {Fragment, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {MdChevronRight} from 'react-icons/md';
import {MdOutlineShoppingBasket} from 'react-icons/md';
// ---- CORE IMPORTS ---- //
import {Quantity, ThumbsCarousel} from '@/ui/components';
import {useQuantity} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';
import {getImageURL} from '@/utils/product';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import type {ComputedProduct, PortalWorkspace} from '@/types';
import {Label} from '@ui/components/label';
import {Button} from '@ui/components/button';
// ---- LOCAL IMPORTS ---- //
import {Categories} from '..';
export function ProductView({
  product: computedProduct,
  workspace,
  breadcrumbs,
  categories,
}: {
  categories?: any;
  product: ComputedProduct;
  workspace?: PortalWorkspace;
  breadcrumbs: any;
}) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();
  const {product, price} = computedProduct;
  const [updating, setUpdating] = useState(false);
  const {quantity, increment, decrement} = useQuantity();
  const {addItem, getProductQuantity, getProductNote, setProductNote} =
    useCart();
  const [cartQuantity, setCartQuantity] = useState(0);
  const [note, setNote] = useState('');
  const handleAddToCart = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setUpdating(true);
    setCartQuantity(q => Number(q) + Number(quantity));
    await addItem({productId: product.id, quantity});
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
      const note = await getProductNote(product.id);
      setNote(note);
    })();
  }, [getProductNote, getProductQuantity, product]);

  return (
    <div>
      <Categories items={categories} onClick={handleCategoryClick} />
      <div className={'container py-2 md:py-4'}>
        <div className="mb-6 pt-4">
          {breadcrumbs?.length > 1 ? (
            <div className="flex items-center gap-4">
              {breadcrumbs.map((crumb: any, i: number) => {
                const islast = breadcrumbs.length - 1 === i;
                return (
                  <Fragment key={i}>
                    <div
                      {...(islast
                        ? {}
                        : {className: 'cursor-pointer flex items-center'})}>
                      <div
                        onClick={() => {
                          if (!islast) {
                            handleCategoryClick(crumb);
                          }
                        }}
                        className={`${islast ? 'text-primary font-bold' : 'text-secondary'}`}>
                        {i18n.get(crumb.name)}
                      </div>
                      {!islast && (
                        <div className="flex">
                          <MdChevronRight className="text-2xl" />
                        </div>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="grid md:grid-cols-[30%_1fr] grid-cols-1 gap-5">
          <div className="overflow-hidden rounded-lg">
            <ThumbsCarousel
              images={product.images?.map(i => ({
                id: i as string,
                url: getImageURL(i) as string,
              }))}
            />
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-xl font-semibold mb-12">
              {i18n.getValueAttribute(product.name)}
            </p>
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
            <p
              className="text-sm mb-0"
              dangerouslySetInnerHTML={{
                __html: product.description || '',
              }}></p>
            {Boolean(cartQuantity) && product.allowCustomNote && (
              <div>
                <Label className="text-secondary">{i18n.get('Note')}</Label>
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
              />
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full rounded-full mt-4">
              <div className="flex items-center justify-center gap-2">
                <MdOutlineShoppingBasket className="text-primary-foreground text-2xl" />
                <span className="text-sm font-medium mb-0">
                  {i18n.get('Add to Cart')}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductView;

'use client';

import React, {Fragment, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Box, Button, InputLabel, useClassNames} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';

// ---- CORE IMPORTS ---- //
import {Quantity, ThumbsCarousel} from '@/ui/components';
import {useQuantity} from '@/ui/hooks';
import {i18n} from '@/lib/i18n';
import {getImageURL} from '@/utils/product';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import type {ComputedProduct, PortalWorkspace} from '@/types';

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

  const cs = useClassNames();

  return (
    <Box>
      <Categories items={categories} onClick={handleCategoryClick} />
      <Box className={cs('container')} py={{base: 2, md: 3}}>
        <Box mb={4} pt={3}>
          {breadcrumbs?.length > 1 ? (
            <Box d="flex" gap="1rem" alignItems="center">
              {breadcrumbs.map((crumb: any, i: number) => {
                const islast = breadcrumbs.length - 1 === i;
                return (
                  <Fragment key={i}>
                    <Box
                      d="flex"
                      alignItems="center"
                      {...(islast ? {} : {className: 'pointer'})}>
                      <Box
                        {...(islast
                          ? {
                              color: 'primary',
                              fontWeight: 'bold',
                            }
                          : {
                              color: 'secondary',
                              onClick: () => handleCategoryClick(crumb),
                            })}>
                        {i18n.get(crumb.name)}
                      </Box>
                      {!islast && (
                        <Box d="flex">
                          <MaterialIcon icon="chevron_right" />
                        </Box>
                      )}
                    </Box>
                  </Fragment>
                );
              })}
            </Box>
          ) : null}
        </Box>
        <Box
          d="grid"
          gridTemplateColumns={{base: '1fr', md: '1fr 2fr'}}
          gridGap="1rem">
          <Box overflow="hidden">
            <ThumbsCarousel
              images={product.images?.map(i => ({
                id: i as string,
                url: getImageURL(i) as string,
              }))}
            />
          </Box>
          <Box p={3} bg="white" rounded border>
            <Box as="p" fontSize={3} fontWeight="bold" mb={5}>
              {i18n.getValueAttribute(product.name)}
            </Box>
            {workspace?.config?.displayPrices && (
              <>
                <Box as="p" fontSize={3} fontWeight="bold">
                  {price.displayPrimary}
                </Box>
                {price.displayTwoPrices && (
                  <Box as="p" fontSize={5} fontWeight="bold">
                    {price.displaySecondary}
                  </Box>
                )}
              </>
            )}
            <Box
              as="p"
              fontSize={6}
              dangerouslySetInnerHTML={{
                __html: product.description || '',
              }}></Box>
            {Boolean(cartQuantity) && product.allowCustomNote && (
              <Box>
                <InputLabel color="secondary">{i18n.get('Note')}</InputLabel>
                <textarea
                  className={cs('form-control')}
                  value={note}
                  onChange={handleChangeNote}
                />
              </Box>
            )}
            <Box mt={3}>
              <Quantity
                value={quantity}
                onIncrement={increment}
                onDecrement={decrement}
              />
            </Box>
            <Button
              variant="primary"
              onClick={handleAddToCart}
              w={100}
              rounded="pill"
              mt={3}>
              <Box
                d="flex"
                alignItems="center"
                justifyContent="center"
                p={1}
                gap={8}>
                <MaterialIcon icon="shopping_basket" />
                <Box as="p" mb={0}>
                  {i18n.get('Add to Cart')}
                </Box>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductView;

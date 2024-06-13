'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@ui/components/button';
import { Separator } from '@ui/components/separator';
import { Label } from '@ui/components/label';
import { RadioGroup, RadioGroupItem } from '@ui/components/radio-group';
// ---- CORE IMPORTS ---- //
import { BackgroundImage } from '@ui/components/index';
import { useCart } from '@/app/[tenant]/[workspace]/cart-context';
import { scale } from '@/utils';
import { computeTotal } from '@/utils/cart';
import { getImageURL } from '@/utils/product';
import { i18n } from '@/lib/i18n';
import type { PortalWorkspace } from '@/types';
// ---- LOCAL IMPORTS ---- //
import { findProduct } from '@/app/[tenant]/[workspace]/(subapps)/shop/common/actions/cart';
import styles from './content.module.scss';
const SHIPPING_TYPE = {
  REGULAR: 'regular',
  FAST: 'fast',
};
const SHIPPING_TYPE_COST = {
  [SHIPPING_TYPE.REGULAR]: 2,
  [SHIPPING_TYPE.FAST]: 5,
};
function Summary({ cart }: any) {
  return (
    <div className="bg-white p-6 rounded-lg">
      <Title
        className="text-xl font-semibold mb-6"
        text={i18n.get('Summary')}
      />
      <div className="flex flex-col gap-4 pt-4">
        {cart.items.map(
          ({
            computedProduct: { product, price } = {},
            quantity,
            note,
            images
          }: any = {}) => (
            <div key={product?.id} className="flex gap-4">
              <BackgroundImage
                src={getImageURL(images?.[0] ? images?.[0] : null)}
                className="rounded-lg w-[80px] h-[80px]"
              />
              <div>
                <Title
                  className="text-base font-medium"
                  text={i18n.getValueAttribute(product?.name)}></Title>
                {note && (
                  <div>
                    {i18n.get('Note')} : {note}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">{i18n.get('Quantity')}</p>
                  <p className="border rounded px-4">{quantity}</p>
                </div>
                <Title
                  className="text-base font-semibold"
                  text={price?.displayPrimary}></Title>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
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
    scale(SHIPPING_TYPE_COST[shippingType], currencyScale),
  ) as number;
  const totalWithShipping = Number(total) + Number(shipping);

  return (
    <div className="rounded-lg p-4 bg-white">
      <Title className="text-xl font-semibold mb-6" text="Total" />
      <Separator className="my-4" />
      <div className="flex justify-between">
        <p className="text-base m-0">{i18n.get('Products')}:</p>
        <div>
          <p className="text-base font-semibold text-right m-0">
            {displayTotal}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-base m-0">{i18n.get('Shipping')}:</p>
        <div>
          <p className="text-xs m-0">{`${shipping} ${currencySymbol}`}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between">
        <p className="text-base font-medium font-m m-0">
          {i18n.get('Total price')}:
        </p>
        <div>
          <p className="text-xl font-semibold m-0">
            {`${totalWithShipping} ${currencySymbol}`}
          </p>
        </div>
      </div>
    </div>
  );
}
function Contact() {
  return (
    <div className="bg-white p-6 rounded-lg">
      <Title className="text-xl font-medium" text={i18n.get('Contact')} />
      <Separator className="my-4" />
      <div className="border p-4 rounded-lg">
        <Title
          className="text-lg font-semibold mb-4"
          text={i18n.get('Invoicing and delivery address')}
        />
        <Button className="rounded-full">
          {i18n.get('Create an address')}
        </Button>
      </div>
    </div>
  );
}
function Shipping({ value, onChange }: { value: string; onChange: any }) {
  return (
    <div className="bg-white p-6 rounded-lg">
      <Title
        className="text-xl font-medium"
        text={i18n.get('Shipping Method')}
      />
      <Separator className="my-4" />
      <RadioGroup defaultValue={value}>
        <div className="border rounded-lg flex p-4 gap-4 items-center">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              name="shipping"
              value={SHIPPING_TYPE.REGULAR}
              className={`${styles.radio} m-0`}
              onClick={onChange}
              id="r1"
            />
            <Label className="text-base font-medium !ml-4" htmlFor="r1">
              {i18n.get('Regular Shipping')}{' '}
              <small className="text-xs font-medium ml-1 text-muted">{`5-10 ${i18n.get(
                'Business Days',
              )}`}</small>
            </Label>
          </div>

          <Title className="text-xs font-medium m-0 ml-auto" text="2.00 €" />
        </div>

        <div className="border rounded-lg flex p-4 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              name="shipping"
              value={SHIPPING_TYPE.FAST}
              className={`${styles.radio} m-0`}
              onClick={onChange}
              id="r2"
            />
            <Label className="text-base font-medium !ml-4" htmlFor="r1">
              {i18n.get('Fast Shipping')}{' '}
              <small className="text-xs font-medium ml-1 text-muted">{`2-3 ${i18n.get(
                'Business Days',
              )}`}</small>
            </Label>
          </div>

          <Title className="text-xs font-medium m-0 ml-auto" text="5.00 €" />
        </div>
      </RadioGroup>
    </div>
  );
}
function Title({ text, ...rest }: { text: string } & any) {
  return (
    <h3 className="font-bold text-3xl" {...rest}>
      {text}
    </h3>
  );
}
export default function Content({ workspace }: { workspace: PortalWorkspace }) {

  const [shippingType, setShippingType] = useState<string>(
    SHIPPING_TYPE.REGULAR,
  );
  const { cart } = useCart();
  const [computedProducts, setComputedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const handleChangeShippingType = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShippingType(event.target.value);
  };

  useEffect(() => {
    
    const init = async () => {
      if (!computedProducts?.length && cart) {
        await Promise.all(cart.items.map((i: any) => findProduct({id:i.product,workspace:workspace})))
          .then(computedProducts => {
            
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
            cp => Number(cp?.product?.id) === Number(i.product),
          ),
        })),
      ],
    }),
    [cart, computedProducts],
  );

  if (loading) {
    return <p>{i18n.get('Loading')}...</p>;
  }

  return (
    <>
      <h4 className="mb-6 text-xl font-medium">{i18n.get('Confirm Cart')}</h4>
      <div className="grid lg:grid-cols-[1fr_25%] xl:grid-cols-[1fr_21%] grid-cols-1 gap-4">
        <div>
          <div className="flex flex-col gap-6">
            <Contact />
            <Shipping
              value={shippingType}
              onChange={handleChangeShippingType}
            />
            <Button className="rounded-full">
              {i18n.get('Continue to payment')}
            </Button>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-6">
            <Summary cart={$cart} />
            <Total
              cart={$cart}
              shippingType={shippingType}
              workspace={workspace}
            />
          </div>
        </div>
      </div>
    </>
  );
}
